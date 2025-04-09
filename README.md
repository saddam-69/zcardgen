# ZCardGen – Générateur de cartes de visite interactives ✨

Une application web pour créer et partager des cartes de visite numériques avec QR code et tracking.

## 🔧 Stack technique

- Next.js (React + SSR)
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (authentification)
- React Hook Form + Zod (formulaire)
- QR Code (qrcode.react)
- Upload d'image local ou Cloudinary (optionnel)

## 🚀 Fonctionnalités

- Création de cartes de visite personnalisées
- Génération de QR code
- Authentification sécurisée
- Statistiques de vues
- Partage via URL publique

## ▶️ Lancer le projet en local

```bash
git clone https://github.com/ton-utilisateur/zcardgen.git
cd zcardgen
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
