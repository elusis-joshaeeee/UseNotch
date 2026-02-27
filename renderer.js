const { ipcRenderer } = require('electron');

// Credit tracking state
let credits = {
  claude: {
    used: 0,
    total: 100, // Claude Pro typically has daily limits
    period: 'daily',
    tier: 'Pro',
    lastUpdated: null
  },
  codec: {
    used: 0,
    total: 50, // Codec free tier daily limit
    period: 'daily',
    tier: 'Free',
    lastUpdated: null
  }
};

// Simulated credit fetch (in production, these would be real API calls)
async function fetchClaudeCredits() {
  // In production, this would call Anthropic's API or parse local usage files
  // For now, we'll simulate with localStorage tracking
  const today = new Date().toDateString();
  const stored = localStorage.getItem('claudeCredits_' + today);
  
  if (stored) {
    const data = JSON.parse(stored);
    credits.claude.used = data.used || Math.floor(Math.random() * 40) + 10;
  } else {
    // Simulate some usage
    credits.claude.used = Math.floor(Math.random() * 40) + 10;
    localStorage.setItem('claudeCredits_' + today, JSON.stringify({
      used: credits.claude.used,
      date: today
    }));
  }
  
  credits.claude.lastUpdated = new Date();
  return credits.claude;
}

async function fetchCodecCredits() {
  // In production, this would call Codec's API
  const today = new Date().toDateString();
  const stored = localStorage.getItem('codecCredits_' + today);
  
  if (stored) {
    const data = JSON.parse(stored);
    credits.codec.used = data.used || Math.floor(Math.random() * 30) + 5;
  } else {
    credits.codec.used = Math.floor(Math.random() * 30) + 5;
    localStorage.setItem('codecCredits_' + today, JSON.stringify({
      used: credits.codec.used,
      date: today
    }));
  }
  
  credits.codec.lastUpdated = new Date();
  return credits.codec;
}

// Update UI
function updateUI() {
  // Claude
  const claudePercent = (credits.claude.used / credits.claude.total) * 100;
  document.getElementById('claude-fill').style.width = claudePercent + '%';
  document.getElementById('claude-glow').style.left = claudePercent + '%';
  document.getElementById('claude-used').textContent = credits.claude.used;
  document.getElementById('claude-total').textContent = credits.claude.total;
  document.getElementById('claude-period').textContent = credits.claude.period;
  document.getElementById('claude-tier').textContent = credits.claude.tier;
  document.getElementById('claude-updated').textContent = credits.claude.lastUpdated 
    ? 'Updated ' + formatTime(credits.claude.lastUpdated)
    : 'Checking...';
  
  // Codec
  const codecPercent = (credits.codec.used / credits.codec.total) * 100;
  document.getElementById('codec-fill').style.width = codecPercent + '%';
  document.getElementById('codec-glow').style.left = codecPercent + '%';
  document.getElementById('codec-used').textContent = credits.codec.used;
  document.getElementById('codec-total').textContent = credits.codec.total;
  document.getElementById('codec-period').textContent = credits.codec.period;
  document.getElementById('codec-tier').textContent = credits.codec.tier;
  document.getElementById('codec-updated').textContent = credits.codec.lastUpdated 
    ? 'Updated ' + formatTime(credits.codec.lastUpdated)
    : 'Checking...';
  
  // Add warning classes
  updateWarningState('claude', claudePercent);
  updateWarningState('codec', codecPercent);
}

function updateWarningState(service, percent) {
  const card = document.querySelector(`.credit-card:nth-child(${service === 'claude' ? 2 : 3})`);
  card.classList.remove('low-credit', 'critical-credit');
  
  if (percent >= 90) {
    card.classList.add('critical-credit');
  } else if (percent >= 70) {
    card.classList.add('low-credit');
  }
}

function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// Fetch all credits
async function refreshCredits() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  
  try {
    await Promise.all([
      fetchClaudeCredits(),
      fetchCodecCredits()
    ]);
    updateUI();
  } catch (error) {
    console.error('Failed to fetch credits:', error);
  } finally {
    btn.classList.remove('spinning');
  }
}

// Event listeners
document.getElementById('refresh-btn').addEventListener('click', refreshCredits);

ipcRenderer.on('refresh-credits', refreshCredits);
ipcRenderer.on('focus-app', () => {
  refreshCredits();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  refreshCredits();
});

// Auto-refresh every 5 minutes while app is open
setInterval(() => {
  if (!document.hidden) {
    refreshCredits();
  }
}, 300000);

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    refreshCredits();
  }
});
