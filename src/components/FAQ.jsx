import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "How does NEWS AI choose sources?",
    answer:
      "NEWS AI curates content from a carefully vetted list of over 50 trusted, high-authority publishers including major news outlets, industry-specific publications, and reputable independent sources. Our team continuously evaluates and updates this list to ensure credibility and accuracy.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take data privacy seriously. Your reading preferences, interests, and personal information are encrypted and never shared with third parties. We use your data solely to personalize your news feed and improve your experience. You have full control over your data and can delete your account at any time.",
  },
  {
    question: "Is NEWS AI replacing journalists?",
    answer:
      "No. NEWS AI is designed to help you consume news more efficiently, not replace human journalism. We aggregate and summarize content from professional journalists and trusted publishers. Our AI helps you discover and understand news faster, while still crediting and linking to the original sources.",
  },
  {
    question: "Can I use NEWS AI on mobile?",
    answer:
      "Yes! NEWS AI is fully responsive and works seamlessly on desktop, tablet, and mobile devices. Simply access it through your web browser. We're also working on dedicated mobile apps for iOS and Android, coming soon.",
  },
  {
    question: "Is NEWS AI free? Will pricing change later?",
    answer:
      "NEWS AI is currently free during our beta phase. We want early users to experience the full platform without barriers. When we launch paid plans, beta users will receive special benefits and may continue to use core features for free. We'll notify you well in advance of any pricing changes.",
  },
  {
    question: "How accurate are the AI summaries?",
    answer:
      "Our AI summaries are highly accurate and designed to capture the core facts and context of each article. However, for critical decisions or in-depth understanding, we always encourage reading the full original articles, which are just one click away.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="min-h-screen bg-[#F8F8FF] py-16 px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="w-full border border-[#B9BFFF] rounded-3xl shadow-[0_22px_70px_rgba(63,81,181,0.16)] backdrop-blur-xl p-6 sm:p-8 md:p-10" style={{ background: 'linear-gradient(183deg, rgba(232, 236, 255, 1) 0%, rgba(243, 244, 255, 1) 100%)' }}>
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400 mb-2">
            Support
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#3f51b5] mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm sm:text-base text-[#606076] max-w-2xl">
            Quick answers about how NEWS AI works, how we handle your data, and what to
            expect as we grow.
          </p>
        </div>

       
        {/* FAQ List */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="bg-[#F0F4FF] border border-[#B9BFFF] overflow-hidden transition-all shadow-[0_8px_24px_rgba(63,81,181,0.04)] hover:shadow-[0_10px_30px_rgba(63,81,181,0.07)]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left cursor-pointer"
                >
                  <h3 className="text-sm sm:text-base md:text-[15px] font-medium text-[#444444]">
                    {faq.question}
                  </h3>
                  <FiChevronDown
                    className={`w-5 h-5 text-[#888888] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden px-5 pb-4 md:px-6 md:pb-5 text-sm text-[#555] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <p className="text-[#666]">
            Still unsure about something? Our team is here to help you make sense of your
            information diet.
          </p>
          <a
            href="mailto:support@newsai.com"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#3f51b5] text-white font-medium shadow-[0_10px_30px_rgba(63,81,181,0.45)] hover:bg-[#344295] transition-colors"
          >
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ
