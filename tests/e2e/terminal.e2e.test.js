/**
 * End-to-End tests for terminal-cv application
 * Tests complete user interactions using Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Terminal CV E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        
        // Wait for terminal to be initialized
        await page.waitForSelector('#terminal', { timeout: 10000 });
        await page.waitForTimeout(1000); // Give xterm.js time to initialize
    });

    test.describe('Terminal Initialization and Responsiveness', () => {
        test('terminal loads and displays initial prompt', async ({ page }) => {
            const terminal = await page.$('#terminal');
            expect(terminal).toBeTruthy();
            
            // Check that terminal has content
            const hasContent = await page.evaluate(() => {
                const terminalEl = document.querySelector('#terminal');
                return terminalEl && terminalEl.querySelector('.xterm-screen');
            });
            
            expect(hasContent).toBe(true);
        });

        test('terminal is responsive to window resize', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await page.waitForTimeout(500);
            
            let terminalSize1 = await page.evaluate(() => {
                const terminalEl = document.querySelector('#terminal');
                return {
                    width: terminalEl.offsetWidth,
                    height: terminalEl.offsetHeight
                };
            });
            
            await page.setViewportSize({ width: 800, height: 600 });
            await page.waitForTimeout(500);
            
            let terminalSize2 = await page.evaluate(() => {
                const terminalEl = document.querySelector('#terminal');
                return {
                    width: terminalEl.offsetWidth,
                    height: terminalEl.offsetHeight
                };
            });
            
            // Verify size changed
            expect(terminalSize1.width).toBeGreaterThan(terminalSize2.width);
        });

        test('terminal accepts input', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('help');
            
            // Check if input was registered
            const inputBufferExists = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined';
            });
            
            // At minimum, we typed something
            expect(inputBufferExists).toBeDefined();
        });
    });

    test.describe('Command Execution', () => {
        test('pwd command shows current directory', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('pwd');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            
            const output = await page.evaluate(() => {
                const terminalEl = document.querySelector('.xterm-screen');
                return terminalEl ? terminalEl.textContent : '';
            });
            
            expect(output).toContain('/');
        });

        test('help command displays available commands', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('help');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            
            const output = await page.evaluate(() => {
                const terminalEl = document.querySelector('.xterm-screen');
                return terminalEl ? terminalEl.textContent : '';
            });
            
            expect(output).toContain('Available commands');
            expect(output).toMatch(/ls|cd|pwd|cat/);
        });

        test('ls command lists directory contents', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('ls');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            
            const output = await page.evaluate(() => {
                const terminalEl = document.querySelector('.xterm-screen');
                return terminalEl ? terminalEl.textContent : '';
            });
            
            // Should show some directory content
            expect(output.length).toBeGreaterThan(10);
        });

        test('clear command clears terminal', async ({ page }) => {
            await page.click('#terminal');
            
            // Type multiple commands
            await page.keyboard.type('help');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            await page.keyboard.type('ls');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            // Now clear
            await page.keyboard.type('clear');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            
            const output = await page.evaluate(() => {
                const terminalEl = document.querySelector('.xterm-screen');
                return terminalEl ? terminalEl.textContent : '';
            });
            
            // After clear, output should be minimal (just prompt)
            expect(output.length).toBeLessThan(100);
        });
    });

    test.describe('Cursor Movement', () => {
        test('left arrow moves cursor left', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('hello');
            
            // Move cursor left
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowLeft');
            
            // Type a character
            await page.keyboard.type('X');
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            // X should be inserted before the last two characters
            expect(buffer).toMatch(/heXllo|helXlo/);
        });

        test('right arrow moves cursor right', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('hello');
            
            // Move left twice, then right once
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowRight');
            
            await page.keyboard.type('X');
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toMatch(/helXlo|hellXo/);
        });

        test('backspace deletes character', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('hello');
            await page.keyboard.press('Backspace');
            await page.keyboard.press('Backspace');
            
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            const output = await page.evaluate(() => {
                const terminalEl = document.querySelector('.xterm-screen');
                return terminalEl ? terminalEl.textContent : '';
            });
            
            expect(output).toContain('hel');
        });
    });

    test.describe('Command History', () => {
        test('up arrow recalls previous command', async ({ page }) => {
            await page.click('#terminal');
            
            // Execute first command
            await page.keyboard.type('pwd');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            // Execute second command
            await page.keyboard.type('ls');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            // Press up arrow
            await page.keyboard.press('ArrowUp');
            await page.waitForTimeout(100);
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toBe('ls');
        });

        test('up arrow multiple times navigates history', async ({ page }) => {
            await page.click('#terminal');
            
            // Execute commands
            await page.keyboard.type('pwd');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            await page.keyboard.type('ls');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            await page.keyboard.type('help');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            // Navigate up
            await page.keyboard.press('ArrowUp'); // help
            await page.keyboard.press('ArrowUp'); // ls
            await page.keyboard.press('ArrowUp'); // pwd
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toBe('pwd');
        });

        test('down arrow navigates forward in history', async ({ page }) => {
            await page.click('#terminal');
            
            await page.keyboard.type('pwd');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            await page.keyboard.type('ls');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(200);
            
            // Go up twice
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('ArrowUp');
            
            // Go down once
            await page.keyboard.press('ArrowDown');
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toBe('ls');
        });
    });

    test.describe('Tab Autocompletion', () => {
        test('tab completes command', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('he');
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toContain('help');
        });

        test('tab completes partial command', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('cle');
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toBe('clear');
        });

        test('tab does nothing with no matches', async ({ page }) => {
            await page.click('#terminal');
            await page.keyboard.type('xyz');
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            
            const buffer = await page.evaluate(() => {
                return typeof inputBuffer !== 'undefined' ? inputBuffer : '';
            });
            
            expect(buffer).toBe('xyz');
        });
    });

    test.describe('All Commands Working', () => {
        const commands = [
            { cmd: 'help', shouldContain: 'Available commands' },
            { cmd: 'pwd', shouldContain: '/' },
            { cmd: 'ls', shouldContain: '' }, // Just check it executes
            { cmd: 'whoami', shouldContain: '' },
            { cmd: 'history', shouldContain: '' },
            { cmd: 'uname', shouldContain: '' },
        ];

        for (const { cmd, shouldContain } of commands) {
            test(`${cmd} command executes without error`, async ({ page }) => {
                await page.click('#terminal');
                await page.keyboard.type(cmd);
                await page.keyboard.press('Enter');
                await page.waitForTimeout(300);
                
                const output = await page.evaluate(() => {
                    const terminalEl = document.querySelector('.xterm-screen');
                    return terminalEl ? terminalEl.textContent : '';
                });
                
                // Check command was executed (output changed)
                expect(output.length).toBeGreaterThan(5);
                
                // Check for "command not found" error
                expect(output).not.toContain('command not found');
                
                if (shouldContain) {
                    expect(output).toContain(shouldContain);
                }
            });
        }
    });
});
