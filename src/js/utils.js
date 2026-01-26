// ============================================================================
// Utility Functions
// ============================================================================

function resolvePath(path) {
    if (!path) return currentPath;
    
    if (path === '/') return '/';
    if (path === '.') return currentPath;
    if (path === '..') {
        const parts = currentPath.split('/').filter(p => p);
        return parts.length > 1 ? '/' + parts.slice(0, -1).join('/') : '/';
    }
    
    if (path.startsWith('/')) return normalizePath(path);
    return normalizePath(currentPath === '/' ? '/' + path : currentPath + '/' + path);
}

function normalizePath(path) {
    const parts = path.split('/').filter(p => p);
    return '/' + parts.join('/');
}

function buildTree(path = '/', indent = '') {
    const entry = fileSystem[path];
    if (!entry || entry.type === 'file') return '';
    
    let output = '';
    const entries = entry.entries || [];
    
    entries.forEach((name, index) => {
        const isLast = index === entries.length - 1;
        const fullPath = path === '/' ? '/' + name : path + '/' + name;
        const child = fileSystem[fullPath];
        
        output += indent + (isLast ? '└── ' : '├── ') + name;
        if (child && child.type === 'directory') output += '/';
        output += '\n';
        
        if (child && child.type === 'directory') {
            output += buildTree(fullPath, indent + (isLast ? '    ' : '│   '));
        }
    });
    
    return output || '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
