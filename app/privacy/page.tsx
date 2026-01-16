import Head from "next/head";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Head>
        <title>Privacy Policy | DESIST!</title>
        <meta name="description" content="DESIST! Privacy Policy" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">DESIST! Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: 2026-01-16</p>
      <article className="prose dark:prose-invert">
        <p>This Privacy Policy explains how DESIST! (&quot;DESIST!&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects information across our mobile application (&quot;App&quot;) and website (&quot;Site&quot;).</p>
        <h2>Summary</h2>
        <ul>
          <li>We collect incident reports you submit, device/app telemetry, and limited usage data.</li>
          <li>The App integrates Google Places to help find legal resources; sponsored listings are labeled.</li>
          <li>The Site uses privacy-friendly analytics (Plausible/Fathom, respects Do Not Track); the App uses Amplitude with city/IP/carrier disabled.</li>
          <li>You control consent preferences and can request data export or deletion at any time.</li>
          <li>We do not sell personal information.</li>
        </ul>
        <h2>1. Information We Collect</h2>
        <h3>A. You provide</h3>
        <ul>
          <li>Account/profile data (website), incident reports (app/site), communications.</li>
        </ul>
        <h3>B. Automatically collected</h3>
        <ul>
          <li>Device/app info, crash diagnostics, usage metrics; location only if enabled.</li>
        </ul>
        <h3>C. Third-party data</h3>
        <ul>
          <li>Google Places/Maps; analytics (Plausible/Fathom on Site; Amplitude in App with privacy settings).</li>
        </ul>
        <h2>2. How We Use Information</h2>
        <ul>
          <li>Operate DESIST!, improve safety/performance, communicate with you, fulfill legal obligations, and display &quot;Sponsored&quot; attorney listings.</li>
        </ul>
        <h2>3. Legal Bases (EEA/UK)</h2>
        <ul>
          <li>Contract, legitimate interests, and consent (for analytics/marketing/location/cookies).</li>
        </ul>
        <h2>4. Sharing and Processors</h2>
        <p>We use vendors to operate DESIST!. We do not sell personal information.</p>
        <h2>5. Data Retention</h2>
        <p>Retention is limited and based on necessity; sensitive data is encrypted locally in the App.</p>
        <h2>6. Your Rights</h2>
        <p>Access, correction, export, deletion, consent withdrawal. Use in‑app controls or email privacy@wedesist.com.</p>
        <h2>7. Consent Management</h2>
        <p>Granular toggles in the App; banner with Accept/Decline on the Site (DNT respected).</p>
        <h2>8. Cookies and Tracking</h2>
        <p>See our Cookie Policy. The App does not use browser cookies.</p>
        <h2>9. Sponsored Attorney Listings</h2>
        <p>Sponsored listings are labeled and do not imply endorsement or guarantee.</p>
        <h2>10. Children&apos;s Privacy</h2>
        <p>Not directed to children.</p>
        <h2>11. Security</h2>
        <p>Encryption, access controls, monitoring; report issues to security@wedesist.com.</p>
        <h2>12. International Transfers</h2>
        <p>Standard safeguards and data minimization used where applicable.</p>
        <h2>13. Changes</h2>
        <p>We&apos;ll post updates with a &quot;Last updated&quot; date and notify where material.</p>
        <h2>14. Contact</h2>
        <ul>
          <li>Privacy: privacy@wedesist.com</li>
          <li>Legal: legal@wedesist.com</li>
          <li>Support: support@wedesist.com</li>
        </ul>
      </article>
    </main>
  );
}