# Portfolio / project evidence

Status: EVIDENCE-REVIEWED KNOWLEDGE BASE. Repository update authorized by owner on 2026-10-01. Source-reported claims, unresolved differences and approval boundaries remain explicitly labelled.

## Evidence policy and sources

Public page descriptions are owner-published claims. Viewed artifacts establish what is visible; source code establishes implementation, not a successful run. Historical test records are documentary evidence, not tests rerun in this audit. Owner confirmation establishes personal direction, not independent mastery of every underlying technology.

- **E001 — Current brief:** owner's skill descriptions, including approximately 100 manually edited videos and independent learning. SELF-REPORTED, 2026-10-01.
- **E002 — Attribution confirmation:** owner explicitly states he originated all ideas and personally directed the agents, working as solo founder, for DoneListing, Hermes, Video Editor Agent, Marketing OS, Trading-OS and Jev Neo. OWNER-CONFIRMED, 2026-10-01. Does not confirm payments, adoption or hand-written code.
- **E003 — English CV supplied by owner:** `C:\Users\endle\Desktop\Document - CV.pdf`, one page, extracted and visually inspected 2026-10-01. Matches the earlier rendered CV image. DOCUMENT-REPORTED employment/background; owner supplying it supports using it as a source, not independent employer/certificate verification.
- **E004 — Video direction:** owner's reviewed conversation “Patobulinti vaizdo filtrą” (chat ID `01a0ecfc-fc7d-7470-8e7a-a3e0159b6b86`, 2026-09-29/30): supplies references and explicit colour/skin/audio/geometry criteria, requires iterative comparison, then next-agent documentation. Evidence of personal creative and operational direction.
- **E005 — Opportunity system direction:** reviewed conversation “Build opportunity outreach system” (chat ID `01a0f74a-b7c9-74c3-87ca-2c9a69247e26`, 2026-10-01): owner defines problem and workflow, challenges unnecessary Apps Script, specifies a simpler sheet formula. Evidence of personal requirements and scope/architecture judgment.
- **E006 — Public website audit:** all 13 discoverable linked pages listed below, selected image artifacts visually inspected, and DoneListing landing/create interface viewed. No accounts, payment, generation or publishing actions performed.
- **E007 — Implementation audit:** read-only local code/docs and connected GitHub inspection. Source links below may be private. No tests rerun, services started or APIs paid for. Successful workflow metadata for the specified Marketing-OS runs was read live; business state records were not refreshed.

- **E008 — Lithuanian CV supplied by owner:** `C:\Users\endle\Desktop\pijus-kuktoras.pdf`, two pages, extracted and visually inspected 2026-10-01. Matches employment dates in E003; adds Canva, Midjourney, Shopify/Etsy/Gumroad administration, website builders, n8n basics, Meta Ads basics, photography and 50+ video experience. All are DOCUMENT-REPORTED self-assessment. Military-service wording, driving tenure, English proficiency and editing count differ; see CV.md conflict record.

Public links supplied on the portfolio can be used as evidence after factual approval. Private repositories, local files and chat records are INTERNAL ONLY: do not send them to employers or clients without explicit permission. Use public case-study links and narrow summaries instead.

## Project index

| ID | Project | Best retrieval use | Evidence boundary |
|---|---|---|---|
| P001 | DoneListing | AI web product; image-to-structured output; quota/billing workflow | Deployed UI plus source/historical controlled tests; live commercial results unknown |
| P002 | Hermes System | Specialized agent roles; shared context; routing | Configuration/scripts; whole chain not tested |
| P003 | Video Editor Agent / vidtool | Media workflow; visual criteria; repeatable QA | Local render and reports; general/client acceptance unproven |
| P004 | Marketing-OS | Durable agent operations; research/experiments; content workflows | Implemented utilities and historical private-draft batch; growth unproven |
| P005 | Marketing-OS multi-channel batch | Creative adaptation and delivery integration | 15 private drafts documented; no campaign effectiveness |
| P006 | focusup / focusOnPosters / artwork411 | Product mockups; Etsy/POD presentation | Viewed historical designs/listings; authorship details pending |
| P007 | Gumroad templates and Notion Student OS | Structured digital products; workspace/layout | Viewed product artifacts; performance/usage unproven |
| P008 | Manual content / thumbnails / graphic resources | Editing, photography, templates | Artifacts and self-report; representative finished video needed |
| P009 | Trading-OS | Research provenance; API/CLI automation; paper experiments | Source plus dated live-session record; no trading profitability |
| P010 | Jev Neo | Voice UX; open-source adaptation; safety/cancellation | Source/build/tests; inspected live-agent task failed without key |
| P011 | Dream-Work-OS | Lightweight agent workflow; operational tracking | Brief/implementation/historical checks; paid work outcome unknown |
| P012 | n8n discovery experiment | Product-mention research automation | Website-reported workflow; implementation not inspected |
| P013 | Personal websites | Multi-page portfolio; deployment; information architecture | Current website publicly viewed; earlier integration self-report |
| P014 | Voice/content and video prototypes | Unfamiliar-tool exploration | Mixed code, narrative and failed/inconsistent experiments |
| P015 | Ripple_Rate | Scheduled data/content experiment | Website narrative; operational claims not independently tested |
| P016 | Vinted resale | Photography; merchandising; small-scale commerce | Historical account/listing screenshot; profits self-report |

## P001 — DoneListing
- **Problem:** Help Etsy sellers turn a product photo and limited context into a usable listing draft.
- **What I built:** AI-assisted web product with image/context input, structured title/description/bullets/tags/keywords output, authentication, subscription/quota and billing code.
- **My role:** Owner-confirmed solo founder, idea originator and sole director of AI agents. Source checkpoints support deliberate interface iteration; independent hand-coding contribution UNKNOWN.
- **How I approached it:** Directed a bounded user flow; implementation uses response schemas and semantic checks, controlled repair, quota reservation/release, signed billing events and duplicate-event protection.
- **Technologies/tools:** Next.js, React, TypeScript, Tailwind, Framer Motion, Clerk, Stripe, Neon PostgreSQL, OpenRouter, Vitest, Vercel, GitHub Actions. These are inspected product dependencies, not proof of equal personal proficiency in every tool.
- **AI/agent involvement:** Agents implement product code; model generation converts image/context to structured listing text.
- **Result:** Live landing and studio interface viewed. Historical record documents founder Free generation/quota checks and controlled Preview billing/sandbox generation. Current model quality, live payment behavior, customers and revenue UNKNOWN. No promotional lift/time-saving claim accepted as a measured outcome.
- **Evidence/link:** Public [case study](https://pijus.xyz/donelisting), [product](https://www.donelisting.com), [studio](https://www.donelisting.com/create). Internal [architecture](https://github.com/Snake-was-here/listcraft-ai/blob/main/ARCHITECTURE_AND_OPERATIONS.md), [generation route](https://github.com/Snake-was-here/listcraft-ai/blob/main/app/api/generate/route.ts), [controlled test record](https://github.com/Snake-was-here/listcraft-ai/blob/main/current_and_future_testing.md), [UI checkpoint](https://github.com/Snake-was-here/listcraft-ai/blob/main/memory/checkpoint-ui-overhaul-2026-06-14.md).
- **Skills demonstrated:** S001–S005, S012, S015. Confidence: strong artifact/role evidence, commercial result unproven.

## P002 — Hermes System
- **Problem:** Coordinate specialist agents without repeatedly reconstructing context or leaving quality/final decisions implicit.
- **What I built:** Configured system repository with lead plus ten specialist role profiles, shared instructions/scripts, routing and state conventions, and a media/content workflow.
- **My role:** Owner-confirmed idea originator and solo director; architecture explicitly names Pijus as owner. Underlying Hermes Agent framework and bundled third-party skills are reused, not authored by him.
- **How I approached it:** Separate strategist/orchestrator/builder/archive/content/visual/distribution/research/analytics/QA roles; route tasks, preserve shared context and define escalation/review points.
- **Technologies/tools:** Hermes Agent framework, Markdown role/skill instructions, YAML configuration, Python and SQLite tooling.
- **AI/agent involvement:** Multiple configured specialist agents; orchestration is the work product itself.
- **Result:** Role/configuration and script artifacts inspected. Site explicitly reports that components worked but the entire pipeline was not tested end-to-end. Continuous operation of all agents and reliable autonomous delivery UNKNOWN.
- **Evidence/link:** Public [case study](https://pijus.xyz/hermes). Internal [README](https://github.com/Snake-was-here/hermes-system/blob/main/README.md), [architecture](https://github.com/Snake-was-here/hermes-system/blob/main/docs/SYSTEM_ARCHITECTURE.md), [Atlas role](https://github.com/Snake-was-here/hermes-system/blob/main/agents/atlas/SOUL.md), [database wrapper](https://github.com/Snake-was-here/hermes-system/blob/main/scripts/agency_db.py).
- **Skills demonstrated:** S001–S004, S015. Confidence: orchestration design/configuration proven; complete execution not proven.

## P003 — Video Editor Agent / vidtool
- **Problem:** Produce repeatable local edits from footage while retaining editorial control, natural colour and usable media output.
- **What I built:** Agent-assisted Python/FFmpeg pipeline for ingest, analysis, transcript/edit decisions, versioned plans, clips/captions, rendering and QA; local colour/audio improvements.
- **My role:** Owner-confirmed solo originator/director. E004 directly demonstrates supplying reference clips, precise acceptance requirements, iteration and next-agent handoff requirements. AI authors implement code; do not describe all source as personally hand-written.
- **How I approached it:** Separate creative decisions from deterministic validation/rendering; preserve earlier plans; require preview/final comparison and output measurements. Specify colourful images, natural skin, true blacks with detail, subtle grain/vignette and source-aware geometry/lighting.
- **Technologies/tools:** Python, FFmpeg/FFprobe, Click, NumPy, Pillow/OpenCV, scene detection, Whisper/faster-whisper/Parakeet components, OCR and optional Ollama vision support.
- **AI/agent involvement:** Transcript and hook decisions, coding/refinement, optional visual analysis; deterministic code executes approved plans.
- **Result:** Actual local 15-second MP4 and saved QA pass inspected; report records 1080×720, −17.93 LUFS and −1.44 dBTP. Documentation records 81 tests plus 14 subtests passed on 2026-09-29, not rerun here. No universal look quality, client delivery or professional listening acceptance established.
- **Evidence/link:** Public [case study](https://pijus.xyz/video-editor). Internal [repository](https://github.com/Snake-was-here/video-editor-agent), `src/vidtool/adaptive_look.py`, `src/vidtool/hooks.py`, `LOOK_WORKFLOW.md`, relevant test files; local `work/filter-review/final_review/reports/qa_report.json`; E004. Inspected local revision `34d3d15` plus working-tree artifacts; remote parity not assumed.
- **Skills demonstrated:** S001–S004, S006, S010, S015. Does not independently verify manual-video count in S007.

## P004 — Marketing-OS
- **Problem:** Give replaceable agents enough durable context to work on DoneListing marketing and reduce repetitive founder operations.
- **What I built:** Repository of product/claim records, strategy, research, experiments, content manifests, CRM/policy states, handoffs, reusable agent skills and integration/validation utilities.
- **My role:** Owner-confirmed solo founder/director. Reviewed founder directive records goals, budget, source hierarchy, boundaries and exception-based involvement.
- **How I approached it:** Research → bottleneck → falsifiable experiment → action → measurement → learning. Separate agent judgment from deterministic utilities and draft completion from business results.
- **Technologies/tools:** Python, JSON/schema/manifests, GitHub Actions, Buffer API, Cloudflare R2/Worker JavaScript, read-only X API discovery and Google Sheets operational contracts. PostHog tooling exists but analytics deployment is deferred.
- **AI/agent involvement:** Agents research, plan, generate assets, evaluate and preserve context; coded tools validate/integrate workflows.
- **Result:** Implementation and experiment records exist; P005 is a concrete production-preparation example. State record dated 2026-09-27 reports zero verified customers/MRR at its checkpoint. Not refreshed live; growth, conversion and revenue success remain unproven.
- **Evidence/link:** Public [case study](https://pijus.xyz/marketing-os). Internal [README](https://github.com/Snake-was-here/Marketing-OS/blob/main/README.md), [founder directive](https://github.com/Snake-was-here/Marketing-OS/blob/main/strategy/founder-directive.md), [state record](https://github.com/Snake-was-here/Marketing-OS/blob/main/operations/NOW.md), [Buffer batch tool](https://github.com/Snake-was-here/Marketing-OS/blob/main/scripts/buffer_batch.py).
- **Skills demonstrated:** S001–S006, S010, S015. Do not substitute “marketing system built” for “marketing works.”

## P005 — Multi-channel visual batch (Marketing-OS subproject)
- **Problem:** Adapt one set of product concepts into native assets for several social channels while keeping delivery inspectable.
- **What I built:** Five visual concepts adapted into 15 channel variants, media/manifest records and private-draft delivery workflow.
- **My role:** Part of the owner-confirmed Marketing-OS agent-direction role. Which individual creative choices Pijus made in this batch is UNKNOWN.
- **How I approached it:** Generate/adapt assets, validate counts/hashes and deliver through recorded workflows; defer public exposure until review.
- **Technologies/tools:** Agent image/content tools, Python, GitHub Actions, Cloudflare R2, Buffer; X/Instagram/Pinterest formats.
- **AI/agent involvement:** Creative generation and adaptation plus tool-driven delivery.
- **Result:** Historical experiment records exact hash verification and 15 unique private unscheduled Buffer drafts. Both linked workflow runs were independently read as completed/success in this audit. Current Buffer contents, native preview, publication, reach and conversions UNKNOWN.
- **Evidence/link:** Internal [result](https://github.com/Snake-was-here/Marketing-OS/blob/main/experiments/EXP-20260927-003-image-backed-style-study/result.md), [R2 workflow](https://github.com/Snake-was-here/Marketing-OS/actions/runs/36326655247), [Buffer workflow](https://github.com/Snake-was-here/Marketing-OS/actions/runs/36326793631).
- **Skills demonstrated:** S002–S004, S006, S008. Evidence of preparation/delivery integration, not successful campaigns.

## P006 — Print-on-demand shops: focusup, focusOnPosters, artwork411
- **Problem:** Turn artwork into understandable, purchasable physical/digital products.
- **What I built:** Portfolio documents shop/catalogue experiments, mug/clothing mockups, poster/framed-art listings, size/shipping/print explanation panels and product variants.
- **My role:** Owner-published project account; precise personal layout/template/AI contribution awaiting confirmation. Site says hired help for some search-oriented titles/descriptions; do not attribute all copy solely to Pijus.
- **How I approached it:** Select/adapt artwork, create product variants and present them through mockups/information graphics; iterate themes and presentation.
- **Technologies/tools:** Etsy/POD workflows; AI-generated artwork; PNG/SVG/PDF offerings described. Canva/Midjourney and Shopify/Etsy/Gumroad experience reported in E008; exact per-product tool attribution and fulfillment provider UNKNOWN.
- **AI/agent involvement:** AI artwork explicitly described; do not imply hand-drawn original illustrations.
- **Result:** Actual historical visual/listing artifacts viewed. Catalogue totals and product counts are site-reported; current availability, revenue/profit and customer outcomes not established.
- **Evidence/link:** [Shop history](https://pijus.xyz/lore-shops), [mug collage](https://pijus.xyz/images/focusup-1.webp), [poster listings/panel](https://pijus.xyz/images/etsy-focusonposters.webp), [framed posters/size chart](https://pijus.xyz/images/artwork%20411.webp).
- **Skills demonstrated:** S005, S006, S008, S009; visual artifacts inspected, detailed authorship pending.

## P007 — Gumroad resources / Notion Student OS
- **Problem:** Package useful workspaces, text resources and design templates as understandable digital products.
- **What I built:** Portfolio artifacts show Notion Student OS with task/week/Pomodoro views, B2B email templates/follow-ups and customization guide, CV and YouTube banner templates, and wallpapers.
- **My role:** Owner-published product history; exact manual/AI/template contribution pending confirmation.
- **How I approached it:** Structure information for reuse, create product previews and describe audience/use cases.
- **Technologies/tools:** Gumroad, Notion; Canva-editable CV product shown. E008 reports personal Canva and Gumroad use; exact tool depth and per-product workflow UNKNOWN.
- **AI/agent involvement:** Not fully documented for each resource; UNKNOWN rather than assumed.
- **Result:** Finished product packaging/listing screenshots inspected. Student OS screenshot shows one sale and one rating historically, not a current dashboard/account verification. No proven effectiveness of email templates or workspace outcomes.
- **Evidence/link:** [History](https://pijus.xyz/lore-shops), [Student OS](https://pijus.xyz/images/gumroad.webp), [B2B email resource](https://pijus.xyz/images/gumroad%20(2).webp), [design resources](https://pijus.xyz/images/gumroad%20(3).webp).
- **Skills demonstrated:** S005, S008, S009; structured product packaging. Copy effectiveness and client outcomes unproven.

## P008 — Manual content, photography, thumbnails and graphics
- **Problem:** Create and present content for personal channels and digital product offers.
- **What I built:** Owner reports filmed/edited videos, thumbnails, posts and social content; site documents gaming recording, personal on-camera content, photography, AI mini-movies and TikTok/sketch experiments. Graphic resources include banners/CV templates.
- **My role:** Manual editing count and filming/creative capabilities self-reported; representative original videos and edit breakdown requested. Listed Fiverr offers do not establish completed paid engagements.
- **How I approached it:** Repeated creation/publishing experiments and visual iteration; exact historical workflow varies and is incompletely recorded.
- **Technologies/tools:** Canva and Midjourney named by site; DSLR in resale narrative; manual editor/camera models UNKNOWN.
- **AI/agent involvement:** Mixed manual and AI workflows. Keep manual editing separate from P003 automation.
- **Result:** Selected graphics and historical account/content screenshots exist; approximately 100 edited videos is self-report. Growth, reach, professional client work and commercial results UNKNOWN.
- **Evidence/link:** [Social history](https://pijus.xyz/lore-social), [services](https://pijus.xyz/together), [numbers](https://pijus.xyz/numbers), E001; design artifacts in P006/P007.
- **Skills demonstrated:** S006–S009. Manual video quality/volume remain less well evidenced than product-layout artifacts.

## P009 — Trading-OS
- **Problem:** Investigate prospective market signals without confusing hindsight, data outages or simulated prices with actual execution.
- **What I built:** Read-only GMGN integration, discovery/filtering, SQLite event journal, point-in-time evidence, versioned hypotheses, paper positions/risk/exit policies, reports and local dashboard.
- **My role:** Owner-confirmed idea originator and sole AI-agent director; hand-written code share UNKNOWN.
- **How I approached it:** Reuse providers, respect free-tier request budgets, preserve raw/rejected/unknown observations, distinguish data gaps from no-fill, compare frozen policies on observed marks.
- **Technologies/tools:** Node.js/JavaScript ESM, built-in SQLite, GMGN CLI, local HTTP dashboard, HTML/CSS/browser JavaScript and Node tests. Optional shadow adapters are not evidence of live usage.
- **AI/agent involvement:** AI-assisted research, implementation and operational debugging; core collection and paper journal are deterministic tooling.
- **Result:** Source and dated Windows session record inspected; record reports real provider data and paper positions. Not run in this audit. No proven profitability, executable fills, real orders, fund management or customers.
- **Evidence/link:** Internal [repository](https://github.com/Snake-was-here/Trading-OS), `STATE.md`, `docs/ARCHITECTURE.md`, `docs/RESEARCH.md`, `src/store.mjs`, adapter/core/paper/policy/server tests. Inspected local revision `6f6e3b2`.
- **Skills demonstrated:** S001–S004, S010, S012, S015. Match to research/data/automation problems, not financial expertise.

## P010 — Jev Neo
- **Problem:** Use Lithuanian speech to control a real Chromium profile with clear feedback and bounded action safety.
- **What I built:** Adapted browser extension with persistent voice panel, interim transcripts, confidence gates, utterance deduplication, navigation/semantic targets, Stop/cancellation and consequential-action controls.
- **My role:** Owner-confirmed idea originator/director of this adaptation. Base executor and much infrastructure are upstream work credited in third-party notices.
- **How I approached it:** Extend existing real-profile execution; keep Phase 1 scoped; separate speech policy, routing and execution; test bounded behaviors.
- **Technologies/tools:** TypeScript, React, Vite, Manifest V3/Chrome APIs, Web Speech API, OpenRouter/TypeSafe Jev, DOM/accessibility data, Vitest and Playwright/tsx harnesses.
- **AI/agent involvement:** AI-assisted implementation; agent decisions connect voice to browser actions.
- **Result:** Source, built output, tests and local screenshots exist. Inspected task receipt reports 0/1 passed because no OpenRouter key was configured. Successful live-agent execution, real-microphone acceptance and general reliability unproven. Inherited demos/store/old E2E results are excluded.
- **Evidence/link:** Internal [repository](https://github.com/Snake-was-here/Jev-neo), `THIRD_PARTY_NOTICES.md`, voice policy/controller/destination modules and related tests; local `.e2e-out/summary.md`. Inspected revision `a2b7926`.
- **Skills demonstrated:** S001–S004, S011, S015. Explicitly an adaptation, not authorship of the underlying browser executor.

## P011 — Dream-Work-OS
- **Problem:** Find expressed demand and turn it into reviewable opportunities, specific outreach and tracked conversations without losing history or inventing profile claims.
- **What I built:** Owner-directed agent instructions, matching/search/outreach rules, four-file profile structure, operational Google Sheet, deduplication/message-link planner and retained timestamp formulas.
- **My role:** E005 directly establishes authored product requirements and active simplification decisions: repository-based agent workflow and sheet formulas instead of an unnecessary script component.
- **How I approached it:** Find → verify → match → review → draft → separate human send → track → learn. Keep repository rules distinct from live sheet history; preserve human decisions and clarify duplicates.
- **Technologies/tools:** Markdown, Google Sheets formulas/validation, Node.js/JavaScript UUID/planning utilities, Node test runner and GitHub.
- **AI/agent involvement:** Agents implement/discover/match/draft; owner reviews and authorizes consequential actions.
- **Result:** Checkout/implementation and historical verification reviewed. Record documents six tests and live formula/dropdown/linking checks, with three provisional opportunities and no sent messages at that checkpoint. Scheduler's first run and paid-work outcomes unverified. Current sheet not re-audited for this profile task.
- **Evidence/link:** Internal [repository](https://github.com/Snake-was-here/Dream-Work-OS), [verification](https://github.com/Snake-was-here/Dream-Work-OS/blob/main/docs/VERIFICATION.md), `tools/pipeline.cjs`; E005. Inspected checkout matches remote HEAD `cf8263bfd068a91b36b5b8acec1aadc6b701c099` at inspection.
- **Skills demonstrated:** S001–S005, S010, S015. Outcome tracking exists; it is not evidence that paid work has resulted.

## P012 — n8n product-mention discovery experiment
- **Problem:** Find relevant Reddit product mentions and save links for review.
- **What I built:** Website describes an n8n discovery workflow and a small related advertising experiment.
- **My role:** Owner-published account; precise build/contribution not independently inspected.
- **How I approached it:** Automate discovery and preserve candidate links for later judgment.
- **Technologies/tools:** n8n and Reddit, as reported; workflow export/provider integration UNKNOWN.
- **AI/agent involvement:** Site places it among AI-assisted experiments; exact division UNKNOWN.
- **Result:** Documentary self-report only. €5 advertising budget and €0.04 CPC are site claims, not verified results or evidence of sales.
- **Evidence/link:** [Experiments](https://pijus.xyz/lore-experiments).
- **Skills demonstrated:** Supporting WORKING KNOWLEDGE claim for n8n/research workflow exposure; verify exported workflow before claiming reliable execution.

## P013 — Personal websites / pijus.xyz
- **Problem:** Present a broad body of work through a coherent professional and personal portfolio.
- **What I built:** Current multi-page portfolio with case studies, historical chapters, images and easter egg. Site also describes earlier sleekshadow.com form-to-Notion/GitHub/Vercel work.
- **My role:** Owner-published account says he supplied ideas/experience and shaped/tested/refined an agent-assisted build. Detailed code/design authorship beyond this account UNKNOWN.
- **How I approached it:** Organize primary work, services and history into connected chapters with visual project evidence.
- **Technologies/tools:** Current delivered HTML/CSS/JavaScript and image artifacts; earlier GitHub/Vercel/Notion integration is reported, not executed here.
- **AI/agent involvement:** Agent-assisted website development described.
- **Result:** All 13 discoverable linked public pages loaded and were inspected. This proves a deployed portfolio; no usability, lead-generation or conversion result measured. Earlier site names should not be confused with the separate pet-sitter landing-page repository.
- **Evidence/link:** [Portfolio](https://pijus.xyz), [work](https://pijus.xyz/work), [history](https://pijus.xyz/lore), [experiments](https://pijus.xyz/lore-experiments).
- **Skills demonstrated:** S005, S006, S008, S015; deployment/interface artifact plus owner-published role claim.

## P014 — Supporting voice/content and video prototypes
- **Problem:** Reduce friction between thoughts/photos and publishable content; explore new media workflows.
- **What I built:** Distinct experiments: Sapphire voice/text-to-posts/newsletters/scripts; Hotkey voice-to-text; Lively photo-to-video; earlier niche→script→images→assembly→voiceover→upload system. Do not merge these with P003 footage editing.
- **My role:** Owner-published history; role/collaborators for each prototype pending explicit confirmation.
- **How I approached it:** Iterate integrations and learn through outputs and failures. Hotkey Linux failure and inconsistent Lively faces are recorded limitations.
- **Technologies/tools:** Sapphire inspected Next.js/React/TypeScript, Groq Whisper/OpenRouter generation. Lively inspected Fal.AI, Stripe webhook, Vercel Blob and Resend code. Earlier system describes ElevenLabs. Technologies are artifact/report-specific.
- **AI/agent involvement:** Agent-assisted coding and model generation/transcription; precise manual role UNKNOWN.
- **Result:** Sapphire/Lively source exists, but current execution/deployment/output quality unverified. Lively uses in-memory session state and lacks implemented deletion cleanup; do not claim production reliability or privacy TTL. Other experiments remain documentary evidence.
- **Evidence/link:** Public [experiments](https://pijus.xyz/lore-experiments). Internal [Sapphire UI](https://github.com/Snake-was-here/Sapphire/blob/main/app/page.tsx), [generation route](https://github.com/Snake-was-here/Sapphire/blob/main/app/api/generate/route.ts), [Lively webhook](https://github.com/Snake-was-here/Lively/blob/main/app/api/webhook/route.ts).
- **Skills demonstrated:** Supporting S003, S011, S012, S015; lower confidence than primary projects until attribution/execution confirmation.

## P015 — Ripple_Rate content bot
- **Problem:** Repeatedly turn a small cryptocurrency data feed into social content.
- **What I built:** Site describes a bot posting three cryptocurrency prices with hooks/CTAs, server/scripts, then meme experiments.
- **My role:** Owner-published historical account; exact coding/agent contribution UNKNOWN.
- **How I approached it:** Combine data retrieval, content formatting and publishing experimentation.
- **Technologies/tools:** Rented server/scripts reported; languages/providers UNKNOWN.
- **AI/agent involvement:** UNKNOWN for each step.
- **Result:** Narrative/screenshots support an experiment, not current uptime, audience growth or financial outcomes.
- **Evidence/link:** [Social history](https://pijus.xyz/lore-social).
- **Skills demonstrated:** Supporting automation/content exposure; do not infer successful marketing or trading expertise.

## P016 — Vinted second-hand resale
- **Problem:** Source and present used clothing for resale.
- **What I built:** Website describes sourcing from Humana, cleaning, DSLR photography, measurement and listings.
- **My role:** Owner-published hands-on work claim; account attribution awaits confirmation.
- **How I approached it:** Improve presentation and information quality around low-cost physical goods.
- **Technologies/tools:** Vinted; DSLR camera reported, model UNKNOWN.
- **AI/agent involvement:** None established; this is practical commerce/photography evidence.
- **Result:** Viewed historical screenshot shows account `wuimi`, 4.8 stars from 25 total reviews (18 member, 7 automatic). It is not a live account audit. €0.50–€3 per-item profit is self-report; revenue and totals UNKNOWN.
- **Evidence/link:** [Shop history](https://pijus.xyz/lore-shops), [historical screenshot](https://pijus.xyz/images/vinted.webp).
- **Skills demonstrated:** S008–S009; resourcefulness, merchandising and fulfilment exposure at small scale, without inflated business claims.

## Public website discovery record

Inspected recursively linked pages: `/`, `/work`, `/lore`, `/together`, `/donelisting`, `/hermes`, `/video-editor`, `/marketing-os`, `/lore-shops`, `/lore-experiments`, `/lore-social`, `/agent-path`, `/numbers` on https://pijus.xyz.

`robots.txt` and `sitemap.xml` returned 404; `site.js` yielded no additional page route list. The `/numbers` page is a linked easter egg. These are all discoverable linked pages found by this inspection, not proof that no entirely unlinked page exists. Ask for additional paths only if the owner knows missing material.

## Metrics and claims excluded from unqualified applications

The `/numbers` page reports 27,776 trees planted, 4,000+ videos filmed, 100+ edited videos, 11,000+ photos, 1,000+ Midjourney images, 442 Canva designs, 100+ uploaded products, 15 internet identities, 28 first online sales, ten countries and eight official jobs. These are SELF-REPORTED counters, not independently audited totals. The owner brief uses approximately 100 edited videos. Do not reconcile scope/time differences by guessing or infer customer revenue from sales counters.

The site also mentions forestry/tree planting, Iceland tyre work and military retraining. Employers, dates and scope need confirmation before adding CV entries. Do not infer that all ten-hour-day accounts apply to every job.

DoneListing promotional speed, time saved, views/ranking/sales uplift; Fiverr offers as paid deliveries; inherited Jev demos/store/E2E results; successful workflow upload as marketing effectiveness; paper positions as profitable real trading; private test billing as live customer revenue — all excluded without stronger evidence.
