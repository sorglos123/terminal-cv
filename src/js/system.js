let cachedNeofetchRaw = null;

// Preload neofetch output from file
async function preloadNeofetch() {
    try {
        const response = await fetch('./assets/neofetch.txt');
        if (response.ok) {
            cachedNeofetchRaw = await response.text();
        }
    } catch (error) {
        console.log('Could not preload neofetch, will use simulated output');
    }
}

// Call preload when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadNeofetch);
} else {
    preloadNeofetch();
}

const systemInfo = {
    hostname: 'blog',
    username: 'srgls',
    platform: 'Ubuntu 24.04 LTS',
    os: 'Ubuntu',
    arch: 'x86_64',
    kernel: '6.8.0-1019-gke',
    cpuModel: 'Intel(R) Xeon(R) CPU @ 2.20GHz',
    cpuCores: 4,
    memoryTotal: 8192,
    memoryUsed: 3456,
    uptime: Math.floor(Math.random() * 86400 * 30), // Random uptime in seconds
    
    getSystemInfo() {
        const now = new Date();
        const uptime = this.uptime;
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        
        return `           _
         / \\
        /   \\               ${this.username}@${this.hostname}
       /     \\              ────────────────────
      /_______\\             OS: ${this.platform}
                             Kernel: ${this.kernel}
                             Architecture: ${this.arch}
                             Uptime: ${days}d ${hours}h ${mins}m`;
    },
    
    getNeofetch() {
        const now = new Date();
        const uptime = this.uptime;
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        const memPercent = Math.round((this.memoryUsed / this.memoryTotal) * 100);
        const uptimeStr = `${days}d ${hours}h ${mins}m`;
        
        // ANSI color codes
        const ORANGE = '\x1b[38;2;233;84;32m';    // #E95420 - accent 1
        const TEAL = '\x1b[38;2;23;184;144m';     // #17B890 - accent 2
        const GRAY = '\x1b[38;2;154;166;178m';    // #9AA6B2 - muted text
        const RESET = '\x1b[0m';
        const BOLD = '\x1b[1m';
        
        // Memory bar visualization
        const barWidth = 20;
        const filledBars = Math.round((memPercent / 100) * barWidth);
        const emptyBars = barWidth - filledBars;
        const memBar = '[' + '█'.repeat(filledBars) + '░'.repeat(emptyBars) + '] ' + memPercent + '%';
        
        // Return parsed neofetch output that works with xterm.js
        // This will be loaded from assets/neofetch.txt and displayed directly
        const neofetchOutput = `${RESET}${this.username}@${this.hostname}
────────────────────
${GRAY}OS${RESET}        Ubuntu 24.04.3 LTS x86_64
${GRAY}Kernel${RESET}    6.8.0-90-generic
${GRAY}Uptime${RESET}    ${uptimeStr}
${GRAY}Shell${RESET}     bash 5.2.21
${GRAY}Terminal${RESET}  xterm-256color
${GRAY}CPU${RESET}       Common KVM (2) @ 3.000GHz
${GRAY}Memory${RESET}    ${this.memoryUsed}M / ${this.memoryTotal}M ${memBar}`;
        
        return neofetchOutput;
    },
    
    // Load raw neofetch output from assets file
    async loadNeofetchRaw() {
        try {
            const response = await fetch('/assets/neofetch.txt');
            return await response.text();
        } catch (error) {
            console.error('Failed to load neofetch output:', error);
            return this.getNeofetch();
        }
    },
    
    getUname() {
        return `Linux ${this.hostname} ${this.kernel} #1 SMP Ubuntu/Canonical
${this.arch} ${this.platform}`;
    }
};

// ============================================================================
// Simulated Process List
// ============================================================================

class ProcessSimulator {
    constructor() {
        this.processes = this.generateProcesses();
        this.timestamp = Date.now();
        this.isRunning = false;
        this.updateInterval = null;
    }
    
    generateProcesses() {
        // More realistic process list
        const processNames = [
            { name: 'systemd', user: 'root', baseCpu: 0.5, baseMem: 2.1 },
            { name: 'systemd-journal', user: 'root', baseCpu: 0.2, baseMem: 1.5 },
            { name: 'sshd', user: 'root', baseCpu: 0.1, baseMem: 0.8 },
            { name: 'bash', user: 'srgls', baseCpu: 0.3, baseMem: 1.2 },
            { name: 'node', user: 'srgls', baseCpu: 2.5, baseMem: 8.5 },
            { name: 'npm', user: 'srgls', baseCpu: 0.8, baseMem: 3.2 },
            { name: 'git', user: 'srgls', baseCpu: 1.2, baseMem: 2.1 },
            { name: 'python3', user: 'srgls', baseCpu: 5.1, baseMem: 12.3 },
            { name: 'firefox', user: 'srgls', baseCpu: 8.7, baseMem: 45.6 },
            { name: 'chrome', user: 'srgls', baseCpu: 12.3, baseMem: 67.2 }
        ];
        
        return processNames.map((p, i) => ({
            pid: 1000 + (i * 50),
            name: p.name,
            user: p.user,
            cpu: p.baseCpu + (Math.random() - 0.5) * 2,
            mem: p.baseMem + (Math.random() - 0.5) * 1.5
        }));
    }
    
    updateProcesses() {
        // Simulate CPU/memory changes with some randomness
        this.processes.forEach(p => {
            p.cpu = Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 3));
            p.mem = Math.max(0, Math.min(100, p.mem + (Math.random() - 0.5) * 1));
        });
    }
    
    formatBar(value, maxValue = 100, width = 10) {
        const filled = Math.round((value / maxValue) * width);
        const empty = width - filled;
        return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
    }
    
    getHtopOutput() {
        this.updateProcesses();
        
        const totalCpu = this.processes.reduce((sum, p) => sum + p.cpu, 0);
        const totalMem = this.processes.reduce((sum, p) => sum + p.mem, 0);
        const avgLoad = (totalCpu / 10).toFixed(2);
        
        // ANSI color codes
        const ORANGE = '\x1b[38;2;233;84;32m';    // #E95420
        const TEAL = '\x1b[38;2;23;184;144m';     // #17B890
        const RED = '\x1b[38;2;255;107;97m';      // #FF6B61
        const GRAY = '\x1b[38;2;154;166;178m';    // #9AA6B2
        const RESET = '\x1b[0m';
        const BOLD = '\x1b[1m';
        
        const cpuPercent = Math.min(100, totalCpu);
        const memPercent = Math.min(100, totalMem);
        const cpuBar = this.formatBar(cpuPercent, 100, 20);
        const memBar = this.formatBar(memPercent, 100, 20);
        
        // Color code based on usage
        const cpuColor = cpuPercent > 70 ? RED : (cpuPercent > 40 ? ORANGE : TEAL);
        const memColor = memPercent > 70 ? RED : (memPercent > 40 ? ORANGE : TEAL);
        // Build header with exact spacing to match data rows
        const headerLine = `   PID USER       CPU%  MEM% COMMAND`;
        
        let output = `${BOLD}htop 3.2.2${RESET} - ${new Date().toLocaleTimeString()}
${GRAY}─────────────────────────────────────────────────────────────${RESET}
${GRAY}Tasks${RESET}: ${this.processes.length} total  ${GRAY}Load average${RESET}: ${avgLoad} ${(totalCpu / 15).toFixed(2)} ${(totalCpu / 20).toFixed(2)}
${cpuColor}CPU  ${cpuBar}${RESET} ${cpuPercent.toFixed(1)}%
${memColor}Mem  ${memBar}${RESET} ${memPercent.toFixed(1)}%
${GRAY}─────────────────────────────────────────────────────────────${RESET}
${BOLD}${ORANGE}${headerLine}${RESET}
${GRAY}─────────────────────────────────────────────────────────────${RESET}
`;
        
        this.processes
            .sort((a, b) => b.cpu - a.cpu)
            .forEach(p => {
                const pid = String(p.pid).padStart(4);
                const user = p.user.padEnd(8);
                const cpuVal = p.cpu.toFixed(1).padStart(4);
                const memVal = p.mem.toFixed(1).padStart(4);
                const cpuCol = p.cpu > 5 ? RED : (p.cpu > 2 ? ORANGE : '');
                const memCol = p.mem > 20 ? RED : (p.mem > 10 ? ORANGE : '');
                
                output += `${pid} ${user} ${cpuCol}${cpuVal}${RESET} ${memCol}${memVal}${RESET} ${p.name}\n`;
            });
        
        output += `${GRAY}─────────────────────────────────────────────────────────────${RESET}
${GRAY}Press 'q' to quit${RESET}`;
        
        return output;
    }
    
    startLive(updateCallback) {
        this.isRunning = true;
        // Clear screen initially
        updateCallback(this.getHtopOutput());
        
        // Update every 500ms
        this.updateInterval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(this.updateInterval);
                return;
            }
            updateCallback(this.getHtopOutput());
        }, 500);
    }
    
    stop() {
        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

const processSimulator = new ProcessSimulator();

// Function to create animated htop/btop view
function createAnimatedProcessView() {
    let frame = 0;
    let isRunning = true;
    
    return {
        start() {
            isRunning = true;
            let output = '';
            
            const interval = setInterval(() => {
                if (!isRunning) {
                    clearInterval(interval);
                    return;
                }
                
                processSimulator.updateProcesses();
                output = processSimulator.getHtopOutput();
                
                // This would be rendered to terminal in real implementation
                frame++;
            }, 500);
            
            return { output: () => processSimulator.getHtopOutput(), stop: () => { isRunning = false; } };
        }
    };
}
