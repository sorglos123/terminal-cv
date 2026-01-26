// ============================================================================
// System Information & Simulated Process Management
// ============================================================================

const systemInfo = {
    hostname: 'blog',
    username: 'srgls',
    platform: 'Ubuntu 24.04 LTS',
    os: 'Ubuntu',
    arch: 'x86_64',
    kernel: 'JavaScript Runtime (Browser)',
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
    
    getUname() {
        return `Linux ${this.hostname} 6.8.0-1019-gke #1 SMP Ubuntu/Canonical
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
