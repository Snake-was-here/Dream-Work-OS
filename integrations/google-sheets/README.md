# Google Sheets integration

Live workbook: https://docs.google.com/spreadsheets/d/1J_UqraPqJTLDcC0UDRz9Jb2F71aQ_DRo_m_JWA417CQ/edit

The workbook is the operational interface; repository files define the rules. A bound Apps Script, [Code.gs](Code.gs), supports manual editing. It does not send messages, email, proposals or applications, and does not discover opportunities by itself.

## Workbook contract

Read headers and current values before any write. OPPORTUNITIES puts decision fields first for scanning; the script resolves fields by exact header name, not column position. Do not rename headers or replace DASHBOARD formulas.

- **OPPORTUNITIES:** stable IDs, demand evidence, matching, human decisions, current state, next action and event dates. My Decision and Status are dropdowns. Activity distinguishes ACTIVE, UNCERTAIN, FILLED and EXPIRED.
- **MESSAGES:** one row per linked message. Direction is OUTBOUND or INBOUND. DRAFT/SENT/RECEIVED/SUPERSEDED/FAILED message statuses distinguish text preparation from actual communication. Reply Outcome records actual reply classification.
- **DASHBOARD:** operational counts and conversions; distinct opportunity conversions differ from total sent message count.
- **CONFIG:** preferences, search/follow-up settings and integration/automation state. Do not assume a configured value has been owner-confirmed when it is labeled a default.

Consult the actual workbook validations for supported message enums. Important opportunity statuses include PAID TRIAL separately from TRIAL / TEST; only the former records Paid Trial At.

## Manual edit behavior

When the bound script is installed:
- Editing a populated row creates a missing `OP-<UUID>` or `MSG-<UUID>` ID. Existing IDs remain unchanged.
- Changing opportunity Status to SENT fills empty Sent At with a **static** timestamp. Re-editing/recalculating does not replace it.
- INTERVIEW / CALL, PAID TRIAL and ACCEPTED fill their first milestone timestamps only when blank.
- OUTBOUND + SENT fills a blank message Timestamp and the linked opportunity's first Sent At.
- INBOUND + RECEIVED fills a blank message Timestamp, updates Last Reply At, records a first Positive Reply At when Reply Outcome is POSITIVE, and queues NEEDS RESPONSE where appropriate. Review whether an automatic receipt actually needs a response.
- Drafts cannot create send/reply milestones. Duplicate and missing/ambiguous message-link warnings appear in Notes without deleting user notes.

Dates inserted at edit time mean the state was recorded now. For a historical message, provide its real known timestamp before marking it sent/received. If unknown, label the uncertainty rather than treating an import time as proven event time.

## Connector/API agents

Google's simple onEdit trigger does **not** run for connector/API writes. Agents must write stable unique IDs and actual known event timestamps explicitly, or run the workbook's **Dream Work OS → Reconcile IDs, links and timestamps** menu after imports. Menu reconciliation may require Google permission the first time; manual onEdit does not need a sending permission.

Reconcile creates missing IDs/keys and validates relationships. It preserves provided timestamps; missing historical communication/milestone dates become reconciliation time with a visible note to verify them. Do not use that fallback as evidence of when a historical event occurred. Supply dates before reconciliation whenever known.

API append procedure:
1. Read the relevant headers, existing IDs, canonical URLs, decisions and notes.
2. Canonicalize and compare URL/company/title/source/description using PIPELINE.md and Code.gs conventions. Review cross-posts, not just exact keys.
3. Re-read immediately before append. Use one writer at a time; Apps Script's document lock does not lock independent API agents.
4. Append a unique ID (`OP-` or `MSG-` plus UUID), preserving all existing rows. For messages require exactly one matching Opportunity ID.
5. Write only intended ranges, explicit event times and new data; preserve formulas/validation. Read back changed rows to confirm.

Treat user text starting with `=` as text during imports rather than executable formulas. Use a raw/text write option for imported message contents and contact descriptions; only intended dashboard formulas should execute.

## Deduplication limits

The script computes canonical URLs and keys, then warns about matching URLs, normalized company/title, source/description and repeated IDs. It does not automatically merge or prevent an API append. This deliberately preserves human work; repeated-run safety requires the agent's pre-append check. Resolve warnings before contacting someone. Near-matching descriptions and different cross-post titles require judgment.

## Installation and verification

Open the workbook's Extensions → Apps Script, replace the bound project source with Code.gs, and save. Return to/reload the workbook for the menu. The simple onEdit hook handles manual edits; a separate installed edit trigger is unnecessary and can cause duplicate processing.

If Google's bound-project launch fails, the same source can run as a standalone project. Run `installForSpreadsheet` once to create its sheet-specific edit trigger. Google permission is required; do not install both versions. Standalone reconciliation runs from its editor, without a sheet menu. The installer preserves unrelated triggers and is safe to repeat.

**GitHub is the agent entry point.** Apps Script only reacts to human sheet edits and records IDs, dates and linking warnings. It does not search or run an AI model. An agent with GitHub, web and Sheets access performs discovery and drafting independently of this helper.

## Portable write planner

The dependency-free `tools/pipeline.cjs` uses the exact canonicalization functions from Code.gs. Export existing/candidate records as arrays of objects with sheet header keys, then run `node tools/pipeline.cjs plan existing.json candidates.json`. It produces new rows, verification-only updates and ambiguous duplicates for review; it makes no external writes. Re-read the live sheet immediately before applying the plan. `node tools/pipeline.cjs validate opportunities.json messages.json` checks IDs and message links. `npm test` runs the runtime and planner tests. Keep exports outside Git or in ignored `data/`.

Installation is complete only after a real sheet edit confirms the hook executes. Check CONFIG and the completion report for current installation status; the presence of this source file alone does not prove deployment.

Use temporary clearly marked TEST rows to verify:
1. Decision/status dropdowns accept listed values and reject invalid ones.
2. Manual SENT writes a date once and preserves it on later edits.
3. New rows receive distinct stable IDs; duplicate URLs/identities produce warnings.
4. Linked sent/received messages update the correct opportunity; nonexistent/repeated IDs warn instead of updating another opportunity.
5. DRAFT messages do not create sent/reply milestones; paid trial is distinct from an unpaid test.
6. Dashboard event counts survive later status changes; conversion denominators are distinct opportunities, not message count.

Remove only the explicitly created TEST rows afterward. Preserve real rows and formulas. Record test evidence separately; do not claim a live timestamp test passed from static source review alone.
