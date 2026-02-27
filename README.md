# CreditNotch 🌫️

A beautiful macOS menu bar app that tracks your AI tool credits — sitting in your notch, always watching.

![Liquid Glass UI](screenshot.png)

## Features

- 🎨 **Liquid Glass Design** — Beautiful translucent UI with grey glass morphism
- 🔴🟢 **Red/Green Glow Lines** — Visual indicators showing credit usage
- 📊 **Claude Code** — Track your Anthropic API credits (Pro tier support)
- 🛠️ **Codec CLI** — Monitor your Codec AI assistant usage
- ⚡ **Always in Menu Bar** — Lives in your Mac's menu bar / notch
- 🔄 **Auto-refresh** — Updates every minute automatically
- 💾 **Smart Caching** — Remembers usage between sessions

## Installation

### Download Pre-built App

Grab the latest release from [Releases](../../releases) — `.dmg` for easy install or `.zip` for portable.

### Build from Source

```bash
# Clone the repo
git clone https://github.com/shivansh/creditnotch.git
cd creditnotch

# Install dependencies
npm install

# Run in development
npm start

# Build for distribution
npm run build-mac
```

## Usage

1. Click the **CN** icon in your menu bar (near the notch on modern Macs)
2. View real-time credit usage for Claude Code and Codec CLI
3. Click **Refresh** or press `Cmd+R` to manually update
4. Green = healthy usage, Yellow = getting low, Red = critical

## How It Works

### Claude Code Credits
- Tracks daily API usage limits
- Supports Pro tier limits (adjustable in settings)
- Reads from local Anthropic config when available

### Codec CLI Credits
- Monitors daily request quotas
- Tracks free tier limits by default
- Configurable for paid tiers

## Configuration

The app automatically detects your usage patterns. To customize limits, edit the config:

```bash
# Config location
~/Library/Application Support/CreditNotch/config.json
```

Example config:
```json
{
  "claude": {
    "tier": "pro",
    "dailyLimit": 100
  },
  "codec": {
    "tier": "free",
    "dailyLimit": 50
  }
}
```

## Development

```bash
# Install deps
npm install

# Start with hot reload
npm run dev

# Package for Mac
npm run build-mac

# Create distributables
npm run dist
```

## Tech Stack

- **Electron** — Cross-platform desktop framework
- **Menubar** — Menu bar app wrapper
- **SwiftUI-style CSS** — Liquid glass effects
- **Node.js** — Backend logic

## Design Philosophy

CreditNotch follows the "calm technology" principle — it stays out of your way until you need it. The liquid glass design fits macOS aesthetics perfectly, and the red/g glow lines give you status at a glance without cognitive load.

## Credits

Built by [Shivansh](https://github.com/shivansh) and [Elusis](https://github.com/elusis) 🌫️

## License

MIT — use it, fork it, make it yours.

---

*Made with ❤️ in SF for builders who track their AI spend.*

