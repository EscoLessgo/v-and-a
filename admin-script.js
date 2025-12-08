// Admin Panel JavaScript

// Set today's date
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('messageDate').value = today;
}

// Add emoji to message
function addEmoji(emoji) {
    const textarea = document.getElementById('messageText');
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    textarea.value = textBefore + emoji + textAfter;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = cursorPos + emoji.length;
    updateCharCount();
}

// Update character count
function updateCharCount() {
    const textarea = document.getElementById('messageText');
    const count = textarea.value.length;
    document.getElementById('charCount').textContent = count;
}

document.getElementById('messageText')?.addEventListener('input', updateCharCount);

// Handle message form submission
document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('messageDate').value;
    const text = document.getElementById('messageText').value.trim();

    if (!date || !text) {
        alert('Please fill in all fields!');
        return;
    }

    const newMessage = {
        date: date,
        text: text
    };

    // Load existing messages
    let messages = [];
    try {
        const response = await fetch('messages.json');
        const data = await response.json();
        messages = data.messages || [];
    } catch (error) {
        console.log('No existing messages, starting fresh');
    }

    // Add new message at the beginning
    messages.unshift(newMessage);

    // Create the JSON output
    const output = JSON.stringify({ messages }, null, 4);

    showModal(
        '✅ Message Added!',
        'Copy the code below and paste it into messages.json (replace everything in the file):',
        output
    );

    // Reset form
    document.getElementById('messageForm').reset();
    updateCharCount();

    // Reload messages list
    loadMessages();
});

// Handle photo form submission
document.getElementById('photoFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('photoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('photoFile');
    const caption = document.getElementById('photoCaption').value.trim();

    if (!fileInput.files[0]) {
        alert('Please select a photo!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        const base64Image = event.target.result;

        const newPhoto = {
            data: base64Image,
            caption: caption || '',
            date: new Date().toISOString().split('T')[0]
        };

        // Load existing photos
        let photos = [];
        try {
            const response = await fetch('photos.json');
            photos = await response.json();
        } catch (error) {
            console.log('No existing photos, starting fresh');
        }

        // Add new photo
        photos.unshift(newPhoto);

        // Create the JSON output
        const output = JSON.stringify(photos, null, 4);

        showModal(
            '✅ Photo Added!',
            'Copy the code below and paste it into photos.json (replace everything in the file):',
            output
        );

        // Reset form
        document.getElementById('photoForm').reset();
        document.getElementById('photoPreview').innerHTML = '';

        // Reload photos
        loadPhotos();
    };

    reader.readAsDataURL(file);
});

// Show modal with output
function showModal(title, instructions, code) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalInstructions').textContent = instructions;
    document.getElementById('codeOutput').textContent = code;
    document.getElementById('outputModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('outputModal').classList.remove('active');
}

// Copy code to clipboard
function copyCode() {
    const code = document.getElementById('codeOutput').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Load and display current messages
async function loadMessages() {
    try {
        const response = await fetch('messages.json');
        const data = await response.json();
        const messages = data.messages || [];

        const container = document.getElementById('messagesList');

        if (messages.length === 0) {
            container.innerHTML = '<p class="empty-state">No messages yet. Add your first one above! 💕</p>';
            return;
        }

        container.innerHTML = messages.map(msg => `
            <div class="message-item">
                <div class="message-date">${formatDate(msg.date)}</div>
                <div class="message-content">${msg.text}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Load and display current photos
async function loadPhotos() {
    try {
        const response = await fetch('photos.json');
        const photos = await response.json();

        const container = document.getElementById('photosGrid');

        if (!photos || photos.length === 0) {
            container.innerHTML = '<p class="empty-state">No photos yet. Add your first one above! 📸</p>';
            return;
        }

        container.innerHTML = photos.map(photo => `
            <div class="photo-item">
                <img src="${photo.data}" alt="${photo.caption || 'Photo'}">
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading photos:', error);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setToday();
    loadMessages();
    loadPhotos();
});

// Close modal on outside click
document.getElementById('outputModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'outputModal') {
        closeModal();
    }
});
