// app/return-exchange/page.tsx

import React from 'react';
import { Metadata } from 'next';

// Best practice: Always include the last updated date for legal documents
const LAST_UPDATED = "October 26, 2023";
// Note: The content provided uses a different email (sukanyaindia.in) in one place, 
// but we will use the consistent Legstar email for primary contact.
const CONTACT_EMAIL_LEGSTAR = "customercarelegstar@gmail.com"; 

// ----------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Legstar',
  description: 'Details on how to return or exchange products purchased from Legstar within the 7-day policy window.',
};

// ----------------------------------------------------------------------
// HELPER COMPONENTS (Replicated from Privacy Policy for Consistency)
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function ReturnExchangePolicyPage() {
    
    // Placeholder links (since actual URLs are not provided)
    const PLACEHOLDER_URL = "#"; 

    return (
        <main className="bg-gray-50 min-h-screen py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-2xl rounded-lg p-8 sm:p-12">

                {/* Header */}
                <header className="mb-10 text-center border-b pb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">Return and Exchange Policy</h1>
                </header>

                {/* Core Policy */}
                <Section title="7-Day Return & Exchange Period">
                    <p className="text-gray-700 leading-relaxed">
                        At Legstar, we want each of you to be 100% happy with your purchase. However, we understand that sometimes you may need to return or exchange the items ordered. Hence, our policy offers a generous <strong>7-days return / exchange period after delivery</strong>.
                    </p>
                    <p className='text-gray-700 font-medium mt-2'>
                        Please note that exchanges are limited to one occurrence per order.
                    </p>
                </Section>
                
                {/* Eligibility */}
                <Section title="Eligibility Requirements">
                    <p className="text-gray-700">
                        To be eligible for a Return / Exchange, the products must meet the following criteria:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>The products must be in the same condition that you received them in.</li>
                        <li>They must be unused.</li>
                        <li>They must retain proper tags.</li>
                        <li>They should have their original packaging.</li>
                        <li>You must provide the invoice or proof of purchase.</li>
                    </ul>
                </Section>
                
                {/* Initiation */}
                <Section title="Initiating a Return or Exchange">
                    <p className="text-gray-700">
                        To start the Return / Exchange process, you have two options:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>
                            You can directly 
                            <a href={PLACEHOLDER_URL} className="text-[#E6D8B2] hover:text-[#E6D8B2] font-medium ml-1">
                                Click Here
                            </a> 
                            to initiate the request.
                        </li>
                        <li>
                            Optionally, you can initiate Return / Exchange on eligible orders through the order page of your registered account. 
                            <a href={PLACEHOLDER_URL} className="text-[#E6D8B2] hover:text-[#E6D8B2] font-medium ml-1">
                                Click Here to login
                            </a>.
                        </li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                        If your Return / Exchange is accepted, we&apos;ll arrange a pick-up for the parcel.
                    </p>
                </Section>

                {/* Processing and Damages */}
                <Section title="Processing, Quality Check, and Issues">
                    
                    <SubSection title="Quality Check & Outcome">
                        <p className="text-gray-700">
                            The parcel, when received, undergoes quality checks. Upon satisfactory completion of the process, Exchange products will be shipped or Refunds will be initiated.
                        </p>
                    </SubSection>

                    <SubSection title="Damages & Issues">
                        <p className="text-gray-700">
                            We conduct a thorough quality check on each item before dispatch. However, if you receive a wrong, defective, or damaged item, you can initiate a return or exchange, provided that <strong>photos and videos are submitted</strong> as proof.
                        </p>
                    </SubSection>
                </Section>

                {/* Cancellations */}
                <Section title="Order Cancellation">
                    <p className="text-gray-700">
                        Please reach out to us via email or WhatsApp chat option if you should need to cancel your order.
                    </p>
                    <p className="text-red-700 font-semibold mt-2">
                        Orders placed on this website can only be cancelled before they are dispatched.
                    </p>
                    <p className='text-gray-700 mt-4'>
                        Email: <a 
                            href={`mailto:${CONTACT_EMAIL_LEGSTAR}`} 
                            className="text-[#E6D8B2] hover:text-[#E6D8B2] font-medium"
                        >
                            {CONTACT_EMAIL_LEGSTAR}
                        </a>
                    </p>
                </Section>

                {/* Refunds */}
                <Section title="Refund Procedure and Timeline">
                    <p className="text-gray-700">
                        We will notify you once we&apos;ve received and inspected your returns, and let you know if the refund was approved.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                        <li>
                            <strong>Prepaid Orders:</strong> If approved, you&apos;ll be automatically refunded on your original payment method within 7 working days.
                        </li>
                        <li>
                            <strong>COD (Cash On Delivery) Orders:</strong> The amount will be credited to the bank account specified by you during the refund process.
                        </li>
                    </ul>
                    <p className="text-gray-600 italic text-sm mt-4">
                        Kindly note it takes some lead time for your bank or Credit Card Company to process and post the refund. The lead time depends on the bank / credit card companies’ policy once the amount is released from our end.
                    </p>
                    <p className="text-red-700 font-bold mt-4">
                        Note: In case of COD orders, the shipping amount is non-refundable at the time of returns.
                    </p>
                </Section>
                
                {/* Sale Policy */}
                <Section title="Sale Items Policy">
                    <p className="text-lg font-bold text-red-700">
                        No Returns / Only Exchanges are acceptable for products purchased on Sale.
                    </p>
                </Section>

                {/* Contact */}
                <Section title="Contact Us">
                    <p className="text-gray-700">
                        You can also contact us for any Return / Exchange questions at: 
                        <a 
                            href={`mailto:customercare@sukanyaindia.in`} 
                            className="text-[#E6D8B2] hover:text-[#E6D8B2] ml-2 transition duration-150"
                        >
                            customercare@sukanyaindia.in
                        </a> 
                        or via the WhatsApp chat option available on the website.
                    </p>
                    <p className='text-gray-700 mt-2'>
                        <span className='font-semibold'>Availability:</span> We are available from 10:00 am to 7:00 pm (Tues-Sun). If we are unavailable when you reach out to us, be rest assured your concerns will be attended to as soon as possible.
                    </p>
                </Section>

            </div>
        </main>
    );
}