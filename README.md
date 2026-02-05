# Portfolio - Maxime Périgny

## 📁 Structure du projet

```
Portfolio/
├── index.html           ← Page d'accueil
├── projects.html        ← Liste de tous les projets
├── contact.html         ← Page contact
├── styles.css
├── script.js
└── projets/
    ├── projet_1/
    │   ├── index.html   ← Page détail du projet
    │   ├── cover.jpg    ← Image principale
    │   └── photos...    ← Autres images
    ├── projet_2/
    │   └── ...
    └── ...
```

---

## ➕ Ajouter un nouveau projet

### 1. Crée le dossier du projet

```bash
mkdir projets/projet_X
```

### 2. Copie le template

```bash
cp projets/projet_1/index.html projets/projet_X/
```

### 3. Personnalise `projets/projet_X/index.html`

- Modifie le `<title>` et la balise `<meta description>`
- Modifie le `<h1>` avec le nom du projet
- Ajoute ta description
- Ajoute tes images (voir ci-dessous)

### 4. Ajoute tes images dans le dossier

```
projets/projet_X/
├── index.html
├── cover.jpg        ← Image principale
├── photo_1.jpg
└── photo_2.jpg
```

Dans `index.html`, utilise :
```html
<img src="cover.jpg" alt="Description">
```

### 5. Ajoute la carte sur `projects.html`

```html
<a href="projets/projet_X/" class="project-card">
    <div class="project-thumbnail">
        <img src="projets/projet_X/cover.jpg" alt="Nom du projet">
    </div>
    <div class="project-info">
        <span class="project-category">CATÉGORIE</span>
        <h3 class="project-title">Nom du projet</h3>
        <p class="project-description">Description courte.</p>
    </div>
</a>
```

---

## 📝 Catégories

`Vidéo` · `Motion Design` · `Montage` · `Création` · `Court-métrage` · `Clip musical`

---

## ✅ Checklist nouveau projet

- [ ] Créer dossier `projets/projet_X/`
- [ ] Copier et personnaliser `index.html`
- [ ] Ajouter images dans le dossier
- [ ] Ajouter carte cliquable sur `projects.html`
- [ ] Tester les liens
