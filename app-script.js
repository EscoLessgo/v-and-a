// ==================== STATE ====================
let currentUser = null;
let currentDisplayName = null;
// Auto-detect API URL based on environment
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;

// ==================== LOGIN ====================
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user.username;
            currentDisplayName = data.user.displayName;
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('currentDisplayName', currentDisplayName);

            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            document.getElementById('currentUser').textContent = currentDisplayName;

            loadMessages();
        } else {
            errorEl.textContent = data.error || 'Login failed';
            errorEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorEl.textContent = 'Server error. Make sure the server is running!';
        errorEl.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    currentDisplayName = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentDisplayName');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    const savedDisplayName = localStorage.getItem('currentDisplayName');

    if (savedUser && savedDisplayName) {
        currentUser = savedUser;
        currentDisplayName = savedDisplayName;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('currentUser').textContent = currentDisplayName;
        loadMessages();
    }
});

// ==================== TOGGLE FORM ====================
function toggleForm() {
    const form = document.getElementById('newMessageForm');
    const isVisible = form.style.display !== 'none';
    form.style.display = isVisible ? 'none' : 'block';
}

// ==================== SEND MESSAGE ====================
async function sendMessage() {
    const text = document.getElementById('messageText').value.trim();

    if (!text) {
        alert('Please write a message!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                author: currentUser,
                date: new Date().toISOString().split('T')[0]
            })
        });

        if (response.ok) {
            document.getElementById('messageText').value = '';
            document.getElementById('newMessageForm').style.display = 'none';
            loadMessages();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Make sure the server is running!');
    }
}

// ==================== LOAD MESSAGES ====================
async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`);
        const data = await response.json();

        displayMessages(data.messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        document.getElementById('messagesContainer').innerHTML = `
            <div class="empty-state">
                <h2>Server Not Running</h2>
                <p>Please start the server with: <code>node server.js</code></p>
            </div>
        `;
    }
}

// ==================== DISPLAY MESSAGES ====================
function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');

    if (!messages || messages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No messages yet 💕</h2>
                <p>Be the first to write a love note!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div class="message-header">
                <span class="message-author">${msg.author === currentUser ? 'You' : (msg.author === 'ashton' ? 'Ashton' : 'Vanessa')}</span>
                <span class="message-date">${formatDate(msg.date)}</span>
            </div>
            
            <div class="message-text">${msg.text}</div>
            
            <div class="message-actions">
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '❤️')">❤️</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '💕')">💕</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '🥰')">🥰</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '😊')">😊</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '💖')">💖</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '✨')">✨</button>
                <button class="reply-btn" onclick="toggleReplyForm(${msg.id})">Reply</button>
            </div>
            
            ${msg.reactions && msg.reactions.length > 0 ? `
                <div class="reactions-list">
                    ${msg.reactions.map(r => `
                        <span class="reaction-item">${r.emoji} ${r.author === currentUser ? 'You' : (r.author === 'ashton' ? 'Ashton' : 'Vanessa')}</span>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="reply-form" id="replyForm${msg.id}" style="display: none;">
                <textarea id="replyText${msg.id}" placeholder="Write a reply..." rows="2"></textarea>
                <button onclick="sendReply(${msg.id})">Send Reply</button>
            </div>
            
            ${msg.replies && msg.replies.length > 0 ? `
                <div class="replies-section">
                    ${msg.replies.map(r => `
                        <div class="reply-item">
                            <div class="reply-author">${r.author === currentUser ? 'You' : (r.author === 'ashton' ? 'Ashton' : 'Vanessa')}</div>
                            <div class="reply-text">${r.text}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ==================== ADD REACTION ====================
async function addReaction(messageId, emoji) {
    try {
        const response = await fetch(`${API_URL}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message_id: messageId,
                emoji: emoji,
                author: currentUser
            })
        });

        if (response.ok) {
            loadMessages();
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
    }
}

// ==================== TOGGLE REPLY FORM ====================
function toggleReplyForm(messageId) {
    const form = document.getElementById(`replyForm${messageId}`);
    const isVisible = form.style.display !== 'none';
    form.style.display = isVisible ? 'none' : 'block';
}

// ==================== SEND REPLY ====================
async function sendReply(messageId) {
    const text = document.getElementById(`replyText${messageId}`).value.trim();

    if (!text) {
        alert('Please write a reply!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/replies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message_id: messageId,
                text: text,
                author: currentUser
            })
        });

        if (response.ok) {
            document.getElementById(`replyText${messageId}`).value = '';
            document.getElementById(`replyForm${messageId}`).style.display = 'none';
            loadMessages();
        }
    } catch (error) {
        console.error('Error sending reply:', error);
    }
}

// ==================== HELPERS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// Auto-refresh every 30 seconds
setInterval(loadMessages, 30000);
