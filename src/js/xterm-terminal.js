// ============================================================================
// xterm.js Terminal Implementation with FitAddon
// ============================================================================

// Initialize xterm.js with optimized settings for monospace alignment
const terminalContainer = document.getElementById('terminal');
const term = new Terminal({
    cols: 120,                        // Initial cols, will be set by fitAddon
    rows: 30,                         // Initial rows, will be set by fitAddon
    allowProposedApi: true,
    convertEol: true,
    cursorBlink: true,
    cursorStyle: 'block',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 14,
    lineHeight: 1.0,                  // Critical: exact character cell height
    letterSpacing: 0,                 // Critical: no spacing for columns
    scrollback: 100,
    scrollOnInput: false,
    scrollOnUserInput: false,
    screenKeys: true,
    mouseWheelScroll: true,
    theme: {
        background: '#0B0F14',
        foreground: '#E6EEF3',
        cursor: '#E95420',
        cursorAccent: '#0B0F14',
        selection: 'rgba(31, 111, 235, 0.12)',
        black: '#2C3E50',
        red: '#FF6B61',
        green: '#17B890',
        yellow: '#D4B03A',
        blue: '#1F6FEB',
        magenta: '#B88EDF',
        cyan: '#00D9FF',
        white: '#E6EEF3',
        brightBlack: '#546E7A',
        brightRed: '#FF8076',
        brightGreen: '#26D07C',
        brightYellow: '#E5C158',
        brightBlue: '#3B82F6',
        brightMagenta: '#D8B9F1',
        brightCyan: '#1FFBF0',
        brightWhite: '#FFFFFF'
    }
});

term.open(terminalContainer);

// Load FitAddon when available - this fires AFTER both scripts load
function initializeFitAddon() {
    // Check if FitAddon is available globally
    if (typeof FitAddon === 'undefined') {
        console.warn('FitAddon not yet loaded, will retry...');
        setTimeout(initializeFitAddon, 100);
        return;
    }
    
    // Attach FitAddon
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    // Call fit() to calculate cols/rows based on container size
    fitAddon.fit();
    
    // Handle resize events
    window.addEventListener('resize', () => {
        try {
            fitAddon.fit();
        } catch (e) {
            console.warn('Fit failed on resize:', e);
        }
    });
    
    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
        try {
            fitAddon.fit();
        } catch (e) {
            console.warn('Fit failed on container resize:', e);
        }
    });
    resizeObserver.observe(terminalContainer);
}

// Start initialization after a brief delay to ensure scripts are loaded
setTimeout(initializeFitAddon, 200);

// ============================================================================
// Terminal state
let currentPath = '/';
let commandHistory = [];
let historyIndex = -1;
let inputBuffer = '';
let cursorPos = 0;  // Cursor position within inputBuffer
let htopMode = false;  // Track if we're in htop/btop mode
let passwordMode = false;  // Track if we're waiting for sudo password
let passwordBuffer = '';  // Store password input

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
    'sudo': { desc: 'Execute command as superuser (easter egg)', handler: handleSudo },
    'clear': { desc: 'Clear terminal', handler: handleClear },
    'exit': { desc: 'Exit terminal', handler: handleExit }
};

// ============================================================================
// Event Handlers
// ============================================================================

term.onData((data) => {
    // Handle q key to exit htop/btop mode
    if (htopMode && (data === 'q' || data === 'Q')) {
        htopMode = false;
        processSimulator.stop();
        term.write('\r\n');
        writePrompt();
        return;
    }
    
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
                cursorPos = inputBuffer.length;
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
                cursorPos = inputBuffer.length;
                term.write(inputBuffer);
            } else if (historyIndex === 0) {
                historyIndex = -1;
                
                // Clear current input
                for (let i = 0; i < inputBuffer.length; i++) {
                    term.write('\b \b');
                }
                
                inputBuffer = '';
                cursorPos = 0;
            }
            return;
        } else if (data === '\x1b[C') {
            // Arrow Right - move cursor right
            if (cursorPos < inputBuffer.length) {
                cursorPos++;
                term.write('\x1b[C');  // Send cursor right escape sequence
            }
            return;
        } else if (data === '\x1b[D') {
            // Arrow Left - move cursor left
            if (cursorPos > 0) {
                cursorPos--;
                term.write('\x1b[D');  // Send cursor left escape sequence
            }
            return;
        }
        // Ignore other escape sequences
        return;
    }
    
    if (data === '\r') {
        // Enter key
        term.write('\r\n');
        
        // Handle password mode
        if (passwordMode) {
            const password = passwordBuffer;
            passwordBuffer = '';
            passwordMode = false;
            
            // Always reject the password
            term.write('\x1b[1;31m');  // Bold red
            term.write('Sorry, try again.\r\n');
            term.write('\x1b[0m');  // Reset
            
            // Famous sudo Easter egg message
            term.write('\x1b[1;33m');  // Bold yellow
            term.write('[sudo] This incident will be reported.\r\n');
            term.write('\x1b[0m');  // Reset
            
            writePrompt();
            return;
        }
        
        const input = inputBuffer.trim();
        inputBuffer = '';
        cursorPos = 0;
        
        if (input.length > 0) {
            commandHistory.push(input);
        }
        historyIndex = -1;
        
        // Parse command
        const [cmd, ...args] = input.split(/\s+/);
        
        if (cmd) {
            const handler = commandRegistry[cmd.toLowerCase()]?.handler;
            
            // Special handling for sudo - password prompt
            if (cmd.toLowerCase() === 'sudo' && handler) {
                passwordMode = true;
                passwordBuffer = '';
                term.write('[sudo] password for ' + systemInfo.username + ': ');
                return;
            }
            
            // Special handling for htop/btop - enter live mode
            if ((cmd.toLowerCase() === 'htop' || cmd.toLowerCase() === 'btop') && handler) {
                htopMode = true;
                processSimulator.startLive((output) => {
                    // Clear and redraw (simulate terminal clearing)
                    term.write('\x1b[2J\x1b[0;0H');  // Clear screen and move cursor to top
                    term.write(output);
                });
                return;
            }
            
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
        if (passwordMode) {
            if (passwordBuffer.length > 0) {
                passwordBuffer = passwordBuffer.slice(0, -1);
                term.write('\b \b');
            }
        } else if (cursorPos > 0) {
            // Remove character before cursor
            inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
            cursorPos--;
            
            // Move cursor back and clear the character
            term.write('\b');
            
            // Redraw from cursor position to end
            const restOfLine = inputBuffer.slice(cursorPos);
            term.write(restOfLine + ' ');
            
            // Move cursor back to position
            for (let i = 0; i < restOfLine.length + 1; i++) {
                term.write('\b');
            }
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
        if (passwordMode) {
            // In password mode, collect input but don't echo it
            passwordBuffer += data;
            term.write('*');  // Show asterisk instead of character
        } else {
            // Insert at cursor position
            inputBuffer = inputBuffer.slice(0, cursorPos) + data + inputBuffer.slice(cursorPos);
            cursorPos++;
            
            // Write the character and redraw rest of line
            const restOfLine = inputBuffer.slice(cursorPos);
            term.write(data + restOfLine);
            
            // Move cursor back to correct position
            for (let i = 0; i < restOfLine.length; i++) {
                term.write('\b');
            }
        }
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
