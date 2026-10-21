name: NASA Software Assurance Pipeline

on:
  push:
      branches: [ main ]
        pull_request:
            branches: [ main ]

            jobs:
              software-assurance:
                  name: NPR 7150.2 Assurance & Security Gates
                      runs-on: ubuntu-latest

                          steps:
                                - name: Checkout Source
                                        uses: actions/checkout@v4

                                              - name: Install Assurance Tools (cppcheck, syft, trivy)
                                                      run: |
                                                                sudo apt-get update -qq
                                                                          sudo apt-get install -y cppcheck
                                                                                    curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sudo sh -s -- -b /usr/local/bin
                                                                                              curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin

                                                                                                    - name: Run NASA Security Pipeline
                                                                                                            run: |
                                                                                                                      chmod +x ./nasa_pipeline_runner.sh
                                                                                                                                ./nasa_pipeline_runner.sh

                                                                                                                                      - name: Upload CycloneDX SBOM Artifact
                                                                                                                                              if: always()
                                                                                                                                                      uses: actions/upload-artifact@v4
                                                                                                                                                              with:
                                                                                                                                                                        name: cyclonedx-sbom
                                                                                                                                                                                  path: sbom.json