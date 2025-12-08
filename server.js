const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database('love-notes.db');

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
app.post('/api/messages', (req, res) => {
    try {
        const { text, author, date } = req.body;

        const stmt = db.prepare(`
            INSERT INTO messages (text, author, date) 
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(text, author, date);

        res.json({
            success: true,
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
    console.log(`   API: /api/messages\n`);
});
