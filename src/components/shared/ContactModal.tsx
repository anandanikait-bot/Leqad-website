import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Info } from 'lucide-react';
import { Button } from './Button';
import { contactConfig } from '../../lib/contact';

// Every entry point
// must resolve to one of the actual select values to avoid a blank topic.
const CONTACT_TOPICS = new Set([
  'Technical Alignment',
  'Educational Pilot',
  'Robotics Team',
  'Commercial Exploration',
  'General Inquiry',
]);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  defaultMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Technical Alignment',
  defaultMessage = '',
}) => {
  // Keep separate drafts for each entry context, including planner prefills.
  // Closing a dialog must never discard the visitor's edits.
  const draftKey = JSON.stringify([defaultTopic, defaultMessage]);
  const [drafts, setDrafts] = useState<Record<string, { topic: string; message: string }>>({});
  const draft = drafts[draftKey] ?? {
    topic: CONTACT_TOPICS.has(defaultTopic) ? defaultTopic : 'General Inquiry',
    message: defaultMessage,
  };
  const { topic, message } = draft;
  const updateDraft = (changes: Partial<typeof draft>) => {
    setDrafts(current => ({ ...current, [draftKey]: { ...draft, ...changes } }));
    setCopied(false);
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submissionController = useRef<AbortController | null>(null);

  const fallbackRef = useRef<HTMLTextAreaElement | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Restore focus and scrolling without resetting the draft.
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      setCopied(false);
      setCopyError(null);
      setSubmitting(false);
      setSubmitted(false);
      setSubmitError(null);

      // Lock background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first input
      const focusTimeout = window.setTimeout(() => {
        modalRef.current?.querySelector<HTMLElement>('#contact-topic')?.focus();
      }, 50);

      return () => {
        submissionController.current?.abort();
        submissionController.current = null;
        window.clearTimeout(focusTimeout);
        window.clearTimeout(copyTimer.current);
        document.body.style.overflow = originalOverflow;
        previousActiveElement.current?.focus?.();
      };
    }
  }, [isOpen, defaultTopic, defaultMessage]);

  // Trap focus & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && (document.activeElement === first || !modalRef.current.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !modalRef.current.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const draftText = `--- Leqad Partnership Inquiry ---
Topic: ${topic}
Name: ${name.trim() || '[Not specified]'}
Email: ${email.trim() || '[Not specified]'}
Organization: ${organization.trim() || '[Not specified]'}
Message: ${message.trim() || '[No message entered]'}
---------------------------------`;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionController.current || submitted) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const controller = new AbortController();
    submissionController.current = controller;
    setSubmitting(true);
    setSubmitError(null);
    setCopyError(null);
    setCopied(false);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(contactConfig.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), organization: organization.trim(),
          topic, message: message.trim(), _subject: `Leqad inquiry: ${topic}`,
          _gotcha: (form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value || '',
        }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (submissionController.current !== controller) return;
      if (!response.ok || result?.ok !== true) {
        throw new Error('Submission was not accepted');
      }
      setSubmitted(true);
    } catch {
      if (submissionController.current === controller) {
        setSubmitError('We could not confirm your submission. Your draft is kept. Please try again, or email Leqad support directly.');
      }
    } finally {
      window.clearTimeout(timeout);
      if (submissionController.current === controller) {
        submissionController.current = null;
        setSubmitting(false);
      }
    }
  };

  const handleCopyNote = async () => {
    setCopyError(null);
    setCopied(false);
    window.clearTimeout(copyTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
      copyTimer.current = window.setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopyError('Unable to copy automatically. Select all of the inquiry below, then use your device’s Copy command or Ctrl+C (Command+C on Mac).');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2943]/60 backdrop-blur-xs animate-fadeIn"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl border border-[#D9DDD9] shadow-xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-[#0E2943]"
      >
        {/* Modal Header */}
        <div className="bg-[#FAF8F4] px-6 py-4 border-b border-[#D9DDD9] flex items-center justify-between flex-shrink-0">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#B74B21] tracking-wider">
              Partnerships & Collaboration
            </span>
            <h3 id="modal-title" className="text-base font-bold text-[#0E2943]">
              Contact Leqad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[#55616B] hover:text-[#0E2943] hover:bg-[#F5EFE7] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Clear, honest delivery notice per Section 8 */}
          <div className="bg-[#FAF8F4] rounded-lg p-3.5 border border-[#D9DDD9] flex items-start gap-2.5 text-xs text-[#0E2943]">
            <Info className="w-4 h-4 text-[#B74B21] flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-[#55616B] leading-relaxed">
              <strong className="text-[#0E2943] font-medium block">
                Send an inquiry to Leqad support
              </strong>
              <span>
                Your inquiry is submitted through Formspree to Leqad support. Your email is used to reply.
              </span>
            </div>
          </div>

          <form action={contactConfig.endpoint} method="POST" onSubmit={handleSubmit} aria-busy={submitting} className="space-y-3.5 text-xs sm:text-sm">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            {submitted && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">Inquiry submitted to Leqad support.</p>}
            {submitError && <div role="alert" className="rounded-md bg-rose-50 p-3 text-sm text-rose-800">{submitError} <a className="underline" href={`mailto:${contactConfig.email}`}>Email Leqad support</a></div>}
            <div className="space-y-1">
              <label htmlFor="contact-topic" className="font-mono text-xs font-semibold text-[#0E2943]">
                Area of Interest
              </label>
              <select
                id="contact-topic"
                  name="topic" disabled={submitting || submitted}
                value={topic}
                onChange={(e) => updateDraft({ topic: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
              >
                <option value="Technical Alignment">Technical Alignment & Platform Fit</option>
                <option value="Educational Pilot">Educational Pilot (School / Maker Space)</option>
                <option value="Robotics Team">Robotics Team Mentorship / Testing</option>
                <option value="Commercial Exploration">Commercial & Distribution Collaboration</option>
                <option value="General Inquiry">General Feedback or Inquiries</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="contact-name" className="font-mono text-xs font-semibold text-[#0E2943]">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name" disabled={submitting || submitted}
                  type="text"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setCopied(false); }}
                  className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-email" className="font-mono text-xs font-semibold text-[#0E2943]">
                  Work / School Email
                </label>
                <input
                  id="contact-email"
                  name="email" disabled={submitting || submitted}
                  type="email" required maxLength={254}
                  placeholder="ada@institution.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setCopied(false); }}
                  className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-organization" className="font-mono text-xs font-semibold text-[#0E2943]">
                Organization / School / Team
              </label>
              <input
                id="contact-organization"
                  name="organization" disabled={submitting || submitted}
                type="text"
                placeholder="e.g. Oakridge Robotics / University CAD Lab"
                value={organization}
                onChange={(e) => { setOrganization(e.target.value); setCopied(false); }}
                className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-message" className="font-mono text-xs font-semibold text-[#0E2943]">
                Brief Note or Context
              </label>
              <textarea
                id="contact-message"
                  name="message" disabled={submitting || submitted}
                rows={3} required maxLength={5000}
                placeholder="Tell us about your student group, CAD platform, or what you would like to explore..."
                value={message}
                onChange={(e) => updateDraft({ message: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
              />
            </div>

            {/* Feedback alert when copied */}
            {copied && (
              <div role="status" className="p-2.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Inquiry note copied to clipboard.</span>
              </div>
            )}

            {copyError && (
              <div className="p-2.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                <p role="alert">{copyError}</p>
                <label htmlFor="contact-complete-draft" className="mt-3 block font-semibold">Complete inquiry text</label>
                <textarea ref={fallbackRef} id="contact-complete-draft" readOnly value={draftText} rows={8}
                  className="mt-1 w-full rounded-md border border-rose-300 bg-white p-3 text-sm text-[#0E2943] focus-visible:outline-2 focus-visible:outline-[#0E2943]" />
                <Button type="button" variant="secondary" size="sm" className="mt-2 min-h-11"
                  onClick={() => { fallbackRef.current?.focus(); fallbackRef.current?.select(); }}>Select All</Button>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-end gap-2 border-t border-[#D9DDD9]">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-md px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#0E2943] text-xs font-medium text-[#55616B] hover:text-[#0E2943] cursor-pointer"
              >
                Close
              </button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="min-h-11"
                onClick={handleCopyNote}
                icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Inquiry Note'}
              </Button>
              <Button type="submit" variant="rust" size="sm" className="min-h-11" disabled={submitting || submitted}>{submitting ? 'Sending…' : submitted ? 'Submitted' : 'Send inquiry'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
