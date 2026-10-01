# Operations

GitHub contains the durable agent instructions and verified profile. Google Sheets holds the live opportunities and conversations. Any model can run the workflow with authenticated GitHub/web/Sheets tools; there is no model SDK or paid API dependency in this repository.

No scheduler is required or currently assumed active. The owner intends to launch discovery manually when wanted. A future ChatGPT/Claude/Grok/Codex scheduler may use the same AGENTS.md and sheet, discover a small batch, prepare drafts for YES rows and check replies/follow-ups, but it must never send without explicit authorization. Any scheduled runner is a replaceable runtime adapter, not the system's source of truth.

Agent launch prompt: “Read AGENTS.md in Snake-was-here/Dream-Work-OS. Run discovery, verification, matching and sheet updates. Then draft for YES rows and respond to linked inbound messages. Do not send anything. Report worthwhile changes and blockers.”

Manual SENT timestamps use retained self-referencing sheet formulas with iterative calculation enabled. Formula definitions are in `integrations/google-sheets/formulas.json`. There is no Apps Script requirement. Agents supply stable IDs, preserve formula results and enter actual known numeric dates for historical imports. The daily adapter must read the latest repository instructions on each run.

Original Sheet1 and its existing cell were preserved. Details/milestone columns are hidden in OPPORTUNITIES; unhide to inspect evidence and dates. All filters, validations and dashboard formulas currently cover rows 2–1000; expand before exceeding that capacity.

The profile now includes owner-confirmed current availability/mobility, no-manual-coding boundary, hands-on video experience, n8n use and clarified contribution to key projects. Remaining useful gaps are narrower: omitted overseas work history, military-service details, education completion, Klettur location/details, exact MEWP credential status, representative public video examples and future paid-client outcomes. Do not turn missing evidence into assumed credentials.
