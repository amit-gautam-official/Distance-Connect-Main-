import React from "react";
import Link from "next/link";

export default function CodeOfConduct() {
  return (
    <div className="container mx-auto px-4 py-10 md:px-6 md:pt-36 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Mentor and Mentee Code of Conduct
          </h1>
          <p className="mb-2 text-gray-600">
            <strong>Effective Date:</strong> 26/02/2024
          </p>
          <p className="mb-4 text-gray-700">
            <strong>Distance Connect (&quot;the Platform&quot;)</strong> is
            committed to maintaining a professional, respectful, and supportive
            environment for both mentors and mentees. This{" "}
            <strong>
              Mentor and Mentee Code of Conduct (&quot;Code&quot;)
            </strong>{" "}
            sets forth the standards of professional behavior and ethical
            responsibilities expected from all users engaged in mentorship
            activities on the platform.
          </p>
          <p className="mb-4 text-gray-700">
            By using the platform as a <strong>mentor</strong> or{" "}
            <strong>mentee</strong>, you agree to comply with this Code, along
            with our <strong>Terms and Conditions</strong>,{" "}
            <strong>Privacy Policy</strong>, and other applicable policies.
            Failure to adhere to this Code may result in account suspension,
            termination, or legal action.
          </p>
          <hr className="my-6 border-gray-300" />
        </header>

        <section id="general-conduct" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">1. General Conduct</h2>
          <h3 className="mb-3 text-xl font-semibold">
            For Both Mentors and Mentees
          </h3>
          <ol className="ml-6 list-decimal space-y-2 text-gray-700">
            <li>
              <strong>Respect and Professionalism:</strong> Users shall
              communicate with each other in a{" "}
              <strong>respectful, professional, and courteous manner</strong> at
              all times.
            </li>
            <li>
              <strong>No Discrimination:</strong> Any form of discrimination
              based on{" "}
              <strong>
                race, caste, religion, gender, nationality, disability, or
                sexual orientation
              </strong>{" "}
              is strictly prohibited.
            </li>
            <li>
              <strong>No Harassment or Abuse:</strong> Users shall not engage in{" "}
              <strong>
                harassment, bullying, threats, or any form of inappropriate
                behavior
              </strong>{" "}
              during interactions.
            </li>
            <li>
              <strong>Confidentiality:</strong> Users must respect and{" "}
              <strong>
                maintain the confidentiality of discussions, personal
                information, and proprietary content
              </strong>{" "}
              shared during mentorship sessions.
            </li>
            <li>
              <strong>Honesty &amp; Integrity:</strong> Users shall not
              misrepresent{" "}
              <strong>
                their identity, qualifications, experience, or affiliations
              </strong>{" "}
              on the platform.
            </li>
            <li>
              <strong>Compliance with Laws:</strong> Users must{" "}
              <strong>comply with all applicable laws</strong> of India,
              including but not limited to the{" "}
              <strong>Information Technology Act, 2000</strong>, and the{" "}
              <strong>Personal Data Protection Bill (if applicable)</strong>.
            </li>
            <li>
              <strong>No Solicitation or Self-Promotion:</strong> Mentors and
              mentees shall not use the platform for{" "}
              <strong>
                unethical self-promotion, unsolicited job offers, marketing, or
                selling services
              </strong>{" "}
              unrelated to mentorship.
            </li>
          </ol>
        </section>

        <section id="mentor-responsibilities" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            2. Responsibilities of Mentors
          </h2>
          <p className="mb-3 text-gray-700">
            As a <strong>mentor</strong> on Distance Connect, you agree to:
          </p>
          <ol className="ml-6 list-decimal space-y-2 text-gray-700">
            <li>
              <strong>Provide Honest and Ethical Guidance:</strong> Offer{" "}
              <strong>authentic</strong> mentorship based on your expertise,
              avoiding misleading advice.
            </li>
            <li>
              <strong>Maintain Professional Boundaries:</strong> Refrain from{" "}
              <strong>
                asking for personal favors, inappropriate personal interactions,
                or engaging in non-professional relationships
              </strong>{" "}
              with mentees.
            </li>
            <li>
              <strong>No Guarantee of Jobs or Internships:</strong> Mentors
              shall not <strong>guarantee</strong> job placements, internships,
              or direct employment through mentorship sessions.
            </li>
            <li>
              <strong>No Monetary Demands Outside Platform:</strong> All{" "}
              <strong>
                session payments must be processed through Distance
                Connect&apos;s payment gateway
              </strong>
              . Mentors must not demand or accept direct payments from mentees.
            </li>
            <li>
              <strong>Timely Availability &amp; Commitment:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  Honor scheduled mentorship sessions and notify in advance if
                  rescheduling is needed.
                </li>
                <li>
                  Refrain from canceling sessions frequently or failing to
                  appear without notice.
                </li>
              </ul>
            </li>
            <li>
              <strong>Respect Intellectual Property Rights:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  Do not use or claim ownership of any work, research, or ideas
                  shared by mentees without permission.
                </li>
                <li>
                  Do not disclose sensitive company information if you are
                  employed by an organization that restricts such discussions.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section id="mentee-responsibilities" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            3. Responsibilities of Mentees
          </h2>
          <p className="mb-3 text-gray-700">
            As a <strong>mentee</strong> on Distance Connect, you agree to:
          </p>
          <ol className="ml-6 list-decimal space-y-2 text-gray-700">
            <li>
              <strong>Engage with a Learning Mindset:</strong> Seek mentorship
              for genuine learning, career development, and skill-building.
            </li>
            <li>
              <strong>No Exploitation of Mentor&apos;s Time:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  Respect the mentor&apos;s availability and do not demand
                  excessive, free, or unsolicited guidance outside scheduled
                  sessions.
                </li>
              </ul>
            </li>
            <li>
              <strong>Provide Accurate Information:</strong> Ensure that the
              information provided about{" "}
              <strong>
                your educational background, skills, and career aspirations
              </strong>{" "}
              is truthful.
            </li>
            <li>
              <strong>Respect Session Fees &amp; Platform Rules:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  Do not negotiate, bargain, or request <strong>free</strong>{" "}
                  mentorship sessions unless explicitly allowed by the mentor.
                </li>
                <li>
                  All payments must be processed{" "}
                  <strong>through the Distance Connect platform</strong> to
                  ensure compliance.
                </li>
              </ul>
            </li>
            <li>
              <strong>Maintain Professionalism &amp; Confidentiality:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  Do not share session recordings, personal mentor information,
                  or private discussions without prior consent.
                </li>
                <li>
                  Do not use the mentorship relationship for inappropriate
                  personal or business networking beyond the agreed mentorship
                  goals.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section id="prohibited-activities" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            4. Prohibited Activities for Both Mentors and Mentees
          </h2>
          <ol className="ml-6 list-decimal space-y-2 text-gray-700">
            <li>
              <strong>Sharing Contact Information Outside the Platform:</strong>{" "}
              Avoid direct personal exchanges (e.g., personal emails, WhatsApp
              numbers) unless necessary and consented to by both parties.
            </li>
            <li>
              <strong>
                Engaging in Financial Transactions Outside Distance Connect:
              </strong>{" "}
              This includes payments, investments, or loan requests between
              mentors and mentees.
            </li>
            <li>
              <strong>Plagiarism or Academic Dishonesty:</strong> Seeking help
              in{" "}
              <strong>completing exams, assignments, or research papers</strong>{" "}
              in a manner that violates academic integrity.
            </li>
            <li>
              <strong>Spamming, Scamming, or Malicious Activities:</strong> No
              promotion of fake job offers, deceptive employment schemes, or
              illegal activities.
            </li>
          </ol>
        </section>

        <section id="reporting-violations" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            5. Reporting Violations &amp; Dispute Resolution
          </h2>
          <ol className="ml-6 list-decimal space-y-2 text-gray-700">
            <li>
              <strong>How to Report Violations:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  If you experience any form of misconduct, harassment, or
                  breach of this Code, report it via{" "}
                  <a
                    href="mailto:support@distanceconnect.in"
                    className="text-blue-600 hover:underline"
                  >
                    support@distanceconnect.in
                  </a>{" "}
                  or through the provided contact form.
                </li>
                <li>
                  Attach relevant{" "}
                  <strong>
                    evidence (screenshots, emails, chat records, etc.)
                  </strong>{" "}
                  to support your complaint.
                </li>
              </ul>
            </li>
            <li>
              <strong>Investigation Process:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  The Distance Connect team will{" "}
                  <strong>review complaints within 7 business days</strong>.
                </li>
                <li>
                  Both parties may be required to provide statements or
                  additional proof.
                </li>
              </ul>
            </li>
            <li>
              <strong>Possible Actions Against Violators:</strong>
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  <strong>Warning:</strong> First-time minor violations may
                  result in a formal warning.
                </li>
                <li>
                  <strong>Account Suspension:</strong> Repeated or serious
                  violations may lead to temporary or permanent suspension.
                </li>
                <li>
                  <strong>Legal Action:</strong> If a violation involves fraud,
                  abuse, or legal breaches, the platform reserves the right to
                  take appropriate legal action under Indian law.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section id="limitation-of-liability" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            6. Limitation of Liability
          </h2>
          <p className="mb-4 text-gray-700">
            Distance Connect is a <strong>facilitator</strong> of mentorship
            services and does not guarantee employment, job placement, or the
            accuracy of information provided by mentors or mentees.
          </p>
          <p className="mb-4 text-gray-700">
            The platform is not liable for any{" "}
            <strong>
              misconduct, misrepresentation, or actions taken by individual
              users
            </strong>{" "}
            beyond its direct control.
          </p>
        </section>

        <section id="amendments" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            7. Amendments &amp; Updates
          </h2>
          <p className="mb-4 text-gray-700">
            Distance Connect reserves the right to{" "}
            <strong>modify this Code of Conduct at any time</strong>. Users will
            be notified of any significant updates.
          </p>
          <p className="mb-4 text-gray-700">
            Continued use of the platform constitutes{" "}
            <strong>acceptance of revised policies</strong>.
          </p>
        </section>

        <footer className="border-t border-gray-300 pt-6">
          <p className="mb-2 text-gray-700">
            <strong>Acknowledgment &amp; Agreement:</strong>
          </p>
          <p className="mb-4 text-gray-700">
            By using Distance Connect, you acknowledge that you have{" "}
            <strong>read, understood, and agreed</strong> to abide by this{" "}
            <strong>Mentor and Mentee Code of Conduct</strong>.
          </p>
          <p className="text-gray-700">
            For any clarifications, please contact{" "}
            <a
              href="mailto:support@distanceconnect.in"
              className="text-blue-600 hover:underline"
            >
              support@distanceconnect.in
            </a>
            .
          </p>
        </footer>
      </article>
    </div>
  );
}
