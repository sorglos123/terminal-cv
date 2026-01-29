# Terminal CV

An interactive terminal-based CV application built with **xterm.js**, featuring a professional terminal emulator interface with system information display, process monitoring, and file navigation.

## Features

### Terminal Emulation
- **Native Terminal Feel**: Built on xterm.js 5.3.0 with FitAddon for dynamic column/row sizing
- **Professional Color Scheme**: Dark theme (#0B0F14 background) with high-contrast text (#E6EEF3)
- **Full Keyboard Support**: Arrow keys, Tab autocomplete, command history, Backspace, and escape sequences
- **WCAG AA Compliant Colors**: Accessible color palette with orange (#E95420) and teal (#17B890) accents

### Available Commands (19 Total)

**File Operations**: `ls`, `cd`, `pwd`, `cat`, `less`, `tree`, `grep`

**System Info**: `whoami`, `hostnamectl`, `uname`, `neofetch`, `htop`, `btop`

**Utilities**: `help`, `history`, `open`, `xdg-open`, `clear`, `exit`

### System Monitoring
- **Neofetch**: Real-time system information with ASCII art
- **HTTop/BTTop**: Live process monitoring with color-coded CPU/memory, real-time updates (500ms), press 'q' to exit

### User Experience
- **Command History**: Navigate with arrow keys (↑/↓)
- **Tab Autocomplete**: Auto-complete commands and file paths
- **Colored Prompt**: Shows username, hostname, and current path
- **Responsive Design**: Terminal adapts to container size

## Project Structure

```
cv-site/
├── src/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── terminal.css
│   ├── js/
│   │   ├── data.js
│   │   ├── utils.js
│   │   ├── system.js
│   │   ├── commands.js
│   │   └── xterm-terminal.js
│   └── assets/
│       └── neofetch.txt
├── README.md
└── package.json
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server

### Installation

```bash
cd cv-site

# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

## Usage Examples

```bash
$ pwd
/

$ ls
assets  about  cv  skills

$ cd about
$ cat bio.txt

$ neofetch
[Shows system info with colors]

$ htop
[Live process monitoring - press 'q' to exit]

$ history
[Show command history]

$ [Press Arrow Up]
[Navigate command history]

$ [Press Tab]
[Auto-complete commands and paths]
```

## Color Palette

| Element | Hex Code |
|---------|----------|
| Background | #0B0F14 |
| Text | #E6EEF3 |
| Accent 1 (Orange) | #E95420 |
| Accent 2 (Teal) | #17B890 |
| Error | #FF6B61 |

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Terminal**: xterm.js v5.3.0 + FitAddon
- **File System**: Virtual JavaScript-based
- **Process Simulator**: Dynamic CPU/Memory simulation

## Development

### Adding Commands
Edit `src/js/commands.js`:

```javascript
function handleMyCommand(args) {
    return 'Output here';
}

commandRegistry['mycommand'] = { desc: 'Description', handler: handleMyCommand };
```

### Customizing
- **Colors**: Edit `theme` object in `xterm-terminal.js`
- **Font**: Modify `.xterm` class in `terminal.css`
- **Container Size**: Adjust `.terminal-container` height in `terminal.css`

## Performance

- **Lightweight**: ~50KB JavaScript
- **Responsive**: Auto-adapts to container size
- **Efficient**: 500ms update interval for live monitoring

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge (v60+) | ✅ Full |
| Firefox (v55+) | ✅ Full |
| Safari (v11+) | ✅ Full |

## Testing

Comprehensive test suite with **59 passing tests** covering app responsiveness, cursor movement, autocompletion, and all commands.

### Quick Start
```bash
npm install           # Install test dependencies
npm run test:unit     # Run unit tests (39 tests)
npm run test:integration  # Run integration tests (20 tests)
npm run test:e2e      # Run E2E browser tests (22 tests)
```

### What's Tested
- ✅ **Responsiveness**: Terminal initialization and resizing
- ✅ **Cursor Movement**: Arrow keys, backspace, character insertion
- ✅ **Autocompletion**: Tab completion for commands and paths
- ✅ **Command Functionality**: All 19 commands with error handling
- ✅ **Command History**: Up/down arrow navigation
- ✅ **Special Modes**: htop, password prompts

See [TESTING_SUMMARY.md](TESTING_SUMMARY.md) and [tests/README.md](tests/README.md) for details.

## Troubleshooting

**Terminal not showing**: Verify xterm.js CDN scripts load and terminal div exists

**Commands not working**: Use `help` to see available commands, check spelling (case-sensitive)

**Misaligned columns in htop**: FitAddon should handle this, try clearing and re-running

---

**Version**: 1.0.0 | **Last Updated**: January 26, 2026
