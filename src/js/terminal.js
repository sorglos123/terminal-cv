// ============================================================================
// DOM Elements
// ============================================================================

const terminalInput = document.getElementById('terminal-input');
const outputContainer = document.getElementById('output-container');
const terminal = document.getElementById('terminal');

// ============================================================================
// Terminal State
// ============================================================================

let currentPath = '/';
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
        
        // Display command
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">$</span> <span class="command">${escapeHtml(input)}</span>`;
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
        
        terminal.scrollTop = terminal.scrollHeight;
    }
});

terminalInput.addEventListener('keydown', (e) => {
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
        // Autocomplete paths for cat, less, cd, ls, grep
        else if (['cat', 'less', 'cd', 'ls', 'grep'].includes(cmd)) {
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
