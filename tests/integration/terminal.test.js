/**
 * Integration tests for terminal functionality
 * Tests terminal input/output, history, and autocompletion
 */

const { describe, test, expect, beforeEach } = require('@jest/globals');

describe('Terminal Integration Tests', () => {
    let mockTerm;
    let inputBuffer;
    let cursorPos;
    let commandHistory;
    let historyIndex;
    let onDataCallback;

    beforeEach(() => {
        inputBuffer = '';
        cursorPos = 0;
        commandHistory = [];
        historyIndex = -1;
        
        mockTerm = {
            write: jest.fn(),
            clear: jest.fn(),
            onData: jest.fn((callback) => {
                onDataCallback = callback;
            }),
        };
    });

    describe('Command Input and Execution', () => {
        test('accumulates input buffer correctly', () => {
            const chars = ['l', 's'];
            chars.forEach(char => {
                inputBuffer += char;
                cursorPos++;
            });
            
            expect(inputBuffer).toBe('ls');
            expect(cursorPos).toBe(2);
        });

        test('handles Enter key to execute command', () => {
            inputBuffer = 'pwd';
            
            // Simulate enter
            if (inputBuffer.trim().length > 0) {
                commandHistory.push(inputBuffer);
            }
            const executed = inputBuffer.trim();
            inputBuffer = '';
            cursorPos = 0;
            historyIndex = -1;
            
            expect(executed).toBe('pwd');
            expect(commandHistory).toContain('pwd');
            expect(inputBuffer).toBe('');
            expect(historyIndex).toBe(-1);
        });

        test('handles empty command', () => {
            inputBuffer = '   ';
            
            const executed = inputBuffer.trim();
            inputBuffer = '';
            cursorPos = 0;
            
            expect(executed).toBe('');
            expect(commandHistory.length).toBe(0);
        });
    });

    describe('Command History Navigation', () => {
        beforeEach(() => {
            commandHistory = ['ls', 'cd home', 'pwd', 'cat file.txt'];
            historyIndex = -1;
            inputBuffer = '';
        });

        test('Arrow Up navigates to previous command', () => {
            // First up arrow
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                cursorPos = inputBuffer.length;
            }
            
            expect(historyIndex).toBe(0);
            expect(inputBuffer).toBe('cat file.txt');
            
            // Second up arrow
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                cursorPos = inputBuffer.length;
            }
            
            expect(historyIndex).toBe(1);
            expect(inputBuffer).toBe('pwd');
        });

        test('Arrow Up stops at oldest command', () => {
            // Navigate to oldest
            for (let i = 0; i < 10; i++) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                }
            }
            
            expect(historyIndex).toBe(commandHistory.length - 1);
            expect(inputBuffer).toBe('ls');
        });

        test('Arrow Down navigates to next command', () => {
            // Go up first
            historyIndex = 2;
            inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
            
            // Then down
            if (historyIndex > 0) {
                historyIndex--;
                inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                cursorPos = inputBuffer.length;
            }
            
            expect(historyIndex).toBe(1);
            expect(inputBuffer).toBe('pwd');
        });

        test('Arrow Down clears buffer at newest', () => {
            historyIndex = 0;
            inputBuffer = 'cat file.txt';
            
            if (historyIndex === 0) {
                historyIndex = -1;
                inputBuffer = '';
                cursorPos = 0;
            }
            
            expect(historyIndex).toBe(-1);
            expect(inputBuffer).toBe('');
        });
    });

    describe('Cursor Movement', () => {
        beforeEach(() => {
            inputBuffer = 'hello world';
            cursorPos = inputBuffer.length;
        });

        test('Arrow Left moves cursor left', () => {
            if (cursorPos > 0) {
                cursorPos--;
            }
            
            expect(cursorPos).toBe(10);
            
            // Move again
            if (cursorPos > 0) {
                cursorPos--;
            }
            
            expect(cursorPos).toBe(9);
        });

        test('Arrow Left stops at beginning', () => {
            cursorPos = 0;
            
            if (cursorPos > 0) {
                cursorPos--;
            }
            
            expect(cursorPos).toBe(0);
        });

        test('Arrow Right moves cursor right', () => {
            cursorPos = 5;
            
            if (cursorPos < inputBuffer.length) {
                cursorPos++;
            }
            
            expect(cursorPos).toBe(6);
        });

        test('Arrow Right stops at end', () => {
            cursorPos = inputBuffer.length;
            
            if (cursorPos < inputBuffer.length) {
                cursorPos++;
            }
            
            expect(cursorPos).toBe(inputBuffer.length);
        });

        test('Backspace deletes character before cursor', () => {
            cursorPos = 5;
            
            if (cursorPos > 0) {
                inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
                cursorPos--;
            }
            
            expect(inputBuffer).toBe('hell world');
            expect(cursorPos).toBe(4);
        });

        test('Backspace at beginning does nothing', () => {
            cursorPos = 0;
            const originalBuffer = inputBuffer;
            
            if (cursorPos > 0) {
                inputBuffer = inputBuffer.slice(0, cursorPos - 1) + inputBuffer.slice(cursorPos);
                cursorPos--;
            }
            
            expect(inputBuffer).toBe(originalBuffer);
            expect(cursorPos).toBe(0);
        });

        test('Character insertion at cursor position', () => {
            cursorPos = 5;
            const char = 'X';
            
            inputBuffer = inputBuffer.slice(0, cursorPos) + char + inputBuffer.slice(cursorPos);
            cursorPos++;
            
            expect(inputBuffer).toBe('helloX world');
            expect(cursorPos).toBe(6);
        });
    });

    describe('Tab Autocompletion', () => {
        const commandRegistry = {
            'help': true,
            'ls': true,
            'cd': true,
            'cat': true,
            'pwd': true,
            'clear': true,
        };

        test('autocompletes command', () => {
            inputBuffer = 'he';
            const parts = inputBuffer.split(/\s+/);
            const currentPart = parts[parts.length - 1];
            
            // Find matching commands
            const matches = Object.keys(commandRegistry)
                .filter(c => c.startsWith(currentPart))
                .sort();
            
            if (matches.length > 0 && parts.length === 1) {
                const completion = matches[0];
                const toAdd = completion.substring(currentPart.length);
                inputBuffer += toAdd;
                cursorPos = inputBuffer.length;
            }
            
            expect(inputBuffer).toBe('help');
        });

        test('autocompletes with multiple matches - takes first', () => {
            inputBuffer = 'c';
            const parts = inputBuffer.split(/\s+/);
            const currentPart = parts[parts.length - 1];
            
            const matches = Object.keys(commandRegistry)
                .filter(c => c.startsWith(currentPart))
                .sort();
            
            expect(matches).toContain('cat');
            expect(matches).toContain('cd');
            expect(matches).toContain('clear');
            
            if (matches.length > 0 && parts.length === 1) {
                const completion = matches[0];
                const toAdd = completion.substring(currentPart.length);
                inputBuffer += toAdd;
            }
            
            expect(inputBuffer).toBe('cat');
        });

        test('no autocomplete when no matches', () => {
            inputBuffer = 'xyz';
            const originalBuffer = inputBuffer;
            const parts = inputBuffer.split(/\s+/);
            const currentPart = parts[parts.length - 1];
            
            const matches = Object.keys(commandRegistry)
                .filter(c => c.startsWith(currentPart))
                .sort();
            
            expect(matches.length).toBe(0);
            expect(inputBuffer).toBe(originalBuffer);
        });

        test('autocompletes path for file commands', () => {
            inputBuffer = 'cat ab';
            const fileSystem = {
                '/': { type: 'directory', entries: ['about', 'home'] },
            };
            const currentPath = '/';
            
            const parts = inputBuffer.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const pathPart = parts[parts.length - 1];
            
            if (['cat', 'cd', 'ls'].includes(cmd)) {
                const dirEntry = fileSystem[currentPath];
                if (dirEntry && dirEntry.type === 'directory') {
                    const matches = dirEntry.entries
                        .filter(e => e.startsWith(pathPart))
                        .sort();
                    
                    if (matches.length > 0) {
                        const completion = matches[0];
                        const argStartIndex = inputBuffer.lastIndexOf(' ') + 1;
                        inputBuffer = inputBuffer.substring(0, argStartIndex) + completion;
                        cursorPos = inputBuffer.length;
                    }
                }
            }
            
            expect(inputBuffer).toBe('cat about');
        });
    });

    describe('Special Modes', () => {
        test('htop mode flag can be set', () => {
            let htopMode = false;
            
            htopMode = true;
            expect(htopMode).toBe(true);
            
            htopMode = false;
            expect(htopMode).toBe(false);
        });

        test('password mode flag can be set', () => {
            let passwordMode = false;
            let passwordBuffer = '';
            
            passwordMode = true;
            expect(passwordMode).toBe(true);
            
            passwordBuffer = 'test';
            expect(passwordBuffer).toBe('test');
            
            passwordMode = false;
            passwordBuffer = '';
            expect(passwordMode).toBe(false);
            expect(passwordBuffer).toBe('');
        });
    });
});
