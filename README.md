# 💌 V and A - Love Notes App

A simple, beautiful love notes app for Ashton and Vanessa.

## 🌐 Live Site

**URL:** https://vanda.velarixsolutions.nl/app.html

## 👥 Login Credentials

- **Ashton**: username `ashton` / password `1125`
- **Vanessa**: username `vanessa` / password `1125`

## ✨ How to Use

### Posting a Message:
1. Log in with your username and password
2. Click **"✏️ Write a Love Note"**
3. Type your message
4. Click **"Send 💕"**
5. Done! It saves automatically

### Reacting to Messages:
- Click any emoji button (❤️ 💕 🥰 😊 💖 ✨)
- Your reaction appears instantly

### Replying to Messages:
1. Click **"Reply"** on any message
2. Type your response
3. Click **"Send Reply"**
4. Done!

## 🚀 Deployment

The app is deployed on Railway and connected to the custom domain via Cloudflare.

- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite (auto-created on Railway)
- **Hosting**: Railway
- **DNS**: Cloudflare

## 🔄 Auto-Updates

Every push to the `main` branch automatically deploys to Railway.

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## 💾 Database

All messages, reactions, and replies are stored in a SQLite database on Railway. Data persists automatically.

## 📁 Project Structure

```
├── app.html          # Main application page
├── app-style.css     # Application styles
├── app-script.js     # Application logic
├── server.js         # Backend API server
├── package.json      # Dependencies
└── README.md         # This file
```

## 🛠️ Local Development

```bash
npm install
npm start
```

Then open: `http://localhost:3000/app.html`

---

**Made with love for V and A** ❤️
