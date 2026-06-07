# Embed Kit #1 — Home Loan Repayment Calculator (replaces the current one)

**For:** Prajwol · **Effort:** ~20–30 min functional + your SEO pass
**Replaces:** the existing repayment calculator on the live site.

This version does **everything the current tool does** (repayments by frequency, plus
**extra repayments + lump sum → interest saved / time saved**) and adds a rate-movement
scenario — so it's a straight upgrade, not a feature regression.

**SEO cluster it targets (Jesse's Surfer data):**
mortgage repayments calculator (22k) · loan calculator mortgage payment (13.8k) ·
calculator home loan interest (3k) · **how do I pay off my mortgage faster (4.98k)** ·
**mortgage payment lump sum calculator (1.43k)** → ~45k+ combined MSV.

---

## A. One-time setup (do once for ALL calculators — skip if already done)

1. Upload the package assets into the child theme (or a small plugin), keeping structure:
   ```
   /wp-content/themes/<child>/mmd-calculators/
     assets/css/mmd-calculators.css
     assets/js/mmd-core.js
   ```
2. Enqueue them in the child theme `functions.php`:
   ```php
   add_action('wp_enqueue_scripts', function () {
     $base = get_stylesheet_directory_uri() . '/mmd-calculators';
     $ver  = '1.0.0';
     wp_enqueue_style('mmd-calculators', $base.'/assets/css/mmd-calculators.css', [], $ver);
     wp_enqueue_script('mmd-core', $base.'/assets/js/mmd-core.js', [], $ver, true); // MUST load before any calculator
   });
   ```
   > SiteGround Optimizer: if "Combine JavaScript" is on, **exclude `mmd-*`** or confirm
   > load order keeps `mmd-core.js` first. Avoid **async** on `mmd-core.js`. **Purge SG cache** after deploy.

## B. This calculator

3. Upload `assets/js/home-loan-repayment.js` to the same `/assets/js/` folder.
4. Enqueue it (depends on `mmd-core`) — add inside the same `wp_enqueue_scripts` action,
   ideally scoped to the calculator page:
   ```php
   if (is_page('home-loan-repayment-calculator')) {
     wp_enqueue_script('mmd-repayments', $base.'/assets/js/home-loan-repayment.js', ['mmd-core'], $ver, true);
   }
   ```
5. **Replace the old calculator** on the page:
   - Edit the page in Elementor → delete the existing repayment calculator widget/section.
   - Add an **HTML widget** where it was.
   - Open `calculators/home-loan-repayment.html`, copy **everything between**
     `<!-- ===== EMBEDDABLE UNIT START -->` and `<!-- ===== EMBEDDABLE UNIT END -->`
     (the `<section class="mmd-calc"> … </section>` block) and paste it into the HTML widget.
   - Do **not** copy the `<head>`, the preview header/footer, or the `<script>` tags — those
     are handled by the enqueue in step 4.
6. Set the CTA links: in `home-loan-repayment.js`, the `renderLeadCapture` call's CTA buttons
   default to `#book` / `#enquire`. Point them at your real Book-a-Meeting / Enquire URLs
   (either edit the JS `bookUrl`/`enquireUrl`, or leave and wire the anchors site-side).

## C. SEO (your weekly value-add — the important bit)

- **Slug:** `/home-loan-repayment-calculator/`
- **Rank Math focus keyword:** `home loan repayment calculator`
- **SEO title (≤60):** `Home Loan Repayment Calculator | MortgageMD`
- **Meta description (≤155):** `Estimate your home loan repayments and see how extra repayments or a lump sum could cut your interest and pay your loan off sooner. Free, indicative tool.`
- **Remove** the `noindex,nofollow` meta (it's only on the standalone preview file; the embedded block has none — just make sure the WP page itself is indexable).
- **H1** is already in the block ("Home Loan Repayment Calculator").
- **FAQ schema** (Rank Math FAQ block) — suggested, all cautious/compliant:
  - *How are home loan repayments calculated?* → standard amortisation; interest on the balance each period; this tool assumes the rate stays constant and excludes fees.
  - *How much can extra repayments save?* → it varies; the tool shows an indicative interest/time saving for Principal & interest loans based on your inputs.
  - *Is weekly, fortnightly or monthly better?* → more frequent repayments can reduce interest slightly; actual benefit depends on your loan and lender.
  - *Are these repayments guaranteed?* → no — estimates only; your lender sets actual repayments based on policy and your circumstances.
- Internal links: from this page link to LMI & LVR, Borrowing Power, Refinance.

## D. Go-live checklist
- [ ] core CSS + JS enqueued (core before calc); SG cache purged
- [ ] old calculator removed; new block pasted in HTML widget
- [ ] CTA URLs set
- [ ] Rank Math title/meta/FAQ set; page indexable
- [ ] AICS sign-off on the on-page disclaimer wording (it's injected from `mmd-core.js`)
- [ ] tested on mobile; no console errors
