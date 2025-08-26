# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing the maintainer. Please do not open public issues for security vulnerabilities.

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Features

- File system access sandboxed to PROJECT_ROOT
- Environment variable based secret management
- Audit logging to append-only JSONL format
- Docker containers run as non-root
- Read-only root filesystem in containers

## Security Best Practices

- Keep dependencies updated
- Use environment variables for secrets
- Enable audit logging in production
- Run with minimal required permissions
- Regularly review access logs