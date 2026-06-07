# Embed Kit #2 — LMI & LVR Calculator

**For:** Prajwol · **Effort:** ~20–30 min functional + your SEO pass

## Why this one is the pick (over the single biggest term)

Jesse's #1 term is **borrowing power (98.2k)** — but it's the most compliance-sensitive
tool and we've just recalibrated it, so it should wait for **AICS sign-off** before going
live (make it #3, very soon). **LMI & LVR is the smartest #2** because it captures **three**
high-volume clusters at once, at much lower compliance risk, and it's ready now:

- **calculate lmi (19.9k)** · **lvr calculator (18.3k)** · **lenders mortgage insurance (12.1k)**
  → **~50k combined MSV**, mid KD.
- Pure LVR maths (exact) + an indicative, loan-size-aware LMI estimate (recently fixed) — all disclaimed.
- Natural next step in the buyer journey after Repayments → strong internal-link value.

---

## A. One-time setup
Same as Kit #1 §A (core CSS + `mmd-core.js` enqueued once). Skip if already done.

## B. This calculator
1. Upload `assets/js/lmi-lvr.js` to `/assets/js/`.
2. Enqueue (depends on `mmd-core`), scoped to the page:
   ```php
   if (is_page('lmi-lvr-calculator')) {
     wp_enqueue_script('mmd-lmi-lvr', $base.'/assets/js/lmi-lvr.js', ['mmd-core'], $ver, true);
   }
   ```
3. New page (e.g. `/lmi-lvr-calculator/`) → Elementor → **HTML widget** → paste the
   `<section class="mmd-calc"> … </section>` block from
   `calculators/lmi-lvr.html` (between the EMBEDDABLE UNIT markers). No `<head>`/scripts.
4. Set CTA URLs (as Kit #1 §B6).

## C. SEO
- **Slug:** `/lmi-lvr-calculator/`  (alt: `/lmi-calculator/`)
- **Rank Math focus keyword:** `LMI calculator` (secondary: `LVR calculator`)
- **SEO title (≤60):** `LMI & LVR Calculator | Estimate Lenders Mortgage Insurance`
- **Meta description (≤155):** `Work out your LVR and deposit percentage, whether Lenders Mortgage Insurance (LMI) may apply, and an indicative LMI cost. Free MortgageMD tool.`
- **H1** already in block ("LMI & LVR Calculator").
- **FAQ schema** (cautious/compliant):
  - *What is LVR?* → loan amount ÷ property value × 100; lenders use it to assess risk.
  - *When does LMI apply?* → typically when LVR is above 80%; it varies by lender, loan and borrower.
  - *How much is LMI?* → it varies by lender/insurer, loan size and LVR — this tool shows an **indicative** estimate only, not a quote.
  - *Can I avoid LMI?* → possibly, via a larger deposit, a guarantor, or (for some professions) a waiver — depending on lender policy. *(link to your LMI Waiver page / Guarantor page.)*
- Internal links: Borrowing Power, Purchase Costs, Guarantor & Professional/Waived-LMI pages.

## D. Go-live checklist
- [ ] `lmi-lvr.js` enqueued (after `mmd-core`); SG cache purged
- [ ] block pasted; CTA URLs set; page indexable
- [ ] Rank Math title/meta/FAQ set
- [ ] AICS sign-off on disclaimer wording (injected from `mmd-core.js`)
- [ ] mobile + no console errors

---

## Suggested rollout order (one per week)
1. **Home Loan Repayment** (Kit #1) — replaces the current tool; biggest table-stakes term.
2. **LMI & LVR** (Kit #2) — ~50k combined MSV, low compliance friction.
3. **Borrowing Power** — #1 term (98.2k), **after AICS signs off the calibration**.
4. **Refinance Savings** (12.7k + 10.5k) · 5. **Stamp Duty** (split out of Purchase Costs — huge intent) · 6. **Usable Equity** (9.3k) · then the Phase-2 differentiators.
