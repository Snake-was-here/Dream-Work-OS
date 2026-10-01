# V1 verification — 2026-10-01

Final implementation uses sheet formulas, as requested by the owner. No script was authorized or installed; script source and runtime tests were removed from the current repository.

Live sheet tests used disposable TEST rows, which were removed afterward:

- Decision dropdown displayed UNREVIEWED/YES/MAYBE/NO; YES accepted; INVALID rejected by Google validation.
- Status dropdown displayed all configured states including PAID TRIAL and DO NOT CONTACT.
- Manual SENT captured date serial 46296.63092096065. The identical numeric value survived subsequent reads, recalculation and a change to REPLIED.
- DRAFT message had no timestamp. OUTBOUND/SENT captured a timestamp. INBOUND/RECEIVED produced a timestamp and linked Last Reply At/Positive Reply At.
- An orphan message produced UNLINKED OPPORTUNITY and did not change an unrelated opportunity's reply date.
- Two matching test opportunities produced POSSIBLE DUPLICATE warnings.
- TRIAL / TEST left Paid Trial At blank; PAID TRIAL captured 46296.63350488426, which survived NEGOTIATING.
- Dashboard ignored empty timestamp formulas after using numeric >0 conditions. Final clean counts: 3 opportunities; 3 unreviewed; 0 sent, replied, called or paid. No messages were sent externally.
- Six dependency-free planner tests cover repeated discovery, tracking variants, stable IDs, batch deduplication, cross-source/ambiguous identity, semantic query IDs, distinct roles with the same title, generic briefs across employers and message linking.

The original 18-test GitHub run included the now-removed script implementation; the final repository should be judged against its current six tests and these live formula checks. The unused, uninstalled Google script project was moved to the recoverable bin.

Limits: formula retention is not a literal immutable timestamp. Clearing/replacing formula cells or IDs, disabling iterative calculation, or importing the workbook into another engine can lose retained values. Preserve populated dates. Derived reply metrics can need a subsequent recalculation when message timestamps latch. Dropdowns express workflow choices; human approval enforcement belongs to AGENTS.md and the executing agent. No daily runner should be assumed active; the owner currently plans manual discovery runs. The original three matches were created before the 2026-10-01 profile clarification and should be treated as test/provisional rows rather than current fit assessments.
