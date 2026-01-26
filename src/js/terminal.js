// ============================================================================
// DOM Elements
// ============================================================================

const terminalInput = document.getElementById('terminal-input');
const outputContainer = document.getElementById('output-container');
const terminal = document.getElementById('terminal');
const initialPrompt = document.getElementById('initial-prompt');

// ============================================================================
// Terminal State & Utilities
// ============================================================================

let currentPath = '/';
let commandHistory = [];
let historyIndex = -1;

function getPromptString() {
    const displayPath = currentPath === '/' ? '/' : currentPath;
    return `${systemInfo.username}@${systemInfo.hostname}:~${displayPath}$`;
}

function updatePromptDisplay() {
    initialPrompt.textContent = getPromptString();
}

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
// Event Listeners
// ============================================================================

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalInput.value = '';
        
        // Add to history
        if (input.length > 0) {
            commandHistory.push(input);
        }
        historyIndex = -1;
        
        // Display command with full path prompt
        const prompt = getPromptString();
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">${escapeHtml(prompt)}</span> <span class="command">${escapeHtml(input)}</span>`;
        outputContainer.appendChild(commandLine);
        
        // Parse and execute
        const [cmd, ...args] = input.split(/\s+/);
        const handler = commandRegistry[cmd.toLowerCase()]?.handler;
        const output = handler ? handler(args) : `${cmd}: command not found`;
        
        if (output) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            outputDiv.innerHTML = `<pre>${escapeHtml(output)}</pre>`;
            outputContainer.appendChild(outputDiv);
        }
        
        // Update prompt display for next input
        updatePromptDisplay();
        terminal.scrollTop = terminal.scrollHeight;
    }
});

terminalInput.addEventListener('keydown', (e) => {
    // Arrow key history navigation
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
        return;
    }
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
            historyIndex = -1;
            terminalInput.value = '';
        }
        return;
    }
    
    // Tab autocomplete
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const input = terminalInput.value;
        const parts = input.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const currentPart = parts[parts.length - 1];
        
        let matches = [];
        
        // Autocomplete commands
        if (parts.length === 1) {
            matches = Object.keys(commandRegistry)
                .filter(c => c.startsWith(currentPart))
                .map(c => c);
        }
        // Autocomplete paths for cat, less, cd, ls, grep, open, xdg-open
        else if (['cat', 'less', 'cd', 'ls', 'grep', 'open', 'xdg-open'].includes(cmd)) {
            const lastArgIndex = parts.length - 1;
            const pathPart = parts[lastArgIndex];
            
            // Resolve the directory part of the path
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
            // Only replace the last part with the first match
            parts[parts.length - 1] = matches[0];
            terminalInput.value = parts.join(' ');
        }
    }
});
