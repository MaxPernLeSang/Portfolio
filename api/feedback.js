// Retours envoyés depuis l'app Offline Reel Generator (Aide → Envoyer un retour…).
// Reçoit un JSON, le vérifie et l'envoie par e-mail via Resend, le journal en pièce jointe.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   RESEND_API_KEY    clé API Resend (obligatoire)
//   FEEDBACK_TO       adresse qui reçoit les retours (obligatoire)
//   FEEDBACK_FROM     expéditeur (facultatif ; par défaut onboarding@resend.dev,
//                     qui n'écrit qu'à l'adresse du compte Resend)
//   FEEDBACK_APP_KEY  si présent, l'en-tête X-Feedback-Key doit l'égaler. Ce n'est
//                     pas un secret (il est dans l'app), il écarte les robots.

const KINDS = { bug: "Bug", idea: "Idée", other: "Autre" };
const MAX_MESSAGE = 5000;
const MAX_LOG = 100000;
const MAX_INFO_KEYS = 24;
const MAX_INFO_VALUE = 300;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

// Limite par adresse IP, au mieux : chaque instance de la fonction a sa propre mémoire.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 1000) {
    for (const [key, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

function oneLine(value, max) {
  return String(value).replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function readInfo(app) {
  if (!app || typeof app !== "object" || Array.isArray(app)) return [];
  return Object.entries(app)
    .slice(0, MAX_INFO_KEYS)
    .filter(([, v]) => ["string", "number", "boolean"].includes(typeof v))
    .map(([k, v]) => [oneLine(k, 40), oneLine(v, MAX_INFO_VALUE)]);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method" });
  }
  const appKey = process.env.FEEDBACK_APP_KEY;
  if (appKey && req.headers["x-feedback-key"] !== appKey) {
    return res.status(403).json({ error: "key" });
  }
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "rate" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : null;
  if (!body) return res.status(400).json({ error: "json" });

  const kind = KINDS[body.kind] ? body.kind : "other";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "message" });
  if (message.length > MAX_MESSAGE) return res.status(413).json({ error: "message_too_long" });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email && (email.length > 200 || !EMAIL_RE.test(email))) {
    return res.status(400).json({ error: "email" });
  }
  const log = typeof body.log === "string" ? body.log : "";
  if (log.length > MAX_LOG) return res.status(413).json({ error: "log_too_long" });
  const info = readInfo(body.app);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_TO;
  if (!apiKey || !to) {
    console.error("feedback: RESEND_API_KEY or FEEDBACK_TO missing");
    return res.status(500).json({ error: "config" });
  }

  const version = (info.find(([k]) => k === "version") || [])[1] || "?";
  const subject = `[Offline Reel Generator] ${KINDS[kind]} · ${version} · ${oneLine(message, 60)}`;
  const text = [
    message,
    "",
    "──────────",
    `Type : ${KINDS[kind]}`,
    `Répondre à : ${email || "(pas d'adresse)"}`,
    ...info.map(([k, v]) => `${k} : ${v}`),
    log ? "\nJournal en pièce jointe (app.log)." : "",
  ].join("\n");

  const mail = {
    from: process.env.FEEDBACK_FROM || "Offline Reel Generator <onboarding@resend.dev>",
    to: [to],
    subject,
    text,
  };
  if (email) mail.reply_to = email;
  if (log) {
    mail.attachments = [{ filename: "app.log", content: Buffer.from(log, "utf8").toString("base64") }];
  }

  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(mail),
    });
    if (!sent.ok) {
      console.error("feedback: Resend answered", sent.status, await sent.text());
      return res.status(502).json({ error: "send" });
    }
  } catch (err) {
    console.error("feedback: Resend unreachable", err);
    return res.status(502).json({ error: "send" });
  }
  return res.status(200).json({ ok: true });
};
