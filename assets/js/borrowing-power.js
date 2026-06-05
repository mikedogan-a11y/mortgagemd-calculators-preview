/* Borrowing Power Estimate — depends on mmd-core.js
   Pillar: home loans / low deposit.
   Lead tag: Calculator - Borrowing Power.
   Simplified, INDICATIVE serviceability only — never a single
   guaranteed figure, always a range. */
(function () {
  "use strict";
  var KEY = "borrowing-power";

  var INPUTS = ["bp_applicants","bp_purpose","bp_income","bp_income2","bp_incometype",
                "bp_dependants","bp_expenses","bp_cardlimits","bp_othercommit",
                "bp_hecs","bp_rental","bp_rate","bp_term"];

  // sensible defaults (editable by the user)
  var DEFAULTS = { bp_rate: 6.50, bp_term: 30 };

  function num(id, fallback) {
    var raw = (MMD.$(id) && MMD.$(id).value || "").trim();
    if (raw === "" && fallback !== undefined) return fallback;
    return MMD.parseMoney(raw);
  }

  function round1000(x) {
    x = MMD.finite(x);
    return Math.round(x / 1000) * 1000;
  }

  function compute() {
    var primaryIncome  = num("bp_income");
    var secondIncome   = num("bp_income2");
    var incomeType     = MMD.$("bp_incometype").value;
    var ownerOcc       = MMD.$("bp_purpose").value === "oo";
    var livingExpenses = num("bp_expenses");
    var creditCardLimits = num("bp_cardlimits");
    var otherMonthly   = num("bp_othercommit");
    var hecsMonthly    = num("bp_hecs");
    var rentalMonthly  = num("bp_rental");
    var assessmentRate = num("bp_rate", DEFAULTS.bp_rate);
    var term           = num("bp_term", DEFAULTS.bp_term);
    if (term <= 0) term = DEFAULTS.bp_term;

    // gross income (rental shaded to 80%)
    var grossAnnual = primaryIncome + secondIncome + (rentalMonthly * 12 * 0.80);
    // simple net-of-tax factor
    var netMonthly = (grossAnnual / 12) * 0.75;
    // commitments (credit card limits assessed at ~3.8%/month)
    var commitments = livingExpenses + otherMonthly + hecsMonthly + (creditCardLimits * 0.038);
    var surplus = netMonthly - commitments;

    // APRA-style serviceability buffer added to the assessment rate
    var assessRate = assessmentRate + 3.0;

    // capacity (annuity present value of the monthly surplus)
    var i = (assessRate / 100) / 12;
    var n = term * 12;
    var maxLoan = 0;
    if (surplus > 0 && n > 0) {
      if (i === 0) {
        maxLoan = surplus * n;
      } else {
        maxLoan = surplus * (1 - Math.pow(1 + i, -n)) / i;
      }
    }
    maxLoan = MMD.finite(maxLoan);

    var low  = round1000(maxLoan * 0.9);
    var high = round1000(maxLoan * 1.1);

    return {
      ownerOcc: ownerOcc, incomeType: incomeType,
      grossAnnual: grossAnnual, netMonthly: netMonthly,
      commitments: commitments, surplus: surplus,
      assessmentRate: assessmentRate, assessRate: assessRate,
      maxLoan: maxLoan, low: low, high: high
    };
  }

  function render() {
    var r = compute();
    var hint = MMD.$("bpr_rangehint");

    if (r.surplus <= 0) {
      MMD.setText("bpr_range", "$0");
      if (hint) hint.textContent =
        "Based on these figures there may be limited additional capacity — let's talk.";
    } else {
      MMD.setText("bpr_range", MMD.fmtCurrency0(r.low) + " – " + MMD.fmtCurrency0(r.high));
      if (hint) hint.textContent =
        "An indicative range only — not a single figure or an approval amount.";
    }

    // monthly surplus (max assessed repayment capacity)
    var surplusShown = r.surplus > 0 ? r.surplus : 0;
    MMD.setText("bpr_surplus", MMD.fmtCurrency(surplusShown));
    MMD.setText("bpr_maxrepay", MMD.fmtCurrency(surplusShown));
    MMD.setText("bpr_assessrate", MMD.fmtPercent(r.assessRate));
    MMD.setText("bpr_purpose", r.ownerOcc ? "Owner-occupied" : "Investment");

    MMD.lead.track(KEY, {
      low: r.low, high: r.high, surplus: surplusShown,
      assessRate: r.assessRate, purpose: r.ownerOcc ? "Owner-occupied" : "Investment"
    });
  }

  function reset() {
    INPUTS.forEach(function (id) {
      var e = MMD.$(id); if (!e) return;
      if (e.tagName === "SELECT") e.selectedIndex = 0; else e.value = "";
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    MMD.renderPreviewChrome();
    MMD.renderTopDisclaimer(document.querySelector("[data-mmd-top]"));
    MMD.renderBottomDisclaimers(document.querySelector("[data-mmd-bottom]"), {
      calcName: "Borrowing Power",
      showComparisonWarning: true,
      assumptions: [
        "A serviceability buffer of 3.0% is added to your assessment rate to estimate capacity, in line with general APRA-style lending practice.",
        "Lender-specific living-expense benchmarks (such as HEM) and lender-specific income shading are not applied.",
        "Rental income is shaded to 80% and credit card limits are assessed at approximately 3.8% of the limit per month.",
        "A simplified net-of-tax factor is used and does not reflect your actual tax position or every commitment."
      ],
      warnings: [
        "Actual borrowing capacity varies materially between lenders and is always subject to full assessment and policy.",
        "Self-employed income assessment varies significantly between lenders and may require additional verification."
      ]
    });
    MMD.renderLeadCapture(document.querySelector("[data-mmd-lead]"), {
      calcKey: KEY,
      ctaText: "Want us to run this properly against lender policy?",
      getContext: function () {
        var r = compute();
        return {
          low: r.low, high: r.high, surplus: r.surplus > 0 ? r.surplus : 0,
          assessRate: r.assessRate, purpose: r.ownerOcc ? "Owner-occupied" : "Investment"
        };
      }
    });

    MMD.bind(INPUTS, render);
    MMD.on("bp_form", "submit", function (e) { e.preventDefault(); render(); });
    MMD.on("bp_reset", "click", reset);
    render();
  });
})();
