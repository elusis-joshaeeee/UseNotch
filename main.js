const { app, BrowserWindow, ipcMain, nativeImage, Tray } = require('electron');
const { menubar } = require('menubar');
const path = require('path');

// Create tray icon
const createTrayIcon = () => {
  // Create a simple icon - black circle with CN
  const size = 22;
  const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="4" fill="#1a1a1a"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="#fff" font-size="10" font-family="-apple-system, sans-serif" font-weight="600">CN</text>
    </svg>
  `;
  const buffer = Buffer.from(canvas);
  return nativeImage.createFromBuffer(buffer);
};

const mb = menubar({
  index: path.join(__dirname, 'index.html'),
  browserWindow: {
    width: 320,
    height: 400,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    transparent: true,
    frame: false,
    vibrancy: 'popover',
    visualEffectState: 'active'
  },
  icon: createTrayIcon(),
  tooltip: 'CreditNotch - AI Credits Tracker',
  preloadWindow: true,
  showOnAllWorkspaces: false,
  windowPosition: 'trayCenter'
});

mb.on('ready', () => {
  console.log('CreditNotch is ready');
  
  // Refresh credits every 60 seconds
  setInterval(() => {
    if (mb.window && !mb.window.isDestroyed()) {
      mb.window.webContents.send('refresh-credits');
    }
  }, 60000);
});

mb.on('show', () => {
  if (mb.window) {
    mb.window.webContents.send('focus-app');
  }
});

// Handle app activation
app.on('activate', () => {
  if (mb.window) {
    mb.showWindow();
  }
});

app.on('window-all-closed', () => {
  // Keep app running in menu bar
});
