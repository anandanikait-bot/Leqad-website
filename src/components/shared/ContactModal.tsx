import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);

  // Sync default topic when opened
  React.useEffect(() => {
    if (defaultTopic) setTopic(defaultTopic);
  }, [defaultTopic]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setOrganization('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2943]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#D9DDD9] shadow-xl max-w-lg w-full overflow-hidden text-[#0E2943]">
        {/* Modal Header */}
        <div className="bg-[#FAF8F4] px-6 py-4 border-b border-[#D9DDD9] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#B74B21] tracking-wider">
              Partnerships & Inquiries
            </span>
            <h3 className="text-base font-bold text-[#0E2943]">
              Start a Conversation with Leqad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#55616B] hover:text-[#0E2943] hover:bg-[#F5EFE7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0E2943]">Inquiry Received</h4>
              <p className="text-sm text-[#55616B] leading-relaxed max-w-sm mx-auto">
                Thank you for reaching out regarding <strong>{topic}</strong>. The Leqad project team reviews partnership inquiries weekly.
              </p>
              <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#D9DDD9] text-xs font-mono text-[#55616B]">
                Inquiry Ref: LQ-{Math.floor(100000 + Math.random() * 900000)} · Logged
              </div>
              <div className="pt-2">
                <Button variant="primary" size="md" onClick={handleReset}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-mono text-xs font-semibold text-[#0E2943]">
                  Area of Interest
                </label>
                <select
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
                  <label className="font-mono text-xs font-semibold text-[#0E2943]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-semibold text-[#0E2943]">
                    Work / School Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ada@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-semibold text-[#0E2943]">
                  Organization / School / Team
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oakridge High Robotics / CAD Lab"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-semibold text-[#0E2943]">
                  Brief Note or Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your student group, CAD platform, or what you'd like to explore..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[#D9DDD9] bg-[#FAF8F4] text-[#0E2943] placeholder-[#55616B]/50 focus:outline-hidden focus:ring-2 focus:ring-[#0E2943]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#D9DDD9]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#55616B] hover:text-[#0E2943] cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="rust"
                  size="md"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
