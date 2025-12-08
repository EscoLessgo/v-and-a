# 💌 Love Notes - Quick Start Guide

## 🎉 You're All Set Up!

Your love notes website is ready to use! Here's everything you need to know:

---

## 🔐 Password

The password to access the site is: **1125**

You can change this in `script.js` (line 4)

---

## ✏️ How to Add Messages & Photos

### Option 1: Use the Admin Panel (EASIEST!)

1. Open `admin.html` in your browser
2. Fill in the form to add a message or photo
3. Click "Add Message" or "Add Photo"
4. **Copy the generated code**
5. Open the respective JSON file (`messages.json` or `photos.json`)
6. **Replace everything** in the file with the copied code
7. Save the file
8. Refresh the main site - your new content appears!

**You can share `admin.html` with your girlfriend so she can add messages too!**

---

### Option 2: Edit JSON Files Directly

#### Adding a Message:

Open `messages.json` and add to the array:

```json
{
    "messages": [
        {
            "date": "2025-12-09",
            "text": "Your sweet message here! 💕"
        }
    ]
}
```

#### Adding a Photo:

This is harder - use the admin panel instead! But if you must:
1. Convert your image to base64
2. Add to `photos.json`:

```json
[
    {
        "data": "data:image/jpeg;base64,YOUR_BASE64_HERE",
        "caption": "Our first date 💕",
        "date": "2025-12-08"
    }
]
```

---

## 🎨 Dark Mode

The site is now in **dark mode** with pastel purple and soft yellow accents!

---

## 📁 File Structure

```
love-notes/
├── index.html          ← Main site (share this URL)
├── admin.html          ← Admin panel (for adding content)
├── style.css           ← Styling
├── admin-style.css     ← Admin panel styling
├── script.js           ← Main functionality
├── admin-script.js     ← Admin panel functionality
├── messages.json       ← Your messages (currently empty)
├── photos.json         ← Your photos (currently empty)
└── music.mp3           ← Background music (optional - add this file)
```

---

## 🚀 Deployment

### Quick Deploy to Netlify:

1. **Create a GitHub repo** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Love notes site"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Go to [netlify.com](https://netlify.com)**
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repo
   - Click "Deploy site"

3. **Done!** You'll get a URL like `your-site.netlify.app`

### Or Deploy to Cloudflare Pages:

1. Push to GitHub (same as above)
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Pages → "Create a project"
4. Connect GitHub and select your repo
5. Click "Save and Deploy"

---

## 💡 Tips

### For You:
- Add a new message every day or whenever you want
- Mix sweet, funny, and encouraging messages
- Use emojis to add personality! ❤️💕🥰✨
- Add photos of special moments together

### For Her:
- She can add messages back to you using the admin panel!
- Just share the admin.html URL with her
- She'll use the same password (1125)

---

## 🎵 Adding Music

1. Find a romantic song (MP3 format)
2. Name it `music.mp3`
3. Put it in the same folder as index.html
4. The music player will automatically work!

**Note:** Keep file size under 5MB for faster loading

---

## ❓ Troubleshooting

**"No messages yet" showing on the site?**
- Make sure `messages.json` has at least one message
- Check that the JSON format is correct (use the admin panel to be safe!)

**Photos not showing?**
- Use the admin panel - it handles all the technical stuff
- Make sure `photos.json` is saved properly

**Password not working?**
- Check `script.js` line 4 for the correct password
- Clear your browser cache and try again

---

## 🎁 What's Included

✅ Password protection (can be disabled)  
✅ Dark mode with beautiful purple/yellow theme  
✅ Message history  
✅ Photo gallery  
✅ Background music player  
✅ Floating hearts animation  
✅ Mobile responsive  
✅ **Easy admin panel for both of you!**  

---

## 📞 Need Help?

All the code is well-commented and easy to modify. The admin panel makes it super easy to add content without touching any code!

**Enjoy your love notes website! 💕**
