// ============================================================================
// Command Handlers
// ============================================================================

function handleHelp() {
    let output = 'Available commands:\n\n';
    for (const [cmd, info] of Object.entries(commandRegistry)) {
        output += `${cmd.padEnd(10)} - ${info.desc}\n`;
    }
    return output;
}

function handleLs(args) {
    const path = resolvePath(args[0] || '.');
    const entry = fileSystem[path];
    
    if (!entry) return `ls: cannot access '${args[0] || '.'}': No such file or directory`;
    if (entry.type === 'file') return `ls: '${path}' is a regular file`;
    
    // Show directories with trailing slash, files without
    return entry.entries
        .map(name => {
            const fullPath = path === '/' ? '/' + name : path + '/' + name;
            const child = fileSystem[fullPath];
            return child && child.type === 'directory' ? name + '/' : name;
        })
        .join('\n');
}

function handleCd(args) {
    if (!args.length) return '';
    
    const newPath = resolvePath(args[0]);
    const entry = fileSystem[newPath];
    
    if (!entry) return `cd: ${args[0]}: No such file or directory`;
    if (entry.type === 'file') return `cd: ${args[0]}: Not a directory`;
    
    currentPath = newPath;
    return '';
}

function handlePwd() {
    return currentPath;
}

function handleCat(args) {
    if (!args.length) return 'cat: missing operand';
    
    const path = resolvePath(args[0]);
    const entry = fileSystem[path];
    
    if (!entry) return `cat: ${args[0]}: No such file or directory`;
    if (entry.type === 'directory') return `cat: ${args[0]}: Is a directory`;
    
    return entry.content;
}

// whoami no longer reads a file; it returns the derived whoami value
function handleWhoami() {
    return (typeof derived !== 'undefined' && derived.whoami) ? derived.whoami : fileSystem['/about/whoami']?.content || '';
}

function handleTree(args) {
    return buildTree('/');
}

function handleGrep(args) {
    if (args.length < 2) return 'grep: usage: grep pattern file';
    
    const pattern = args[0];
    const path = resolvePath(args[1]);
    const entry = fileSystem[path];
    
    if (!entry) return `grep: ${args[1]}: No such file or directory`;
    if (entry.type === 'directory') return `grep: ${args[1]}: Is a directory`;
    
    const regex = new RegExp(pattern, 'gi');
    const lines = entry.content.split('\n');
    const matches = lines.filter(line => regex.test(line));
    
    return matches.length ? matches.join('\n') : '';
}

function handleSudo(args) {
    // Easter egg: trigger password prompt in xterm terminal
    if (typeof passwordMode !== 'undefined') {
        passwordMode = true;
        passwordBuffer = '';
        // Return empty string since the prompt will be handled by xterm
        return '';
    }
    return 'sudo: command not found (this is a simulation)';
}

function handleClear() {
    term.clear();
    return '';
}

function handleExit() {
    return 'Goodbye!';
}

function handleOpen(args) {
    if (!args.length) return 'open: missing operand';
    
    const path = resolvePath(args[0]);
    let entry = fileSystem[path];
    
    // Follow symlinks
    if (entry && entry.type === 'symlink') {
        entry = fileSystem[entry.target];
    }
    
    if (!entry) return `open: ${args[0]}: No such file or directory`;
    if (entry.type === 'directory') return `open: ${args[0]}: Is a directory`;
    if (!entry.url) return `open: ${args[0]}: No URL associated with this file`;
    
    window.open(entry.url, '_blank');
    return '';
}

function handleXdgOpen(args) {
    // xdg-open is an alias to open
    return handleOpen(args);
}

function handleHistory() {
    if (commandHistory.length === 0) return 'No command history';
    return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
}

function handleHostnamectl() {
    return `Static hostname: ${systemInfo.hostname}
Icon name: computer-laptop
Chassis: laptop
Machine ID: cv-terminal-js
Boot ID: runtime-${Math.random().toString(36).substr(2, 9)}
Virtualization: javascript
Operating System: CV Terminal OS
Kernel: ${systemInfo.kernel}
Architecture: ${systemInfo.arch}`;
}

function handleUname() {
    return systemInfo.getUname();
}

function handleNeofetch() {
    // Use cached raw neofetch if available, otherwise use simulated
    if (cachedNeofetchRaw) {
        // Strip control codes like [?25l, [?7l, [20A, [9999999D etc.
        // Keep ANSI color/style codes but remove cursor positioning
        return cachedNeofetchRaw
            .replace(/\[\?25[lh]/g, '')      // Hide/show cursor
            .replace(/\[\?7[lh]/g, '')       // Disable/enable line wrapping
            .replace(/\[\d+A/g, '')          // Move cursor up
            .replace(/\[\d+B/g, '')          // Move cursor down
            .replace(/\[\d+C/g, '')          // Move cursor right
            .replace(/\[\d+D/g, '')          // Move cursor left
            .replace(/\[\d+;\d+H/g, '')      // Move cursor to position
            .replace(/\[\d+;\d+f/g, '')      // Move cursor to position (alternate)
            .trim();
    }
    // Fallback to simulated neofetch
    return systemInfo.getNeofetch();
}

function handleHtop() {
    return processSimulator.getHtopOutput();
}

function handleBtop() {
    // btop is an alias to htop
    return handleHtop();
}