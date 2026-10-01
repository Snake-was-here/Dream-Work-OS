# Dream-Work-OS

A simple, model-neutral system for turning expressed demand into reviewed opportunities, honest outreach, conversations, and paid work.

**Find → verify → match → review → draft → human send → track → learn.**

The repository holds the operating rules and verified profile. The [Google Sheet](https://docs.google.com/spreadsheets/d/1J_UqraPqJTLDcC0UDRz9Jb2F71aQ_DRo_m_JWA417CQ/edit) holds the live pipeline and message history. Any agent with access can follow [AGENTS.md](AGENTS.md); no particular model, agent framework, or API subscription is required.

## Daily use

1. Ask an agent: “Read AGENTS.md, then find and verify a small batch of current opportunities. Deduplicate against the live sheet. Do not send anything.”
2. Review **OPPORTUNITIES**. Set **My Decision** to YES, MAYBE, or NO. The agent can explain uncertainties before you choose.
3. Ask: “Draft messages for my YES opportunities using verified profile facts and relevant proof. Save each draft in MESSAGES.”
4. Review the drafts. Explicitly authorize a particular message and recipient if you want an agent to send it, or send it yourself. A YES decision approves drafting only.
5. After an actual send, mark the message SENT and the opportunity SENT. Self-referencing IF/NOW formulas are designed to retain the first event time with iterative calculation enabled (maximum iterations 1). Agents create UUID IDs and validate message links; see the integration guide for historical dates and formula limits. Paste replies as separate INBOUND rows in MESSAGES.
6. Ask: “Review conversations and follow-ups, draft needed responses, and update next actions. Do not send.”

**DASHBOARD** shows progress and conversions. **CONFIG** documents settings and automation state. A scheduled discovery run is optional; its prompt and limits are in [SEARCH.md](system/SEARCH.md). A scheduler must be enabled before searches recur.

## Start with honest evidence

The initial profile contains the owner's self-reported skills, not verified employment or results. [CV.md](profile/CV.md) and [PORTFOLIO.md](profile/PORTFOLIO.md) intentionally contain no invented history. Add reviewed evidence to unlock stronger matching and outreach. Missing location, work eligibility, availability, and pay preferences remain visible unknowns; agents must not fill them by assumption.

## Operating references

- [Profile](profile/PROFILE.md), [skills](profile/SKILLS.md), [portfolio](profile/PORTFOLIO.md), [CV](profile/CV.md)
- [Search](system/SEARCH.md), [sources](system/SOURCES.md), [matching](system/MATCHING.md)
- [Pipeline](system/PIPELINE.md), [outreach](system/OUTREACH.md), [follow-ups](system/FOLLOWUPS.md)
- [Sheet integration and setup](integrations/google-sheets/README.md), [changelog](docs/CHANGELOG.md)

Keep the repository private unless the owner explicitly approves publication. Keep professional contact data and conversation contents in the operational sheet, not in commits. Neither drafts nor spreadsheet state changes send messages by themselves.

The repository is the primary agent entry point. There is no Apps Script component.

