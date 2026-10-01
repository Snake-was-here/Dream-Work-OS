# Operations

GitHub contains the durable agent instructions and verified profile. Google Sheets holds the live opportunities and conversations. Any model can run the workflow with authenticated GitHub/web/Sheets tools; there is no model SDK or paid API dependency in this repository.

An optional Codex daily runner is configured for 10:00 Europe/Vilnius (automation ID `dream-work-daily-opportunity-discovery`, attached to the setup chat). It reads this repository, discovers at most five worthwhile opportunities, prepares drafts for YES rows and checks replies/follow-ups. It never sends. This scheduler is a replaceable runtime adapter, not the system's source of truth. A future Claude/Grok/ChatGPT runner should use the same AGENTS.md and sheet, with one writer at a time. Host availability, connected tools and account limits affect scheduled runs; the first scheduled run is not yet verified.

Agent launch prompt: “Read AGENTS.md in Snake-was-here/Dream-Work-OS. Run discovery, verification, matching and sheet updates. Then draft for YES rows and respond to linked inbound messages. Do not send anything. Report worthwhile changes and blockers.”

Manual SENT timestamps use retained self-referencing sheet formulas with iterative calculation enabled. Formula definitions are in `integrations/google-sheets/formulas.json`. There is no Apps Script requirement. Agents supply stable IDs, preserve formula results and enter actual known numeric dates for historical imports. The daily adapter must read the latest repository instructions on each run.

Original Sheet1 and its existing cell were preserved. Details/milestone columns are hidden in OPPORTUNITIES; unhide to inspect evidence and dates. All filters, validations and dashboard formulas currently cover rows 2–1000; expand before exceeding that capacity.

The profile is deliberately incomplete. To improve useful matching, the owner should add confirmed project links, personal contribution, actual technologies, availability, geographic/work eligibility and commercial preferences. Do not turn this request into assumed credentials.
