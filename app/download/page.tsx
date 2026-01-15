import { Header } from "../components/Header";
import { NewHero } from "../components/NewHero";
import { AppFeatures } from "../components/AppFeatures";
import { NotificationDemo } from "../components/NotificationDemo";
import { AppStats } from "../components/AppStats";
import { AppDownloadCTA } from "../components/AppDownloadCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background Patterns */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      <div className="relative">
        <Header />
        <NewHero />
        <AppFeatures />
        <NotificationDemo />
        <AppStats />
        {/* <Testimonials /> */}
        <section className="container mx-auto py-12 ">
          <AppDownloadCTA />
        </section>
      </div>
    </main>
  );
}
