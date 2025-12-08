# 💌 Love Notes - Daily Messages for Your Special Someone

A beautiful, romantic website where you can post daily love notes for your girlfriend. She can visit anytime to read today's message and look back at previous ones.

## ✨ Features

- **Stunning Design**: Romantic gradient theme with smooth animations and glassmorphism effects
- **Today's Message**: Prominently displays the most recent note
- **Message History**: Collapsible section showing all previous messages
- **Easy Updates**: Just edit `messages.json` to add new notes
- **Mobile Responsive**: Looks beautiful on all devices
- **Interactive**: Floating hearts when clicking on messages
- **Auto-refresh**: Checks for new messages every 5 minutes

## 🚀 How to Update Daily

### Method 1: Edit Locally & Push (Recommended)

1. Open `messages.json` in any text editor
2. Add your new message at the **top** of the messages array:
   ```json
   {
     "date": "2025-12-09",
     "text": "Your sweet message here! 💕"
   },
   ```
3. Save the file
4. Commit and push to GitHub:
   ```bash
   git add messages.json
   git commit -m "Love note for Dec 9"
   git push
   ```
5. Your site will auto-update in ~1 minute!

### Method 2: Edit Directly on GitHub

1. Go to your GitHub repo
2. Click on `messages.json`
3. Click the pencil icon (Edit)
4. Add your new message at the top
5. Commit changes
6. Site updates automatically!

## 📝 Message Format

Each message needs:
- **date**: Format as `YYYY-MM-DD` (e.g., `2025-12-08`)
- **text**: Your sweet message (can include emojis!)

**Important**: Always add new messages at the **top** of the array. The most recent message will be shown as "Today's Note".

## 🌐 Deployment Instructions

### Option 1: Netlify (Easiest)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Love notes site"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repo
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `/` or `.`
   - Click "Deploy site"

3. **Get your URL**:
   - Netlify will give you a URL like `random-name-123.netlify.app`
   - You can customize it in Site settings → Domain management
   - Share this URL with your girlfriend!

### Option 2: Cloudflare Pages

1. **Push to GitHub** (same as above)

2. **Deploy on Cloudflare**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → "Create a project"
   - Connect to GitHub and select your repo
   - Build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`
   - Click "Save and Deploy"

3. **Your site will be live** at `your-project.pages.dev`

## 🔒 Making it Private

### Simple Option: Secret URL
- Just don't share the URL publicly
- Use the random subdomain Netlify/Cloudflare gives you
- Only share it with your girlfriend

### Medium Option: Custom Subdomain
- Use something non-obvious like `peach-sunrise.netlify.app`
- Makes it harder to guess

### Advanced Option: Password Protection
If you want to add a simple password:
1. Add Cloudflare Access (free for up to 50 users)
2. Or use Netlify's password protection (paid feature)
3. Or add a simple client-side password prompt (I can help with this!)

## 🎨 Customization Ideas

- Change colors in `style.css` (look for the `:root` section)
- Add photos of you two in the background
- Include a special song that plays when she visits
- Add a counter showing how many days you've been together
- Include a photo gallery

## 💡 Tips

- **Consistency**: Try to add a new note every day at the same time
- **Variety**: Mix sweet messages, funny memories, and reasons you love her
- **Emojis**: Use emojis to add personality! ❤️💕🥰✨🌟
- **Length**: Keep messages 1-3 sentences for easy reading
- **Surprise**: Sometimes add a longer, more detailed message

## 📱 How She Uses It

1. Bookmark the URL on her phone/computer
2. Visit whenever she wants to read today's message
3. Click "View Previous Notes" to see the history
4. Click on messages to see floating hearts! ❤️

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No framework needed
- **No database** - All messages stored in `messages.json`
- **Static site** - Fast, secure, and free to host
- **Auto-deploy** - Every push to GitHub updates the live site

## ❤️ Made with Love

This site is a labor of love. Every time you update it, you're creating a digital love letter that she can cherish forever.

---

**Need help?** Feel free to customize this however you want. The code is simple and well-commented!
