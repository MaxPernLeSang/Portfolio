import os
import re

css_to_append = """
/* ================================
   LARGE FOOTER
   ================================ */

.footer-large {
  background: var(--bg-primary);
  padding: 6rem 2rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-large-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.footer-top-line {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 4rem;
}

.footer-top-text {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-right: 1rem;
}

.footer-line {
  flex-grow: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.footer-huge-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 0.9;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 2.5rem;
}

.footer-location {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

.footer-email-block {
  display: inline-block;
  background: var(--text-primary);
  color: var(--bg-primary);
  font-family: var(--font-display);
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 700;
  padding: 1.5rem 2.5rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  margin-bottom: 4rem;
}

.footer-email-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
  color: var(--bg-primary);
}

.footer-social-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.footer-social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.footer-social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  color: var(--text-primary);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}
"""

with open('styles.css', 'a') as f:
    f.write(css_to_append)

new_footer_template = """<footer class="footer-large">
        <div class="container">
            <div class="footer-large-content">
                <div class="footer-top-line">
                    <span class="footer-top-text">ÉCRIVEZ-MOI</span>
                    <div class="footer-line"></div>
                </div>
                
                <h2 class="footer-huge-title">TRAVAILLONS<br>ENSEMBLE</h2>
                
                <p class="footer-location">SAVOIE • ALPES FRANÇAISES</p>
                
                <a href="mailto:maxime.perigny.50@gmail.com" class="footer-email-block">
                    MAXIME.PERIGNY.50@GMAIL.COM
                </a>
                
                <div class="footer-social-row">
                    <a href="https://www.linkedin.com/in/maxime-périgny-69b9b31ba/" target="_blank" class="footer-social-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="18" height="18">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LINKEDIN
                    </a>
                    {CONTACT_BTN}
                </div>
                
                <div class="footer-bottom">
                    <p>© 2026 Maxime Périgny. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    </footer>"""

contact_btn = """<a href="{PATH_TO_ROOT}contact.html" class="footer-social-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        CONTACT
                    </a>"""

for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            depth = filepath.count('/') - 1
            if depth < 0: depth = 0
            path_to_root = '../' * depth
            
            is_contact_page = (file == 'contact.html' and depth == 0)
            
            btn_html = "" if is_contact_page else contact_btn.format(PATH_TO_ROOT=path_to_root)
            new_footer = new_footer_template.replace('{CONTACT_BTN}', btn_html)
            
            pattern = re.compile(r'<footer class="footer">.*?</footer>', re.DOTALL)
            
            if pattern.search(content):
                new_content = pattern.sub(new_footer, content)
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
