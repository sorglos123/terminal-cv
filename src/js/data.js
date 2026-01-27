// ============================================================================
// Canonical CV Content (Single Source of Truth)
// ============================================================================
const cvContent = {
    about: `Sascha is an Enterprise Systems Engineer focusing on backup, virtualization and automation.`,
    experience: `11/2024 – Present
Enterprise Systems Engineer – Customer Success
Veeam Software Group, München
- Led Backup Configuration Review in Enterprise Environments
  (AHV, vSphere, Hyper-V, Proxmox, AWS, Azure)
- Security Hardening, Zoning (AD placement, Protocol Review)
- Solution Design for large-scale backup environments
- Driving product adoption to increase customer retention (99%+ renewal rate)
- Identified Cross- and Upsell opportunities (+5M $ TCV, +1M $ ARR)

10/2021 – 11/2024
Team Lead Backup & Storage – Dedalus IT Group
Dedalus HealthCare GmbH, Bonn
- Implementation & Operations Dedalus Private Cloud (170+ ESXi Hosts)
- Design & Operations Backup Infrastructure (5000+ VMs, 1PB+)
- Design & Operations Storage Infrastructure (PureStorage, NetApp, Dell ECS)
- Linux SME: Configuration Management (RHEL, Ubuntu, OEL, Rocky)

09/2018 – 10/2021
Systems Engineer – Datacenter Solutions
WBS IT-Service GmbH, Leipzig
- Infrastructure Operations: Virtualization, Backup, Storage
- Pre-Sales & Architecture of Backup Environments
- Automation: Powershell and Python

05/2016 – 08/2018
Consultant
mobileBlox GmbH, Leipzig
- Pre-Sales Product Presentations (CRM)
- On-site training and process optimization
- 2nd Level Support

02/2014 – 07/2014
Jr. Sales and Account Manager; Internship
Wize Commerce, Günstiger.de, Hamburg`,
    education: `10/2018 – 09/2021
Dual Study Program in Computer Science
Staatliche Studienakademie Leipzig
Final Grade: 1.8
Thesis: Planung einer Bereitstellung eines Enterprise Container
         Clusters auf Basis von VMware Tanzu
Degree: Bachelor of Science`,
    skills: `Virtualization & Cloud:
  vSphere, Proxmox, AWS, Azure, AHV

Automation & IaC:
  Linux (RHEL/Ubuntu), Saltstack, Ansible, Terraform, Packer
  Python, Bash, PowerShell

Containers:
  Docker, Kubernetes

Identity & Security:
  SAML, OIDC, Azure AD, Authentik

CSM Tools:
  Gainsight, Salesforce, ServiceNow

Certifications:
  VMCE & VMCA 2025
  AWS Certified Solutions Architect – Associate
  Commvault Certified Professional
  ITIL 4 Foundation`,
    contact: `Email:   sascha@srgls.de
GitHub:  https://github.com/sorglos123/`
};

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
        entries: ['about', 'assets', 'education', 'experience', 'skills', 'contact', 'projects']
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
        // removed 'whoami' here; only 'bio' remains as a file
        entries: ['bio']
    },
    '/about/bio': {
        type: 'file',
        virtual: true,
        content: derived.aboutBio
    },
    '/experience': {
        type: 'directory',
        entries: ['summary', 'highlights', 'full']
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
    '/education': {
        type: 'file',
        content: cvContent.education
    },
    '/skills': {
        type: 'file',
        content: cvContent.skills
    },
    '/contact': {
        type: 'file',
        virtual: true,
        content: cvContent.contact
    },
    '/projects': {
        type: 'directory',
        entries: ['dns-resilience-part1.md', 'dns-resilience-part2.md', 'veeam-backup-tagging.md']
    },
    '/projects/dns-resilience-part1.md': {
        type: 'file',
        url: 'https://community.veeam.com/automation-desk-103/making-dns-more-resilient-with-ansible-automated-etc-hosts-part-1-9635',
        content: 'Making DNS More Resilient with Ansible: Automated /etc/hosts - Part 1\n\nAuthor: Sascha Richter\nPublished on: Veeam Community\n\nUse "open /projects/dns-resilience-part1.md" or "xdg-open /projects/dns-resilience-part1.md" to open in browser'
    },
    '/projects/dns-resilience-part2.md': {
        type: 'file',
        url: 'https://community.veeam.com/automation-desk-103/making-dns-more-resilient-with-ansible-automated-etc-hosts-part-2-9653',
        content: 'Making DNS More Resilient with Ansible: Automated /etc/hosts - Part 2\n\nAuthor: Sascha Richter\nPublished on: Veeam Community\n\nUse "open /projects/dns-resilience-part2.md" or "xdg-open /projects/dns-resilience-part2.md" to open in browser'
    },
    '/projects/veeam-backup-tagging.md': {
        type: 'file',
        url: 'https://community.veeam.com/blogs-and-podcasts-57/automate-backup-tagging-with-veeam-one-a-smarter-way-to-organize-your-jobs-12048',
        content: 'Automate Backup Tagging with Veeam ONE: A Smarter Way to Organize Your Jobs\n\nAuthor: Sascha Richter\nPublished on: Veeam Community\n\nUse "open /projects/veeam-backup-tagging.md" or "xdg-open /projects/veeam-backup-tagging.md" to open in browser'
    }
};

// (rest of data.js continues unchanged)