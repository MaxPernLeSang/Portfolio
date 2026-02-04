# Portfolio - Maxime Périgny

## 📁 Structure du projet

```
Portfolio/
├── index.html       ← Page d'accueil (slider horizontal de projets)
├── projects.html    ← Page tous les projets (cliquables)
├── project-1.html   ← Page projet individuelle (template)
├── project-2.html   
├── project-3.html   
├── project-4.html   
├── styles.css       ← Styles du site
├── script.js        ← JavaScript
└── assets/          ← Images et médias (à créer)
    └── projects/    ← Images des projets
```

---

## 🎯 Fonctionnement des pages

| Page | Comportement |
|------|--------------|
| **Accueil** | Slider défilable (scroll horizontal), pas de clic |
| **Projets** | Cartes cliquables vers pages individuelles, hover animé |
| **Projet individuel** | Détails complets du projet |

---

## ➕ Ajouter un nouveau projet

### 1. Crée la page projet

Copie `project-1.html` vers `project-X.html` et modifie :
- Le titre dans `<title>`
- La catégorie, le titre, les métadonnées
- Le contenu descriptif

### 2. Ajoute la carte sur `projects.html`

```html
<a href="project-X.html" class="project-card">
    <div class="project-thumbnail">
        <img src="assets/projects/ton-image.jpg" alt="Description">
    </div>
    <div class="project-info">
        <span class="project-category">CATÉGORIE</span>
        <h3 class="project-title">Nom du projet</h3>
        <p class="project-description">
            Description courte (1-2 phrases).
        </p>
    </div>
</a>
```

→ Colle dans `<div class="projects-page-grid">`

### 3. (Optionnel) Ajoute au slider de l'accueil

```html
<article class="project-card slider-card">
    <div class="project-thumbnail">
        <img src="assets/projects/ton-image.jpg" alt="Description">
    </div>
    <div class="project-info">
        <span class="project-category">CATÉGORIE</span>
        <h3 class="project-title">Nom du projet</h3>
        <p class="project-description">
            Description courte.
        </p>
    </div>
</article>
```

→ Colle dans `<div class="slider-track">` (index.html)

> ⚠️ Sur l'accueil, utilise `<article>` (non cliquable), sur projets utilise `<a href>` (cliquable)

---

## 📝 Catégories suggérées

`Vidéo` · `Motion Design` · `Montage` · `Création` · `Court-métrage` · `Clip musical`

---

## 🖼️ Cloudinary pour les médias

```html
<img src="https://res.cloudinary.com/dtwelbtjt/image/upload/v1234567890/nom-image.jpg" alt="...">
```

---

## ✅ Checklist nouveau projet

- [ ] Créer `project-X.html` (copier template)
- [ ] Personnaliser le contenu de la page projet
- [ ] Ajouter la carte cliquable sur `projects.html`
- [ ] (Optionnel) Ajouter au slider de `index.html`
- [ ] Tester sur mobile et desktop
