# WordPress integration

These calculators are framework-agnostic static HTML/CSS/JS. Embedding into WordPress is
three steps: **host the assets → enqueue them → drop the calculator markup on the page.**

The standalone preview pages include a **preview header/footer + blue preview strip**
(injected by `mmd-core.js`'s `renderPreviewChrome()`). **Do not embed those.** Embed only
the block between the `<!-- EMBEDDABLE UNIT START -->` and `<!-- EMBEDDABLE UNIT END -->`
comments — i.e. the `<section class="mmd-calc"> … </section>`.

---

## 0. Your live environment (confirmed) — integration targets

- **Platform:** WordPress + **Elementor** → embed via Elementor **HTML widget** (see §3a).
- **Target page:** the existing **`/mortgage-calculators/`** page (currently empty-ish) is
  the natural home — one HTML widget per calculator, or hold all 9 in an Elementor
  Tabs/Accordion.
- **SEO: Rank Math.** These production calculator pages **should be indexed** — *remove the
  `<meta name="robots" content="noindex, nofollow">`* (it's only on the preview/dummy
  pages) and manage titles/meta/schema in Rank Math. Consider FAQ/HowTo schema per
  calculator for SEO.
- **Hosting/perf: SiteGround Optimizer (SG Optimizer).** Three cautions:
  1. **Load order** — `mmd-core.js` must load before each calculator script. The
     `wp_enqueue_script` dependency (`['mmd-core']`) enforces this, but if SG's **"Combine
     JavaScript"** reorders/merges, either exclude `mmd-*` from combine or test thoroughly.
  2. **Async/defer** — calculators run on `DOMContentLoaded`, so *defer* is safe; avoid
     **async** on `mmd-core.js` (a calc script could run before core). Exclude core from
     async if enabled.
  3. **Cache** — **purge SG cache after every deploy/update**, or changes won't show.
- **REST available:** use a server-side lead endpoint (e.g. `POST /wp-json/mmd/v1/lead`)
  that holds the ActiveCampaign/Mercury keys server-side — see `LEAD-CAPTURE.md`. Never put
  API keys in front-end JS.

---

## 1. Host the assets

Upload to the theme (or a small plugin / uploads folder), keeping the structure:
```
/wp-content/.../mmd-calculators/
  assets/css/mmd-calculators.css
  assets/js/mmd-core.js
  assets/js/<calculator>.js
```

## 2. Enqueue CSS + JS (child theme `functions.php`)

```php
add_action('wp_enqueue_scripts', function () {
  // Only load on calculator pages if you can scope it (recommended).
  $base = get_stylesheet_directory_uri() . '/mmd-calculators';
  wp_enqueue_style('mmd-calculators', $base . '/assets/css/mmd-calculators.css', [], '1.0.0');
  // core MUST load before any calculator script
  wp_enqueue_script('mmd-core', $base . '/assets/js/mmd-core.js', [], '1.0.0', true);
  // load the specific calculator(s) you placed on this page, e.g. purchase-costs:
  wp_enqueue_script('mmd-purchase-costs', $base . '/assets/js/purchase-costs.js', ['mmd-core'], '1.0.0', true);
});
```
> The calculator scripts run on `DOMContentLoaded` and look up elements by id, so loading
> in the footer (`true`) is fine. Each calculator script must be enqueued with `mmd-core`
> as a dependency.

## 3. Place the markup

In a **Custom HTML block** (Gutenberg) or a shortcode template, paste the
`<section class="mmd-calc"> … </section>` from the calculator's `.html` file. You do **not**
need the `<head>`, the preview header/footer, or the `<script>` tags (those are enqueued in
step 2).

You must keep the empty hook elements that the script fills:
`<div data-mmd-top></div>`, the inputs/results, `<div data-mmd-lead></div>`,
`<div data-mmd-bottom></div>`.

### 3a. Elementor (your stack)

1. Edit `/mortgage-calculators/` with Elementor.
2. Drop an **HTML widget** where you want a calculator and paste that calculator's
   `<section class="mmd-calc"> … </section>` block (between the EMBEDDABLE UNIT comments).
3. Load the assets once for the page — preferred: the `functions.php` enqueue in §2 (scope
   it to this page). Alternative (no theme edit): put the `<link>`/`<script>` tags in an
   Elementor **HTML widget at the top of the page** pointing at the hosted asset URLs —
   core first, then each calculator script. Enqueue is cleaner and SG-friendlier.
4. To present all 9 on one page, use an Elementor **Tabs** or **Accordion** widget with one
   HTML widget per pane. Unique id prefixes (`pc_`, `rp_`, …) mean they won't collide — just
   don't place the *same* calculator twice on one page.
5. Set the CTA links (Book / Enquire) to your real URLs — they're passed in each
   calculator's `renderLeadCapture()` call (default `#book` / `#enquire`).

### Optional: a shortcode per calculator
```php
add_shortcode('mmd_purchase_costs', function () {
  ob_start();
  // paste the <section class="mmd-calc">…</section> block here
  return ob_get_clean();
});
// then enqueue mmd-core + purchase-costs.js when the shortcode is present.
```

## 4. Disclaimer & lead hooks

- The top/bottom disclaimers and the lead-capture block are **injected by the script** into
  the `data-mmd-top` / `data-mmd-bottom` / `data-mmd-lead` elements — you don't paste that
  wording into WordPress, which keeps it centralised and AICS-controlled.
- The preview chrome calls `renderPreviewChrome()` from inside each calculator's JS. For
  production you can either (a) leave it (the page has no `data-mmd-header/footer` elements,
  so it simply does nothing), or (b) tell us and we'll gate it behind a flag. It is safe to
  leave in.
- To capture leads, define `window.MMDLeadHook` (see `LEAD-CAPTURE.md`) and/or use GTM via
  `window.dataLayer`. Set the CTA links to the real "Book a meeting" / "Enquire" URLs — they
  default to `#book` / `#enquire` (passed in each calculator's `renderLeadCapture` call).

## 5. Multiple calculators / notes

- Every calculator uses a **unique id prefix** (`pc_`, `rp_`, `ll_`, …) so two different
  calculators can coexist on one page. Do **not** place two copies of the *same* calculator
  on one page (duplicate ids).
- CSS is scoped under `.mmd-calc` and prefixed `mmd-`, so it should not collide with the
  theme. If the theme aggressively styles inputs/buttons, increase specificity or load the
  calculator CSS last.
- No external requests, fonts or trackers are loaded by these files.
- Remove the `<meta name="robots" content="noindex, nofollow">` (it's only on the preview
  pages) — for production you'll want these calculator pages indexed for SEO.

## 6. Go-live checklist

- [ ] Assets uploaded and enqueued (core before calculators).
- [ ] CTA URLs set to real Book/Enquire links.
- [ ] `MMDLeadHook` / GTM wired and tested (tags landing in ActiveCampaign + Mercury).
- [ ] Disclaimer wording signed off (COMPLIANCE.md) — it's injected, so confirm once.
- [ ] Rate tables validated (MAINTENANCE.md).
- [ ] Page indexed (no noindex), mobile layout checked, no console errors.
