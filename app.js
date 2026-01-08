// In-Memory Data Storage (No localStorage)
let appState = {
  isAuthenticated: false,
  isDemoMode: false,
  demoUsesRemaining: 5,
  user: {
    name: '',
    email: '',
    password: ''
  },
  activities: [],
  moodEntries: [],
  screenTimeData: {
    currentSessionStart: null,
    currentSessionElapsed: 0,
    todayTotal: 0,
    isTracking: false
  },
  suryaNamaskarState: {
    currentStep: 0,
    isRunning: false,
    isPaused: false,
    currentTimer: null,
    poseStartTime: null,
    totalSessionTime: 0,
    poseDuration: 10,
    poses: [
      { name: 'Pranamasana (Prayer Pose)', description: 'Stand tall, feet together, palms together at chest', breathing: 'Exhale', emoji: '🙏' },
      { name: 'Hastauttanasana (Raised Arms Pose)', description: 'Raise arms up and back, stretch the whole body', breathing: 'Inhale', emoji: '🙌' },
      { name: 'Hastapadasana (Standing Forward Bend)', description: 'Bend forward from waist, hands to floor or ankles', breathing: 'Exhale', emoji: '🤸' },
      { name: 'Ashwa Sanchalanasana (Equestrian Pose) - Right', description: 'Step right leg back, drop left knee, arch chest', breathing: 'Inhale', emoji: '🧘' },
      { name: 'Dandasana (Stick Pose)', description: 'Bring both legs back, body in straight line', breathing: 'Retain breath', emoji: '📏' },
      { name: 'Ashtanga Namaskara (Eight-Limbed Pose)', description: 'Lower body to floor, chest and chin touch ground', breathing: 'Exhale', emoji: '⬇️' },
      { name: 'Bhujangasana (Cobra Pose)', description: 'Chest forward, arms straight, upper body lifted', breathing: 'Inhale', emoji: '🐍' },
      { name: 'Adho Mukha Svanasana (Downward-Facing Dog)', description: 'Hips up, body in inverted V shape', breathing: 'Exhale', emoji: '🐕' },
      { name: 'Ashwa Sanchalanasana (Equestrian Pose) - Left', description: 'Step left leg forward, drop right knee, arch chest', breathing: 'Inhale', emoji: '🧘' },
      { name: 'Hastapadasana (Standing Forward Bend)', description: 'Bring both legs forward, bend from waist', breathing: 'Exhale', emoji: '🤸' },
      { name: 'Hastauttanasana (Raised Arms Pose)', description: 'Roll spine up, raise arms, slight backbend', breathing: 'Inhale', emoji: '🙌' },
      { name: 'Tadasana (Mountain Pose)', description: 'Stand tall, arms at sides, relax and observe', breathing: 'Exhale', emoji: '🏔️' }
    ]
  },
  breathingExercises: {
    'Kapal Bhati': { description: 'Skull Shining Breath - forceful exhalations', technique: 'Forceful exhales through nose, passive inhales', duration: 60 },
    'Anulom Vilom': { description: 'Alternate Nostril Breathing', technique: 'Close right nostril, inhale left, switch, exhale right', duration: 300 },
    'Bhastrika': { description: 'Bellows Breathing', technique: 'Deep inhalations and forceful exhalations', duration: 120 },
    'Ujjayi': { description: 'Ocean Breath', technique: 'Tone throat during inhalation and exhalation', duration: 0 }
  },
  currentMood: null,
  moodStream: null,
  moodDetectionActive: false,
  aiChatHistory: []
};

let screenTimeInterval = null;
let breathingInterval = null;
let breathingTimeElapsed = 0;

// Custom Cursor
document.addEventListener('mousemove', (e) => {
  const cursor = document.getElementById('custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

function showLanding() {
  showPage('landing-page');
}

function showAuth() {
  showPage('auth-page');
}

function showDashboard() {
  showPage('dashboard-page');
  updateDashboardStats();
}

// Authentication Functions
function showSignupForm() {
  document.getElementById('signup-form').classList.remove('hidden');
  document.getElementById('login-form').classList.add('hidden');
}

function showLoginForm() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('signup-form').classList.add('hidden');
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  appState.user = { name, email, password };
  appState.isAuthenticated = true;
  
  showToast('Account created successfully! Welcome to Mind Vedha 🎉', 'success');
  setTimeout(() => {
    showDashboard();
  }, 1000);
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (appState.user.email === email && appState.user.password === password) {
    appState.isAuthenticated = true;
    showToast('Login successful! Welcome back 👋', 'success');
    setTimeout(() => {
      showDashboard();
    }, 1000);
  } else {
    showToast('Invalid credentials. Please try again.', 'error');
  }
}

function loginWithGoogle() {
  appState.user = { name: 'Google User', email: 'user@gmail.com', password: '' };
  appState.isAuthenticated = true;
  showToast('Signed in with Google successfully! 🎉', 'success');
  setTimeout(() => {
    showDashboard();
  }, 1000);
}

function loginWithApple() {
  appState.user = { name: 'Apple User', email: 'user@icloud.com', password: '' };
  appState.isAuthenticated = true;
  showToast('Signed in with Apple successfully! 🎉', 'success');
  setTimeout(() => {
    showDashboard();
  }, 1000);
}

function logout() {
  if (appState.moodStream) {
    appState.moodStream.getTracks().forEach(track => track.stop());
  }
  if (screenTimeInterval) {
    clearInterval(screenTimeInterval);
  }
  appState.isAuthenticated = false;
  appState.isDemoMode = false;
  showToast('Logged out successfully. See you soon! 👋', 'success');
  showLanding();
}

// Demo Mode
function startDemo() {
  if (appState.demoUsesRemaining <= 0) {
    showToast('Demo uses expired. Please sign up for full access!', 'error');
    return;
  }
  
  appState.demoUsesRemaining--;
  appState.isDemoMode = true;
  appState.user = { name: 'Demo User', email: 'demo@mindvedha.com', password: '' };
  
  updateTrialCounter();
  showToast('✨ Welcome to Mind Vedha! You have ' + appState.demoUsesRemaining + ' free sessions remaining.', 'success');
  
  setTimeout(() => {
    showDashboard();
  }, 1000);
}

function updateTrialCounter() {
  document.getElementById('trial-count').textContent = '✨ ' + appState.demoUsesRemaining + ' Free Sessions Remaining';
}

// Dashboard Navigation
function showSection(sectionName) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionName + '-section').classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`.nav-item[data-section="${sectionName}"]`).classList.add('active');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function updateDashboardStats() {
  document.getElementById('user-name-display').textContent = appState.user.name || 'User';
  document.getElementById('yoga-count').textContent = appState.activities.filter(a => a.type === 'yoga').length;
  document.getElementById('activity-count').textContent = appState.activities.length;
  document.getElementById('mood-count').textContent = appState.moodEntries.length;
  
  const screenTimeMinutes = Math.floor(appState.screenTimeData.todayTotal / 60);
  document.getElementById('screen-time-display').textContent = screenTimeMinutes + 'm';
  
  // Update settings
  document.getElementById('settings-name').value = appState.user.name || '';
  document.getElementById('settings-email').value = appState.user.email || '';
  
  // Update activity list
  updateActivityList();
  updateMoodHistory();
}

// Surya Namaskar Functions - AUTOMATED
function startSuryaNamaskar() {
  appState.suryaNamaskarState.currentStep = 0;
  appState.suryaNamaskarState.isRunning = false;
  appState.suryaNamaskarState.isPaused = false;
  appState.suryaNamaskarState.totalSessionTime = 0;
  
  document.getElementById('surya-modal').classList.add('active');
  
  // Show start button, hide others
  document.getElementById('start-btn').style.display = 'inline-flex';
  document.getElementById('pause-btn').style.display = 'none';
  document.getElementById('resume-btn').style.display = 'none';
  document.getElementById('stop-btn').style.display = 'none';
  
  // Reset timer display
  document.getElementById('timer-text').textContent = appState.suryaNamaskarState.poseDuration;
  resetTimerCircle();
  
  updateSuryaPose();
}

function closeSuryaNamaskar() {
  // Stop any running timers
  if (appState.suryaNamaskarState.currentTimer) {
    clearInterval(appState.suryaNamaskarState.currentTimer);
    appState.suryaNamaskarState.currentTimer = null;
  }
  appState.suryaNamaskarState.isRunning = false;
  appState.suryaNamaskarState.isPaused = false;
  
  document.getElementById('surya-modal').classList.remove('active');
}

function startAutomatedSession() {
  appState.suryaNamaskarState.isRunning = true;
  appState.suryaNamaskarState.poseStartTime = Date.now();
  
  // Hide start button, show pause and stop
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('pause-btn').style.display = 'inline-flex';
  document.getElementById('stop-btn').style.display = 'inline-flex';
  
  showToast('Automated session started! Follow the timer 🧘', 'success');
  runPoseTimer();
}

function runPoseTimer() {
  let timeRemaining = appState.suryaNamaskarState.poseDuration;
  const totalTime = appState.suryaNamaskarState.poseDuration;
  
  document.getElementById('timer-text').textContent = timeRemaining;
  updateBreathingAnimation();
  
  appState.suryaNamaskarState.currentTimer = setInterval(() => {
    if (!appState.suryaNamaskarState.isRunning || appState.suryaNamaskarState.isPaused) {
      return;
    }
    
    timeRemaining--;
    appState.suryaNamaskarState.totalSessionTime++;
    
    document.getElementById('timer-text').textContent = timeRemaining;
    
    // Update circular progress
    const progress = (timeRemaining / totalTime);
    const circumference = 2 * Math.PI * 90;
    const offset = circumference * (1 - progress);
    document.getElementById('timer-progress').style.strokeDashoffset = offset;
    
    if (timeRemaining <= 0) {
      clearInterval(appState.suryaNamaskarState.currentTimer);
      appState.suryaNamaskarState.currentTimer = null;
      
      // Move to next pose
      if (appState.suryaNamaskarState.currentStep < 11) {
        appState.suryaNamaskarState.currentStep++;
        updateSuryaPose();
        setTimeout(() => {
          if (appState.suryaNamaskarState.isRunning) {
            runPoseTimer();
          }
        }, 500);
      } else {
        // Session complete
        completeAutomatedSession();
      }
    }
  }, 1000);
}

function updateSuryaPose() {
  const step = appState.suryaNamaskarState.currentStep;
  const pose = appState.suryaNamaskarState.poses[step];
  
  document.getElementById('current-step').textContent = step + 1;
  document.getElementById('pose-emoji').textContent = pose.emoji;
  document.getElementById('pose-name').textContent = pose.name;
  document.getElementById('pose-description').textContent = pose.description;
  document.getElementById('breathing-text').textContent = pose.breathing;
  
  const progress = ((step + 1) / 12) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
  
  // Reset timer circle
  resetTimerCircle();
  document.getElementById('timer-text').textContent = appState.suryaNamaskarState.poseDuration;
  
  // Update breathing animation
  updateBreathingAnimation();
}

function resetTimerCircle() {
  const circumference = 2 * Math.PI * 90;
  document.getElementById('timer-progress').style.strokeDasharray = circumference;
  document.getElementById('timer-progress').style.strokeDashoffset = 0;
}

function updateBreathingAnimation() {
  const step = appState.suryaNamaskarState.currentStep;
  const pose = appState.suryaNamaskarState.poses[step];
  const breathingCircle = document.getElementById('breathing-animation');
  
  breathingCircle.classList.remove('inhale', 'exhale');
  
  if (pose.breathing.toLowerCase().includes('inhale')) {
    breathingCircle.classList.add('inhale');
  } else if (pose.breathing.toLowerCase().includes('exhale')) {
    breathingCircle.classList.add('exhale');
  }
}

function pauseSession() {
  appState.suryaNamaskarState.isPaused = true;
  
  if (appState.suryaNamaskarState.currentTimer) {
    clearInterval(appState.suryaNamaskarState.currentTimer);
    appState.suryaNamaskarState.currentTimer = null;
  }
  
  document.getElementById('pause-btn').style.display = 'none';
  document.getElementById('resume-btn').style.display = 'inline-flex';
  
  showToast('Session paused ⏸', 'success');
}

function resumeSession() {
  appState.suryaNamaskarState.isPaused = false;
  
  document.getElementById('resume-btn').style.display = 'none';
  document.getElementById('pause-btn').style.display = 'inline-flex';
  
  showToast('Session resumed ▶️', 'success');
  runPoseTimer();
}

function stopSession() {
  if (confirm('Are you sure you want to stop? Progress will not be saved.')) {
    if (appState.suryaNamaskarState.currentTimer) {
      clearInterval(appState.suryaNamaskarState.currentTimer);
      appState.suryaNamaskarState.currentTimer = null;
    }
    
    appState.suryaNamaskarState.isRunning = false;
    appState.suryaNamaskarState.isPaused = false;
    
    closeSuryaNamaskar();
    showToast('Session stopped', 'success');
  }
}

function completeAutomatedSession() {
  appState.suryaNamaskarState.isRunning = false;
  
  if (appState.suryaNamaskarState.currentTimer) {
    clearInterval(appState.suryaNamaskarState.currentTimer);
    appState.suryaNamaskarState.currentTimer = null;
  }
  
  // Calculate session duration
  const totalSeconds = appState.suryaNamaskarState.totalSessionTime;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const durationText = minutes + ':' + String(seconds).padStart(2, '0');
  
  // Save activity
  const activity = {
    type: 'yoga',
    name: 'Surya Namaskar (Automated)',
    duration: durationText,
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  appState.activities.push(activity);
  
  // Close yoga modal
  document.getElementById('surya-modal').classList.remove('active');
  
  // Show completion modal
  document.getElementById('session-duration').textContent = durationText;
  document.getElementById('completion-modal').classList.add('active');
  
  updateDashboardStats();
}

function closeCompletion() {
  document.getElementById('completion-modal').classList.remove('active');
}

function restartSession() {
  closeCompletion();
  startSuryaNamaskar();
  setTimeout(() => {
    startAutomatedSession();
  }, 500);
}

// Breathing Exercise Functions
let currentBreathingExercise = null;

function startBreathing(exerciseName) {
  currentBreathingExercise = exerciseName;
  const exercise = appState.breathingExercises[exerciseName];
  
  document.getElementById('breathing-modal').classList.add('active');
  document.getElementById('breathing-title').textContent = '🌬️ ' + exerciseName;
  document.getElementById('breathing-description').textContent = exercise.description;
  document.getElementById('breathing-technique').textContent = 'Technique: ' + exercise.technique;
  document.getElementById('breathing-timer').textContent = '00:00';
  breathingTimeElapsed = 0;
  
  document.getElementById('breathing-start-btn').style.display = 'inline-flex';
  document.getElementById('breathing-stop-btn').style.display = 'none';
  document.getElementById('breathing-complete-btn').style.display = 'none';
}

function closeBreathing() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
  }
  document.getElementById('breathing-modal').classList.remove('active');
}

function startBreathingTimer() {
  const circle = document.getElementById('breathing-circle');
  const phaseText = document.getElementById('breathing-phase');
  
  document.getElementById('breathing-start-btn').style.display = 'none';
  document.getElementById('breathing-stop-btn').style.display = 'inline-flex';
  
  breathingInterval = setInterval(() => {
    breathingTimeElapsed++;
    const minutes = Math.floor(breathingTimeElapsed / 60);
    const seconds = breathingTimeElapsed % 60;
    document.getElementById('breathing-timer').textContent = 
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    
    // Breathing animation
    const phase = Math.floor(breathingTimeElapsed % 8);
    if (phase < 4) {
      circle.classList.add('inhale');
      circle.classList.remove('exhale');
      phaseText.textContent = 'Inhale';
    } else {
      circle.classList.add('exhale');
      circle.classList.remove('inhale');
      phaseText.textContent = 'Exhale';
    }
    
    const exercise = appState.breathingExercises[currentBreathingExercise];
    if (exercise.duration > 0 && breathingTimeElapsed >= exercise.duration) {
      stopBreathingTimer();
      document.getElementById('breathing-complete-btn').style.display = 'inline-flex';
      showToast('Breathing exercise completed!', 'success');
    }
  }, 1000);
}

function stopBreathingTimer() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
  document.getElementById('breathing-stop-btn').style.display = 'none';
  document.getElementById('breathing-complete-btn').style.display = 'inline-flex';
}

function completeBreathing() {
  const activity = {
    type: 'breathing',
    name: currentBreathingExercise,
    duration: Math.floor(breathingTimeElapsed / 60) + ' minutes',
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  appState.activities.push(activity);
  
  closeBreathing();
  showToast('Breathing exercise completed! 🌬️', 'success');
  updateDashboardStats();
}

// Activity List
function updateActivityList() {
  const listContainer = document.getElementById('activity-list');
  
  if (appState.activities.length === 0) {
    listContainer.innerHTML = '<p class="empty-state">No activities yet. Start a yoga session or breathing exercise!</p>';
    document.getElementById('total-activities').textContent = '0';
    return;
  }
  
  document.getElementById('total-activities').textContent = appState.activities.length;
  
  const sortedActivities = [...appState.activities].sort((a, b) => b.timestamp - a.timestamp);
  
  listContainer.innerHTML = sortedActivities.map(activity => `
    <div class="activity-item">
      <div class="activity-info">
        <h4>${activity.name}</h4>
        <p>${activity.date} • ${activity.duration}</p>
      </div>
      <span class="activity-badge">✓ Completed</span>
    </div>
  `).join('');
}

// Screen Time Tracker
function toggleScreenTime() {
  if (appState.screenTimeData.isTracking) {
    stopScreenTime();
  } else {
    startScreenTime();
  }
}

function startScreenTime() {
  appState.screenTimeData.isTracking = true;
  appState.screenTimeData.currentSessionStart = Date.now();
  appState.screenTimeData.currentSessionElapsed = 0;
  
  document.getElementById('screentime-btn').textContent = 'Stop Tracking';
  
  screenTimeInterval = setInterval(() => {
    appState.screenTimeData.currentSessionElapsed++;
    appState.screenTimeData.todayTotal++;
    
    const hours = Math.floor(appState.screenTimeData.currentSessionElapsed / 3600);
    const minutes = Math.floor((appState.screenTimeData.currentSessionElapsed % 3600) / 60);
    const seconds = appState.screenTimeData.currentSessionElapsed % 60;
    
    document.getElementById('current-session-time').textContent = 
      String(hours).padStart(2, '0') + ':' + 
      String(minutes).padStart(2, '0') + ':' + 
      String(seconds).padStart(2, '0');
    
    const totalMinutes = Math.floor(appState.screenTimeData.todayTotal / 60);
    document.getElementById('today-total-time').textContent = totalMinutes + ' minutes';
    document.getElementById('screen-time-display').textContent = totalMinutes + 'm';
    
    updateScreenTimeRecommendation();
  }, 1000);
}

function stopScreenTime() {
  appState.screenTimeData.isTracking = false;
  
  if (screenTimeInterval) {
    clearInterval(screenTimeInterval);
    screenTimeInterval = null;
  }
  
  document.getElementById('screentime-btn').textContent = 'Start Tracking';
  showToast('Screen time tracking stopped', 'success');
}

function updateScreenTimeRecommendation() {
  const minutes = Math.floor(appState.screenTimeData.currentSessionElapsed / 60);
  let recommendation = 'Take a break every 30 minutes for eye health';
  
  if (minutes >= 120) {
    recommendation = '⚠️ You\'ve been using the app for over 2 hours. Time for a long break!';
  } else if (minutes >= 60) {
    recommendation = '💡 Consider taking a 10-minute break and doing some yoga poses';
  } else if (minutes >= 30) {
    recommendation = '⏰ Great session! Take a 5-minute break to rest your eyes';
  }
  
  document.getElementById('screentime-recommendation').textContent = recommendation;
}

// Mood Tracker with Facial Recognition
let faceLandmarksModel = null;

async function startMoodDetection() {
  try {
    const video = document.getElementById('mood-video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    video.srcObject = stream;
    appState.moodStream = stream;
    appState.moodDetectionActive = true;
    
    document.getElementById('camera-instructions').style.display = 'none';
    document.getElementById('mood-detect-btn').style.display = 'none';
    document.getElementById('mood-stop-btn').style.display = 'inline-flex';
    document.getElementById('mood-save-btn').disabled = false;
    
    // Simulate mood detection (simplified version)
    simulateMoodDetection();
    
    showToast('Camera started. Analyzing your mood...', 'success');
  } catch (error) {
    showToast('Camera access denied. Please allow camera permissions.', 'error');
  }
}

function simulateMoodDetection() {
  const emotions = [
    { emoji: '😊', label: 'Happy', color: '#FFD700' },
    { emoji: '😢', label: 'Sad', color: '#4A90E2' },
    { emoji: '😐', label: 'Neutral', color: '#95A5A6' },
    { emoji: '😲', label: 'Surprised', color: '#F39C12' }
  ];
  
  // Randomly select emotion for demo
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
  
  appState.currentMood = {
    emoji: randomEmotion.emoji,
    label: randomEmotion.label,
    confidence: confidence,
    timestamp: Date.now()
  };
  
  document.getElementById('detected-emoji').textContent = randomEmotion.emoji;
  document.getElementById('detected-label').textContent = randomEmotion.label;
  document.getElementById('detected-confidence').textContent = confidence + '%';
  document.getElementById('mood-result').classList.add('active');
}

function stopMoodDetection() {
  if (appState.moodStream) {
    appState.moodStream.getTracks().forEach(track => track.stop());
    appState.moodStream = null;
  }
  
  appState.moodDetectionActive = false;
  
  document.getElementById('camera-instructions').style.display = 'flex';
  document.getElementById('mood-detect-btn').style.display = 'inline-flex';
  document.getElementById('mood-stop-btn').style.display = 'none';
  document.getElementById('mood-result').classList.remove('active');
  
  const video = document.getElementById('mood-video');
  video.srcObject = null;
}

function saveMood() {
  if (!appState.currentMood) {
    showToast('Please start mood detection first', 'error');
    return;
  }
  
  const moodEntry = {
    emoji: appState.currentMood.emoji,
    label: appState.currentMood.label,
    confidence: appState.currentMood.confidence,
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  
  appState.moodEntries.push(moodEntry);
  updateMoodHistory();
  updateDashboardStats();
  
  showToast('Mood saved successfully! 😊', 'success');
}

function updateMoodHistory() {
  const timeline = document.getElementById('mood-timeline');
  
  if (appState.moodEntries.length === 0) {
    timeline.innerHTML = '<p class="empty-state">No mood entries yet. Start by detecting your mood!</p>';
    return;
  }
  
  const sortedMoods = [...appState.moodEntries].sort((a, b) => b.timestamp - a.timestamp);
  
  timeline.innerHTML = sortedMoods.map(mood => `
    <div class="mood-entry">
      <div class="mood-entry-emoji">${mood.emoji}</div>
      <div class="mood-entry-info">
        <h4>${mood.label}</h4>
        <p>${mood.date} • Confidence: ${mood.confidence}%</p>
      </div>
    </div>
  `).join('');
}

// Settings Functions
function updateProfile() {
  const name = document.getElementById('settings-name').value;
  appState.user.name = name;
  document.getElementById('user-name-display').textContent = name;
  showToast('Profile updated successfully!', 'success');
}

function changePassword(event) {
  event.preventDefault();
  
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (appState.user.password && currentPassword !== appState.user.password) {
    showToast('Current password is incorrect', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showToast('New passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }
  
  appState.user.password = newPassword;
  showToast('Password changed successfully!', 'success');
  
  event.target.reset();
}

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// BHISHMA AI Functions
function askQuickQuestion(question) {
  const input = document.getElementById('ai-chat-input');
  input.value = question;
  sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const message = input.value.trim();
  
  if (!message) {
    showToast('Please enter a message', 'error');
    return;
  }
  
  // Add user message to chat
  addAIMessage(message, 'user');
  input.value = '';
  
  // Show typing indicator
  showAITyping();
  
  // Simulate AI response (in real implementation, this would call Perplexity API)
  setTimeout(() => {
    hideAITyping();
    const response = generateAIResponse(message);
    addAIMessage(response, 'ai');
  }, 2000);
}

function handleAIChatKeypress(event) {
  if (event.key === 'Enter') {
    sendAIMessage();
  }
}

function addAIMessage(message, sender) {
  const messagesContainer = document.getElementById('ai-chat-messages');
  const messageDiv = document.createElement('div');
  
  if (sender === 'user') {
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
      <div class="user-message-bubble">
        ${message}
      </div>
    `;
  } else {
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `
      <div class="ai-avatar">🤖</div>
      <div class="ai-message-bubble">
        ${message}
      </div>
    `;
  }
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Save to history
  appState.aiChatHistory.push({ message, sender, timestamp: Date.now() });
}

function showAITyping() {
  const messagesContainer = document.getElementById('ai-chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ai-message';
  typingDiv.id = 'ai-typing-indicator';
  typingDiv.innerHTML = `
    <div class="ai-avatar">🤖</div>
    <div class="ai-typing-indicator">
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    </div>
  `;
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideAITyping() {
  const typingIndicator = document.getElementById('ai-typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function generateAIResponse(question) {
  // Simulated AI responses based on common wellness questions
  const responses = {
    'anxiety': `Great question about anxiety! Here are some effective yoga poses:
    
    <strong>1. Child's Pose (Balasana)</strong> - Calms the nervous system
    <strong>2. Legs-Up-The-Wall (Viparita Karani)</strong> - Reduces stress
    <strong>3. Corpse Pose (Savasana)</strong> - Deep relaxation
    <strong>4. Cat-Cow Pose</strong> - Releases tension
    
    Combine these with deep breathing for best results. Would you like more specific guidance?`,
    
    'stress': `Managing stress naturally is important! Here are evidence-based techniques:
    
    <strong>• Deep Breathing:</strong> Practice 4-7-8 breathing technique
    <strong>• Regular Exercise:</strong> 30 minutes daily reduces cortisol
    <strong>• Meditation:</strong> Even 10 minutes helps significantly
    <strong>• Nature Time:</strong> Forest bathing lowers stress hormones
    <strong>• Healthy Sleep:</strong> 7-9 hours is essential
    
    Try incorporating one technique at a time for sustainable change.`,
    
    'sleep': `Better sleep quality is achievable! Here are proven tips:
    
    <strong>1. Sleep Schedule:</strong> Same bedtime/wake time daily
    <strong>2. Cool Environment:</strong> 60-67°F (15-19°C) is ideal
    <strong>3. No Screens:</strong> Stop 1 hour before bed
    <strong>4. Relaxation Routine:</strong> Try gentle yoga or reading
    <strong>5. Limit Caffeine:</strong> None after 2 PM
    
    Consistency is key. Most people see improvement within 2 weeks.`,
    
    'breathing': `Breathing techniques for panic attacks are highly effective:
    
    <strong>Box Breathing (4-4-4-4):</strong>
    1. Inhale for 4 counts
    2. Hold for 4 counts
    3. Exhale for 4 counts
    4. Hold for 4 counts
    
    <strong>5-2-5 Technique:</strong>
    - Breathe in for 5 seconds
    - Hold for 2 seconds
    - Breathe out for 5 seconds
    
    Practice daily so it becomes automatic during panic moments.`,
    
    'clarity': `Improving mental clarity involves several approaches:
    
    <strong>• Morning Meditation:</strong> 15 minutes sets focused intention
    <strong>• Hydration:</strong> Drink 8 glasses water daily
    <strong>• Brain Foods:</strong> Omega-3s, blueberries, nuts
    <strong>• Regular Breaks:</strong> Pomodoro technique (25min work/5min break)
    <strong>• Quality Sleep:</strong> Brain detoxifies during deep sleep
    <strong>• Limit Multitasking:</strong> Focus on one task at a time
    
    Mental clarity improves with consistent practice!`,
    
    'meditation': `Meditation for beginners - start simple:
    
    <strong>Week 1-2:</strong> 5 minutes daily, focus on breath
    <strong>Week 3-4:</strong> 10 minutes, add body scan
    <strong>Month 2+:</strong> 15-20 minutes, explore different styles
    
    <strong>Best practices:</strong>
    • Same time daily (morning is ideal)
    • Quiet, comfortable space
    • Don't judge your thoughts
    • Use guided apps initially
    
    Remember: There's no "bad" meditation. Consistency matters more than perfection!`,
    
    'time': `Best time to meditate depends on your goals:
    
    <strong>Morning (5-7 AM):</strong> 
    • Mind is fresh and quiet
    • Sets positive tone for day
    • Fewer distractions
    
    <strong>Evening (6-8 PM):</strong>
    • Releases day's stress
    • Improves sleep quality
    
    <strong>Midday:</strong>
    • Resets focus and energy
    
    Choose when you can be consistent. That's more important than the "perfect" time!`,
    
    'depression': `Natural approaches for depression (consult a doctor too):
    
    <strong>• Regular Exercise:</strong> 30 min daily boosts serotonin
    <strong>• Sunlight Exposure:</strong> 15-20 min morning sun
    <strong>• Social Connection:</strong> Even brief interactions help
    <strong>• Omega-3 Foods:</strong> Fish, walnuts, flaxseeds
    <strong>• Therapy/Counseling:</strong> CBT is evidence-based
    <strong>• Mindfulness Practice:</strong> Reduces negative thought patterns
    
    <strong>Important:</strong> If symptoms persist, please seek professional help. Depression is treatable!`
  };
  
  // Find matching response
  const lowerQuestion = question.toLowerCase();
  
  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuestion.includes(key)) {
      return response;
    }
  }
  
  // Default response
  return `Thank you for your question! For the most accurate and personalized wellness advice, please use the Perplexity AI interface below. You can also try our other features:
  
  <strong>• Yoga Section:</strong> Guided Surya Namaskar
  <strong>• Mood Tracker:</strong> AI-powered emotion detection
  <strong>• Counselling:</strong> Connect with licensed professionals
  <strong>• Screen Time:</strong> Monitor your digital wellness
  
  For immediate help with mental health concerns, please reach out to our counselors in the Counselling section or contact a healthcare professional.`;
}

function clearAIChat() {
  const messagesContainer = document.getElementById('ai-chat-messages');
  messagesContainer.innerHTML = `
    <div class="ai-welcome-message">
      <div class="ai-avatar">🤖</div>
      <div class="ai-message-content">
        <h3>Welcome to AI Assistant!</h3>
        <p>I'm your mental wellness assistant powered by Perplexity AI. I can help you with:</p>
        <ul>
          <li>Yoga and meditation guidance</li>
          <li>Stress management techniques</li>
          <li>Sleep improvement tips</li>
          <li>Mental health advice</li>
          <li>Wellness best practices</li>
        </ul>
        <p><strong>Ask me anything about mental wellness!</strong></p>
      </div>
    </div>
  `;
  appState.aiChatHistory = [];
  showToast('Chat cleared successfully', 'success');
}

// Initialize
window.addEventListener('load', () => {
  updateTrialCounter();
});