import Head from "next/head";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Head>
        <title>Cookie Policy | DESIST!</title>
        <meta name="description" content="DESIST! Cookie Policy" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">DESIST! Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: 2026-01-16</p>
      <article className="prose dark:prose-invert">
        <p>The App does not use browser cookies; it uses platform storage for preferences/security. The Site uses cookies and similar technologies.</p>
        <h2>1. What Are Cookies?</h2>
        <p>Small text files that help remember preferences, improve performance, and measure usage.</p>
        <h2>2. How We Use Cookies</h2>
        <ul>
          <li>Strictly Necessary: core functionality (session, language, consent).</li>
          <li>Functional: preferences and experience features.</li>
          <li>Analytics: privacy-friendly Plausible/Fathom; Do Not Track respected; consent required where applicable.</li>
          <li>Maps: Google Maps may set cookies when embedded.</li>
        </ul>
        <h2>3. Analytics Details</h2>
        <p>Plausible is cookieless; Fathom is privacy-focused. If DNT=1, analytics are disabled when configured.</p>
        <h2>4. Managing Cookies</h2>
        <p>Use the site banner to accept/decline analytics, or adjust browser settings. Blocking necessary cookies may affect functionality.</p>
        <h2>5. Third-Party Cookies</h2>
        <p>Google Maps and other embeds may set cookies per their policies.</p>
        <h2>6. Mobile App Storage</h2>
        <p>App uses local/secure storage (not browser cookies) for consent and privacy actions.</p>
        <h2>7. Changes</h2>
        <p>We may update this policy and post changes here.</p>
        <h2>8. Contact</h2>
        <ul>
          <li>Privacy: privacy@wedesist.com</li>
          <li>Support: support@wedesist.com</li>
        </ul>
        <hr />
        <p>
          See also: <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
        </p>
      </article>
    </main>
  );
}
