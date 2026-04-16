# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public issue for security vulnerabilities.**

Instead, please use one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   
   Go to [Security Advisories](https://github.com/LessUp/particle-fluid-sim/security/advisories) and click "Report a vulnerability".

2. **Email**
   
   Send details to the repository maintainer via GitHub's contact methods.

### What to Include

Please include:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)
- Your contact information for follow-up

### Response Timeline

| Action | Timeline |
|--------|----------|
| Initial response | Within 48 hours |
| Vulnerability confirmation | Within 7 days |
| Fix development | Depends on severity |
| Security advisory published | After fix is released |

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅ Active |
| 1.x     | ❌ End of life |

## Security Best Practices

When using this project:

- Always use the latest version
- Run in a secure browser environment
- Be cautious when modifying GPU-related code
- Review any third-party dependencies

## Known Security Considerations

### WebGPU

This project uses WebGPU, which has the following considerations:

- WebGPU is sandboxed by the browser
- GPU memory is isolated from other processes
- No direct file system access
- Network access is controlled by browser policies

### Dependencies

We use Dependabot to monitor dependencies for vulnerabilities. Security updates are applied promptly.
