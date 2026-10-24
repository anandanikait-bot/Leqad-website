# Submit inquiries with the verified Formspree response contract

Branch `fix/formspree-response-contract` targets latest main `7efe606`. The rebase completed without conflicts and includes the original unmerged Formspree integration.

[Create the PR](https://github.com/anandanikait-bot/Leqad-website/pull/new/fix/formspree-response-contract)

Submit website inquiries directly to the owner-approved Formspree endpoint, with confirmation based on Formspree’s actual `{ next: string }` success schema. The previous `ok: true` assumption could report failure after acceptance. HTTP errors, malformed bodies, and error-bearing payloads remain failures; HTTP 429 now explicitly asks the visitor to try again later and retains the draft.

Rebased onto main at `7efe606`, including the responsive and CAD scrolling fixes, without conflicts. This branch also includes the preceding Formspree integration because its feature branch has not been merged.

Validation includes TypeScript, ESLint, unit/build checks, the complete browser suite, and 15 mocked success/error/ready accessibility states. External requests are mocked to avoid creating test inquiries. Official response verification is pinned in the integration notes; live mailbox delivery is not claimed.

- [Official response references and integration notes](docs/formspree-integration.md)
- [Error state](docs/screenshots/formspree/error-375.png)
- [Success state](docs/screenshots/formspree/success-375.png)

No merge or deployment.
