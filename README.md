# state-retail-ai-disclosure-tracker

> **State Retail AI Disclosure Tracker v0.1 draft.** A per-state lifecycle ledger of US state attorney-general enforcement guidance, state privacy regulator rules (CA CPPA, CO DOJ, etc.), state biometric statutes (IL BIPA, NYC, WA, TX CUBI, NY S5687), state pricing-transparency / dark-patterns laws, and state legislative statutes applicable to consumer-facing retail AI. The Operator surface a retailer / marketplace / brand / ad-tech vendor queries to know **which state's retail AI obligations govern a personalized-pricing / recommendation / loyalty / biometric / fraud-screening decision on a given date**.

Part of the [Kinetic Gain Protocol Suite](https://suite.kineticgain.com).

> Status: v0.1 draft. Schema at [`schema/disclosure-event.schema.json`](./schema/disclosure-event.schema.json), per-state streams at [`states/`](./states/), Node verifier at [`src/verify.mjs`](./src/verify.mjs).

## Why this exists

Retail / consumer AI regulation lives at the intersection of: federal FTC enforcement (Section 5 + 2023 algorithmic-pricing guidance + Operation AI Comply 2024), state attorneys general, state privacy regulators (CA CPPA leading), state biometric statutes (BIPA the strongest, with $1k–$5k per-incident statutory damages), state pricing-transparency / dark-patterns laws, and the EU Omnibus Directive (2019/2161) Art 6a for any business operating in the EU. A multi-state retailer or marketplace operating in IL + CA + NY + TX + WA needs to know which state requires which AI obligation on which date. This tracker provides the per-state lifecycle ledger to answer that deterministically.

## Seed coverage (v0.1)

| State | Last lifecycle_state | Key citation |
| --- | --- | --- |
| US-IL | amended (2024) | BIPA 740 ILCS 14 + SB 2979 per-scan-stacking amendment |
| US-CA | effective (2026) | CCPA → CPRA → CPPA ADMT regulations (automated decisionmaking technology) |
| US-NY | in-comment-period (2024) + effective (2023) | NY S365A (ATBP, in comm) + NYC §22-1201 (biometric, effective) |

Each row is a JSON-line in [`states/US-XX.ndjson`](./states/) with one line per lifecycle event in the regulation's history.

## The shape

| Field | Purpose |
| --- | --- |
| `event_id`, `state`, `timestamp` | Per-event identity + when this lifecycle transition was observed |
| `lifecycle_state` | One of: proposed / in-comment-period / adopted-regulation / enacted-awaiting-effective / effective / amended / superseded / sunset / withdrawn |
| `regulatory_vehicle` | One of: state-legislative-statute / state-ag-enforcement-guidance / state-privacy-regulator-rulemaking / state-biometric-statute / state-consumer-protection-rule / state-pricing-transparency-statute |
| `citation` | Short label + long title + jurisdictional URI |
| `scope.covered_decisions` | Which retail AI decisions are covered (15 enums: dynamic-pricing / personalized-pricing / recommendation-ranking / loyalty-tier / biometric-id / etc.) |
| `scope.covered_actors` | Which retail business types are covered (12 enums: online-retailer / marketplace-operator / brick-and-mortar / ad-tech-vendor / data-broker / etc.) |
| `obligation_kinds` | 17 enums covering personalized-pricing disclosure / opt-out / annual bias audit / biometric consent + retention / dark patterns / data broker registration / etc. |
| `regulator` | Primary agency code (e.g. CA-CPPA, IL-AG, NYC-DCA) + name + URI |

## Compliance posture

RetailTech-readiness scaffolding for state retail / consumer AI obligations. The tracker organizes citations + obligations but does not by itself establish compliance with any state law. Per the standing public-language guardrail: *readiness · evidence · posture · controls · scaffolding* — never "CCPA-compliant" or "BIPA-attested" without an external attestation.

## Composes with

| Repo | Role |
| --- | --- |
| [`retail-decision-record-audit-stream`](https://github.com/mizcausevic-dev/retail-decision-record-audit-stream) | Sibling RetailTech audit-stream Operator |
| [`state-financial-ai-disclosure-tracker`](https://github.com/mizcausevic-dev/state-financial-ai-disclosure-tracker) | Sibling FinTech state-tracker |
| [`state-insurance-ai-disclosure-tracker`](https://github.com/mizcausevic-dev/state-insurance-ai-disclosure-tracker) | Sibling InsurTech state-tracker |
| [`state-employment-ai-disclosure-tracker`](https://github.com/mizcausevic-dev/state-employment-ai-disclosure-tracker) | Sibling HR Tech state-tracker |

## License

MIT — see [`LICENSE`](./LICENSE).
