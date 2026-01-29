// Test setup file for Jest
// This file is executed before each test file

// Mock xterm.js since we're testing in a Node environment
global.Terminal = jest.fn().mockImplementation(() => ({
  open: jest.fn(),
  write: jest.fn(),
  clear: jest.fn(),
  onData: jest.fn(),
  loadAddon: jest.fn(),
}));

global.FitAddon = jest.fn().mockImplementation(() => ({
  fit: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window methods
global.addEventListener = jest.fn();
global.setTimeout = setTimeout;
global.setInterval = setInterval;
global.clearInterval = clearInterval;
