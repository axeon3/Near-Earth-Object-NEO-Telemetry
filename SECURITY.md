# Security Policy

## Supported Versions

Only the latest release on the primary branch is actively monitored and supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Team Axe takes the security and integrity of our open-source software seriously. If you discover a vulnerability or security risk, please report it responsibly following these guidelines:

1. **Private Reporting:** Do NOT open a public GitHub issue for security vulnerabilities. Instead, submit a **Private Vulnerability Report** directly through the repository’s **Security** tab using GitHub Private Security Advisories, or email the team lead at **axeonetwothree@gmail.com**.
2. **Details to Include:**
   - A descriptive summary of the potential vulnerability.
   - Step-by-step instructions or proof-of-concept (PoC) code to reproduce the issue.
   - Impact assessment (e.g., exposed data, vector of attack).
3. **Response Window:** You will receive an initial acknowledgment within **48 hours**. We aim to validate and resolve confirmed reports within **7 to 14 days**.

## Security Guidelines & Secure Coding Standards

All contributions to this repository must strictly adhere to the following security principles:

* **CWE Top 25 Standards:** All code inputs must be sanitized, strictly typed, and validated against common vulnerabilities (e.g., injection, deserialization, path traversal).
* **Zero Secret Policy:** Hardcoded credentials, API keys, tokens, or private keys are strictly forbidden. All automated pull requests must pass secret scanning pre-commit hooks before being merged.
* **Threat Mitigation:** Code structure and dependencies are regularly audited against the MITRE ATT&CK framework to ensure defense-in-depth against software supply chain risks.
* **Licensing Compliance:** All submitted contributions must remain compliant with the Apache License 2.0.
