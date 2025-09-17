# KrishiAI

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=flat&logo=typescript)

*AI-powered crop recommendations for farmers* 🚜🌱

KrishiAI is a PWA built with Next.js 15 + FastAPI that helps farmers make smarter crop decisions. 
---

## 🗂 Project Structure

All Next.js code lives in the `krishi-ai-app/` folder:

```bash
krishi-ai-app
├─ public               # Static assets
├─ src
│  ├─ app               # Next.js App Router pages
│  ├─ components        # Reusable React components
│  └─ utils             # Utility functions
├─ package.json
├─ tsconfig.json
└─ next.config.ts
```

All FastAPI and ML code is planned to be put in the `krishi-ai-ml/` folder:

---

## 🚀 Getting Started (App)

### 1. Install dependencies

```bash
cd krishi-ai-app
npm install
```

### 2. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see it in action.

### 3. Build for production

```bash
npm run build
npm run start
```
---
