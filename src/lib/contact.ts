// Set only after the owner approves a public project address. Until then the
// inquiry helper remains draft-only; message delivery is a launch blocker.
export const contactConfig: { email: string | null } = { email: null };
export const inquiryActionLabel = contactConfig.email ? 'Contact Leqad' : 'Draft an Inquiry Note';
