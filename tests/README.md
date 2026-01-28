# Terminal CV - Test Suite Documentation

This directory contains comprehensive tests for the Terminal CV application, covering unit tests, integration tests, and end-to-end tests.

## Test Structure

```
tests/
├── unit/               # Unit tests for individual functions
│   ├── utils.test.js   # Path resolution and tree building tests
│   └── commands.test.js # Command handler tests
├── integration/        # Integration tests for component interactions
│   └── terminal.test.js # Terminal functionality tests
├── e2e/               # End-to-end tests for complete user flows
│   └── terminal.e2e.test.js # Full application tests
└── setup.js           # Jest configuration and mocks
```

## Test Coverage

### Unit Tests (`tests/unit/`)

**utils.test.js** - Tests utility functions:
- Path resolution (absolute, relative, parent directories)
- Path normalization
- Tree building for directory structures
- HTML escaping for security

**commands.test.js** - Tests command handlers:
- File operations: `ls`, `cd`, `pwd`, `cat`, `grep`
- Utilities: `clear`, `history`
- Error handling and edge cases
- Command validation

### Integration Tests (`tests/integration/`)

**terminal.test.js** - Tests terminal integration:
- Command input and execution flow
- Command history navigation (up/down arrows)
- Cursor movement (left/right arrows, backspace)
- Tab autocompletion for commands and paths
- Special modes (htop, password mode)

### End-to-End Tests (`tests/e2e/`)

**terminal.e2e.test.js** - Tests complete user scenarios:
- Terminal initialization and responsiveness
- Window resize handling
- All 19+ commands execution
- Cursor movement in real terminal
- Command history in real browser
- Tab autocompletion in live environment
- User interaction flows

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests
npm run test:e2e
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

This generates a coverage report in the `coverage/` directory.

## What Each Test Type Validates

### 1. App Responsiveness ✓
- **E2E tests** verify terminal loads and displays properly
- **E2E tests** verify terminal resizes with window changes
- **Integration tests** verify terminal state updates correctly

### 2. Cursor Movement ✓
- **Integration tests** verify cursor position logic
- **E2E tests** verify left/right arrow keys work in browser
- **E2E tests** verify backspace deletes characters correctly
- **Integration tests** verify character insertion at cursor

### 3. Autocompletion ✓
- **Integration tests** verify tab completion logic for commands
- **Integration tests** verify tab completion logic for file paths
- **E2E tests** verify tab key triggers completion in browser
- **E2E tests** verify completed commands can be executed

### 4. All Commands Working ✓
- **Unit tests** verify individual command logic
- **E2E tests** verify all commands execute without errors
- **E2E tests** verify command output appears correctly
- **Unit tests** verify error handling for invalid inputs

### Additional Validation

- **Command History**: Up/down arrow navigation through previous commands
- **Special Modes**: htop/btop interactive mode, sudo password mode
- **Security**: HTML escaping prevents XSS attacks
- **Error Handling**: Proper error messages for invalid operations

## Test Technologies

- **Jest** - Test framework and runner
- **jsdom** - DOM simulation for unit/integration tests
- **Playwright** - Browser automation for E2E tests
- **http-server** - Local server for E2E testing

## Writing New Tests

### Adding a Unit Test

1. Create or edit a file in `tests/unit/`
2. Import test utilities: `const { describe, test, expect } = require('@jest/globals');`
3. Write focused tests for individual functions
4. Run with `npm run test:unit`

Example:
```javascript
describe('My Function', () => {
    test('does something specific', () => {
        const result = myFunction(input);
        expect(result).toBe(expected);
    });
});
```

### Adding an E2E Test

1. Edit `tests/e2e/terminal.e2e.test.js`
2. Add a new test in an appropriate describe block
3. Use Playwright page API for browser interactions
4. Run with `npm run test:e2e`

Example:
```javascript
test('new feature works', async () => {
    await page.click('#terminal');
    await page.keyboard.type('mycommand');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    const output = await page.evaluate(() => {
        return document.querySelector('.xterm-screen').textContent;
    });
    
    expect(output).toContain('expected result');
});
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Check exit code (0 = success, non-zero = failure)

For headless CI environments, Playwright will automatically run in headless mode.

## Troubleshooting

### E2E Tests Failing
- Ensure port 8765 is available
- Check that xterm.js CDN is accessible
- Verify browser automation permissions

### Unit Tests Failing
- Check Jest configuration in `jest.config.js`
- Verify mocks in `tests/setup.js` are correct
- Look for console errors in test output

### Coverage Issues
- Add more test cases for uncovered lines
- Check `collectCoverageFrom` in Jest config
- Run `npm run test:coverage` to see report

## Performance

- Unit tests: ~1-2 seconds
- Integration tests: ~1-2 seconds  
- E2E tests: ~10-20 seconds (browser startup + interactions)
- Total test suite: ~15-25 seconds

## Future Enhancements

Potential test additions:
- Visual regression testing (screenshot comparison)
- Performance benchmarks (terminal render time)
- Accessibility testing (screen reader compatibility)
- Cross-browser testing (Firefox, Safari)
- Mobile responsiveness tests
- Load testing (many rapid commands)

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all existing tests still pass
3. Add tests for new functionality
4. Update this README if adding new test categories
5. Maintain >80% code coverage

## License

Tests are part of the Terminal CV project and share the same license.
