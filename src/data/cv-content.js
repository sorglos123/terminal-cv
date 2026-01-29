// ============================================================================
// CV Content Configuration
// ============================================================================
// This file contains all customizable CV data for the terminal-based CV.
// Edit this file to personalize your CV with your own information.
//
// Guidelines:
// - Keep text concise and professional
// - Use consistent formatting for dates (MM/YYYY format recommended)
// - Preserve the structure of the cvContent object
// - For special characters, use proper escaping
// ============================================================================

const cvContent = {
    // Brief professional summary (1-2 sentences)
    about: `Sascha is an Enterprise Systems Engineer focusing on backup, virtualization and automation.`,

    // Work experience in reverse chronological order
    // Format: Date range, Position, Company, Location, Key achievements
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

    // Educational background
    education: `10/2018 – 09/2021
Dual Study Program in Computer Science
Staatliche Studienakademie Leipzig
Final Grade: 1.8
Thesis: Planung einer Bereitstellung eines Enterprise Container
         Clusters auf Basis von VMware Tanzu
Degree: Bachelor of Science`,

    // Technical skills organized by category
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

    // Contact information
    contact: `Email:   sascha@srgls.de
GitHub:  https://github.com/sorglos123/`
};

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cvContent };
}
