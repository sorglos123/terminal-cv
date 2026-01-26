// ============================================================================
// Canonical CV Content (Single Source of Truth)
// ============================================================================

const cvContent = {
    experienceSummary: `Enterprise Systems Engineer – Customer Success at Veeam Software Group (since 11/2024)

Enterprise infrastructure specialist with 10+ years.
Designing and implementing backup, storage, and cloud solutions. 
Led teams in large-scale private cloud and backup environments.
Driving customer success, retention and growth. 
Virtualization, security hardening, infrastructure automation.
Solutions architecture across enterprise platforms.`,

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
- Automation Solutions: VMware Aria, Saltstack, Packer, Bitwarden, Vault

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
Degree: Bachelor of Science

08/2011 – 04/2016
International Business and Languages
Stenden University, Emmen, Niederlande
Thesis: Chemical Trade Facilitation; Vietnam and Germany
Degree: Bachelor of Commerce

06/2007 – 06/2010
Abitur
Gymnasium am Wall, Verden`,

    about: `Enterprise infrastructure specialist with 10+ years of experience
designing and implementing scalable backup, storage, and cloud solutions.
Passionate about automation, data protection, and driving customer success
through technical innovation and strategic architecture decisions.

Name:          Sascha Richter
Address:       Horsterstraße 55, 56656 Brohl-Lützing
Email:         sascha@srgls.de
Date of Birth: 24.02.1991
GitHub:        https://github.com/sorglos123/`,

    skills: `Storage & Data Protection:
  Pure Storage, NetApp (ONTAP), Dell ECS, iSCSI, NFS, S3
  Veeam, Commvault, Wazuh, Splunk

Virtualization & Cloud:
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
  ITIL 4 Foundation`
};

// ============================================================================
// Virtual File System
// ============================================================================

const fileSystem = {
    '/': {
        type: 'directory',
        entries: ['about', 'education', 'experience', 'skills', 'contact']
    },
    '/about': {
        type: 'directory',
        entries: ['bio']
    },
    '/about/bio': {
        type: 'file',
        virtual: true,
        content: cvContent.about
    },
    '/experience': {
        type: 'directory',
        entries: ['summary', 'highlights', 'full']
    },
    '/experience/summary': {
        type: 'file',
        virtual: true,
        content: cvContent.experienceSummary
    },
    '/experience/highlights': {
        type: 'file',
        virtual: true,
        content: cvContent.experience.split('\n').filter(l => l.includes('-')).join('\n')
    },
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
        content: `Email:   sascha@srgls.de
GitHub:  https://github.com/sorglos123/`
    }
};
