// ==================== CONFIGURATION ====================
// CUSTOMIZE THESE VALUES!
const CONFIG = {
    password: '1125', // Change this to your desired password
    enablePassword: true // Set to false to disable password protection
};

// ==================== PASSWORD PROTECTION ====================
function setupPasswordProtection() {
    if (!CONFIG.enablePassword) {
        document.getElementById('passwordOverlay').classList.add('hidden');
        return;
    }

    const overlay = document.getElementById('passwordOverlay');
    const input = document.getElementById('passwordInput');
    const button = document.getElementById('passwordSubmit');
    const error = document.getElementById('passwordError');

    // Check if already authenticated
    if (sessionStorage.getItem('authenticated') === 'true') {
        overlay.classList.add('hidden');
        return;
    }

    function checkPassword() {
        const enteredPassword = input.value;
        if (enteredPassword === CONFIG.password) {
            sessionStorage.setItem('authenticated', 'true');
            overlay.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        } else {
            error.textContent = 'Incorrect password. Try again! 💕';
            input.value = '';
            input.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }
    }

    button.addEventListener('click', checkPassword);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    @keyframes fadeOut {
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== MUSIC PLAYER ====================
function setupMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const audio = document.getElementById('backgroundMusic');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎵';
        } else {
            audio.play().catch(err => {
                console.log('Audio playback failed:', err);
            });
            musicToggle.classList.add('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎶';
        }
        isPlaying = !isPlaying;
    });
}

// ==================== PHOTO GALLERY ====================
async function setupPhotoGallery() {
    const toggleButton = document.getElementById('toggleGallery');
    const galleryContainer = document.getElementById('galleryContainer');

    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('active');
        galleryContainer.classList.toggle('active');
    });

    // Load photos from photos.json
    try {
        const response = await fetch('photos.json');
        const photos = await response.json();

        if (photos && photos.length > 0) {
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '';

            photos.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.style.animationDelay = `${index * 0.1}s`;

                const img = document.createElement('img');
                img.src = photo.data;
                img.alt = photo.caption || `Memory ${index + 1}`;

                if (photo.caption) {
                    const caption = document.createElement('div');
                    caption.className = 'photo-caption';
                    caption.textContent = photo.caption;
                    item.appendChild(caption);
                }

                item.appendChild(img);
                galleryGrid.appendChild(item);
            });
        }
    } catch (error) {
        console.log('No photos yet');
    }
}

// ==================== MESSAGES ====================
// Load and display messages
async function loadMessages() {
    try {
        const response = await fetch('messages.json');
        const data = await response.json();

        if (!data.messages || data.messages.length === 0) {
            displayError('No messages yet. Use the admin panel to add your first love note! 💕');
            return;
        }

        // Sort messages by date (newest first)
        const sortedMessages = data.messages.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        // Display today's message (most recent)
        displayTodayMessage(sortedMessages[0]);

        // Display history (all except the first one)
        if (sortedMessages.length > 1) {
            displayHistory(sortedMessages.slice(1));
        } else {
            document.getElementById('toggleHistory').style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading messages:', error);
        displayError('No messages yet. Use the admin panel to add your first love note! 💕');
    }
}

// Display today's message
function displayTodayMessage(message) {
    const dateElement = document.getElementById('todayDate');
    const messageElement = document.getElementById('todayMessage');

    const formattedDate = formatDate(message.date);
    dateElement.textContent = formattedDate;
    messageElement.textContent = message.text;

    // Add stagger animation to message
    messageElement.style.animation = 'fadeInUp 0.6s ease 0.6s backwards';
}

// Display message history
function displayHistory(messages) {
    const historyGrid = document.getElementById('historyGrid');
    historyGrid.innerHTML = '';

    messages.forEach((message, index) => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const dateDiv = document.createElement('div');
        dateDiv.className = 'history-date';
        dateDiv.textContent = formatDate(message.date);

        const messageDiv = document.createElement('div');
        messageDiv.className = 'history-message';
        messageDiv.textContent = message.text;

        card.appendChild(dateDiv);
        card.appendChild(messageDiv);
        historyGrid.appendChild(card);
    });
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// Display error message
function displayError(errorMessage) {
    const messageElement = document.getElementById('todayMessage');
    messageElement.textContent = errorMessage;
    messageElement.style.color = 'var(--color-accent)';
}

// Toggle history visibility
function setupHistoryToggle() {
    const toggleButton = document.getElementById('toggleHistory');
    const historyContainer = document.getElementById('historyContainer');

    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('active');
        historyContainer.classList.toggle('active');
    });
}

// Add floating hearts effect on click
function addHeartEffect(e) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'floatUp 2s ease forwards';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Add floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(floatStyle);

// Add click listener for heart effect
document.addEventListener('click', (e) => {
    // Only add hearts when clicking on message cards
    if (e.target.closest('.message-card')) {
        addHeartEffect(e);
    }
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    setupPasswordProtection();
    setupMusicPlayer();
    setupPhotoGallery();
    loadMessages();
    setupHistoryToggle();
});

// Optional: Auto-refresh every 5 minutes to check for new messages
setInterval(() => {
    loadMessages();
}, 5 * 60 * 1000);
