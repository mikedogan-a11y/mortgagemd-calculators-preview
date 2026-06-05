# Lead capture — ActiveCampaign + Mercury wiring

The calculators **never gate results**. The estimate always shows first; an **optional**
email box (with a privacy-consent checkbox) sits below it. Engagement and email events are
pushed to a documented data layer for you to connect to ActiveCampaign and Mercury.

There is **no backend in this package** — no PII leaves the browser until you connect one
of the integration points below.

---

## 1. Two integration points (in `mmd-core.js`)

Both fire for every event:

1. **`window.dataLayer`** — a GTM-style array. Use this if you run Google Tag Manager.
2. **`window.MMDLeadHook(payload)`** — define this function on the page (before the
   calculator scripts) to receive events directly, e.g. to POST to your endpoint.

```html
<script>
  window.MMDLeadHook = function (payload) {
    // forward to your serverless endpoint / AC / Mercury
    navigator.sendBeacon('/wp-json/mmd/v1/lead', JSON.stringify(payload));
  };
</script>
```

## 2. Events

### `mmd_calculator_result` (engagement — no PII)
Fires whenever a result is shown.
```json
{
  "event": "mmd_calculator_result",
  "calculator": "purchase-costs",
  "leadTag": "Calculator - Purchase Costs",
  "source": "MortgageMD Website Calculator",
  "timestamp": "2026-06-05T03:21:00.000Z",
  "data": { "fundsRequired": 243872.4, "lvr": 80, "state": "NSW" }
}
```

### `mmd_lead_email` (lead — includes email + consent)
Fires when the user submits the optional email form (only after a valid email **and** a
ticked consent box).
```json
{
  "event": "mmd_lead_email",
  "calculator": "purchase-costs",
  "leadTag": "Calculator - Purchase Costs",
  "source": "MortgageMD Website Calculator",
  "timestamp": "2026-06-05T03:21:30.000Z",
  "email": "person@example.com",
  "consent": true,
  "data": { "fundsRequired": 243872.4, "state": "NSW", "lvr": 80 }
}
```

## 3. Lead tags (source tracking)

Use `leadTag` (also defined in `MMD.TAGS`) as the ActiveCampaign tag so you can review
conversion by calculator at ~90 days.

| calculator key | Lead tag |
|---|---|
| `borrowing-power` | `Calculator - Borrowing Power` |
| `repayments` | `Calculator - Repayments` |
| `purchase-costs` | `Calculator - Purchase Costs` |
| `lmi-lvr` | `Calculator - LMI` |
| `refinance` | `Calculator - Refinance` |
| `equity` | `Calculator - Equity` |
| `self-employed` | `Calculator - Self Employed` |
| `lmi-waiver` | `Calculator - LMI Waiver` |
| `borrowing-power-drag` | `Calculator - Borrowing Power Drag` |

## 4. Suggested wiring

**ActiveCampaign:** on `mmd_lead_email`, create/update the contact by email, add the
`leadTag`, and store the calculator `data` as custom fields. On `mmd_calculator_result`
(optional) fire a GTM event for funnel analytics only — do not create contacts (no PII).

**Mercury (CRM):** on `mmd_lead_email`, push a new enquiry/lead record with `source`,
`calculator`, `leadTag` and `data`. Map `leadTag` to your lead-source taxonomy.

**Recommended:** wire to a small WordPress REST endpoint or serverless function that holds
the AC/Mercury API keys server-side (never put API keys in front-end JS).

## 5. Privacy

- The consent checkbox text is the MortgageMD Privacy Disclosure summary
  (`MMD.DISCLAIMERS.privacyConsent`) — keep it in sync with the live Privacy Disclosure.
- `mmd_lead_email` only fires when consent is ticked.
- Do not place email or any PII in URL parameters.
- Confirm the data flow (including any overseas disclosure) matches the Privacy Disclosure
  before go-live.
