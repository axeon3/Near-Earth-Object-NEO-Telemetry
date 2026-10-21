# Security Policy

## Overview & Governance
This policy defines the security and software assurance controls for flight and ground support software. Software security practices adhere to NASA technical standards and guidelines, including:

- **NPR 7150.2**: NASA Software Engineering Requirements
- **NASA-STD-8739.8**: Software Assurance and Software Safety Standard
- **NASA-STD-8719.13**: Software Safety Standard

Automated compliance is verified via local assurance scripts and continuous integration pipelines.

---

## Reporting a Vulnerability
If you discover a potential security flaw, vulnerability, or unexpected code behavior in this project, please follow the responsible disclosure process:

- **Do NOT open a public issue.**
- Send a detailed report to the designated Security & Mission Assurance team or email: `axe` *(or use GitHub Private Vulnerability Reporting)*.

Please include the following details in your submission:
1. Description of the issue and affected subsystem or component.
2. Associated Common Weakness Enumeration (CWE) or threat vectors.
3. Proof-of-concept (PoC) code or steps to reproduce the behavior.
4. Potential impact on mission operation, flight telemetry, or ground system control.

---

## Vulnerability Remediation Timelines

| Severity Level | CVSS Score / Criteria | Remediation SLA |
| :--- | :--- | :--- |
| **CRITICAL** | CVSS 9.0 – 10.0 or CISA KEV Listed | 72 Hours |
| **HIGH** | CVSS 7.0 – 8.9 | 14 Calendar Days |
| **MEDIUM** | CVSS 4.0 – 6.9 | 30 Calendar Days |
| **LOW** | CVSS 0.1 – 3.9 | 90 Calendar Days |

---

## Automated Software Assurance Checks
The project enforces continuous security verification through the shell runner script (`nasa_pipeline_runner.sh`) and CI/CD pipelines.

### STAGE 1: Static Application Security Testing (SAST) & CWE Auditing
* **Tooling**: `cppcheck` / `CodeQL`
* **Focus Areas**:
  * **CWE-120**: Unbounded buffer copy operations.
  * **CWE-190**: Integer overflow and wrap-around handling.
* **Enforcement**: Code compilation and pull requests are blocked if static analysis reports critical errors.

### STAGE 2: Software Bill of Materials (SBOM) & CVE Scanning
* **Tooling**: `syft`, `trivy`
* **Format**: CycloneDX JSON (`sbom.json`)
* **Database Alignment**: National Vulnerability Database (NVD) & CISA Known Exploited Vulnerabilities (KEV) Catalog.
* **Enforcement**: Builds fail (exit code 1) upon detection of any unmitigated **CRITICAL** or **HIGH** severity CVEs.

### STAGE 3: MITRE Space ATT&CK Threat Mitigations
* **Telecommand Link Security**: Verifies implementation of Space Data Link Security (SDLS) protocol standards (CCSDS 355.0-B-1).
* **Anti-Spoofing & Replay Protection**: Audits cryptographic signature checks (`CCSDS_SDLS_Verify`) and counter verification routines on incoming command streams.

---

## Developer Verification Guidelines
Before submitting pull requests or merging changes to flight or ground releases, developers must execute local security checks:

```bash
chmod +x nasa_pipeline_runner.sh
./nasa_pipeline_runner.sh
```
