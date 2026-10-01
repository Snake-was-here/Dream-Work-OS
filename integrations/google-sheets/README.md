# Google Sheets integration

Live workbook: https://docs.google.com/spreadsheets/d/1J_UqraPqJTLDcC0UDRz9Jb2F71aQ_DRo_m_JWA417CQ/edit

**GitHub is the agent entry point.** Agents read the repository, discover demand, match, deduplicate and update the workbook. The workbook records decisions, messages and outcomes. The owner explicitly requested spreadsheet formulas for timestamps; there is no Apps Script, bound project, edit trigger, repair menu or sending component. The optional daily Codex adapter is a scheduler; other agents can run the same repository workflow manually or through their own scheduler.

## Workbook contract

- **OPPORTUNITIES:** one expressed need per row, with stable ID, source evidence, match, decision, state, next action and event dates. Decision/status/activity dropdowns support human review.
- **MESSAGES:** one row per message, including drafts. Every row needs a unique Message ID and an existing Opportunity ID. Direction/status separate actual communications from drafts; Reply Outcome classifies received replies.
- **DASHBOARD:** outcome counts and conversions. Distinct opportunity conversion rates differ from total sent message count.
- **CONFIG:** defaults, preferences and current integration/verification state.

The primary scan hides IDs and some details to keep decisions/status visible; matching explanations are also available in title hover notes. Unhide details when needed. Read exact headers and current values before writes. Do not rename headers or overwrite dashboard formulas. Timestamp formulas use fixed column references; moving columns requires updating formulas and validating again.

## Retained timestamps

Enable **File → Settings → Calculation → Iterative calculation**, with **maximum iterations = 1**. Self-referencing IF/NOW formulas use the prior cell value to retain a captured event time. This is a retained formula result, not a literal static timestamp. Consult CONFIG and the completion report for current live test results. Formula source review alone does not establish stability.

Current OPPORTUNITIES mapping: A = Opportunity ID, I = Status, AA = Sent At, AB = Last Reply At, AH = Positive Reply At, AI = Call At, AJ = Paid Trial At, AK = Accepted At. MESSAGES: A = Message ID, B = Opportunity ID, C = Timestamp, D = Direction, K = Status, M = Reply Outcome. [formulas.json](formulas.json) is the formula manifest.

Sent At, row 2:

```text
=IF($A2="","",IF($I2="SENT",IF(OR(AA2="",AA2=0),NOW(),AA2),IF(OR(AA2="",AA2=0),"",AA2)))
```

Call At, Paid Trial At and Accepted At use the same self-reference pattern with AI/INTERVIEW / CALL, AJ/PAID TRIAL and AK/ACCEPTED respectively. PAID TRIAL requires confirmed payment; TRIAL / TEST does not imply it.

MESSAGES Timestamp, row 2:

```text
=IF($A2="","",IF(OR(AND($D2="OUTBOUND",$K2="SENT"),AND($D2="INBOUND",$K2="RECEIVED")),IF(OR(C2="",C2=0),NOW(),C2),IF(OR(C2="",C2=0),"",C2)))
```

DRAFT starts blank. The latch requires OUTBOUND/SENT or INBOUND/RECEIVED. Agents must validate the opportunity link; Integrity flags orphan links. Reply aggregation excludes invalid linked rows. With one calculation iteration, derived dates can update on the next recalculation after a newly latched message date; agents should re-read after calculation before reporting outcomes.

Last Reply At derives from MAXIFS over MESSAGES Timestamp where Opportunity ID matches, Direction = INBOUND and Status = RECEIVED, with a blank result when none exists. Positive Reply At uses those criteria plus Reply Outcome = POSITIVE. These are derived reply dates, not independently latched values. An acknowledgment is not automatically a positive reply.

Preserve filled timestamp cells when refreshing rows. Clearing or replacing a self-reference formula/retained value, deleting the row ID, or disabling iterative calculation can reset or break the date. Never bulk reapply event formulas over captured dates. Initial setup covers rows 2–1000 and fills only blank event cells; agents extending capacity must preserve all populated dates and adjust ranges. A SENT state records an actual send; it does not send anything or create a message row.

For historical events, overwrite the corresponding formula cell with the **actual known numeric date/time value**, using the sheet's date format. Do not write a guessed event time or a moving NOW() formula. Unknown event dates remain explicitly uncertain; import time is not proof of historical send time. Received imports should carry actual dates. Preserve historical literal values on later updates.

If a historical message's actual date is unknown, clear that row's Timestamp formula to a blank literal before setting RECEIVED/SENT, and write “Historical event date unknown; imported at [actual import time]” in Notes. Preserve that blank on later refreshes; do not reinsert the latch there. Date-based dashboard metrics exclude undated history until a real date is established. This prevents NOW from silently claiming a historical event happened at import time.

## IDs, deduplication and message links

Agents create stable UUID-based `OP-<UUID>` and `MSG-<UUID>` IDs. Manual spreadsheet editing does not automatically create IDs or merge duplicates. If the owner adds a row without an ID, an agent must allocate one before linked messages or timestamp formulas work correctly.

Hidden **Integrity** columns (OPPORTUNITIES AL and MESSAGES N) warn about missing/repeated IDs, duplicate source URL/company-title combinations, orphan message links and invalid direction/status combinations. These are formula warnings, not automatic repair or merging. Review warnings before contact.

Use [tools/pipeline.cjs](../../tools/pipeline.cjs) to plan deduplicated inserts/verification refreshes and validate opportunity/message relationships. It is a local, model-neutral planner; it does not write to Google or send anything.

```text
node tools/pipeline.cjs plan existing.json candidates.json
node tools/pipeline.cjs validate opportunities.json messages.json
```

JSON inputs are arrays of objects using exact sheet headers. Compare canonical URL, normalized company/title and source/description; ambiguous cross-posts need review. The planner protects human workflow/history by proposing narrow verification updates. Agents must still read live rows immediately before append, serialize writers and validate links. A shared spreadsheet is not transactional.

## Safe writes

1. Read headers, IDs, source keys, decisions, statuses, notes and retained dates/formulas.
2. Deduplicate and allocate IDs; validate every message against exactly one opportunity.
3. Append only new rows or update specific intended cells. Preserve decisions/history, validation and filled event dates.
4. Supply formulas for genuinely new rows beyond prepared capacity, adjusting references/ranges. Supply actual known historical numeric dates instead where appropriate.
5. Write imported user text as raw/text rather than executable formulas; only intended formula cells should execute.
6. Read back changed rows, calculated timestamps, integrity warnings and links. Report failures explicitly.

## Verification checklist

Use clearly marked temporary TEST rows and remove only those rows afterward:
- Dropdowns accept supported values and reject invalid values.
- New SENT captures a retained date; later recalculation and status changes preserve it.
- New DRAFT message is blank; SENT/RECEIVED captures once; historical numeric values remain unchanged.
- UUIDs are distinct/stable; repeated discovery plans update existing candidates instead of duplicating them.
- Orphan/repeated IDs and direction/status inconsistencies produce integrity warnings and are caught by agent validation.
- Inbound received messages update derived reply dates; positive classification and paid trials require evidence.
- Dashboard counts survive later state changes and use distinct-opportunity conversion denominators.

Record actual test results and remaining limits in CONFIG and the completion report; do not claim a test passed merely because its formula exists.
