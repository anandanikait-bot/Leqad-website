// Owner-approved Leqad support destination. The website opens an email draft;
// delivery is handled by the visitor's email app.
export const contactConfig: { email: string | null } = { email: 'anandanikait@gmail.com' };
export const inquiryActionLabel = contactConfig.email ? 'Contact Leqad' : 'Draft an Inquiry Note';
