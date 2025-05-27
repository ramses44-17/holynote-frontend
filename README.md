# ✨ HolyNotes – Frontend (React)

**HolyNotes** est une application web moderne de prise de notes spirituelles destinée aux fidèles souhaitant mieux organiser leurs pensées avant, pendant et après les sermons.

Ce dépôt contient l’interface utilisateur du projet, développée avec **React**, **shadcn/ui** pour les composants UI, et **TanStack Query** pour la gestion de données.

👉 Le backend associé est disponible ici : [HolyNotes Backend](https://github.com/ton-utilisateur/holynotes-backend)

---

## 🧰 Fonctionnalités du frontend

* 📝 Création, lecture, édition et suppression de notes (CRUD)
* 🔎 Recherche des notes avec filtres simples (texte, date, etc.)
* 📖 Affichage intégré de versets bibliques
* ▶️ Lecture directe de vidéos YouTube liées aux sermons
* 🌙 Interface responsive et élégante grâce à **shadcn/ui**

---

## 🔮 Fonctionnalités prévues

* 🎙️ Upload et écoute d’audios de sermons
* 📂 Organisation des notes par séries de prédications

---

## 🛠️ Stack technique

* **React** (TypeScript)
* **shadcn/ui** (composants UI stylés avec Tailwind CSS)
* **TanStack Query** (anciennement React Query)
* **Zod** (validation côté client)
* **pnpm** pour la gestion des dépendances
* Authentification via **JWT** (géré côté cookie par le backend)

---

## 📦 Installation

### Prérequis

* Node.js ≥ 18
* pnpm ([https://pnpm.io](https://pnpm.io))

### Étapes

```bash
git clone https://github.com/ton-utilisateur/holynotes-frontend.git
cd holynotes-frontend
pnpm install
cp .env.example .env
pnpm dev
```

> Le fichier `.env` doit contenir l’URL de l’API backend (`VITE_API_URL=https://...`)

---

## 🖼️ Aperçu de l'interface

L’interface utilise [**shadcn/ui**](https://ui.shadcn.com) pour proposer des composants UI accessibles, stylés et personnalisables via Tailwind CSS.

---

## 📁 Structure du projet (extrait)

```
holynotes-frontend/
├── src/
│   ├── components/         # Composants UI (shadcn/ui)
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── services/           # Appels à l'API via TanStack Query
│   └── App.tsx
├── public/
├── .env
├── index.html
└── ...
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues !
Merci de suivre les bonnes pratiques :

* Code typé (TypeScript)
* Respect des conventions ESLint / Prettier
* Composants réutilisables et testables
* Créez une `issue` avant toute PR importante

---

## 📄 Licence

Distribué sous la licence **MIT**.