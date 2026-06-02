# Changelog

## [0.1.0] - 2026-06-02

Initial draft. Seed coverage: US-IL (BIPA 740 ILCS 14 + 2024 SB 2979 amendment), US-CA (CCPA → CPRA → CPPA ADMT regulations), US-NY (S365A ATBP in-committee + NYC §22-1201 biometric ordinance).

Schema covers 15 retail AI decision types, 12 covered-actor types, 17 obligation kinds, 6 regulatory-vehicle types. Per-state ndjson streams with `lifecycle_state` transitions verified by `src/verify.mjs` against the legal state-machine.

Part of the Kinetic Gain Protocol Suite 11th vertical 6-pack (RetailTech / Consumer AI). Sibling repos: retail-decision-record-audit-stream, ftc-algorithmic-pricing-readiness-evidence-bundle, consumer-pricing-bias-coverage-lab, retail-ai-incident-card-profile, shopper-pii-vault-contract-profile.
