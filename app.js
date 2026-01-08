const yogaSessions = [
    { id: 1, title: "Morning Flow", instructor: "Yoga With Adriene", duration: "20 min", level: "Beginner", description: "Start your day with energizing poses", image: "🌅" },
    { id: 2, title: "Evening Calm", instructor: "Yoga With Kassandra", duration: "25 min", level: "All Levels", description: "Gentle yin yoga for relaxation", image: "🌙" },
    { id: 3, title: "Stress Relief", instructor: "Sarah Beth Yoga", duration: "15 min", level: "Beginner", description: "Quick stress relief session", image: "😌" },
    { id: 4, title: "Power Yoga", instructor: "Yoga With Tim", duration: "30 min", level: "Intermediate", description: "Build strength and flexibility", image: "💪" }
];

const counselors = [
    { name: "Dhanvanth TP", phone: "8667539586", specialty: "Clinical Psychologist", expertise: "Anxiety, Depression, Stress" },
    { name: "Purushothaman Ramesh", phone: "9600080109", specialty: "Licensed Therapist", expertise: "Relationships, Life Coaching" },
    { name: "Amogh Aaditya", phone: "9715416262", specialty: "Counselor", expertise: "CBT, Mindfulness, Anxiety" },
    { name: "Rimangdawet Rapthap", phone: "8056244186", specialty: "Psychiatrist", expertise: "Mood Disorders, Crisis Support" }
];

const moodData = [];

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() { showPage('home-page'); }
function goYoga() { showPage('yoga-page'); initializeYoga(); }
function goMood() { showPage('mood-page'); displayMoodHistory(); }
function goCounseling() { showPage('counseling-page'); initializeCounseling(); }
function openBhishma() { showPage('bhishma-page'); }

function openLoginModal() { document.getElementById('login-modal').classList.add('active'); }
function closeLoginModal() { document.getElementById('login-modal').classList.remove('active'); }
function openSignupModal() { closeLoginModal(); document.getElementById('signup-modal').classList.add('active'); }
function closeSignupModal() { document.getElementById('signup-modal').classList.remove('active'); }

function loginEmail(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const name = email.split('@')[0];
    const user = { name, email };
    closeLoginModal();
    showDashboard(user);
}

function signupEmail(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const user = { name, email };
    closeSignupModal();
    showDashboard(user);
}

function demoMode() {
    const user = { name: 'Demo User', email: 'demo@svastha.com' };
    showDashboard(user);
}

function showDashboard(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('signup-btn').style.display = 'none';
    document.getElementById('user-name').style.display = 'block';
    document.getElementById('user-name').textContent = `Hi, ${user.name}!`;
    document.getElementById('logout-btn').style.display = 'inline-block';
    goHome();
}

function logout() {
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('signup-btn').style.display = 'inline-block';
    document.getElementById('user-name').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    goHome();
}

function initializeYoga() {
    let html = '<div class="yoga-grid">';
    yogaSessions.forEach(session => {
        html += `
            <div class="yoga-card" onclick="startYoga('${session.title}')">
                <div class="yoga-image">${session.image}</div>
                <div class="yoga-content">
                    <div class="yoga-title">${session.title}</div>
                    <p style="font-size: 12px; color: var(--gray); margin-bottom: 8px;">with ${session.instructor}</p>
                    <div class="yoga-meta">
                        <span class="yoga-tag">⏱️ ${session.duration}</span>
                        <span class="yoga-tag">📊 ${session.level}</span>
                    </div>
                    <p class="yoga-desc">${session.description}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    document.getElementById('yoga-grid').innerHTML = html;
}

function startYoga(title) {
    alert(`✅ Starting: ${title}\n\nPlease check YouTube for full session guide.`);
}

function recordMood(level, emoji) {
    const today = new Date().toLocaleDateString();
    moodData.push({ date: today, level, emoji });
    alert(`✅ Mood recorded: ${emoji}`);
    displayMoodHistory();
}

function displayMoodHistory() {
    const last7 = moodData.slice(-7);
    let html = '';
    last7.forEach((m, i) => {
        html += `<div style="background: white; padding: 12px; border-radius: 8px; text-align: center; border: 2px solid var(--light-border);"><div style="font-size: 12px; color: var(--gray); margin-bottom: 6px;">Day ${i+1}</div><div style="font-size: 24px;">${m.emoji}</div></div>`;
    });
    document.getElementById('mood-history').innerHTML = html || '<p style="color: var(--gray);">No mood data yet</p>';
}

function initializeCounseling() {
    let html = '<div class="grid">';
    counselors.forEach(c => {
        html += `
            <div class="counselor-card">
                <div class="counselor-avatar">👨‍⚕️</div>
                <div class="counselor-name">${c.name}</div>
                <div class="counselor-phone">📱 ${c.phone}</div>
                <div class="counselor-info">
                    <strong>${c.specialty}</strong><br>
                    ${c.expertise}
                </div>
                <a href="tel:${c.phone}" class="counselor-btn">Call Now</a>
            </div>
        `;
    });
    html += '</div>';
    document.getElementById('counselor-grid').innerHTML = html;
}

const responses = {
    hello: ['Hi! How can I help you today?', 'Hello! What brings you here?', 'Welcome! Tell me more'],
    anxiety: ['Try deep breathing. Breathe in for 4, hold for 4, exhale for 6.', 'Anxiety is manageable. Try exercise or meditation.'],
    depression: ['Reach out to a professional. You deserve support.', 'Depression is treatable. Please seek help.'],
    sleep: ['Keep consistent sleep schedule. Avoid screens before bed.', 'Create cool, dark bedroom.'],
    stress: ['Try exercise or yoga.', 'Take breaks and practice self-care.'],
    crisis: ['🚨 CRISIS SUPPORT: 9600080109', 'Contact emergency services immediately.']
};

const crisisKeywords = ['suicide', 'kill', 'die', 'hopeless', 'worthless'];

function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    const chatBox = document.getElementById('chat-container');
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-msg';
    userDiv.textContent = input.value;
    chatBox.appendChild(userDiv);
    input.value = '';

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'message bhishma-msg';
        
        if (crisisKeywords.some(k => msg.includes(k))) {
            botDiv.textContent = responses.crisis[0];
        } else if (msg.includes('anx')) {
            botDiv.textContent = responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
        } else if (msg.includes('depr')) {
            botDiv.textContent = responses.depression[Math.floor(Math.random() * responses.depression.length)];
        } else if (msg.includes('sleep')) {
            botDiv.textContent = responses.sleep[Math.floor(Math.random() * responses.sleep.length)];
        } else if (msg.includes('stress')) {
            botDiv.textContent = responses.stress[Math.floor(Math.random() * responses.stress.length)];
        } else {
            botDiv.textContent = responses.hello[Math.floor(Math.random() * responses.hello.length)];
        }
        
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 300);
}

window.addEventListener('load', () => {
    console.log('🧠 Svastha V15 - Complete Mental Wellness Platform Loaded');
    console.log('✅ All features operational!');
});