​OVERVIEW & GOVERNANCE​This policy defines the security and software assurance controls for flight andground support software. Software security practices adhere to NASA technicalstandards and guidelines, including:​NPR 7150.2: NASA Software Engineering Requirements​NASA-STD-8739.8: Software Assurance and Software Safety Standard​NASA-STD-8719.13: Software Safety Standard​Automated compliance is verified via local assurance scripts and continuousintegration pipelines.​REPORTING A VULNERABILITY​If you discover a potential security flaw, vulnerability, or unexpected codebehavior in this project, please follow the responsible disclosure process:​Do NOT open a public issue.​Send a detailed report to the designated Security & Mission Assurance team oremail: security@nasa.gov​Include the following details in your submission:​
Description of the issue and affected subsystem or component.​
Associated Common Weakness Enumeration (CWE) or threat vectors.​
Proof-of-concept (PoC) code or steps to reproduce the behavior.
​Potential impact on mission operation, flight telemetry, or ground system control.​VULNERABILITY REMEDIATION TIMELINES​CRITICAL (CVSS 9.0 - 10.0 or CISA KEV Listed): 72 Hours​HIGH (CVSS 7.0 - 8.9): 14 Calendar Days​MEDIUM (CVSS 4.0 - 6.9): 30 Calendar Days​LOW (CVSS 0.1 - 3.9): 90 Calendar Days​AUTOMATED SOFTWARE ASSURANCE CHECKS​The project enforces continuous security verification through the shell runner script(nasa_pipeline_runner.sh) and continuous integration pipelines.​STAGE 1: Static Application Security Testing (SAST) & CWE Auditing​Tooling: cppcheck / CodeQL​Focus Areas:​CWE-120: Unbounded buffer copy operations.​CWE-190: Integer overflow and wrap-around handling.​Enforcement: Code compilation and pull requests are blocked if static analysisreports critical errors.​STAGE 2: Software Bill of Materials (SBOM) & CVE Scanning​Tooling: syft, trivy​Format: CycloneDX JSON (sbom.json)
​Database Alignment: National Vulnerability Database (NVD) & CISA Known
Exploited Vulnerabilities (KEV) Catalog.
​Enforcement: Builds fail (exit code 1) upon detection of any unmitigated
CRITICAL or HIGH severity CVEs.
​STAGE 3: MITRE Space ATT&CK Threat Mitigations
​Telecommand Link Security: Verifies implementation of Space Data Link Security
(SDLS) protocol standards (CCSDS 355.0-B-1).
​Anti-Spoofing & Replay Protection: Audits cryptographic signature checks
(CCSDS_SDLS_Verify) and counter verification routines on incoming command streams.
​DEVELOPER VERIFICATION GUIDELINES
​Before submitting pull requests or merging changes to flight or ground releases,
developers must execute local security checks:
​chmod +x nasa_pipeline_runner.sh
./nasa_pipeline_runner.sh
​DEPENDENCY MANAGEMENT & SUPPLY CHAIN
​All external libraries, third-party COTS, and GOTS components must be cataloged
in the software bill of materials.
​Unsigned binary dependencies or unverified packages are strictly prohibited
in Class A, B, and C builds.
                       ┌─────────────────────────────────────────┐
                       │        NASA Software Assurance          │
                       └────────────────────┬────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│ Software Quality│  │Software Safety│               │Software Secure│   │ Software IV&V │
│  Assurance    │   │  & Hazard     │               │ Cybersecurity │   │ (Independent) │
│   (SQA)       │   │  Mitigation   │               │   Assurance   │   │ Program       │
└───────────────┘   └───────────────┘               └───────────────┘   └───────────────┘
