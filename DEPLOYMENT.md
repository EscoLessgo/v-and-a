# 🚀 Deployment Guide for vanda.velarixsolutions.nl

## ✅ Code is Fixed and Pushed to GitHub!

The app now automatically detects whether it's running locally or in production.

---

## 🌐 Deploy to Railway (Recommended)

### Step 1: Deploy
1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select **`EscoLessgo/v-and-a`**
6. Wait 2-3 minutes for deployment

### Step 2: Get Your Railway URL
1. Click **"Settings"** in Railway
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `v-and-a.up.railway.app`)

### Step 3: Point Your Domain
1. Go to **Cloudflare Dashboard**
2. Select **velarixsolutions.nl**
3. Go to **DNS** → **Records**
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: `vanda`
   - **Target**: `v-and-a.up.railway.app` (your Railway URL)
   - **Proxy**: ✅ Proxied (orange cloud)
   - **TTL**: Auto
5. Click **Save**

### Step 4: Add Custom Domain in Railway
1. In Railway, go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter: `vanda.velarixsolutions.nl`
4. Wait for verification (1-5 minutes)

### Step 5: Access Your App
Go to: **https://vanda.velarixsolutions.nl/app.html**

---

## 📝 Login Credentials

- **Ashton**: username `ashton` / password `1125`
- **Vanessa**: username `vanessa` / password `1125`

---

## ✨ How to Use (Super Simple!)

### Posting a Message:
1. Log in
2. Click **"✏️ Write a Love Note"**
3. Type your message
4. Click **"Send 💕"**
5. **Done!** It saves automatically

### Reacting:
- Just click any emoji (❤️ 💕 🥰 😊 💖 ✨)

### Replying:
1. Click **"Reply"** on any message
2. Type your response
3. Click **"Send Reply"**

---

## 🔄 Auto-Updates

Every time you push to GitHub, Railway will automatically redeploy!

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway will update in 1-2 minutes.

---

All data is stored in SQLite database on Railway. It persists automatically!

---

## 🔔 Discord Webhooks (Optional)

The app supports personalized Discord notifications with mentions!

### How It Works:
- When **Vanessa** posts a note → Ashton's webhook gets notified with **@tcp.dns** mention
- When **Ashton** posts a note → Vanessa's webhook gets notified with **@misspufff** mention

### Setup in Railway:
1. Go to your Railway project
2. Click **Variables** tab
3. Add these environment variables:
   - `DISCORD_WEBHOOK_ASHTON` = `https://canary.discord.com/api/webhooks/1448169963780051038/Eal0_bd1_tTS63GbBU9YfFmdO-aB6sNx65nBFJSvFwoIq9n4oCOFxRDuU0iBDIJnE5FP`
   - `DISCORD_WEBHOOK_VANESSA` = `https://canary.discord.com/api/webhooks/1447840045263487117/O-s4K1nkK9KooQOIEIte2wiiSiLrF-OiJgHc7FiQ4_WCPuzyUzzPFlXzNFDP7UxwUydn`
   - `PUBLIC_URL` = Your Railway URL (e.g., `https://v-and-a.up.railway.app`) for media previews
   - `DISCORD_ID_ASHTON` = Ashton's Discord User ID (tcp.dns)
   - `DISCORD_ID_VANESSA` = Vanessa's Discord User ID (misspufff)

**Note:** The webhooks are hardcoded as fallbacks, so they'll work even without setting environment variables!

### How to Get Discord User IDs:
1. Open Discord
2. Go to **Settings** → **Advanced** → Enable **"Developer Mode"**
3. Right-click on a user's profile → **"Copy User ID"**
4. Paste the User ID into the Railway environment variables above


---

## ❓ Troubleshooting

**Can't log in?**
- Make sure Railway deployment is complete
- Check that custom domain is verified

**Messages not showing?**
- Wait 30 seconds for auto-refresh
- Or refresh the page manually

**Need to reset everything?**
- In Railway, go to **Data** → Delete `love-notes.db`
- Restart the service

---

**Your app is ready to deploy! Follow the Railway steps above.** 🚀
