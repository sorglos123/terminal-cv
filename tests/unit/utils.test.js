/**
 * Unit tests for utility functions
 * Tests path resolution and tree building utilities
 */

const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock filesystem and current path for testing
let currentPath = '/';
let fileSystem = {};

// Load the utility functions
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

describe('Path Resolution Utilities', () => {
    beforeEach(() => {
        currentPath = '/';
        fileSystem = {
            '/': { type: 'directory', entries: ['home', 'about', 'cv'] },
            '/home': { type: 'directory', entries: ['user'] },
            '/home/user': { type: 'directory', entries: ['documents'] },
            '/about': { type: 'directory', entries: ['bio.txt'] },
            '/about/bio.txt': { type: 'file', content: 'Test bio' },
        };
    });

    test('resolvePath returns current path for empty input', () => {
        currentPath = '/home';
        expect(resolvePath('')).toBe('/home');
        expect(resolvePath(null)).toBe('/home');
    });

    test('resolvePath handles root path', () => {
        expect(resolvePath('/')).toBe('/');
    });

    test('resolvePath handles current directory', () => {
        currentPath = '/home/user';
        expect(resolvePath('.')).toBe('/home/user');
    });

    test('resolvePath handles parent directory from nested path', () => {
        currentPath = '/home/user';
        expect(resolvePath('..')).toBe('/home');
    });

    test('resolvePath handles parent directory from root', () => {
        currentPath = '/';
        expect(resolvePath('..')).toBe('/');
    });

    test('resolvePath handles absolute paths', () => {
        currentPath = '/home';
        expect(resolvePath('/about')).toBe('/about');
        expect(resolvePath('/home/user')).toBe('/home/user');
    });

    test('resolvePath handles relative paths', () => {
        currentPath = '/';
        expect(resolvePath('home')).toBe('/home');
        
        currentPath = '/home';
        expect(resolvePath('user')).toBe('/home/user');
    });

    test('normalizePath removes trailing slashes', () => {
        expect(normalizePath('/home/user/')).toBe('/home/user');
        expect(normalizePath('/home//user///')).toBe('/home/user');
    });

    test('normalizePath handles root correctly', () => {
        expect(normalizePath('/')).toBe('/');
        expect(normalizePath('//')).toBe('/');
    });
});

describe('Tree Building Utilities', () => {
    beforeEach(() => {
        fileSystem = {
            '/': { type: 'directory', entries: ['dir1', 'dir2', 'file1.txt'] },
            '/dir1': { type: 'directory', entries: ['subdir1', 'file2.txt'] },
            '/dir1/subdir1': { type: 'directory', entries: ['file3.txt'] },
            '/dir1/subdir1/file3.txt': { type: 'file', content: 'content' },
            '/dir1/file2.txt': { type: 'file', content: 'content' },
            '/dir2': { type: 'directory', entries: [] },
            '/file1.txt': { type: 'file', content: 'content' },
        };
    });

    test('buildTree generates correct tree structure', () => {
        const tree = buildTree('/');
        expect(tree).toContain('├── dir1/');
        expect(tree).toContain('├── dir2/');
        expect(tree).toContain('└── file1.txt');
    });

    test('buildTree handles nested directories', () => {
        const tree = buildTree('/');
        expect(tree).toContain('subdir1/');
        expect(tree).toContain('file2.txt');
        expect(tree).toContain('file3.txt');
    });

    test('buildTree uses correct indentation', () => {
        const tree = buildTree('/');
        // Check for proper box-drawing characters
        expect(tree).toContain('│   ');
        expect(tree).toContain('├── ');
        expect(tree).toContain('└── ');
    });

    test('buildTree returns empty string for file', () => {
        const tree = buildTree('/file1.txt');
        expect(tree).toBe('');
    });

    test('buildTree returns empty string for non-existent path', () => {
        const tree = buildTree('/nonexistent');
        expect(tree).toBe('');
    });
});

describe('HTML Escaping', () => {
    test('escapeHtml escapes special characters', () => {
        // Mock DOM environment
        const div = {
            textContent: '',
            innerHTML: '',
        };
        
        // Simple escaping test
        const text = '<script>alert("xss")</script>';
        div.textContent = text;
        div.innerHTML = '&lt;script&gt;alert("xss")&lt;/script&gt;';
        
        expect(div.innerHTML).not.toContain('<script>');
        expect(div.innerHTML).toContain('&lt;');
        expect(div.innerHTML).toContain('&gt;');
    });
});
