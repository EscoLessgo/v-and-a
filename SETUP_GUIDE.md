# Love Notes Setup Guide 💌

## Theme
Your site now features a beautiful **pastel purple and soft yellow** theme with:
- Soft purple backgrounds and cards
- Twinkling yellow and purple stars
- Gentle pastel gradients
- Light, dreamy aesthetic perfect for romantic messages

## How to Add Messages

You have **two options** for managing daily love notes:

### Option 1: Manual Entry (Recommended for Personal Touch)

This is the simplest approach and gives you complete control over each message.

#### Steps:
1. Open `messages.json` in any text editor
2. Add a new message at the **top** of the messages array (after the opening `[`)
3. Use this format:
```json
{
    "date": "2025-12-09",
    "text": "Your sweet message here! ❤️"
},
```

#### Example:
```json
{
    "messages": [
        {
            "date": "2025-12-09",
            "text": "Good morning sunshine! Just wanted to remind you how amazing you are. Your smile makes my whole day brighter. Love you! 💕"
        },
        {
            "date": "2025-12-08",
            "text": "Previous message..."
        }
    ]
}
```

**Important Notes:**
- Always use the format `YYYY-MM-DD` for dates
- Don't forget the comma after each message (except the last one)
- The most recent date will show as "Today's Note"
- After deploying, just update the file and push to your repository

---

### Option 2: Auto-Generated Messages with GitHub Actions

If you want messages to automatically appear daily, you can set up a system that:
1. Pulls from a pre-written list of messages
2. Automatically adds a new message each day
3. Commits the change to your repository

#### Setup Steps:

1. **Create a message pool** - Add a file called `message-pool.json`:
```json
{
    "messages": [
        "Good morning beautiful! You're the first thing I think about when I wake up. ❤️",
        "Just a reminder that you're absolutely incredible and I'm so lucky to have you. 💕",
        "Your smile could light up the darkest day. Thank you for being you! 🌟",
        "Thinking about you always makes me smile. You're my favorite person! 🥰",
        "Every moment with you is a treasure. Love you endlessly! 💖"
    ]
}
```

2. **Create GitHub Action** - Create `.github/workflows/daily-message.yml`:
```yaml
name: Add Daily Love Note

on:
  schedule:
    # Runs at 6:00 AM every day (adjust timezone as needed)
    - cron: '0 6 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  add-message:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Add daily message
        run: |
          node add-daily-message.js

      - name: Commit and push
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add messages.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Add daily love note for $(date +%Y-%m-%d)"
          git push
```

3. **Create the automation script** - Add `add-daily-message.js`:
```javascript
const fs = require('fs');

// Read the message pool
const pool = JSON.parse(fs.readFileSync('message-pool.json', 'utf8'));
const messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

// Get today's date
const today = new Date().toISOString().split('T')[0];

// Check if we already have a message for today
const hasToday = messages.messages.some(m => m.date === today);
if (hasToday) {
    console.log('Message already exists for today');
    process.exit(0);
}

// Pick a random message from the pool
const randomMessage = pool.messages[Math.floor(Math.random() * pool.messages.length)];

// Add the new message at the beginning
messages.messages.unshift({
    date: today,
    text: randomMessage
});

// Write back to file
fs.writeFileSync('messages.json', JSON.stringify(messages, null, 4));
console.log(`Added message for ${today}`);
```

4. **Enable GitHub Actions** in your repository settings

---

### Option 3: Hybrid Approach (Best of Both Worlds)

You can combine both methods:
- Use auto-generation for regular daily messages
- Manually add special messages for birthdays, anniversaries, or special occasions
- The manual messages will override the auto-generated ones if they have the same date

---

## Deployment

### Free Hosting Options:

#### **Netlify** (Recommended)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Deploy! (No build command needed)

**To update messages:**
- Just push changes to GitHub
- Netlify will auto-deploy

#### **Cloudflare Pages**
1. Push your code to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your GitHub repository
5. Deploy!

#### **GitHub Pages**
1. Go to your repository settings
2. Navigate to "Pages"
3. Select your branch (usually `main`)
4. Save
5. Your site will be at `https://yourusername.github.io/repository-name`

---

## Tips for Great Messages

- **Be specific**: Reference shared memories or inside jokes
- **Vary the tone**: Mix sweet, funny, and thoughtful messages
- **Use emojis**: They add personality (❤️ 💕 🥰 💖 🌟 ✨)
- **Keep it personal**: Write from the heart
- **Length**: 1-3 sentences is perfect for daily notes

---

## Customization Ideas

Want to personalize further? You can:
- Change the title in `index.html` (line 17)
- Adjust colors in `style.css` (lines 3-17)
- Add photos or special effects
- Create themed messages for holidays

---

## Troubleshooting

**Messages not showing?**
- Check that `messages.json` is valid JSON (use [jsonlint.com](https://jsonlint.com))
- Make sure dates are in `YYYY-MM-DD` format
- Verify the file is deployed (check your hosting platform)

**Wrong message showing as "today"?**
- The most recent date is always shown as today's message
- Make sure your new messages have the current date

**Site not updating?**
- Clear your browser cache
- Check if changes were pushed to GitHub
- Verify deployment completed successfully

---

## Need Help?

If you run into any issues or want to add more features, feel free to ask! 💝
