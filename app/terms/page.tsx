import Head from "next/head";

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Head>
        <title>Terms of Service | DESIST!</title>
        <meta name="description" content="DESIST! Terms of Service" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">DESIST! Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: 2026-01-16</p>
      <article className="prose dark:prose-invert">
        <h2>1. Using DESIST!</h2>
        <p>Personal, revocable license; you're responsible for your account and use.</p>
        <h2>2. Acceptable Use</h2>
        <p>No unlawful content, abuse, or security interference. We may restrict access to protect users.</p>
        <h2>3. Content and Ownership</h2>
        <p>You retain your content; license to operate DESIST!. Our software and designs are owned by DESIST!.</p>
        <h2>4. Sponsored Attorney Listings and Legal Disclaimer</h2>
        <p>"Sponsored" listings are labeled. No legal advice or guarantees. No endorsement implied.</p>
        <h2>5. Third-Party Services</h2>
        <p>Integrations (e.g., Google Places/Maps, analytics) are governed by their terms.</p>
        <h2>6. App Store Terms</h2>
        <p>Apple/Google terms apply in addition to these Terms.</p>
        <h2>7. Privacy</h2>
        <p>Subject to our Privacy Policy and Cookie Policy; manage consent controls.</p>
        <h2>8. Termination</h2>
        <p>We may suspend/terminate for violations; some sections survive termination.</p>
        <h2>9. Disclaimers</h2>
        <p>DESIST! is provided "as is" and "as available," without warranties.</p>
        <h2>10. Limitation of Liability</h2>
        <p>To the extent permitted, liability is limited to $100 or amounts paid to DESIST! in the prior 12 months.</p>
        <h2>11. Indemnification</h2>
        <p>You agree to defend/indemnify DESIST! for misuse or violations, except for our willful misconduct.</p>
        <h2>12. Changes</h2>
        <p>We may update these Terms; continued use constitutes acceptance.</p>
        <h2>13. Governing Law and Dispute Resolution</h2>
        <p>Governed by applicable law; negotiations first, then arbitration where permitted.</p>
        <h2>14. Contact</h2>
        <ul>
          <li>Legal: legal@wedesist.com</li>
          <li>Support: support@wedesist.com</li>
        </ul>
      </article>
    </main>
  );
}
