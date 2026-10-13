import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Printer,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: 'How do I ensure my QR codes scan reliably on all mobile cameras?',
      a: 'Three key rules guarantee 100% scanning: 1) High Color Contrast: keep foreground dark and background light (or check our built-in contrast meter). 2) Quiet Zone: preserve at least 2 margin blocks around the code so camera sensors can isolate the pattern. 3) High Error Correction (H or Q) whenever you insert a center logo.',
    },
    {
      q: 'What is the recommended print size for business cards, menus, and posters?',
      a: 'A reliable rule of thumb is: QR Code Size = Expected Scanning Distance divided by 10. For a business card held 20cm away, a 2cm x 2cm code is perfect. For a poster scanned from 2 meters away, print at least 20cm x 20cm. We recommend minimum 2.5cm (1 inch) for general print materials.',
    },
    {
      q: 'What is the difference between Static and Dynamic QR codes?',
      a: 'Static QR codes encode the data directly into the black-and-white modules. They work forever without any server or subscription, but their destination cannot be edited after printing. Dynamic QR codes route through a short redirection URL, enabling you to change the destination URL anytime and measure scan analytics over time.',
    },
    {
      q: 'Can I export in vector SVG for large format printing and billboard signs?',
      a: 'Yes! Select the SVG format in the download menu. The SVG export uses pure mathematical vector coordinates and can be scaled infinitely to billboard dimensions in Adobe Illustrator, Figma, CorelDRAW, or Canva without any pixelation or loss of quality.',
    },
    {
      q: 'Why does adding a center logo require Error Correction Level H?',
      a: 'QR codes feature Reed-Solomon error correction algorithm. Level H can recover up to 30% of obscured or damaged modules. When you place a center logo, it covers some data modules. Level H ensures the surrounding modules have plenty of redundant parity bytes so camera apps decode the data without noticing the logo.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Help, Best Practices & Support
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Everything you need to know about QR technology, printing guidelines, and scan mechanics.
        </p>
      </div>

      {/* Print & Reliability Guidelines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Printer className="h-4 w-4" />
            <span>The 10:1 Distance Rule</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Divide your expected scanning distance by 10 to determine the minimum physical width of your printed QR code.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Quiet Zone Margin</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Keep at least 2-4 empty blocks around your QR code. Without a quiet zone, textured backgrounds can disrupt autofocus.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>High Contrast Discipline</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Maintain at least a 4:1 luminance contrast ratio. Avoid light pastels on white paper or dark navy on black surfaces.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-l-2 border-indigo-500">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Contact Support & Feedback
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Have a question about high-volume QR packaging, specialized formats, or hardware scanner compatibility? Send our engineering team a message.
        </p>

        {contactSent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 space-y-1">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            <p className="font-semibold">Thank you for reaching out!</p>
            <p>Our team has received your inquiry and will respond to your email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Message / Question *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or use-case..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Support Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
