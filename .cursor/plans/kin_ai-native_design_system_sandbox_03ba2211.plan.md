---
name: Kin AI-Native Design System Sandbox
overview: "1-day build: encode kin's design system as 4 machine-readable JSON files (Knowledge, Intelligence, Experience, Governance) on a sandbox branch. Real kin data where it exists, clear TODOs where it doesn't."
todos:
  - id: setup
    content: Create sandbox/kin-ai branch, verify kin clone at /tmp/kin-explore-https
    status: pending
  - id: knowledge
    content: Build knowledge.json from kin data (tokens, motion, voice, a11y, 2 component schemas). Mark gaps needing Stanley input.
    status: pending
  - id: intelligence
    content: "Build intelligence.json: prompt templates referencing real knowledge paths, router stub, calibration stub"
    status: pending
  - id: experience
    content: "Build experience.json: patterns, confidence, telemetry schema (all new, clearly marked)"
    status: pending
  - id: governance
    content: "Build governance.json: extract CLAUDE.md governance into structured rules, add triage + audit stubs"
    status: pending
  - id: optimize
    content: "6 optimization passes: completeness, compression, cross-referencing, calibration, tightening, coherence"
    status: pending
isProject: false
---

# Kin AI-Native Design System -- 1-Day Sandbox Build

## Goal

Encode kin's existing design system rules as 4 machine-readable JSON files. Use real kin data wherever it exists. Clearly mark what needs Stanley's input vs. what is already defined. Build on a sandbox branch in sitepractice. No deployment.

## Hypothesis

If Claude Code can read these specs as structured context (not just source code), it will generate more consistent, system-compliant components with less back-and-forth.

---

## Honest Gap Analysis: What Kin Has vs. What It Doesn't

### knowledge.json -- what the system knows


| Section           | Source in kin                                                                                                                                                  | Coverage | Gaps needing Stanley                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| **tokens**        | `tokens/foundation.ts`, `tokens/brands/*.ts`, `tokens/languages/*.ts`, `tokens/semantic.ts`                                                                    | 100%     | None                                                                                                                       |
| **motion**        | `foundation.ts` (spring physics, durations) + language overrides                                                                                               | 100%     | None                                                                                                                       |
| **content/voice** | `src/app/foundation/voice/page.mdx` -- principles (warm/direct/knowing), registers (consumer/merchant/courier), microcopy rules, formatting, human attribution | ~80%     | Error message examples per brand. Brand-specific vocabulary lists. What words to avoid per brand.                          |
| **a11y**          | `public/design-tokens/CONTRAST_RATIOS.md` + language configs (contrast ratios, touch targets)                                                                  | ~85%     | ARIA role requirements per component (which roles for Button, Card, etc.). Reduced motion rules (not defined in kin).      |
| **components**    | `ButtonComponent.tsx`, `CardComponent.tsx` in sandbox -- sizes, states, contexts, brand mappings                                                               | 2 of 5   | Schemas for Input, Badge, Alert. What variants exist? What are the required vs. optional props? What slots does each have? |
| **metrics**       | Does not exist in kin                                                                                                                                          | 0%       | What does "good" mean? Token coverage target? Compliance target? Acceptable error rate?                                    |


### intelligence.json -- how the system thinks


| Section         | Source in kin  | Coverage | Gaps needing Stanley                                                                                                    |
| --------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **prompts**     | Does not exist | 0%       | None -- I can write these from knowledge.json data. But Stanley should review: are these the right 5 tasks to template? |
| **router**      | Does not exist | 0%       | None for POC (all Claude Code). For future: which tasks need fast vs. deep reasoning?                                   |
| **calibration** | Does not exist | 0%       | What's acceptable? How long should component gen take? What first-pass accuracy is "good enough"?                       |


### experience.json -- where the system acts


| Section        | Source in kin  | Coverage | Gaps needing Stanley                                                                                  |
| -------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| **patterns**   | Does not exist | 0%       | None -- these are conceptual workflow shapes. I can define suggest/regenerate/refine/validate.        |
| **confidence** | Does not exist | 0%       | What confidence level should auto-apply vs. require review? (I'll propose defaults, Stanley adjusts.) |
| **telemetry**  | Does not exist | 0%       | What does Stanley actually want to track? (I'll propose a schema, Stanley adjusts.)                   |


### governance.json -- who controls the system


| Section    | Source in kin                                                                                   | Coverage | Gaps needing Stanley                                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **rules**  | `CLAUDE.md` -- risk warnings, approval requirements, "wait for confirmation" triggers           | ~40%     | Are the 3 tiers (auto-apply / suggest-first / require-approval) right? What else should require approval beyond what CLAUDE.md lists? |
| **triage** | `CLAUDE.md` has qualitative criteria (multi-file, architecture, tokens, navigation, deployment) | ~20%     | Are the 4 risk factors (brand impact, a11y impact, user-facing, reversibility) the right dimensions? Weights?                         |
| **audit**  | Does not exist                                                                                  | 0%       | What should be logged? (I'll propose a schema.)                                                                                       |


### Summary

- **Fully from kin data (no fabrication)**: tokens, motion, most of voice/content, most of a11y, governance rules (from CLAUDE.md), 2 component schemas
- **I can write but Stanley should review**: prompts, patterns, confidence defaults, telemetry schema, triage weights, audit schema
- **Needs Stanley's input before I can write accurately**: metrics definitions, 3 missing component schemas (Input/Badge/Alert), brand-specific vocabulary, ARIA role requirements, calibration baselines

---

## What I Need From You (Stanley)

Before or during the build, decisions on these items. Brief answers are fine -- even one-liners. I'll mark items as `"TODO_STANLEY"` in the JSON if I don't have them.

**Must-have for a meaningful POC (5 items):**

1. **Metrics**: What does "good" look like? Example: "If AI generates a component that passes a11y checks on first try 80% of the time, that's good." Any number is better than no number.
2. **Component schemas for Input, Badge, Alert**: What variants does each have? (e.g., Input: text, password, search, textarea? Badge: status, count, label?) What ARIA roles? I have Button and Card from the sandbox code.
3. **Brand vocabulary**: Any words DoorDash/Wolt/Deliveroo should always or never use? The voice page has tone (warm/direct/knowing) but not brand-specific word lists.
4. **Calibration gut-feel**: How long does it currently take you to generate a component with Claude Code? (rough: 5 min? 20 min? varies wildly?) This becomes the baseline.
5. **Governance comfort level**: The CLAUDE.md has a good risk model. Is there anything it's missing? Anything that should be higher or lower risk than what it currently defines?

**Nice-to-have (can default and adjust later):**

1. ARIA roles per component (I can default to WAI-ARIA patterns)
2. Reduced motion preferences (I can default to `prefers-reduced-motion` disabling springs)
3. Confidence thresholds (I'll propose 0.85/0.5 split, you adjust)
4. Telemetry fields (I'll propose a schema, you add/remove)

---

## Build Plan (1 Day)

### Setup (15 min)

1. `git checkout -b sandbox/kin-ai` from clean `main`
2. Verify `/tmp/kin-explore-https/` exists (re-clone if needed)
3. `mkdir sandbox/`

### knowledge.json (2-3 hours)

The big file. Extract real data from kin:

- `tokens`: Flatten foundation.ts + 3 brands + 3 languages + semantic into structured JSON
- `motion`: Spring physics per language, duration scale
- `content`: Voice principles, registers, microcopy rules, formatting from voice/page.mdx
- `a11y`: CONTRAST_RATIOS.md data + language-specific thresholds + touch targets
- `components`: Button + Card schemas from sandbox code. Input/Badge/Alert marked `TODO_STANLEY`
- `metrics`: Marked `TODO_STANLEY` with proposed defaults

### intelligence.json (1 hour)

Write prompt templates that reference real knowledge.json paths:

- 5 templates: generate-component, lookup-token, validate-a11y, rewrite-content, suggest-layout
- Router: task-type mapping (stub, all routes to Claude Code for POC)
- Calibration: marked `TODO_STANLEY` with proposed defaults

### experience.json (30 min)

Conceptual layer -- smaller file:

- 4 interaction patterns (suggest, regenerate, refine, validate)
- Confidence thresholds (proposed defaults, adjustable)
- Telemetry event schema (proposed fields)

### governance.json (30 min)

Extract from CLAUDE.md + extend:

- Rules: structure the existing CLAUDE.md risk model as formal tiers
- Triage: propose scoring matrix from CLAUDE.md's qualitative criteria
- Audit: propose trail schema

### 6 Optimization Passes (1-2 hours)

One git commit per pass:

1. **Completeness** -- Every kin token present? Every brand override? Gaps flagged?
2. **Compression** -- Brands only store overrides. Languages only store multipliers.
3. **Cross-referencing** -- Every prompt references real knowledge.json paths.
4. **Calibration** -- Confidence thresholds align with governance tiers.
5. **Tightening** -- A11y constraints have matching governance rules.
6. **Coherence** -- All cross-file references resolve. All TODOs clearly marked.

### Total: ~5-6 hours of build time

---

## Deliverable

```
sandbox/
├── knowledge.json       # ~500-800 lines. Real kin data + TODO_STANLEY markers.
├── intelligence.json    # ~150-200 lines. Prompt templates + stubs.
├── experience.json      # ~100-150 lines. Patterns + proposed defaults.
└── governance.json      # ~100-150 lines. CLAUDE.md structured + extensions.
```

On branch `sandbox/kin-ai`. 6 commits (one per optimization pass). Main untouched.

---

## What We Do NOT Touch

`index.html`, `style.css`, `main.js`, `vite.config.js`, `package.json`, `.github/workflows/`, `public/`

---

## After the Build: How to Test It

Not part of the 1-day build, but the next step:

1. Copy knowledge.json into a Claude Code session alongside kin source
2. Ask Claude to generate a Card variant for Deliveroo courier context
3. Compare the output (with specs) vs. the same request without specs
4. Did it get the accent color, spacing multiplier, contrast ratio, touch target, and tone right on the first try?

If yes: the machine-readable encoding works. If no: iterate on the specs.