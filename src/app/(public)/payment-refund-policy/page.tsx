import React from "react";
import Link from "next/link";

export default function PaymentRefundPolicy() {
  return (
    <div className="container md:pt-36 mx-auto px-4 py-10 md:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Payment and Refund Policy
          </h1>
          <p className="mb-2 text-gray-600">
            <strong>Effective Date:</strong> 26/02/2025
          </p>
          <p className="mb-4 text-gray-700">
            At <strong>Distance Connect ("the Platform")</strong>, we operate as
            a <strong>marketplace model</strong>, facilitating payments between{" "}
            <strong>mentees (students) and mentors (professionals)</strong>.
            Mentors set their own prices for mentorship sessions, and Distance
            Connect acts as a <strong>secure payment intermediary</strong>,
            processing transactions and ensuring compliance with applicable
            financial regulations.
          </p>
          <p className="mb-4 text-gray-700">
            This <strong>Payment and Refund Policy</strong> outlines the terms
            governing payments, billing, refunds, cancellations, and disputes.
            By using Distance Connect, users agree to abide by this policy along
            with our <strong>Terms and Conditions</strong>.
          </p>
          <hr className="my-6 border-gray-300" />
        </header>

        <section id="payment-structure" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            1. Payment Structure on Distance Connect
          </h2>
          <h3 className="mb-3 text-xl font-semibold">
            1.1 Marketplace-Based Payments
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>Mentors set their own prices</strong> for mentorship
              sessions based on their expertise and experience.
            </li>
            <li>
              Payment is <strong>collected in advance</strong> from mentees at
              the time of booking.
            </li>
            <li>
              Distance Connect <strong>deducts a service commission (%)</strong>{" "}
              from the mentor's earnings before processing payouts.
            </li>
            <li>
              Payments are securely processed via a third-party{" "}
              <strong>payment gateway</strong> that complies with{" "}
              <strong>PCI-DSS and RBI regulations</strong>.
            </li>
          </ul>
        </section>

        <section id="accepted-payment-methods" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            2. Accepted Payment Methods
          </h2>
          <p className="mb-3 text-gray-700">
            Distance Connect supports multiple payment options to ensure{" "}
            <strong>convenient and secure transactions</strong>:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>Credit &amp; Debit Cards</strong> (Visa, MasterCard,
              RuPay, American Express)
            </li>
            <li>
              <strong>UPI &amp; Digital Wallets</strong> (Google Pay, PhonePe,
              Paytm, etc.)
            </li>
            <li>
              <strong>Net Banking</strong> (Major Indian banks supported)
            </li>
            <li>
              <strong>International Payments</strong> (For users outside India,
              subject to currency conversion fees)
            </li>
          </ul>
          <p className="mt-3 text-gray-700">
            All transactions are{" "}
            <strong>encrypted and securely processed</strong> through{" "}
            <strong>[Payment Gateway Name]</strong>, ensuring compliance with
            Indian financial regulations.
          </p>
        </section>

        <section id="mentor-earnings" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            3. Mentor Earnings &amp; Payouts
          </h2>
          <h3 className="mb-3 text-xl font-semibold">
            3.1 Mentor Payment Structure
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>
                Mentors receive earnings after Distance Connect deducts its
                commission
              </strong>{" "}
              per session.
            </li>
            <li>
              Payouts are processed <strong>weekly/monthly</strong> based on the
              agreed payout schedule.
            </li>
          </ul>
          <h3 className="mb-3 mt-5 text-xl font-semibold">
            3.2 Payment Processing Time
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              Payments are typically credited{" "}
              <strong>within 5-7 business days</strong> after the mentorship
              session is successfully completed.
            </li>
            <li>
              Mentors are responsible for providing{" "}
              <strong>accurate bank details</strong> to avoid payout failures.
            </li>
          </ul>
          <h3 className="mb-3 mt-5 text-xl font-semibold">
            3.3 Taxes &amp; Compliance
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              Mentors are responsible for{" "}
              <strong>declaring and paying applicable taxes</strong> on their
              earnings.
            </li>
            <li>
              Distance Connect{" "}
              <strong>may deduct TDS (Tax Deducted at Source)</strong> in
              accordance with Indian tax laws.
            </li>
            <li>
              International mentors may be subject to{" "}
              <strong>currency conversion fees</strong> and foreign exchange
              regulations.
            </li>
          </ul>
        </section>

        <section id="refund-cancellation" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            4. Refund &amp; Cancellation Policy
          </h2>
          <p className="mb-3 text-gray-700">
            Refund requests are considered <strong>case-by-case</strong>,
            depending on session cancellations, mentor availability, and service
            quality.
          </p>
          <h3 className="mb-3 text-xl font-semibold">4.1 Refund Eligibility</h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>Mentor No-Show:</strong> If a mentor{" "}
              <strong>fails to attend the session</strong>, a full refund will
              be issued.
            </li>
            <li>
              <strong>Session Canceled by Mentor:</strong> If a mentor cancels a
              session, the mentee is entitled to a{" "}
              <strong>full refund or session rescheduling</strong>.
            </li>
            <li>
              <strong>Technical Issues:</strong> If a session is disrupted due
              to <strong>verified technical issues</strong> on Distance
              Connect's platform, a refund or reschedule may be offered.
            </li>
            <li>
              <strong>Non-Refundable Cases:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  If the mentee <strong>fails to attend</strong> the scheduled
                  session.
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="mb-3 mt-5 text-xl font-semibold">
            4.2 Refund Process
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              Users must submit a{" "}
              <strong>refund request within 12 hours</strong> after the session.
            </li>
            <li>
              Refunds will be{" "}
              <strong>processed within 5-10 business days</strong> after
              approval.
            </li>
            <li>
              Refunds will be credited to the{" "}
              <strong>original payment method</strong> used.
            </li>
          </ul>
        </section>

        <section id="session-cancellation" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            5. Session Cancellation Policy
          </h2>
          <h3 className="mb-3 text-xl font-semibold">
            5.1 Mentee-Initiated Cancellations
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              If a mentee cancels a session{" "}
              <strong>at least 24 hours before</strong> the scheduled time, a{" "}
              <strong>full refund</strong> will be provided.
            </li>
            <li>
              If canceled <strong>within 24 hours</strong>, the mentee{" "}
              <strong>will not be eligible for a refund</strong>.
            </li>
          </ul>
          <h3 className="mb-3 mt-5 text-xl font-semibold">
            5.2 Mentor-Initiated Cancellations
          </h3>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              If a mentor cancels, the mentee can choose to{" "}
              <strong>reschedule or request a full refund</strong>.
            </li>
          </ul>
        </section>

        <section id="disputes" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            6. Disputes &amp; Chargebacks
          </h2>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              If a <strong>payment dispute</strong> is raised with a bank
              (chargeback request), the user's{" "}
              <strong>Distance Connect account may be suspended</strong> until
              the issue is resolved.
            </li>
            <li>
              Distance Connect reserves the right to{" "}
              <strong>reject refund claims</strong> in cases of fraud, abuse, or
              violation of platform policies.
            </li>
            <li>
              Any disputes can be reported to{" "}
              <a
                href="mailto:support@distanceconnect.com"
                className="text-blue-600 hover:underline"
              >
                support@distanceconnect.com
              </a>{" "}
              for resolution.
            </li>
          </ul>
        </section>

        <section id="regulations" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            7. Compliance with Indian &amp; International Regulations
          </h2>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>Reserve Bank of India (RBI) Guidelines</strong> for online
              payments.
            </li>
            <li>
              <strong>The Payment and Settlement Systems Act, 2007</strong>{" "}
              (India).
            </li>
            <li>
              <strong>
                Foreign Exchange Management Act (FEMA) for International
                Payments
              </strong>
              .
            </li>
            <li>
              <strong>GST Compliance</strong> for applicable taxation on
              mentorship earnings.
            </li>
          </ul>
          <p className="mt-3 text-gray-700">
            If required by law, Distance Connect{" "}
            <strong>may share transaction details</strong> with financial
            authorities for regulatory compliance.
          </p>
        </section>

        <section id="policy-amendments" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            8. Policy Amendments &amp; Updates
          </h2>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              Distance Connect <strong>reserves the right</strong> to update
              this Payment &amp; Refund Policy periodically.
            </li>
            <li>
              Users will be{" "}
              <strong>notified via email or platform notifications</strong>{" "}
              before major changes take effect.
            </li>
            <li>
              Continued use of the platform after policy updates implies{" "}
              <strong>acceptance of the revised terms</strong>.
            </li>
          </ul>
        </section>

        <section id="contact-support" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">9. Contact &amp; Support</h2>
          <p className="mb-3 text-gray-700">
            For any payment or refund queries, contact our support team:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@distanceconnect.com"
                className="text-blue-600 hover:underline"
              >
                support@distanceconnect.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong> +91 7678163826
            </li>
          </ul>
        </section>

        <footer className="border-t border-gray-300 pt-6">
          <p className="text-gray-700">
            By using Distance Connect, you agree to this{" "}
            <strong>Payment and Refund Policy</strong> and our{" "}
            <Link
              href="/terms-conditions"
              className="text-blue-600 hover:underline"
            >
              Terms and Conditions
            </Link>
            .
          </p>
        </footer>
      </article>
    </div>
  );
}
