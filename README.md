# IrikList

Original bounded reference23 workflow: an administrator publishes a RU/KK brief and fictional coded profiles. An operator reads literal city/language/topic reasons, writes explanations and explicitly freezes one shortlist. Later edits and archives preserve its exact versions.

Local source implementation v0.1; publication and actual verification status are recorded in docs/verification.json. This README does not imply a hosted SaaS. No real creators,AI,scraping,external messages,invitations,consent,contracts or payment.

## Run

Node 24.15+ (below 25), no packages. Set `ADMIN_USER` and a private `ADMIN_PASSWORD` of 14–200characters, optionally `PORT`1024–65535 and `DATABASE` (default `.data/irik.sqlite`). Run `node start.js`, then open the printed127.0.0.1URL. No default credential. First startup bootstraps one admin only in an empty account table. Admin creates additional local admin/operator accounts in the UI. Existing databases do not silently replace credentials.

Run `npm test` or `node --test --test-reporter=tap test/*.test.js`. Tests use ephemeral servers/temporary synthetic databases and close them. Browser and runtime evidence is separate; tests are counted once.

## Workflow

1. Admin creates fictional `SYN_` codes with finite declared city/language/topic fields. Missing data stays missing. Codes are forever unique,including archives.
2. Admin creates both brief titles and criteria, then explicitly publishes a full version. City/language/topic condition are ANDed; topics use any or all.
3. Operator chooses 1–5 currently matching versions and writes 1–500UTF16-character explanation for each. Submit freezes the full publication, profile data, computed reasons,manual explanation,owner and server time. One shortlist per operator/publication forever,including archived lists.
4. Same-account refresh retains live selections/reasons but flags changed versions. Explicitly re-accept a changed still-matching version or remove it; no silent rebinding. Source closure blocks new selection.
5. Creator-only list archive hides it from working history; explicit archive view retains it. Admin cannot override creator ownership. Source/pub archives preserve prior snapshots.

## Limits

Shared local staff data and limits,not tenant isolation. All staff can read the fictional domain/history. Current admin/operator roles are checked; accounts are create-only. No reset/deactivation/roleedit.

80profiles/400profileversions,40briefs/200briefversions,100publications,200shortlists,1200permanent command keys,1,500,000serialized UTF8workspace bytes. Global revision CAS,lowercaseUUIDv4 and numeric server clock guards; even unrelated writes can make a prepared command stale. Replays reject rather than returning idempotent success. Rejected domain commands preserve the complete workspace and audit.

JSONbackup includes domain/ledger but excludes users,passwords,sessions,CSRF,failure counters and oldaudit. Empty restore requires current referenced account roles,strict original UTF8/JSON and exact event replay/snapshot equality. It appends one new restore marker and one local audit row. It is unsigned consistency,not proof of rights,authenticity,historical identity or protection against consistent rewrites. A full consistent SQLite copy is separate and private. Never commit `.data`,`.env`,credentials or SQLite files.

Unknown POST outcome may already have committed. The app blocks further writes until an explicit relevant read started after the unknown outcome; automatic lifecycle refresh does not clear that block. It does not automatically resend. Full reload may lose live drafts; identity changes clear the UI but cannot erase copies or knowledge.

Only synthetic local checks are claimed. No touch,screenreader,physical device,load,lowmemory,full security or publicserver audit. Three sourced company hypotheses are not customers or demand. See docs/contract.md and verification evidence for exact scope.

Owner-authored infrastructure was adapted from earlier programme products; no vendor code or UI copied. Local NotoSans font/OFL licence is in public/fonts.
