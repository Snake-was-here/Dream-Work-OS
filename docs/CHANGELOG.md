# Changelog

## 2026-10-01 — V1 operating system
- Added model-neutral onboarding, demand discovery, verification, provisional matching, human approval, message history and follow-up rules.
- Created an honest initial profile from the owner's self-reported skills. CV and portfolio evidence remain explicitly incomplete.
- Defined the live sheet as operational history, with deterministic identity/deduplication and retained first-event timestamps.
- Defined dashboard conversions from recorded events and separate message rows, preserving outcomes as statuses change.
- Established learning from approvals and real outcomes without silently changing profile facts.

Future entries should record date, change, supporting observation, expected effect and later result. Label small-sample conclusions as hypotheses. Installation and test status belong in integration documentation; this entry does not claim external configuration or test results.

## 2026-10-01 — Owner-requested formula timestamps
- Replaced the proposed Apps Script approach with self-referencing IF/NOW timestamp formulas and iterative calculation (maximum iterations 1), as explicitly requested by the owner.
- Kept the repository as the primary agent entry point; agents create UUID IDs, validate links and deduplicate using the local planner. No script menu, edit trigger or automatic ID assignment is part of this design.
- Live formula tests verified first-SENT retention, draft/received dates, orphan/duplicate warnings, paid-trial retention and clean dashboard counts. Numeric >0 timestamp criteria prevent empty formulas from inflating metrics. All disposable test rows were removed.
- Independent onboarding review clarified full profile paths and unknown historical-date imports. Ambiguous same-title listings require review; generic descriptions across different employers are not merged.
- Documented retained formula dates versus literal date values, historical imports and latch-reset risks. Live stability must be verified in the actual sheet; source review alone is insufficient.
