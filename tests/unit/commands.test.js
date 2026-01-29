/**
 * Unit tests for command handlers
 * Tests individual command functionality
 */

const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock global state
let currentPath = '/';
let commandHistory = [];
let fileSystem = {};
let term = {
    write: jest.fn(),
    clear: jest.fn(),
};

// Command handler implementations for testing
function handlePwd() {
    return currentPath;
}

function handleClear() {
    term.clear();
    return '';
}

function handleHistory() {
    return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
}

function resolvePath(path) {
    if (!path) return currentPath;
    if (path === '/') return '/';
    if (path === '.') return currentPath;
    if (path === '..') {
        const parts = currentPath.split('/').filter(p => p);
        return parts.length > 1 ? '/' + parts.slice(0, -1).join('/') : '/';
    }
    if (path.startsWith('/')) {
        const parts = path.split('/').filter(p => p);
        return '/' + parts.join('/');
    }
    const normalPath = currentPath === '/' ? '/' + path : currentPath + '/' + path;
    const parts = normalPath.split('/').filter(p => p);
    return '/' + parts.join('/');
}

function handleLs(args) {
    const path = resolvePath(args[0] || '.');
    const entry = fileSystem[path];
    
    if (!entry) return `ls: cannot access '${args[0] || '.'}': No such file or directory`;
    if (entry.type === 'file') return `ls: '${path}' is a regular file`;
    
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

function handleCat(args) {
    if (!args.length) return 'cat: missing operand';
    
    const path = resolvePath(args[0]);
    const entry = fileSystem[path];
    
    if (!entry) return `cat: ${args[0]}: No such file or directory`;
    if (entry.type === 'directory') return `cat: ${args[0]}: Is a directory`;
    
    return entry.content;
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

describe('Command Handlers - File Operations', () => {
    beforeEach(() => {
        currentPath = '/';
        fileSystem = {
            '/': { type: 'directory', entries: ['home', 'about', 'test.txt'] },
            '/home': { type: 'directory', entries: ['user'] },
            '/home/user': { type: 'directory', entries: ['doc.txt'] },
            '/home/user/doc.txt': { type: 'file', content: 'Hello World\nTest Line\nAnother Line' },
            '/about': { type: 'directory', entries: ['bio.txt'] },
            '/about/bio.txt': { type: 'file', content: 'Bio content here' },
            '/test.txt': { type: 'file', content: 'Root file content' },
        };
    });

    describe('pwd command', () => {
        test('returns current path', () => {
            currentPath = '/';
            expect(handlePwd()).toBe('/');
            
            currentPath = '/home/user';
            expect(handlePwd()).toBe('/home/user');
        });
    });

    describe('ls command', () => {
        test('lists current directory contents', () => {
            currentPath = '/';
            const output = handleLs([]);
            expect(output).toContain('home/');
            expect(output).toContain('about/');
            expect(output).toContain('test.txt');
        });

        test('lists specified directory contents', () => {
            currentPath = '/';
            const output = handleLs(['home']);
            expect(output).toContain('user/');
        });

        test('shows error for non-existent path', () => {
            const output = handleLs(['nonexistent']);
            expect(output).toContain('No such file or directory');
        });

        test('shows error when listing a file', () => {
            const output = handleLs(['test.txt']);
            expect(output).toContain('is a regular file');
        });
    });

    describe('cd command', () => {
        test('changes to specified directory', () => {
            currentPath = '/';
            const output = handleCd(['home']);
            expect(output).toBe('');
            expect(currentPath).toBe('/home');
        });

        test('handles absolute paths', () => {
            currentPath = '/';
            handleCd(['/home/user']);
            expect(currentPath).toBe('/home/user');
        });

        test('shows error for non-existent directory', () => {
            const output = handleCd(['nonexistent']);
            expect(output).toContain('No such file or directory');
        });

        test('shows error when cd to a file', () => {
            const output = handleCd(['test.txt']);
            expect(output).toContain('Not a directory');
        });

        test('returns empty string when no args provided', () => {
            const output = handleCd([]);
            expect(output).toBe('');
        });
    });

    describe('cat command', () => {
        test('displays file content', () => {
            const output = handleCat(['test.txt']);
            expect(output).toBe('Root file content');
        });

        test('displays nested file content', () => {
            currentPath = '/home/user';
            const output = handleCat(['doc.txt']);
            expect(output).toContain('Hello World');
        });

        test('shows error for non-existent file', () => {
            const output = handleCat(['nonexistent.txt']);
            expect(output).toContain('No such file or directory');
        });

        test('shows error when cat a directory', () => {
            const output = handleCat(['home']);
            expect(output).toContain('Is a directory');
        });

        test('shows error when no operand provided', () => {
            const output = handleCat([]);
            expect(output).toBe('cat: missing operand');
        });
    });

    describe('grep command', () => {
        test('searches for pattern in file', () => {
            currentPath = '/home/user';
            const output = handleGrep(['Hello', 'doc.txt']);
            expect(output).toContain('Hello World');
        });

        test('case insensitive search', () => {
            currentPath = '/home/user';
            const output = handleGrep(['hello', 'doc.txt']);
            expect(output).toContain('Hello World');
        });

        test('returns empty string when no matches', () => {
            currentPath = '/home/user';
            const output = handleGrep(['nonexistent', 'doc.txt']);
            expect(output).toBe('');
        });

        test('shows usage error when insufficient args', () => {
            const output = handleGrep(['pattern']);
            expect(output).toBe('grep: usage: grep pattern file');
        });

        test('shows error for non-existent file', () => {
            const output = handleGrep(['test', 'nonexistent.txt']);
            expect(output).toContain('No such file or directory');
        });

        test('shows error when grepping a directory', () => {
            const output = handleGrep(['test', 'home']);
            expect(output).toContain('Is a directory');
        });
    });
});

describe('Command Handlers - Utilities', () => {
    beforeEach(() => {
        commandHistory = [];
        term.clear.mockClear();
    });

    describe('clear command', () => {
        test('calls term.clear()', () => {
            const output = handleClear();
            expect(term.clear).toHaveBeenCalled();
            expect(output).toBe('');
        });
    });

    describe('history command', () => {
        test('displays empty history', () => {
            const output = handleHistory();
            expect(output).toBe('');
        });

        test('displays command history with line numbers', () => {
            commandHistory = ['ls', 'cd home', 'pwd'];
            const output = handleHistory();
            expect(output).toContain('1  ls');
            expect(output).toContain('2  cd home');
            expect(output).toContain('3  pwd');
        });
    });
});
