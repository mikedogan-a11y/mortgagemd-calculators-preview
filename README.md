# MortgageMD Website Calculators — Build Package (for Prajwol)

**Prepared:** 5 June 2026 · For: Prajwol (build/deploy) · Owner: Michael Dogan
**Status:** Groundwork complete — **preview build for review**. Not deployed. Compliance
wording must be signed off by Cheyenne / AICS before launch.

This package delivers the **Phase 1 (6)** and **Phase 2 (3)** calculators from the
*MortgageMD — Website Calculator Build Brief (FINAL)*, built as framework-agnostic
static HTML/CSS/JS designed to drop into the WordPress site.

---

## 1. What's in here

```
mortgagemd-calculators/
├─ index.html                      ← Calculator hub (links all 9)
├─ README.md                       ← this file
├─ assets/
│  ├─ css/mmd-calculators.css      ← shared design system (namespaced .mmd-calc)
│  └─ js/
│     ├─ mmd-core.js               ← SHARED ENGINE: formatting, stamp-duty + LMI maths,
│     │                              ALL compliance wording, lead-capture data layer
│     ├─ hub.js
│     ├─ borrowing-power.js
│     ├─ home-loan-repayment.js
│     ├─ purchase-costs.js
│     ├─ lmi-lvr.js
│     ├─ refinance-savings.js
│     ├─ usable-equity.js
│     ├─ self-employed-readiness.js
│     ├─ lmi-waiver-eligibility.js
│     └─ borrowing-power-drag.js
├─ calculators/                    ← one standalone preview page per calculator
│     └─ *.html
└─ docs/
   ├─ COMPLIANCE.md                ← disclaimer wording + required/banned words + AICS checklist
   ├─ LEAD-CAPTURE.md              ← ActiveCampaign + Mercury wiring, tags, consent, dataLayer
   ├─ MAINTENANCE.md               ← quarterly review + the rate tables to keep current
   └─ WORDPRESS-INTEGRATION.md     ← how to embed (Custom HTML / shortcode / iframe / enqueue)
```

## 2. The 9 calculators

**Phase 1 — core**
| # | Calculator | Output | Lead tag |
|---|------------|--------|----------|
| 1 | Borrowing Power | Indicative **range** (never a single figure) | `Calculator - Borrowing Power` |
| 2 | Home Loan Repayment | Repayments + rate-movement scenario | `Calculator - Repayments` |
| 3 | Purchase Costs | Stamp duty, gov fees, LMI, total funds required | `Calculator - Purchase Costs` |
| 4 | LMI & LVR | LVR, deposit %, whether LMI may apply, LMI range | `Calculator - LMI` |
| 5 | Refinance Savings & Break-Even | Monthly saving, break-even, total saving | `Calculator - Refinance` |
| 6 | Usable Equity | Estimated usable equity at target LVR | `Calculator - Equity` |

**Phase 2 — differentiators**
| # | Calculator | Output | Lead tag |
|---|------------|--------|----------|
| 7 | Self-Employed Readiness Check | **Readiness rating + checklist** (no dollars) | `Calculator - Self Employed` |
| 8 | LMI Waiver Eligibility | **Eligibility *discussion* only** (no lender/postcode claims) | `Calculator - LMI Waiver` |
| 9 | What's Reducing Your Borrowing Power | General impact indication + ranked contributors | `Calculator - Borrowing Power Drag` |

## 3. How to review locally

No build step, no dependencies. Serve the folder and open the hub:

```powershell
cd mortgagemd-calculators
py -m http.server 8800
# then open http://localhost:8800/index.html
```

Click into each calculator from the hub. Every page carries a blue **"Preview build —
not yet deployed"** strip (injected by `mmd-core.js`); that strip and the preview
header/footer are **review chrome only** and are dropped when embedding (see
`docs/WORDPRESS-INTEGRATION.md`).

## 4. Architecture — why it's built this way

- **One shared engine (`mmd-core.js`).** All number formatting, the stamp-duty/LMI rate
  tables, **and every line of compliance/disclaimer wording** live in this one file and
  are *injected* into every calculator. Calculators cannot drift apart on disclaimers,
  and a wording change is a one-file edit. See `MMD.DISCLAIMERS` and the
  `renderTopDisclaimer` / `renderBottomDisclaimers` functions.
- **Namespaced CSS.** Everything is scoped under `.mmd-calc` and prefixed `mmd-` so it
  won't fight the WordPress theme.
- **No results gating.** Results always show first; the email capture is optional and
  sits *below* the result, with a privacy-consent checkbox (per the brief).
- **No backend, no analytics, no third-party scripts** in this package. Lead events are
  pushed to a documented data layer for you to wire to ActiveCampaign + Mercury
  (`docs/LEAD-CAPTURE.md`).

## 5. Compliance status — READ BEFORE LAUNCH

- Every calculator shows the standard top disclaimer + a four-part bottom section
  (Calculator Disclaimer, Assumptions, Warnings, Next Step) + the ACL 501419 line.
- Calculators that show a rate (Repayments, Refinance) also show the **comparison-rate
  warning**.
- Output wording is cautious throughout ("may", "could", "estimated", "indicative") and
  avoids the prohibited terms.
- **The exact wording still needs Cheyenne / AICS sign-off.** `docs/COMPLIANCE.md` has the
  full wording and a sign-off checklist. The stamp-duty / LMI / concession rates are
  **indicative approximations** and need a maintenance owner (`docs/MAINTENANCE.md`).

## 6. What's intentionally NOT done (your call)

- Wiring the lead events to ActiveCampaign + Mercury (needs your API keys/endpoints).
- Real logo asset (uses an inline SVG/text logo placeholder; swap for the brand asset).
- Final, lawyer/AICS-approved disclaimer wording.
- Validation of the indicative rate tables against current state revenue / LMI data.
- Phase 3 calculators (the brief says wait on Phase 1–2 lead data first).

## 7. Suggested deployment order

1. AICS/Cheyenne sign-off on `docs/COMPLIANCE.md` wording.
2. Wire lead events (`docs/LEAD-CAPTURE.md`) on a staging page; confirm tags land in
   ActiveCampaign + Mercury.
3. Validate the rate tables (`docs/MAINTENANCE.md`).
4. Embed per `docs/WORDPRESS-INTEGRATION.md`, starting with Purchase Costs + Repayments
   (highest traffic), then the rest.
5. Set the 90-day conversion-by-calculator review before committing Phase 3.
