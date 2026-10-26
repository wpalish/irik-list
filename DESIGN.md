---
name: "IrikList"
description: "A local criteria-led workspace for fictional profile versions and explicit shortlist snapshots."
colors:
  forest: "#163f35"
  mint: "#e4eee5"
  paper: "#fffaf1"
  white: "#fff"
  ink: "#1c3029"
  muted: "#4e6259"
  line: "#a6b9ab"
  accent: "#d68e66"
  danger: "#8b302b"
  warn: "#74411d"
  selected: "#d0e3d5"
  focus: "#ad512c"
typography:
  brand:
    fontFamily: "Noto, sans-serif"
    fontSize: "28px"
    fontWeight: 750
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Noto, sans-serif"
    fontSize: "30px"
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Noto, sans-serif"
    fontSize: "22px"
    lineHeight: 1.3
  section:
    fontFamily: "Noto, sans-serif"
    fontSize: "18px"
  body:
    fontFamily: "Noto, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  label:
    fontFamily: "Noto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  hint:
    fontFamily: "Noto, sans-serif"
    fontSize: "14px"
  version:
    fontFamily: "Noto, sans-serif"
    fontSize: "13px"
rounded:
  field: "4px"
  button: "5px"
spacing:
  compact: "4px"
  small: "8px"
  medium: "12px"
  regular: "16px"
  surface: "24px"
  column: "32px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.forest}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.selected}"
  button-disabled:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.muted}"
  button-archive:
    backgroundColor: "{colors.white}"
    textColor: "{colors.danger}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
  navigation-current:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
  version-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    padding: "3px 9px"
  brief:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "22px 26px"
  profile:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    padding: "22px 24px"
  profile-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.ink}"
  draft:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "24px"
  draft-conflict:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    padding: "16px"
---

# Design System: IrikList

## Overview

**Creative North Star: "Collection Labels for Working Decisions"**

Museum collection-label precision is the implemented working metaphor: forest navigation, pale mint ground, white current records and warm paper for the published brief, draft and frozen history. This is a code-derived description of an author-inferred world. The owner confirmed the priority of criteria and reasons; the visual world was not approved by the owner.

Local Noto carries both RU and KK. Native controls, named condition rows and compact version captions support careful comparison without turning fictional codes into portraits or promotional imagery. The built signature is a peach version caption that becomes a text-labelled conflict; the provisional surface brief’s vertical mark did not become a card stripe.

**Key Characteristics:**
- Flat, bordered working surfaces with forest actions.
- Three named reasons remain text, rather than a color-only verdict.
- Peach marks the selected version; a changed version includes text and an explicit action.
- Compact narrow layouts keep localized navigation words intact.

## Colors

The palette places warm paper and white on a pale mint ground, with forest actions and small state-specific accents. Frontmatter values are normative; names below explain their application.

### Primary

- **Forest:** header, active navigation, primary actions, caret and checkbox accent; also successful command feedback.

### Secondary

- **Peach Version:** selected version captions and native text selection.
- **Selection Green:** selected profile rows and secondary-button hover.

### Tertiary

- **Error Red:** failed or unknown outcomes, mismatches, field errors and archive actions.
- **Conflict Brown:** changed-version caption boundary and its explanatory text.
- **Focus Rust:** the visible keyboard focus ring.

### Neutral

- **Pale Mint:** page ground, disabled controls and subtle reason separators.
- **Warm Paper:** published brief, draft, frozen subrecord, login and ordinary version captions.
- **Work White:** current records, inputs and source editors.
- **Deep Ink:** principal text and primary hover.
- **Muted Green:** hints, timestamps, secondary copy and field borders.
- **Sage Divider:** record and section separators, disabled boundaries and secondary active fill.

**The Caption Rule.** Use peach on the version caption of a selected record. A changed version carries its old-to-current text and conflict boundary; color alone does not describe the change.

## Typography

**Display and Body Font:** bundled Noto, with a sans-serif fallback. There is no separate display family, icon font or named mono family.

The hierarchy is restrained and data-readable. The brand is heavier and slightly tightened; page headings share the tightened tracking, while controls inherit the body face. Browser defaults provide the weight of semantic headings and strong text where no explicit weight is set.

### Hierarchy

- **Brand:** frontmatter brand role; the narrow layout reduces it to (23px).
- **Headline:** page heading role; effective narrow size is (24px), with the same (1.2) line height.
- **Title:** section headings; the narrow brief and selection headings reduce to (20px).
- **Section:** record and draft-entry subheadings.
- **Body:** primary copy; paragraphs are limited to (72ch).
- **Label:** native form labels and controls use the body size; labels and buttons use (600) weight.
- **Hint:** supporting descriptions and reason names. Narrow brief metadata reduces to (12px/18px); the actor line also uses this compact treatment.
- **Version:** compact caption with tabular numerals; selected captions increase to (700) weight.

**The One Local Voice Rule.** Use the bundled Noto family across navigation, data, forms and headings. Keep version numerals tabular and labels in their natural RU/KK case.

## Layout

The desktop working container is centered, with a maximum width of (1328px), side padding of (24px) and top padding of (28px). The comparison pool and draft use a two-column grid of `minmax(0,1.7fr)` and `minmax(300px,1fr)` with a (32px) gap. Source editors use equal columns with a (40px) gap. The published-brief selector is capped at (760px).

At the single narrow breakpoint, maximum width (760px), both grids become one column with a (24px) gap. The main area uses (12px 16px 32px) padding. The effective header is a compact two-column grid: brand and controls occupy the first row, actor the second. The visible language label is visually hidden while remaining associated with its native select.

Navigation uses wrapping flex rows. At narrow widths each button retains an unbroken localized word sequence (`white-space: nowrap`), and the whole control can move to the next row; it does not use arbitrary-letter wrapping. Narrow navigation uses (14px/20px) type, (7px) padding and the inherited (44px) minimum control height. The brief condenses to (12px 14px) padding and its city/language conditions share a row when they fit; topics take the next full row. Reasons keep an (80px) label column and a flexible value column.

The spacing frontmatter records repeated working steps, rather than every one-off measurement. Actual layout is governed by the final CSS cascade; superseded earlier mobile declarations do not establish alternate effective tokens.

## Elevation & Depth

This is a flat system. Background shifts, thin borders and nested paper areas distinguish current rows, the working draft and frozen snapshots. No box-shadow appears in the built stylesheet. Version-change feedback uses an outline, not an elevated card.

**The Flat Record Rule.** Separate records with fills, spacing and thin borders. The current system uses no box shadows.

## Shapes

Containers retain square corners. Buttons have a gentle (5px) radius and inputs a (4px) radius; compact version captions remain rectangular. Borders are generally (1px), with a (3px) focus outline offset by (3px). Empty areas use a dashed boundary, while current records use fine horizontal separators. The selection signature belongs to the caption, rather than a full-height decorative side stripe.

## Components

### Buttons

Native, direct actions with a minimum height of (44px). Secondary actions use a white surface, forest text and border; primary actions reverse forest and white. Hover and disabled variants are captured in frontmatter. Secondary active fill uses the divider tone. Primary hover uses deep ink. Archive actions keep the native button shape, use error-colored text/border and are spaced away from ordinary actions. Visible keyboard focus is the shared rust outline.

### Inputs / Fields

White, full-width fields have a muted border, field radius and (10px 12px) padding. Textareas resize vertically and begin at a (100px) minimum height. Checkboxes remain native (20px) controls within labels with at least (44px) height. Topic choices use two columns on both desktop and narrow layouts. The brief topic group places its range hint and specific error directly after the choices; error text and invalid state accompany the association, rather than replacing the user's entered values.

### Navigation

Native section buttons use the secondary treatment at rest and the primary treatment for `aria-current=page`. The navigation has a thin lower boundary and wraps at the whole-control level. Narrow behavior is documented in Layout; no clipped label or forced letter fragmentation is part of the system.

### Version Captions

Small tabular captions sit beside record codes. An unselected caption uses paper. Selection applies peach to that caption and a green surface to the current row. When a selected source changes, the caption shows both versions, changes to paper with a brown border, and sits beside an explicit conflict explanation and acceptance action.

### Brief / Draft / Frozen Records

The published brief and working draft use paper with thin sage boundaries. Current rows use white, selected rows green. Frozen history nests paper sections within white records. These contexts are related by material, while their headings and state copy keep them distinct.

### Literal Reason Rows

Each reason separates its named condition from a textual status and required/actual values. Thin mint rules align the three rows without a floating card for each condition. Mismatch and missing statuses use error text; the reason remains readable without relying on that hue.

### Feedback

One live status region uses muted text for a pending write, forest for a confirmed success and error red for errors or unknown outcomes. Pending/unknown states are not simulated as success. Busy attributes and write availability are controlled by the implementation, outside the static sidecar examples.

### Motion

Only the changed-draft outline and selected-version background/border transition are explicitly animated: (180ms) with `cubic-bezier(.16,1,.3,1)`. Both transitions become `none` under `prefers-reduced-motion: reduce`. The sidecar carries these extensions; no new motion grammar is inferred.

## Do's and Don'ts

### Do:

- **Do** preserve the text label and value for each city, language and topic reason.
- **Do** retain native-sized controls, associated field errors and the visible rust focus outline.
- **Do** let whole navigation controls move to another row on narrow screens.
- **Do** distinguish selected, changed, frozen and archived states with text as well as their existing treatments.

### Don't:

- **Don't** split localized navigation labels into arbitrary letter fragments.
- **Don't** replace a changed-version explanation with a colored stripe alone.
- **Don't** add elevation shadows to these flat record surfaces as an assumed house style.
- **Don't** present the inferred visual world as owner-approved.
