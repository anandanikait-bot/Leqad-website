import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Info } from 'lucide-react';
import { Button } from './Button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Technical Alignment',
}) => {
  const [topic, setTopic] = useState(defaultTopic);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Sync default topic and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      if (defaultTopic) setTopic(defaultTopic);
      setCopied(false);
      setCopyError(null);

      // Lock background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first input
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstInput?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        previousActiveElement.current?.focus?.();
      };
    }
  }, [isOpen, defaultTopic]);

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
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyNote = async () => {
    setCopyError(null);
    const draftText = `--- Leqad Partnership Inquiry ---
Topic: ${topic}
Name: ${name.trim() || '[Not specified]'}
Email: ${email.trim() || '[Not specified]'}
Organization: ${organization.trim() || '[Not specified]'}
Message: ${message.trim() || '[No message entered]'}
---------------------------------`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(draftText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = draftText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopyError('Unable to copy automatically. Please select and copy your text manually.');
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
              Prepare an Inquiry Note
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#55616B] hover:text-[#0E2943] hover:bg-[#F5EFE7] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943]"
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
                Draft-Only Inquiry Helper
              </strong>
              <span>
                This form prepares a formatted note for you. It does not send messages directly from the browser. Fill in your details below and click <strong>Copy Inquiry Note</strong> to paste into your preferred email client.
              </span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleCopyNote(); }} className="space-y-3.5 text-xs sm:text-sm">
            <div className="space-y-1">
              <label htmlFor="contact-topic" className="font-mono text-xs font-semibold text-[#0E2943]">
                Area of Interest
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
                  type="text"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-email" className="font-mono text-xs font-semibold text-[#0E2943]">
                  Work / School Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="ada@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                type="text"
                placeholder="e.g. Oakridge Robotics / University CAD Lab"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-message" className="font-mono text-xs font-semibold text-[#0E2943]">
                Brief Note or Context
              </label>
              <textarea
                id="contact-message"
                rows={3}
                placeholder="Tell us about your student group, CAD platform, or what you would like to explore..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
              />
            </div>

            {/* Feedback alert when copied */}
            {copied && (
              <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Inquiry note copied to clipboard. You can now paste this into an email to send to the team.</span>
              </div>
            )}

            {copyError && (
              <div className="p-2.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                {copyError}
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#D9DDD9]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-[#55616B] hover:text-[#0E2943] cursor-pointer"
              >
                Close
              </button>
              <Button
                type="button"
                variant="rust"
                size="sm"
                onClick={handleCopyNote}
                icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Inquiry Note'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
