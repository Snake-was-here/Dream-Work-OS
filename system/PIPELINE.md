# Live pipeline and identity

## Sheet contract

**OPPORTUNITIES:** One row per expressed need. Keep the supplied core fields plus Next Follow-up At, Canonical URL, Dedupe Key, Evidence, Activity, Positive Reply At, Call At, Paid Trial At and Accepted At. OPPORTUNITY IDs remain stable for all linked messages. Preserve headings and integration formulas; consult the integration README for exact field order and automation.

**MESSAGES:** One row per message, including drafts. Link each to a valid Opportunity ID. Core fields: Message ID, Opportunity ID, Timestamp, Direction, Message Type, Channel, From, To, Subject, Message, Status, Notes, Reply Outcome. Keep original message content; a substantial revision becomes a new draft with the old draft marked SUPERSEDED. A manually sent approved draft can be marked SENT with the actual send time.

**DASHBOARD:** Event-based counts and conversion rates, with denominators visible. First-event timestamps retain outcomes when current status changes. An opportunity with a reply counts once for sent→reply, not once per reply. These are pipeline counts, not causal proof that a tactic works; rates are immature while responses are pending. Paid Trial At means a confirmed paid trial, not a free test. Accepted At means confirmed accepted employment/paid work, not speculative interest.

## Decisions and states

My Decision: **UNREVIEWED, YES, MAYBE, NO**.

Status: **NEW, REVIEW, APPROVED, DRAFTED, SENT, REPLIED, NEEDS RESPONSE, FOLLOW-UP DUE, INTERVIEW / CALL, TRIAL / TEST, PAID TRIAL, NEGOTIATING, ACCEPTED, REJECTED, NO RESPONSE, CLOSED, DO NOT CONTACT**. Activity: **ACTIVE, UNCERTAIN, FILLED, EXPIRED**.

Normal transitions:
- NEW → REVIEW; human YES → APPROVED → DRAFTED.
- An actual send → SENT; inbound message → REPLIED, then NEEDS RESPONSE if action is required.
- Unanswered send after the configured interval → FOLLOW-UP DUE; actual follow-up is logged separately.
- Verified outcomes → INTERVIEW / CALL, TRIAL / TEST, PAID TRIAL, NEGOTIATING or ACCEPTED. A test is not a paid trial unless pay is confirmed.
- Human NO / filled vacancy → CLOSED; rejection → REJECTED; exhausted permitted follow-ups → NO RESPONSE.
- Any opt-out or contact prohibition → DO NOT CONTACT; no further outreach without explicit human resolution.

MAYBE remains REVIEW; NO blocks drafting/sending. A status never authorizes sending. Do not rewind a SENT/REPLIED opportunity to APPROVED because its YES decision is edited again.

## Timestamps and conversation history

Sent At uses a self-referencing IF/NOW formula designed to retain the first SENT time after later status changes. It remains a formula, not a literal static value. Iterative calculation must be enabled with maximum iterations 1. Clearing/replacing the formula, its retained value or row ID can reset the latch; preserve filled date cells on every update. Call At, Paid Trial At, Accepted At and actual message Timestamp use the same retention pattern. For historical events overwrite the appropriate formula cell with the actual known numeric date/time value; do not guess. Last Reply At and Positive Reply At derive from linked RECEIVED inbound message rows. Agents create IDs, validate directions/statuses and check links; no edit trigger or repair menu exists. Marking an opportunity SENT does not create a message row: log every actual message separately. Read the integration guide for formulas and current verification status.

## Deduplication

Canonicalize URLs: trim whitespace, normalize host, remove fragments and known tracking parameters, preserve vacancy/project identifiers and semantic query parameters. Compare exact canonical URL first. Also compare normalized company/person + title/problem + source and substantially matching descriptions to catch cross-posts. Distinct vacancies at one company remain distinct; reposts of the same need refresh the existing record. If ambiguous, flag for review before appending.

Use `tools/pipeline.cjs` conventions: stable UUID-based OP-/MSG- IDs and a deterministic canonical URL key, falling back to normalized company/title. Preserve IDs; the key updates if source identity changes. Do not independently renumber rows or invent another hashing algorithm. Dedupe Key is an identity aid, not the sole cross-post check. Re-read immediately before append and serialize writers; a shared sheet is not a transactional database. The local planner proposes inserts, narrow verification updates and ambiguous duplicates for review. It does not write to Google or send anything. Agents must prevent duplicates before appending, create stable IDs for manual rows, and validate message links before contact.

Existing row: update Last Verified, activity evidence, changed terms/contact route and next action while preserving Date Found, ID, decision, conversation history and event dates. Record a meaningful change in Notes. Do not delete a closed opportunity: keeping it prevents duplicate contact.

## Learning review

Weekly, inspect approvals/rejections and progression by source, problem, opportunity type and message approach. Note explicit rejection reasons and observed replies. Count messages accurately; distinguish opportunities from outreach attempts. With small samples, record hypotheses rather than confident claims. Propose one useful search/prioritization/outreach adjustment, log rationale and evidence in CHANGELOG.md, then compare later outcomes. Never change profile facts from conversion data.

