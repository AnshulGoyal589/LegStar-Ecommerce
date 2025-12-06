// app/privacy-policy/page.tsx

import React from 'react';
import { Metadata } from 'next';

// Best practice: Always include the last updated date for legal documents
const LAST_UPDATED = "October 26, 2023";
const CONTACT_EMAIL = "customercarelegstar@gmail.com";

// ----------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Privacy Policy | Legstar',
  description: 'Learn how Legstar collects, uses, and protects your personal information.',
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function PrivacyPolicyPage() {
  
  // Helper Component for consistency
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="space-y-4 pt-6">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">{title}</h2>
      {children}
    </section>
  );

  const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-[#E6D8B2] mt-6">{title}</h3>
      {children}
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-2xl rounded-lg p-8 sm:p-12">
        
        {/* Header */}
        <header className="mb-10 text-center border-b pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        </header>

        {/* Introduction */}
        <Section title="Introduction">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Legstar. We are committed to protecting your privacy and ensuring a safe online experience. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our e-commerce website <strong>www.legstar.in</strong> and use our services.
          </p>
        </Section>

        {/* Information We Collect */}
        <Section title="Information We Collect">
          <p className="text-gray-700">
            We collect various types of information to provide and improve our services, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <strong>Personal Information:</strong> Includes your name, email address, phone number, shipping address, and payment details when you make a purchase or create an account.
            </li>
            <li>
              <strong>Transaction Information:</strong> Details about your purchases and payment transactions.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact with our Site, including your IP address, browser type, pages visited, and the time and date of your visit.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and gather data on how you use our Site.
            </li>
          </ul>
        </Section>

        {/* How We Use Your Information */}
        <Section title="How We Use Your Information">
          <p className="text-gray-700">
            We use your information exclusively for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <strong>Processing Transactions:</strong> To process and fulfil your orders, manage your account, and handle payments.
            </li>
            <li>
              <strong>Improving Our Services:</strong> To analyze usage data and enhance the functionality and content of our Site.
            </li>
            <li>
              <strong>Customer Support:</strong> To respond to your inquiries, provide customer service, and resolve any issues.
            </li>
            <li>
              <strong>Marketing:</strong> To send you promotional materials and updates about our products and services, with your consent where required.
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal obligations.
            </li>
          </ul>
        </Section>
        
        {/* Sharing Your Information & Data Security */}
        <Section title="Disclosure and Security">
          
          <SubSection title="Sharing Your Information">
            <p className="text-gray-700">
              We may share your information with third parties only in the following necessary situations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Service Providers:</strong> Sharing data with third-party service providers who perform services on our behalf (e.g., payment processors, shipping companies, and email marketing services).
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities, banks, regulators, and affiliates.
              </li>
            </ul>
          </SubSection>

          <SubSection title="Data Security">
            <p className="text-gray-700">
              We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security. We limit data access to authorized personnel.
            </p>
          </SubSection>
          
          <SubSection title="Aggregate Information">
            <p className="text-gray-700">
              Aggregate user behavior data may be shared with third parties for business relationships and statistical analysis. Such data will not personally identify you.
            </p>
          </SubSection>

        </Section>
        
        {/* Intellectual Property and Cookies */}
        <Section title="Intellectual Property and Tracking">
          
          <SubSection title="Intellectual Property">
            <p className="text-gray-700">
              We hold intellectual property rights to the Website. Downloaded materials do not transfer ownership. The Website content is protected by copyright laws.
            </p>
          </SubSection>

          <SubSection title="Cookies Policy">
            <p className="text-gray-700">
              We send cookies to your device for unique browser identification and service improvement. Cookies come as session or persistent cookies. Disabling cookies might impact Legstar functionality. Third-party tools may collect anonymous information to tailor advertisements, but no Personal Information is used for this purpose. Opt-out instructions vary by browser settings.
            </p>
          </SubSection>
        </Section>

        {/* Your Rights and Enforcement */}
        <Section title="User Rights and Policy Enforcement">
          
          <SubSection title="Your Rights">
            <p className="text-gray-700">
              Depending on your jurisdiction, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Access:</strong> The right to access and obtain a copy of your personal information.
              </li>
              <li>
                <strong>Correction:</strong> The right to request correction of inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> The right to request deletion of your personal information, subject to legal obligations.
              </li>
              <li>
                <strong>Opt-Out:</strong> The right to opt out of receiving marketing communications from us.
              </li>
            </ul>
            <p className="font-semibold mt-4 text-gray-800">
              To exercise these rights, please contact us at: 
              <a 
                href={`mailto:${CONTACT_EMAIL}`} 
                className="text-[#E6D8B2] hover:text-[#E6D8B2] ml-2 transition duration-150"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </SubSection>

          <SubSection title="Policy Enforcement">
            <p className="text-gray-700">
              We may use collected information to enforce terms, conditions, and this Privacy Policy. Registered users can modify Personal Information and privacy preferences via their account settings. Industry-standard security measures protect your account data.
            </p>
          </SubSection>

          <SubSection title="Limitation of Liability">
            <p className="text-red-600 font-medium">
              Legstar is not responsible for intercepted internet data and releases any claims arising from unauthorized use or interception.
            </p>
          </SubSection>
        </Section>

      </div>
    </main>
  );
}