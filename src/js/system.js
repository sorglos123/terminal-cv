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
    }
    
    generateProcesses() {
        const processNames = [
            'init', 'kthreadd', 'rcu_gp', 'rcu_par_gp', 'kworker/0:0',
            'systemd', 'journald', 'sshd', 'bash', 'terminal.js',
            'node', 'npm', 'git', 'chrome', 'firefox'
        ];
        
        return processNames.map((name, i) => ({
            pid: 100 + i,
            name: name,
            cpu: Math.random() * 20,
            mem: Math.random() * 15
        }));
    }
    
    updateProcesses() {
        // Simulate CPU/memory changes
        this.processes.forEach(p => {
            p.cpu = Math.max(0, p.cpu + (Math.random() - 0.5) * 5);
            p.mem = Math.max(0, p.mem + (Math.random() - 0.5) * 3);
        });
    }
    
    formatBar(value, maxValue = 100, width = 10) {
        const filled = Math.round((value / maxValue) * width);
        const empty = width - filled;
        return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
    }
    
    getHtopOutput() {
        const totalCpu = this.processes.reduce((sum, p) => sum + p.cpu, 0);
        const totalMem = this.processes.reduce((sum, p) => sum + p.mem, 0);
        
        let output = `Tasks: ${this.processes.length} total   Load average: ${(totalCpu / 10).toFixed(2)}, ${(totalCpu / 15).toFixed(2)}, ${(totalCpu / 20).toFixed(2)}
CPU  ${this.formatBar(totalCpu, 100)} ${totalCpu.toFixed(1)}%
Mem  ${this.formatBar(totalMem, 100)} ${totalMem.toFixed(1)}%

  PID USER      CPU% MEM%  COMMAND
`;
        
        this.processes
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 10)
            .forEach(p => {
                output += `${p.pid.toString().padEnd(5)} srgls  ${p.cpu.toFixed(2).padEnd(5)} ${p.mem.toFixed(2).padEnd(6)} ${p.name}\n`;
            });
        
        return output;
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
