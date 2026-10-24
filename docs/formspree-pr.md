# Send website inquiries directly through Formspree

Branch: `feat/formspree-inquiries`, based on latest main `3efe2ad`.

[Create the PR](https://github.com/anandanikait-bot/Leqad-website/pull/new/feat/formspree-inquiries)

GitHub API PR creation returned `Post "https://api.github.com/graphql": Forbidden`. The branch is pushed; no PR was created automatically. Nothing was merged or deployed.

---

Replace the email-app handoff with direct inquiry submission to the owner-provided Formspree endpoint. The existing React form sends all inquiry fields, prevents duplicate clicks while pending, and shows success only after Formspree accepts the request. Errors retain the draft and offer retry/direct-email fallback; copy recovery remains available.

No new dependencies or hosting backend are required. No website redesign, deployment, or merge.

Validation includes TypeScript, ESLint, unit/build checks, all 127 browser tests, and 15 mocked ready/success/error accessibility and responsive states across five widths. The service is intercepted in tests so no real inquiries are created.

- [Integration and validation](docs/formspree-integration.md)
- [Mobile form](docs/screenshots/formspree/ready-375.png)
- [Mocked success](docs/screenshots/formspree/success-375.png)
- [Mocked error](docs/screenshots/formspree/error-375.png)

After the approved deployment, verify one real submission in the intended private Formspree account and confirm Gmail notifications. Formspree account forwarding, live CORS/CSP and actual inbox delivery were not verified locally.
