// ============================================================================
// CV Content is loaded from data/cv-content.js
// Projects Content is loaded from data/projects-content.js
// ============================================================================
// The cvContent and projectsContent objects are now defined in the src/data/
// directory for easy customization. This file handles the presentation logic only.
//
// Note: cvContent and projectsContent are loaded globally from their respective files
// ============================================================================

// ============================================================================
// Derived / Virtual content (computed once)
// - Avoids recomputing .split()/filters in multiple fileSystem entries.
// - Keeps cvContent as the single source of truth and prevents duplication.
// ============================================================================
const derived = {
    // kept as a derived value (no longer exposed as a separate file)
    whoami: 'Sascha — Enterprise Systems Engineer (Backup, Virtualization & Automation) at Veeam.',

    // short bio wrapped to avoid horizontal scrolling in narrow terminals
    aboutBio:
`I’m an Enterprise Systems Engineer specializing in backup & restore,
large-scale virtualization (vSphere, Proxmox), and automation
(Ansible, Salt, Terraform). I design and operate resilient backup
infrastructures and drive adoption of enterprise backup solutions.
I enjoy converting complex architectures into reliable, repeatable
operations.`,

    // concise experience summary (includes WBS role)
    experienceSummary:
`11/2024 – Present — Enterprise Systems Engineer, Veeam — Led enterprise
backup reviews and security hardening; improved customer retention and
solution adoption.
10/2021 – 11/2024 — Team Lead Backup & Storage, Dedalus — Architected
private cloud backup for 5000+ VMs; operated 170+ ESXi hosts.
09/2018 – 10/2021 — Systems Engineer, WBS IT-Service — Datacenter
Solutions; infrastructure operations, pre-sales architecture, automation.
05/2016 – 08/2018 — Consultant, mobileBlox — Pre-sales, training and
operational support.`,

    // curated highlights (NetApp added)
    experienceHighlights:
`- Virtualization: vSphere, Proxmox, AHV
- Backup & Storage: Veeam, Commvault, PureStorage, NetApp
- Automation & IaC: Ansible, Salt, Terraform, Packer
- Languages / Scripting: Python, Bash, PowerShell
- Containers & Cloud: Docker, Kubernetes, AWS, Azure`
};

// ============================================================================
// Virtual File System
// Note: /about/whoami file removed (whoami command reads derived.whoami).
// ============================================================================
const fileSystem = {
    '/': {
        type: 'directory',
        entries: ['about', 'assets', 'contact', 'experience', 'projects', 'skills']
    },
    '/assets': {
        type: 'directory',
        entries: ['cv.pdf']
    },
    '/assets/cv.pdf': {
        type: 'file',
        url: '/assets/cv_SRichter2026.pdf',
        content: 'CV - Sascha Richter (PDF) [use "open /assets/cv.pdf" to view]'
    },
    '/cv.pdf': {
        type: 'symlink',
        target: '/assets/cv.pdf'
    },
    '/about': {
        type: 'directory',
        entries: ['bio', 'education']
    },
    '/about/bio': {
        type: 'file',
        virtual: true,
        content: derived.aboutBio
    },
    '/about/education': {
        type: 'file',
        content: cvContent.education
    },
    '/experience': {
        type: 'directory',
        entries: ['full', 'highlights', 'summary']
    },
    '/experience/summary': {
        type: 'file',
        virtual: true,
        content: derived.experienceSummary
    },
    '/experience/highlights': {
        type: 'file',
        virtual: true,
        content: derived.experienceHighlights
    },
    // full experience remains the authoritative full CV (unchanged)
    '/experience/full': {
        type: 'file',
        virtual: true,
        content: cvContent.experience
    },
    '/contact': {
        type: 'file',
        virtual: true,
        content: cvContent.contact
    },
    '/skills': {
        type: 'file',
        content: cvContent.skills
    }
};

// ============================================================================
// Build projects dynamically from projectsContent configuration
// ============================================================================
// Projects directory
fileSystem['/projects'] = {
    type: 'directory',
    entries: projectsContent.map(p => p.filename).sort()
};

// Individual project files
projectsContent.forEach(project => {
    const content = [
        project.title,
        '',
        `Author: ${project.author}`,
        `Published on: ${project.publishedOn}`
    ];
    
    if (project.description) {
        content.push('', project.description);
    }
    
    content.push('', `Use "open /projects/${project.filename}" or "xdg-open /projects/${project.filename}" to open in browser`);
    
    fileSystem[`/projects/${project.filename}`] = {
        type: 'file',
        url: project.url,
        content: content.join('\n')
    };
});

// (rest of data.js continues unchanged)