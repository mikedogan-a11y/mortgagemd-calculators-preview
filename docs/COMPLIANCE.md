# Compliance — wording, rules & AICS sign-off checklist

> **This wording must be reviewed and signed off by Cheyenne / AICS before launch.**
> All disclaimer text is centralised in `assets/js/mmd-core.js` under `MMD.DISCLAIMERS`
> and injected into every calculator — change it in ONE place and it updates everywhere.

MortgageMD is an **Australian Credit Licensee — ACL 501419**. These calculators are
general-information tools and must not read as personal credit advice.

---

## 1. Standard wording shipped (edit in `MMD.DISCLAIMERS`)

**Top disclaimer (every calculator):**
> This calculator provides general information and estimates only. It is not personal
> credit advice and does not guarantee loan approval, borrowing capacity, eligibility,
> interest rates or savings. Speak with MortgageMD before making a finance decision.

**Calculator Disclaimer (bottom, every calculator):**
> Results are estimates only and are provided for general information purposes. This
> calculator does not constitute personal credit advice, financial advice, legal advice
> or tax advice, and is not an offer of credit, a pre-approval or a guarantee of loan
> approval. Results do not guarantee borrowing capacity, eligibility, interest rate,
> savings or lender acceptance. Actual outcomes depend on lender policy, income
> verification, credit history, expenses, liabilities, property or security type and your
> personal circumstances. You should speak to a licensed MortgageMD credit adviser before
> making a finance decision.

**Standard Assumptions** (each calculator appends its own):
- The figures you enter are accurate and complete.
- Government charges, lender fees, scheme rules, rates and policies can change and should be confirmed.
- Results do not take into account your full personal circumstances, income, expenses or liabilities.

**Standard Warnings** (each calculator appends its own):
- Actual results may differ from these estimates.
- Loan eligibility and approval are always subject to lender assessment and policy.
- This calculator does not assess your full borrowing capacity or serviceability.

**Comparison-rate warning** (shown on calculators that display a rate — Repayments, Refinance):
> WARNING: Any interest rate shown is an example only and is not an offer of credit. A
> comparison rate is true only for the example given and may not include all fees and
> charges. Different terms, fees or loan amounts might result in a different comparison
> rate. Rates are indicative and subject to change and lender approval.

**ACL line (footer of every bottom-disclaimer block):**
> MortgageMD is an Australian Credit Licensee — ACL 501419. Any credit assistance is
> provided in line with our Credit Guide and Privacy Disclosure.

**Privacy consent (next to every email-capture box):**
> I agree that MortgageMD may collect and use my personal information to contact me about
> my enquiry, in accordance with the MortgageMD Privacy Disclosure. I understand my
> information may be exchanged with lenders, advisers, contractors and other parties, some
> of whom may be located overseas.

---

## 2. Output wording rules (already applied — verify on review)

**Use cautious language:** may, could, estimated, indicative, depending on circumstances,
some lenders may, subject to lender policy.

**NEVER use:** independent, unbiased, guaranteed, best loan, cheapest loan, guaranteed
approval, guaranteed savings, "you qualify", "you are approved".

A self-check note: `mmd-core.js` keeps all assertion-bearing copy in one place; the
per-calculator JS only adds short, cautious assumption/warning bullets.

---

## 3. Per-calculator compliance notes (the "treat carefully" items)

- **Borrowing Power (#1):** outputs an **indicative range**, never a single figure or an
  approval amount. Adds a 3% serviceability buffer to the assessment rate.
- **Repayments (#2) / Refinance (#5):** show the **comparison-rate warning**; Refinance
  never states "guaranteed savings" — only "estimated"; warns that extending the term can
  increase total interest.
- **Self-Employed Readiness (#7):** **no dollar output** — a documentation-readiness
  rating + checklist only. States a strong score does not guarantee approval and a low
  score does not mean you cannot borrow.
- **LMI Waiver Eligibility (#8):** **eligibility discussion only**. Never asserts the user
  *is* eligible, never names a specific lender outcome, never references postcodes. Always
  "you may be eligible depending on lender policy…".
- **What's Reducing Your Borrowing Power (#9):** a **general impact indication**, not an
  exact capacity figure.

---

## 4. AICS / Cheyenne sign-off checklist

- [ ] Top disclaimer wording approved.
- [ ] Calculator Disclaimer wording approved.
- [ ] Standard Assumptions & Warnings approved.
- [ ] Comparison-rate warning approved (and confirm which calculators must show it).
- [ ] Privacy-consent wording matches the current MortgageMD Privacy Disclosure.
- [ ] ACL 501419 reference correct and present.
- [ ] Per-calculator output wording reviewed against the banned-words list.
- [ ] Self-Employed Readiness confirmed to contain no dollar figures or eligibility claims.
- [ ] LMI Waiver confirmed to make no eligibility assertion / lender / postcode claim.
- [ ] Borrowing Power confirmed to output a range, not a single figure.
- [ ] Sign-off recorded (who / date) and a re-review date set.

> After sign-off, if any wording changes, update `MMD.DISCLAIMERS` in `mmd-core.js` only.
