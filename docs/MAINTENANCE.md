# Maintenance — keep the calculators accurate & compliant

**Named owner:** Prajwol (or nominated person).
**Cycle:** **quarterly** for general calculators, and **immediately** on any major tax,
stamp-duty, scheme or lending-policy change. An out-of-date calculator is both a
lead-killer and a compliance risk.

All rate logic is centralised in **`assets/js/mmd-core.js`** → `MMD.rates`. Update the
`MMD.rates.lastReviewed` date string each time you complete a review.

---

## 1. What to review each cycle

| Item | Where (in `mmd-core.js`) | Notes |
|---|---|---|
| Stamp / transfer duty scales | `DUTY_SCALES`, `dutyVIC()`, `dutyNT()` | One entry per state; brackets `[threshold, base, ratePer$100]` |
| First-home-buyer concessions | `FHB` | `[fullExemptUpTo, concessionUpTo]` per state |
| Foreign purchaser surcharge | `FOREIGN_SURCHARGE` | % of price per state |
| Government fees (transfer + registration) | `GOV_FEES` | Flat fees per state |
| LMI premium rates | `lmiRate()` | Indicative % of loan by LVR band |
| Example / assessment rates | per-calculator JS defaults | e.g. Borrowing Power assessment rate + 3% buffer; Repayments/Refinance default rates |
| Comparison-rate warning | `MMD.DISCLAIMERS.comparisonWarning` | Keep aligned with a real comparison-rate example if one is shown |
| Disclaimer / privacy wording | `MMD.DISCLAIMERS` | Re-confirm with AICS if changed (see COMPLIANCE.md) |
| Lead tags | `MMD.TAGS` | Keep in sync with ActiveCampaign |
| LMI Waiver professions/criteria | `lmi-waiver-eligibility.js` | Professions & thresholds change — review carefully |
| Self-Employed scoring | `self-employed-readiness.js` | Keep aligned with current lender documentation norms |

## 2. Known simplifications (by design — confirm before relying)

- Duty scales, FHB concessions, surcharges, gov fees and LMI rates are **indicative
  approximations (broadly 2024–25)**, not authoritative.
- **Not modelled:** QLD home concession, off-the-plan / new-build concessions beyond the
  FHB bands, vacant-land specifics, regional variations, and most state-specific schemes.
- **LMI** does not vary by lender, LMI provider, loan-size tier or property type.
- **Borrowing Power** uses a simplified net-income factor and a flat living-expense input
  (no HEM benchmark, no lender-specific shading).
- **LMI Waiver** is a discussion guide only — no specific lender policy, LVR cap or
  postcode logic is encoded (intentionally).

## 3. Immediate-update triggers

Update the same day a change is announced/takes effect for:
- State budget / stamp-duty bracket or threshold changes.
- First-home-buyer concession or government-scheme changes.
- Material LMI premium or policy changes.
- Any change to MortgageMD's Privacy Disclosure or Credit Guide (update consent/ACL wording).

## 4. Review log (fill in each cycle)

| Date reviewed | By | Items changed | Next review due |
|---|---|---|---|
| 2026-06-05 | (initial build) | Initial indicative tables | (set on first real review) |

## 5. How to test after an update

1. `py -m http.server 8800` in the package folder; open `http://localhost:8800/index.html`.
2. Spot-check the changed calculator against a known example (e.g. a state revenue office
   stamp-duty estimate).
3. Confirm no console errors (browser dev tools).
4. Update `MMD.rates.lastReviewed` and this review log.
