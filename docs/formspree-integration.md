# Formspree inquiry submission

The existing React/Vite controlled form now posts directly to the owner-provided public endpoint `https://formspree.io/f/xoeevqpq`. It uses React state and native `fetch` with JSON and `Accept: application/json`, following the asynchronous submission approach without adding an SDK. This works with static hosting and the existing Express server; no server secret or new backend route is required.

## Changes

- `src/lib/contact.ts` contains the public endpoint and approved fallback email.
- `ContactModal.tsx` submits name, email, organization, topic, message, subject and Formspree's `_gotcha` honeypot. Email and message are required.
- Sending disables repeat submission and field editing. Success requires an HTTP success response with `ok: true`. It reads "Inquiry submitted to Leqad support." This confirms Formspree acceptance, not Gmail delivery.
- Service rejection, network errors, unexpected response bodies and a 15-second timeout retain the draft and offer retry or direct email. Closing cancels the pending browser request; a response for a closed dialog cannot mark a newly opened one successful.
- Copy/manual-copy recovery, keyboard focus handling, dialog dismissal and existing entry-context drafts remain available. Copy feedback makes no claim about submission.
- Partners copy now describes direct submission instead of opening an email app.

## Validation

Browser tests intercept the exact Formspree endpoint. They check the actual request fields and content type, pending/success behavior, rejection and retry for 422/429/500, network failure, an unexpected HTML response, and incomplete fields. No test inquiry was sent to the live service.

The visual/accessibility script `scripts/audit-formspree.mjs` also intercepts requests. It captures ready, success and error states at 320, 375, 768, 1024 and 1440 pixels. Screenshots depicting success are explicitly simulated test states.

```sh
npm run typecheck
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4311 npm run test:browser
SCREENSHOT_ORIGIN=http://127.0.0.1:4311 node scripts/audit-formspree.mjs
```

## Publishing and account checks

No merge or deployment was performed. After the approved deployment, submit one real inquiry and confirm it appears in the intended Formspree account. Confirm that account's notification destination is `anandanikait@gmail.com`, that the form is activated, and that any allowed-domain and spam settings permit the published domain. The client endpoint does not configure or verify mailbox forwarding or private dashboard permissions. Check live CORS/CSP behavior and quota limits on the actual host. Messages and account access are managed by Formspree; the public endpoint provides submission access, not an inbox-reading interface.

Final local results: TypeScript, ESLint, production build, 24 unit tests and all 127 browser tests passed after incorporating the responsive changes merged through PR #32. All 15 mocked form-state accessibility scans reported zero WCAG A/AA violations and no page overflow. [Test output](screenshots/formspree/test-results.txt), [accessibility results](screenshots/formspree/accessibility.json), [ready mobile form](screenshots/formspree/ready-375.png), [mocked success](screenshots/formspree/success-375.png), [mocked error](screenshots/formspree/error-375.png).
