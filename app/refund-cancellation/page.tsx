// app/refund-cancellation/page.tsx

import React from 'react';
import { Metadata } from 'next';

// Best practice: Always include the last updated date for legal documents
const LAST_UPDATED = "October 26, 2023";
const CONTACT_EMAIL = "customercarelegstar@gmail.com";

// ----------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Legstar',
  description: 'Understand Legstar\'s policy regarding refunds and order cancellations.',
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

export default function RefundCancellationPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-2xl rounded-lg p-8 sm:p-12">

                {/* Header */}
                <header className="mb-10 text-center border-b pb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">Refund & Cancellation Policy</h1>
                </header>

                {/* Introduction */}
                <Section title="General Refund Condition">
                    <p className="text-gray-700 leading-relaxed">
                        Amount once paid through the payment gateway shall not be refunded other than in the following circumstances:
                    </p>
                    <ol className="list-decimal list-inside space-y-4 text-gray-700 ml-4">
                        <li>
                            <p className='font-medium'>
                                Multiple times debiting of Customer’s Card/Bank Account due to technical error OR Customer's account being debited with excess amount in a single transaction due to technical error.
                            </p>
                            <p className='ml-4 mt-1 text-sm text-gray-600'>
                                In such cases, the excess amount excluding Payment Gateway charges would be refunded to the Customer.
                            </p>
                        </li>
                        <li>
                            <p className='font-medium'>
                                Due to a technical error, payment is being charged to the Customer’s Card/Bank Account but the enrolment for the examination is unsuccessful.
                            </p>
                            <p className='ml-4 mt-1 text-sm text-gray-600'>
                                Customers would be provided with the enrolment by NISM at no extra cost. However, if in such cases, the Customer wishes to seek a refund of the amount, he/she would be refunded net the amount, after deduction of Payment Gateway charges or any other charges.
                            </p>
                        </li>
                    </ol>
                </Section>

                {/* Refund Application Process */}
                <Section title="Refund Application and Processing">
                    <ol className="list-decimal list-inside space-y-4 text-gray-700">
                        <li value={2}>
                            The Customer will have to make an application for a refund along with the transaction number and original payment receipt if any generated at the time of making payments.
                        </li>
                        <li value={3}>
                            The application in the prescribed format should be sent to: 
                            <a 
                                href={`mailto:${CONTACT_EMAIL}`} 
                                className="text-[#E6D8B2] hover:text-[#E6D8B2] ml-2 font-semibold transition duration-150"
                            >
                                {CONTACT_EMAIL}
                            </a>
                        </li>
                        <li value={4}>
                            The application will be processed manually and after verification, if the claim is found valid, the amount received in excess will be refunded by NISM through electronic mode in favour of the applicant, and confirmation sent to the mailing address given in the online registration form, within 21 calendar days on receipt of such claim. It will take 3-21 days for the money to show in your bank account depending on your bank’s policy.
                        </li>
                    </ol>
                </Section>

                {/* Limitations */}
                <Section title="Limitation of Liability for Non-Payment">
                    <p className="text-gray-700">
                        The company assumes no responsibility and shall incur no liability if it is unable to affect any Payment Instruction(s) on the Payment Date owing to any one or more of the following circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                        <li>
                            If the Payment Instruction(s) issued by you is/are incomplete, inaccurate, invalid, and delayed.
                        </li>
                        <li>
                            If the Payment Account has insufficient funds/limits to cover the amount as mentioned in the Payment Instruction(s).
                        </li>
                        <li>
                            If the funds available in the Payment Account are under any encumbrance or charge.
                        </li>
                        <li>
                            If your Bank or the NCC refuses or delays honouring the Payment Instruction(s).
                        </li>
                        <li>
                            Circumstances beyond the control of the Company (including, but not limited to, fire, flood, natural disasters, bank strikes, power failure, and systems failure like computer or telephone line breakdown due to an unforeseeable cause or interference from an outside force).
                        </li>
                    </ul>
                    <p className='mt-4 text-gray-600 italic text-sm'>
                        In case the payment is not affected for any reason, you will be intimated about the failed payment by e-mail.
                    </p>
                </Section>
                
                {/* Termination Clause */}
                <Section title="Account Termination and Suspension">
                    <p className="text-gray-700">
                        User agrees that Company, in its sole discretion, for any or no reason, and without penalty, may suspend or terminate his/her account (or any part thereof) or use of the Services and remove and discard all or any part of his/her account, user profile, or his/her recipient profile, at any time. Company may also in its sole discretion and at any time discontinue providing access to the Services, or any part thereof, with or without notice. 
                    </p>
                    <p className="text-gray-700 mt-3">
                        User agrees that any termination of his /her access to the Services or any account he/she may have or portion thereof may be effected without prior notice and also agrees that Company will not be liable to the user or any third party for any such termination. Any suspected, fraudulent, abusive, or illegal activity may be referred to appropriate law enforcement authorities. These remedies are in addition to any other remedies the Company may have at law or in equity. Upon termination for any reason, the user agrees to immediately stop using the Services.
                    </p>
                </Section>

                {/* Dispute Resolution */}
                <Section title="Dispute Resolution">
                    <p className="text-gray-700">
                        The Company may elect to resolve any dispute, controversy, or claim arising out of or relating to this Agreement or Service provided in connection with this Agreement by binding arbitration under the provisions of the Indian Arbitration & Conciliation Act, 1996. Any such dispute, controversy, or claim shall be arbitrated on an individual basis and shall not be consolidated in any arbitration with any claim or controversy of any other party.
                    </p>
                </Section>

            </div>
        </main>
    );
}