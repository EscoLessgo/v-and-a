// ==================== STATE ====================
let currentUser = null;
let currentDisplayName = null;
let selectedFile = null;
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

// ==================== FILE HANDLING ====================
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile = file;
    const previewContainer = document.getElementById('mediaPreview');
    previewContainer.innerHTML = '';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewContainer.innerHTML = `
                <div class="preview-item">
                    <img src="${e.target.result}" alt="Preview" class="preview-img">
                    <button onclick="clearFileSelection()" class="remove-file-btn">❌</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        previewContainer.innerHTML = `
             <div class="preview-item">
                <span class="file-info">📹 ${file.name} (${formatBytes(file.size)})</span>
                <button onclick="clearFileSelection()" class="remove-file-btn">❌</button>
            </div>
        `;
    }
}

function clearFileSelection() {
    selectedFile = null;
    document.getElementById('mediaInput').value = '';
    document.getElementById('mediaPreview').innerHTML = '';
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ==================== SEND MESSAGE ====================
async function sendMessage() {
    const text = document.getElementById('messageText').value.trim();
    const sendBtn = document.querySelector('.send-btn');

    if (!text && !selectedFile) {
        alert('Please write a message or add a photo/video!');
        return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    let mediaUrl = null;
    let mediaType = null;

    try {
        // Upload file if selected
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadResponse = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) throw new Error('File upload failed');

            const uploadData = await uploadResponse.json();
            mediaUrl = uploadData.fileUrl;
            mediaType = uploadData.fileType;
        }

        // Send message
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                author: currentUser,
                date: new Date().toISOString().split('T')[0],
                media_url: mediaUrl,
                media_type: mediaType
            })
        });

        if (response.ok) {
            document.getElementById('messageText').value = '';
            clearFileSelection();
            document.getElementById('newMessageForm').style.display = 'none';
            loadMessages();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + error.message);
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send 💕';
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
            
            ${msg.text ? `<div class="message-text">${msg.text}</div>` : ''}

            ${msg.media_url ? `
                <div class="message-media">
                    ${msg.media_type && msg.media_type.startsWith('video') ?
                `<video controls src="${msg.media_url}" class="media-content"></video>` :
                `<img src="${msg.media_url}" class="media-content" loading="lazy" alt="Love Note Media">`
            }
                </div>
            ` : ''}
            
            <div class="message-actions">
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '❤️')">❤️</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '💕')">💕</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '🥰')">🥰</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '😊')">😊</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '💖')">💖</button>
                <button class="emoji-btn" onclick="addReaction(${msg.id}, '✨')">✨</button>
                <button class="reply-btn" onclick="toggleReplyForm(${msg.id})">Reply</button>
                ${msg.author === currentUser ? `<button class="delete-btn" onclick="deleteMessage(${msg.id})">Delete</button>` : ''}
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

// ==================== DELETE MESSAGE ====================
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/messages/${messageId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadMessages();
        } else {
            alert('Failed to delete message.');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error communicating with server.');
    }
}

// Auto-refresh every 30 seconds
setInterval(loadMessages, 30000);

// ==================== CLOCKS ====================
function updateClocks() {
    // Amsterdam Time (CET/CEST)
    const amsterdamEl = document.getElementById('clock-amsterdam');
    if (amsterdamEl) {
        const amsterdamTime = new Date().toLocaleTimeString('en-US', {
            timeZone: 'Europe/Amsterdam',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        amsterdamEl.textContent = amsterdamTime;
    }

    // St. Joseph, Missouri Time (Central Time)
    const stJosephEl = document.getElementById('clock-stjoseph');
    if (stJosephEl) {
        const stJosephTime = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/Chicago',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        stJosephEl.textContent = stJosephTime;
    }
}

// Update clocks every second
setInterval(updateClocks, 1000);
updateClocks(); // Initial call
