/* Home Loan Repayment Calculator — depends on mmd-core.js
   Pillar: home loans / fixed vs variable.
   Lead tag: Calculator - Repayments. */
(function () {
  "use strict";
  var KEY = "repayments";

  var INPUTS = ["rp_loan", "rp_rate", "rp_term", "rp_type", "rp_freq"];
  var DEFAULTS = { rp_rate: 6.50, rp_term: 30 };

  var FREQ_LABEL = { "12": "month", "26": "fortnight", "52": "week" };

  function num(id, fallback) {
    var raw = (MMD.$(id) && MMD.$(id).value || "").trim();
    if (raw === "" && fallback !== undefined) return fallback;
    return MMD.parseMoney(raw);
  }

  function compute() {
    var loan = num("rp_loan");
    var rate = num("rp_rate", DEFAULTS.rp_rate);
    var years = num("rp_term", DEFAULTS.rp_term);
    var interestOnly = MMD.$("rp_type").value === "io";
    var ppy = MMD.parseMoney(MMD.$("rp_freq").value) || 12;

    var n = Math.round(years * ppy);
    var payment = MMD.repayment(loan, rate, years, ppy, interestOnly);

    var totalInterest, totalRepaid;
    if (interestOnly) {
      totalInterest = payment * n;          // principal stays outstanding
      totalRepaid = totalInterest + loan;   // principal repaid at end
    } else {
      totalRepaid = payment * n;
      totalInterest = totalRepaid - loan;
    }

    // Rate-movement scenarios: -0.50%, current, +1.00%, +2.00%
    var deltas = [-0.50, 0, 1.00, 2.00];
    var scenarios = deltas.map(function (d) {
      var sr = Math.max(0, rate + d);
      return { delta: d, rate: sr, payment: MMD.repayment(loan, sr, years, ppy, interestOnly) };
    });

    return {
      loan: loan, rate: rate, years: years, ppy: ppy,
      interestOnly: interestOnly, n: n, payment: payment,
      totalInterest: MMD.finite(totalInterest), totalRepaid: MMD.finite(totalRepaid),
      scenarios: scenarios
    };
  }

  function scenLabel(s) {
    if (s.delta === 0) return "Current rate (" + MMD.fmtPercent(s.rate) + ")";
    var sign = s.delta > 0 ? "+" : "−";
    return "Rate " + sign + MMD.fmtPercent(Math.abs(s.delta)) + " (" + MMD.fmtPercent(s.rate) + ")";
  }

  function render() {
    var r = compute();
    var unit = FREQ_LABEL[String(r.ppy)] || "period";

    MMD.setText("rpr_herolabel", "Estimated repayment (per " + unit + ")");
    MMD.setText("rpr_payment", MMD.fmtCurrency(r.payment));
    MMD.setText("rpr_herohint",
      (r.interestOnly ? "Interest only" : "Principal & interest") +
      " · " + MMD.fmtPercent(r.rate) + " over " + MMD.fmtNumber(r.years) + " yrs");

    MMD.setText("rpr_interest", MMD.fmtCurrency(r.totalInterest));
    MMD.setText("rpr_interestsub",
      r.interestOnly ? "Interest-only — principal not reduced during the IO period." : "");

    MMD.setText("rpr_total", MMD.fmtCurrency(r.totalRepaid));

    r.scenarios.forEach(function (s, idx) {
      MMD.setText("rpr_scen" + idx + "label", scenLabel(s));
      MMD.setText("rpr_scen" + idx, MMD.fmtCurrency(s.payment));
      var card = MMD.$("rpr_scen" + idx + "card");
      if (card) {
        card.classList.remove("is-positive", "is-caution");
        if (s.delta === 0) card.classList.add("is-positive");
        else if (s.delta > 0) card.classList.add("is-caution");
      }
    });

    MMD.lead.track(KEY, {
      payment: r.payment, frequency: unit, rate: r.rate,
      loan: r.loan, type: r.interestOnly ? "IO" : "P&I"
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
      calcName: "Home Loan Repayment",
      showComparisonWarning: true,
      assumptions: [
        "Repayments are estimates assuming the interest rate stays constant for the period shown.",
        "Fees and charges are not included in these figures.",
        "The rate-movement scenario is illustrative only and is not a forecast or an offer of credit."
      ],
      warnings: [
        "Interest rates can change, which would change your actual repayments.",
        "Actual repayments are set by your lender and depend on lender policy and your circumstances."
      ]
    });
    MMD.renderLeadCapture(document.querySelector("[data-mmd-lead]"), {
      calcKey: KEY,
      ctaText: "Thinking about refinancing or fixing? Let's compare your options.",
      getContext: function () {
        var r = compute();
        return { payment: r.payment, rate: r.rate, loan: r.loan, type: r.interestOnly ? "IO" : "P&I" };
      }
    });

    MMD.bind(INPUTS, render);
    MMD.on("rp_form", "submit", function (e) { e.preventDefault(); render(); });
    MMD.on("rp_reset", "click", reset);
    render();
  });
})();
