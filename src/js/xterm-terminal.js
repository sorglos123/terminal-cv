// ============================================================================
// xterm.js Terminal Implementation
// ============================================================================

// Initialize xterm.js
const terminalContainer = document.getElementById('terminal');
const term = new Terminal({
    cols: 120,
    rows: 30,
    theme: {
        background: '#0B0F14',        // primary background - near-black
        foreground: '#E6EEF3',        // primary text - high contrast off-white
        cursor: '#E95420',            // accent 1 - Ubuntu orange for visibility
        cursorAccent: '#0B0F14',      // background behind cursor
        selection: 'rgba(31, 111, 235, 0.12)', // focus color - subtle blue
        // ANSI color palette
        black: '#2C3E50',             // dark gray
        red: '#FF6B61',               // error - accessible red
        green: '#17B890',             // success - teal accent
        yellow: '#D4B03A',            // warning - accessible yellow
        blue: '#1F6FEB',              // info - focus blue
        magenta: '#B88EDF',           // purple - complementary
        cyan: '#00D9FF',              // bright cyan
        white: '#E6EEF3',             // primary text
        brightBlack: '#546E7A',       // lighter dark gray
        brightRed: '#FF8076',         // lighter red
        brightGreen: '#26D07C',       // lighter green
        brightYellow: '#E5C158',      // lighter yellow
        brightBlue: '#3B82F6',        // lighter blue
        brightMagenta: '#D8B9F1',     // lighter purple
        brightCyan: '#1FFBF0',        // lighter cyan
        brightWhite: '#FFFFFF'        // pure white
    },
    scrollback: 1000,
    screenKeys: true,
    mouseWheelScroll: true,
    scrollOnUserInput: true,
    disableStdin: false
});

term.open(terminalContainer);

// ============================================================================
// Terminal State
// ============================================================================

let currentPath = '/';
let commandHistory = [];
let historyIndex = -1;
let inputBuffer = '';

// ============================================================================
// Utility Functions
// ============================================================================

function getPromptString() {
    const displayPath = currentPath === '/' ? '/' : currentPath;
    // Using accent colors: Orange for identity, Teal for path
    const ORANGE = '\x1b[38;2;233;84;32m';   // #E95420
    const TEAL = '\x1b[38;2;23;184;144m';    // #17B890
    const RESET = '\x1b[0m';
    return `${ORANGE}${systemInfo.username}${RESET}@${ORANGE}${systemInfo.hostname}${RESET}:${TEAL}~${displayPath}${RESET}$ `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function writePrompt() {
    term.write(getPromptString());
}

// Command Registry
const commandRegistry = {
    'help': { desc: 'Show available commands', handler: handleHelp },
    'ls': { desc: 'List directory contents', handler: handleLs },
    'cd': { desc: 'Change directory', handler: handleCd },
    'pwd': { desc: 'Print working directory', handler: handlePwd },
    'cat': { desc: 'Display file contents', handler: handleCat },
    'less': { desc: 'Display file contents (pageable)', handler: handleCat },
    'tree': { desc: 'Show file system tree', handler: handleTree },
    'grep': { desc: 'Search file contents', handler: handleGrep },
    'whoami': { desc: 'Display brief bio', handler: handleWhoami },
    'open': { desc: 'Open file (PDF, etc) in browser', handler: handleOpen },
    'xdg-open': { desc: 'Open file (alias to open)', handler: handleXdgOpen },
    'history': { desc: 'Show command history', handler: handleHistory },
    'hostnamectl': { desc: 'Show system hostname info', handler: handleHostnamectl },
    'uname': { desc: 'Show system information', handler: handleUname },
    'neofetch': { desc: 'Show system info with ASCII art', handler: handleNeofetch },
    'htop': { desc: 'Simulated process monitor', handler: handleHtop },
    'btop': { desc: 'Simulated process monitor (alias to htop)', handler: handleBtop },
    'clear': { desc: 'Clear terminal', handler: handleClear },
    'exit': { desc: 'Exit terminal', handler: handleExit }
};

// ============================================================================
// Event Handlers
// ============================================================================

term.onData((data) => {
    // Handle arrow keys and other special sequences
    if (data.startsWith('\x1b')) {
        // Handle arrow keys
        if (data === '\x1b[A') {
            // Arrow Up
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                const historyItem = commandHistory[commandHistory.length - 1 - historyIndex];
                
                // Clear current input
                for (let i = 0; i < inputBuffer.length; i++) {
                    term.write('\b \b');
                }
                
                inputBuffer = historyItem;
                term.write(inputBuffer);
            }
            return;
        } else if (data === '\x1b[B') {
            // Arrow Down
            if (historyIndex > 0) {
                historyIndex--;
                const historyItem = commandHistory[commandHistory.length - 1 - historyIndex];
                
                // Clear current input
                for (let i = 0; i < inputBuffer.length; i++) {
                    term.write('\b \b');
                }
                
                inputBuffer = historyItem;
                term.write(inputBuffer);
            } else if (historyIndex === 0) {
                historyIndex = -1;
                
                // Clear current input
                for (let i = 0; i < inputBuffer.length; i++) {
                    term.write('\b \b');
                }
                
                inputBuffer = '';
            }
            return;
        }
        // Ignore other escape sequences
        return;
    }
    
    if (data === '\r') {
        // Enter key
        term.write('\r\n');
        const input = inputBuffer.trim();
        inputBuffer = '';
        
        if (input.length > 0) {
            commandHistory.push(input);
        }
        historyIndex = -1;
        
        // Parse command
        const [cmd, ...args] = input.split(/\s+/);
        
        if (cmd) {
            const handler = commandRegistry[cmd.toLowerCase()]?.handler;
            const output = handler ? handler(args) : `${cmd}: command not found`;
            
            if (output) {
                // Convert newlines to \r\n for xterm
                const xtermOutput = output.split('\n').join('\r\n');
                term.write(xtermOutput + '\r\n');
            }
        }
        
        writePrompt();
    } else if (data === '\u007F') {
        // Backspace
        if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            term.write('\b \b');
        }
    } else if (data === '\u0009') {
        // Tab - autocomplete
        const parts = inputBuffer.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const currentPart = parts[parts.length - 1];
        
        let matches = [];
        
        // Autocomplete commands
        if (parts.length === 1) {
            matches = Object.keys(commandRegistry)
                .filter(c => c.startsWith(currentPart))
                .map(c => c);
        }
        // Autocomplete paths
        else if (['cat', 'less', 'cd', 'ls', 'grep', 'open', 'xdg-open'].includes(cmd)) {
            const lastArgIndex = parts.length - 1;
            const pathPart = parts[lastArgIndex];
            
            let dirPath = '/';
            let filePrefix = pathPart;
            
            if (pathPart.includes('/')) {
                const lastSlash = pathPart.lastIndexOf('/');
                dirPath = pathPart.substring(0, lastSlash + 1);
                filePrefix = pathPart.substring(lastSlash + 1);
                dirPath = resolvePath(dirPath);
            } else if (pathPart.startsWith('/')) {
                dirPath = '/';
                filePrefix = pathPart.substring(1);
            } else {
                dirPath = currentPath;
            }
            
            const dirEntry = fileSystem[dirPath];
            if (dirEntry && dirEntry.type === 'directory') {
                const entries = dirEntry.entries || [];
                matches = entries
                    .filter(e => e.startsWith(filePrefix))
                    .map(e => {
                        const fullPath = dirPath === '/' ? '/' + e : dirPath + '/' + e;
                        const entry = fileSystem[fullPath];
                        return entry && entry.type === 'directory' ? e + '/' : e;
                    });
            }
        }
        
        if (matches.length > 0) {
            const toAdd = matches[0].substring(currentPart.length);
            inputBuffer += toAdd;
            term.write(toAdd);
        }
    } else if (data.charCodeAt(0) >= 32) {
        // Printable characters
        inputBuffer += data;
        term.write(data);
    }
});

// ============================================================================
// Initialize Terminal
// ============================================================================

function initializeTerminal() {
    const TEAL = '\x1b[38;2;23;184;144m';    // #17B890
    const RESET = '\x1b[0m';
    term.write(`${TEAL}┌─────────────────────────────┐${RESET}\r\n`);
    term.write(`${TEAL}│${RESET}  Welcome to Terminal CV     ${TEAL}│${RESET}\r\n`);
    term.write(`${TEAL}│${RESET}  Type "help" for commands   ${TEAL}│${RESET}\r\n`);
    term.write(`${TEAL}└─────────────────────────────┘${RESET}\r\n`);
    term.write('\r\n');
    writePrompt();
}

// Wait for xterm to be fully ready, then initialize
setTimeout(initializeTerminal, 100);
