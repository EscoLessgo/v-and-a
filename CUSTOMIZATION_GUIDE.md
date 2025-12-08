# 🎨 Customization Guide

This guide will help you personalize your love notes website to make it truly special!

## 🔐 Step 1: Set Your Password

Open `script.js` and find the `CONFIG` section at the top:

```javascript
const CONFIG = {
    password: 'iloveyou', // ← Change this!
    relationshipStartDate: '2024-01-01', // ← Change this!
    enablePassword: true, // Set to false to disable
    photos: []
};
```

**Change:**
- `password`: Set your own secret password
- `relationshipStartDate`: Your actual relationship start date (format: YYYY-MM-DD)
- `enablePassword`: Set to `false` if you don't want password protection

## 💕 Step 2: Customize the Relationship Counter

The "Days Together" counter automatically calculates from your `relationshipStartDate`.

**Example:**
```javascript
relationshipStartDate: '2023-06-15', // June 15, 2023
```

## 🎨 Step 3: Change Colors (Her Favorite Colors!)

Open `style.css` and find the `:root` section (lines 2-53):

### Current Theme: Pastel Purple & Soft Yellow

```css
:root {
    /* Colors - Pastel Purple & Soft Yellow Theme */
    --color-primary: hsl(270, 50%, 75%);        /* Main purple */
    --color-primary-light: hsl(270, 60%, 85%);  /* Light purple */
    --color-primary-dark: hsl(270, 50%, 65%);   /* Dark purple */
    --color-secondary: hsl(280, 55%, 80%);      /* Secondary purple */
    --color-accent: hsl(45, 100%, 80%);         /* Soft yellow */
}
```

### Popular Color Themes:

#### 🌸 Pink & Rose Gold
```css
--color-primary: hsl(340, 70%, 75%);
--color-primary-light: hsl(340, 80%, 85%);
--color-primary-dark: hsl(340, 70%, 65%);
--color-secondary: hsl(350, 75%, 80%);
--color-accent: hsl(30, 80%, 75%);
```

#### 💙 Ocean Blue & Turquoise
```css
--color-primary: hsl(200, 60%, 70%);
--color-primary-light: hsl(200, 70%, 80%);
--color-primary-dark: hsl(200, 60%, 60%);
--color-secondary: hsl(180, 65%, 75%);
--color-accent: hsl(190, 70%, 80%);
```

#### 🌺 Coral & Peach
```css
--color-primary: hsl(15, 75%, 70%);
--color-primary-light: hsl(15, 85%, 80%);
--color-primary-dark: hsl(15, 75%, 60%);
--color-secondary: hsl(25, 80%, 75%);
--color-accent: hsl(35, 85%, 80%);
```

#### 💚 Mint & Sage Green
```css
--color-primary: hsl(150, 40%, 70%);
--color-primary-light: hsl(150, 50%, 80%);
--color-primary-dark: hsl(150, 40%, 60%);
--color-secondary: hsl(140, 45%, 75%);
--color-accent: hsl(160, 50%, 80%);
```

## 📸 Step 4: Add Photos

### Option 1: Simple (Recommended)
1. Create a folder called `photos` in your project
2. Add your photos (name them: `photo1.jpg`, `photo2.jpg`, etc.)
3. Open `script.js` and find the `setupPhotoGallery()` function
4. Uncomment the photo array section and add your photos:

```javascript
const photos = [
    'photos/photo1.jpg',
    'photos/photo2.jpg',
    'photos/photo3.jpg',
    'photos/photo4.jpg',
    // Add as many as you want!
];
```

### Option 2: Use Online Photos
You can also use URLs from photo hosting services:

```javascript
const photos = [
    'https://i.imgur.com/yourphoto1.jpg',
    'https://i.imgur.com/yourphoto2.jpg',
];
```

## 🎵 Step 5: Add Background Music

1. Find a romantic song you both love
2. Convert it to MP3 format
3. Name it `music.mp3` and place it in your project folder
4. The music player will automatically work!

**Tips:**
- Keep the file size under 5MB for faster loading
- Use royalty-free music or your own recordings
- Popular choices: instrumental versions of "your song"

### Where to find music:
- **YouTube to MP3 converters** (for personal use only)
- **Free music sites**: Bensound, Incompetech, Free Music Archive
- **Your own recordings**: Record yourself singing or playing!

## ✏️ Step 6: Customize Text

### Change the Title
In `index.html`, line 17:
```html
<h1 class="title">Hi, Beautiful 💌</h1>
```

Change to her name or a special nickname:
```html
<h1 class="title">Hi, Sarah 💌</h1>
```

### Change the Subtitle
Line 18:
```html
<p class="subtitle">A little something sweet, just for you</p>
```

Make it more personal:
```html
<p class="subtitle">My daily love letters to you</p>
```

### Change the Footer
In `index.html`, lines 89-90:
```html
<p>Made with love ❤️</p>
<p class="footer-hint">Every moment with you is a treasure</p>
```

## 📝 Step 7: Add More Messages

Edit `messages.json` to add your own personal messages:

```json
{
    "date": "2025-12-09",
    "text": "Your personalized message here! 💕"
}
```

**Tips for great messages:**
- Mix sweet, funny, and encouraging messages
- Reference inside jokes or special memories
- Keep them 1-3 sentences for easy reading
- Use emojis to add personality! ❤️💕🥰✨

## 🚀 Step 8: Test Locally

Before deploying, test your site:

1. Open PowerShell in your project folder
2. Run: `python -m http.server 8000` (if you have Python)
   OR: `npx http-server` (if you have Node.js)
3. Open browser to: `http://localhost:8000`
4. Test the password, counter, music, and gallery!

## 🌐 Step 9: Deploy

Once everything looks perfect:

1. **Push to GitHub**
2. **Deploy on Netlify or Cloudflare Pages**
3. **Share the URL with your girlfriend!**

See `README.md` for detailed deployment instructions.

## 💡 Advanced Customizations

### Disable Password Protection
In `script.js`:
```javascript
enablePassword: false,
```

### Change Password Prompt Text
In `index.html`, lines 19-21:
```html
<h2 class="password-title">🔒 Enter Password</h2>
<p class="password-subtitle">This is a special place, just for you</p>
```

### Add More Animations
The site already has beautiful animations, but you can add more in `style.css`!

---

## 🎁 Final Touches

Before sharing with your girlfriend:

- [ ] Set the correct password
- [ ] Update the relationship start date
- [ ] Add at least 10-15 personalized messages
- [ ] Upload 3-5 photos of you together
- [ ] Add background music (optional)
- [ ] Customize colors to her favorites
- [ ] Test everything locally
- [ ] Deploy to a live URL
- [ ] Bookmark the URL on her phone/computer

---

**Need help?** All the code is well-commented and easy to modify. Don't be afraid to experiment! 💕
