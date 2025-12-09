require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
// Use DATA_DIR env var if set (for Railway Volumes), otherwise use current directory
const DATA_DIR = process.env.DATA_DIR || __dirname;

// Ensure Data Directory exists if it's not the current directory
if (DATA_DIR !== __dirname && !fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`Created data directory: ${DATA_DIR}`);
    } catch (err) {
        console.error(`Error creating data directory: ${err.message}`);
    }
}

const dbPath = path.join(DATA_DIR, 'love-notes.db');
const db = new Database(dbPath);
console.log(`Database stored at: ${dbPath}`);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Ensure uploads directory exists
const uploadDir = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB limit
});

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        media_url TEXT,
        media_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        emoji TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id)
    );

    CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id)
    );
`);

// Migration to add media columns if they don't exist (for existing databases)
try {
    const tableInfo = db.prepare('PRAGMA table_info(messages)').all();
    const hasMediaUrl = tableInfo.some(col => col.name === 'media_url');

    if (!hasMediaUrl) {
        console.log('Migrating database: Adding media columns...');
        db.prepare('ALTER TABLE messages ADD COLUMN media_url TEXT').run();
        db.prepare('ALTER TABLE messages ADD COLUMN media_type TEXT').run();
    }
} catch (error) {
    console.error('Migration error:', error);
}

// Insert default users (Ashton and Vanessa) if they don't exist
const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, display_name) 
    VALUES (?, ?, ?)
`);

insertUser.run('ashton', '1125', 'Ashton');
insertUser.run('vanessa', '1125', 'Vanessa');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        const user = db.prepare(`
            SELECT * FROM users 
            WHERE username = ? AND password = ?
        `).get(username, password);

        if (user) {
            res.json({
                success: true,
                user: {
                    username: user.username,
                    displayName: user.display_name
                }
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid username or password'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return relative path for frontend use
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileType = req.file.mimetype; // e.g., 'image/jpeg', 'video/mp4'

        res.json({
            success: true,
            fileUrl: fileUrl,
            fileType: fileType
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all messages with reactions and replies
app.get('/api/messages', (req, res) => {
    try {
        const messages = db.prepare(`
            SELECT * FROM messages 
            ORDER BY date DESC, created_at DESC
        `).all();

        // Get reactions and replies for each message
        messages.forEach(msg => {
            msg.reactions = db.prepare(`
                SELECT * FROM reactions 
                WHERE message_id = ? 
                ORDER BY created_at DESC
            `).all(msg.id);

            msg.replies = db.prepare(`
                SELECT * FROM replies 
                WHERE message_id = ? 
                ORDER BY created_at ASC
            `).all(msg.id);
        });

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new message
app.post('/api/messages', async (req, res) => {
    try {
        const { text, author, date, media_url, media_type } = req.body;

        const stmt = db.prepare(`
            INSERT INTO messages (text, author, date, media_url, media_type) 
            VALUES (?, ?, ?, ?, ?)
        `);

        // Pass null if media_url or media_type are undefined/missing
        const result = stmt.run(text, author, date, media_url || null, media_type || null);

        // Send Discord Notification (Non-blocking)
        sendDiscordNotification(text, author, media_url).catch(err => console.error('Discord Webhook Error:', err));

        res.json({
            success: true,
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper: Send Discord Notification
async function sendDiscordNotification(text, author, mediaUrl) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    // Capitalize author name
    const authorName = author.charAt(0).toUpperCase() + author.slice(1);

    // Construct absolute URL for media if present
    // Assuming the app is deployed, we need the public base URL.
    // For now, we'll try to use a generic approach or just send the text/file info.
    // In a real deployed scenario, you'd prepend the domain (e.g., https://myapp.railway.app)

    const embeds = [{
        title: `💌 New Note from ${authorName}!`,
        description: text || '(No text content)',
        color: 16758465, // Pinkish color
        timestamp: new Date().toISOString(),
        footer: {
            text: "Daily Dose Love Notes"
        }
    }];

    // If there is media, add it to the embed or content
    // Note: Discord acts weird with local host URLs, but for production it works if the URL is public.
    const PUBLIC_URL = process.env.PUBLIC_URL; // User should set this in Railway

    if (mediaUrl && PUBLIC_URL) {
        const fullMediaUrl = `${PUBLIC_URL}${mediaUrl}`;
        embeds[0].image = { url: fullMediaUrl };
    } else if (mediaUrl) {
        embeds[0].description += `\n\n(See attached media in the app)`;
    }

    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: "Love Notes Bot",
            embeds: embeds
        })
    });
}

// Add a reaction to a message
app.post('/api/reactions', (req, res) => {
    try {
        const { message_id, emoji, author } = req.body;

        const stmt = db.prepare(`
            INSERT INTO reactions (message_id, emoji, author) 
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(message_id, emoji, author);

        res.json({
            success: true,
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a reply to a message
app.post('/api/replies', (req, res) => {
    try {
        const { message_id, text, author } = req.body;

        const stmt = db.prepare(`
            INSERT INTO replies (message_id, text, author) 
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(message_id, text, author);

        res.json({
            success: true,
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a message
app.delete('/api/messages/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve message to check for media files to delete
        const message = db.prepare('SELECT media_url FROM messages WHERE id = ?').get(id);

        if (message && message.media_url) {
            const filePath = path.join(__dirname, message.media_url);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            }
        }

        // Delete reactions and replies first
        db.prepare('DELETE FROM reactions WHERE message_id = ?').run(id);
        db.prepare('DELETE FROM replies WHERE message_id = ?').run(id);
        db.prepare('DELETE FROM messages WHERE id = ?').run(id);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n💌 Love Notes Server Running!\n`);
    console.log(`   Port: ${PORT}`);
    console.log(`   API: /api/messages`);
    console.log(`   Uploads: /uploads\n`);
});
