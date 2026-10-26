# IrikList — pre-code contract, reference 23

Recorded 26 October 2026, Asia/Almaty. Authority: the owner's continuing instruction to implement all 100 original bounded products without stopping for routine implementation choices. The name, limits and detailed behaviour below are author decisions under that delegation, not a claimed human design approval. Published delivery remains 40 products / 684 tests until this product independently passes its release gates. The dated AhaCreator research and three company hypotheses remain historical research, not fresh contact checks.

## Outcome and boundaries

An administrator authors a bilingual brief and fictional coded profiles. An operator reads literal city/language/topic matches, then explicitly freezes one shortlist of 1–5 matching profiles with an actual written explanation for each. Subsequent edits and archives cannot change that shortlist. It records a synthetic local selection only. No real names, handles, photographs, contacts, URLs, follower statistics, audience predictions, AI, scraping, messaging, consent, invitation, contracts or payment. No external APIs or paid dependencies. This differs from the image products and from reference 24 bulk processing.

Native Node 24 ESM / SQLite / plain HTML, CSS and JavaScript. Owner-authored authentication, strict JSON and server infrastructure may be adapted with a new database application ID, backup format and cookie. Vendor code, brand and assets are excluded. Product tests and browser evidence must execute this product.

## Literal data and matching

- A profile has a stable UUID ID, an immutable code matching `SYN_[A-Z0-9_]{1,24}` after outer trim and ASCII uppercase, and append-only numbered content versions. The code is forever unique, including archives. No display name or free biography field.
- A content version contains `city` (`astana`, `almaty`, `shymkent`, or null), `languages` (0–3 unique values from `ru`, `kk`, `en`) and `topics` (0–7 unique values from `beauty`, `food`, `travel`, `education`, `tech`, `home`, `sport`). Lists are canonicalized into the enum order. Null/empty means missing declared data, not a negative real-world fact.
- A brief has a stable UUID and append-only numbered content versions. Each contains outer-trimmed, single-line `titleRu` and `titleKk`, 1–120 UTF-16 code units each; `city` as above (null means any); `language` from `ru`, `kk`, `en`, or null (any); 1–3 distinct topics; `topicsMode` exactly `any` or `all`. Reject extra keys, coercion, duplicate values and control characters in titles. Canonical topic order is the same enum order.
- Matching ANDs city, language and the topic condition. Any-city/any-language are ignored conditions. A required missing field fails with `missing`; a present nonmatching value fails with `mismatch`. `any` needs at least one required topic, `all` needs every required topic. Every result has exactly three ordered reason records (city, language, topics) with literal required and actual values and `ignored`, `match`, `missing` or `mismatch`. No suitability score or external verification.
- Evaluation uses the latest versions of all currently active profiles, sorted by ASCII code. It returns both matching and nonmatching profiles with their reasons, profile ID and version. An archived profile is excluded from the current pool but remains in history and old snapshots.

## Roles, versions, immutable records

Authenticated local roles are `admin` and `operator`. All staff share the same fictional domain workspace and limits. Staff can read all domain records, versions and shortlists; this is not tenant isolation. Only an admin can create/edit/archive profiles or briefs, publish/archive a publication, manage local accounts, read audit, export backup or restore. Only an operator can create a shortlist. Only its original operator can archive its visibility; an admin cannot override authorship. Accounts are create-only in this version; no role mutation, deactivation or password reset.

Profile/brief creation makes version 1. Edit requires the current content version and creates the next immutable version, even if normalized values are unchanged. The current profile code never changes. Archive is terminal for that source: no editing, unarchive or deletion. Historical versions remain readable.

Publishing explicitly freezes the full current brief version, including both titles and criteria. A brief/version can be published once forever, including an archived publication. Later brief edits do not rewrite an existing publication. Archiving a brief or publication closes new selections under it; it preserves every saved shortlist.

An operator may create **one shortlist per publication forever**, including after visibility archive. Another operator may create its own. It contains 1–5 distinct profile IDs, each with the exact latest content version and an outer-trimmed actual explanation of 1–500 UTF-16 code units (multiline allowed; reject disallowed control characters). The server recomputes eligibility in the same transaction and refuses unmatched, missing, archived or stale versions. There is no manual override. Entries are sorted by profile code and freeze full profile content/code/version, computed reasons and authored explanation; the full publication is frozen too. Owner/time/IDs are assigned by the server. No edit, delete, replacement, reopen or reassignment.

Working views exclude archived source/publication/shortlist records. An explicit history view preserves them and all version content. A history badge describes current source changes without replacing frozen content. Archive is local visibility, not cancellation of an external event.

## Atomic writes, replay and clock

Every domain command requires the global nonnegative integer `revision` and a fresh lowercase UUIDv4 `requestKey`. Profile/brief edits additionally require an integer `expectedVersion`; shortlist entries require the exact profile version. All role, CAS, source state, version, uniqueness, capacity, key and clock checks execute inside one `BEGIN IMMEDIATE` transaction. Even an unrelated domain edit makes a prepared command stale. First accepted command wins; a rejected command leaves the entire workspace and audit unchanged. GET, refresh and elapsed time never perform domain writes.

Keys are retained permanently within the bounded workspace. Reuse is a 409 rejection, not idempotent success; no automatic resend. Server time must be a valid nonnegative safe-integer epoch and cannot precede the last accepted event. Each accepted domain command appends exactly one event/key and one audit row, then increments revision once. Account/session/rate-limit changes are separate auth state, not domain events.

Persistent workspace contains `profiles`, `briefs`, `publications`, `shortlists`, `keys`. Profile/brief versions are nested append-only arrays. Every event/key contains its UUID, server timestamp, current account name, action and normalized domain payload. Saved rows bind to those events. This is an unsigned consistency ledger, not authenticity or proof of historical identity.

## Bounds and backup/restore

Including archived/history: at most 80 profiles / 400 total profile versions; 40 briefs / 200 total brief versions; 100 publications; 200 shortlists; 1200 keys including restore markers. Serialized workspace UTF-8 is at most 1,500,000 bytes. An accepted action must leave space for its own event; a restore must leave space for its new restore marker. Capacity refusal leaves everything unchanged. These limits can require a fresh workspace; there is no compaction or key expiry.

Admin JSON backup is exactly `{format:'irik-list-v1',data:<workspace>}` and excludes accounts, password hashes, sessions, CSRF, failure counters and audit. Restore requires a completely empty domain workspace and its current revision, plus a new key. It validates strict keys/types/normalization, all bounds, UUID/unique stable codes/IDs/versions, chronological events, current referenced account roles, publication uniqueness, per-publication/operator shortlist uniqueness and every frozen snapshot/reason by replaying the normalized event ledger and requiring exact equality with the supplied records. Restore events are admin-only markers with an empty payload and no domain effect. Duplicate immutable versions, forged derived reasons and broken event binding refuse atomically. Consistently rewritten unsigned data is not cryptographically prevented.

Successful empty restore keeps the exact old domain records and keys, appends one fresh restore marker and one new local audit row, and sets the new workspace revision from 0 to 1. It does not import old audit/authentication. A consistent full SQLite backup is a separate private operator action, never a public artifact. Referenced current admin/operator roles do not prove original rights or human identity.

## HTTP contract and read policy

All JSON responses use `Cache-Control: no-store`. The configured local origin/Host are exact; POST requires Origin, application/json and authenticated commands require the session CSRF token. Request bodies are bounded to 2 MiB, UTF-8 and strict JSON (including decoded duplicate-key rejection). No CORS, image/file import, remote URL fetch or external service route. Unknown paths, methods, query keys and malformed IDs refuse. Static routes serve only declared public files. Auth uses an individual `il_session` HttpOnly SameSite=Strict cookie, not an assertion that ports isolate cookies.

| Route | Access | Input / result |
| --- | --- | --- |
| GET /api/config | public | Product descriptor and finite labels/limits; no auth or data |
| GET /api/session | public | Current safe user/CSRF or null; no password/session digest |
| POST /api/login | public + exact Origin | username/password; safe user/CSRF |
| POST /api/logout | current session + CSRF | empty object; destroy current session |
| GET /api/state | staff | Global revision and all shared domain rows/versions; omit command-key ledger, auth and audit |
| GET /api/evaluate?publicationId=UUID | staff | Current active publication/source validation, revision and literal current profile results; no write |
| POST /api/command | staff, action-specific roles | Exact action schemas below; successful safe state DTO, no key ledger |
| GET /api/users | admin | Safe local account names/roles only |
| POST /api/users | admin + CSRF | New bounded local username/password/role; no domain revision/event |
| GET /api/audit | admin | Bounded actual local domain audit |
| GET /api/backup | admin | Explicit backup including ledger, no auth/audit |
| POST /api/restore | admin + CSRF | backup/revision/requestKey; safe state DTO |

Exact command envelope fields are `action,revision,requestKey` plus:

- `profileCreate`: `code,content`.
- `profileEdit`: `id,expectedVersion,content`.
- `profileArchive`: `id`.
- `briefCreate`: `content`.
- `briefEdit`: `id,expectedVersion,content`.
- `briefArchive`: `id`.
- `publish`: `id,expectedVersion` (brief ID).
- `publicationArchive`: `id`.
- `shortlistCreate`: `publicationId,entries`; entries exactly `profileId,version,reason`.
- `shortlistArchive`: `id`.

The action envelope is one deliberate atomic command endpoint, not a claim of a general third-party REST API. Reads are bounded complete local collections; there is no pagination or public multi-tenant API. All errors have a stable code and RU/KK user copy; raw SQL/path/password details never enter responses.

## Browser state, races and recovery

Use native labelled controls, explicit synthetic scope, RU/KK task/recovery copy, visible focus, associated field bounds/errors and keyboard access. The brief is read before the pool; each profile shows match/missing/mismatch reasons before selection. Each checked row has a required authored explanation. Save creates an immutable snapshot only after an explicit user submit. A prepared form is not a saved selection.

Same-account in-app refresh preserves live unsaved choices and explanations. It does not silently rebind a checked profile to a new version: changed/missing/ineligible rows are visibly flagged and block submit until the operator explicitly removes or re-accepts the current matching version. Publication closure blocks submit while preserving the draft. Switching publications explicitly starts a new draft; an existing saved shortlist prevents another for that operator/publication. Identity changes/logout clear prior domain UI/draft; a full reload may lose them. Clearing does not erase copies or knowledge.

Every asynchronous read/write is bound to an actor/generation. Late alpha replies cannot appear under beta. Unknown POST outcome may already have committed: block additional writes and require an explicit relevant read (state for domain, users for account creation); never automatically resend. A failed relevant read keeps the block. Session/access revalidate on pageshow and visibility resume. Hidden/no-store UI does not certify memory erasure.

## Required independent verification before release

Meaningful RED→GREEN domain/store/HTTP/client tests cover exact literals and missing semantics; immutable publication/version snapshots; selected version and per-operator uniqueness; role/creator guards; stale/racing/global key/clock/full workspace+audit refusals; event replay restore and duplicate immutable rows; capacity/body/routes; held replies/unknown outcomes and explicit reconciliation. Designed cases are not executed tests.

Actual own synthetic browser flows must include current profile edit after a frozen shortlist, missing/nonmatch, both topic modes, stale unsaved explanations and explicit version re-acceptance, native keyboard, RU/KK, desktop and mobile, source/publication and shortlist archives/history. Actual authenticated HTTP refusals, consistent private full backup, meaningful owned restart with all five own table fingerprints and all prior private DBs preserved, and fresh empty JSON restore are required. Fresh whole-source review, applicable Impeccable/UIUX/accessibility work with actual captures, design documentation, exact-SHA public CI, source ZIP/hash/index and finalizer exactly once follow. Prior product tests/reviews do not transfer. No tenant, full security, screenreader, touch, physical-device, load or public SaaS claims without their own evidence.

## Pre-code status

Contract decisions recorded; no product code, runtime, accepted domain commands, product tests, repository or release from this document. Fresh builder check and implementation plan follow. Existing published products and maintenance candidates are untouched.
