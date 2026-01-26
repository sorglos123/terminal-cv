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

function handleWhoami() {
    return cvContent.about.split('\n')[0];
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

function handleClear() {
    outputContainer.innerHTML = '';
    return '';
}

function handleExit() {
    return 'Goodbye!';
}
