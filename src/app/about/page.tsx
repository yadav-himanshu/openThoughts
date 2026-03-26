import Link from "next/link";
import { Feather, Heart, Sparkles, ShieldCheck, ArrowRight, PenTool } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-36 bg-white dark:bg-slate-900/50">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              Our Mission
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.95] italic">
              Giving every <span className="text-indigo-600 dark:text-indigo-400">thought</span> a place to <span className="text-indigo-600 dark:text-indigo-400">breathe.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12 font-medium">
              OpenThoughts is a curated sanctuary for authors, poets, and thinkers. We believe in the power of words to bridge experiences and ignite imagination.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/submit" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 transition-all flex items-center gap-2">
                Start Writing Today <ArrowRight size={18} />
              </Link>
              <Link href="/" className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                Explore Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Feather,
              title: "Raw & Authentic",
              desc: "No algorithms, no noise. Just honest expressions from real people sharing real feelings."
            },
            {
              icon: Heart,
              title: "Community Driven",
              desc: "A safe space where every story is valued and every voice is heard with respect."
            },
            {
              icon: ShieldCheck,
              title: "Carefully Curated",
              desc: "Our human-led approval process ensures quality, meaningful content with zero spam."
            }
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:-translate-y-2">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <card.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
              <p className="text-slate-700 dark:text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-3xl font-bold mb-12 text-center">What is OpenThoughts?</h2>

        <div className="space-y-16">
          <div className="flex gap-6">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="text-xl font-bold mb-2">A Sanctuary for Writers</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether it's a four-line shayari or a detailed short story, this is where your writing finds its audience. We support both Hindi and English submissions.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="text-xl font-bold mb-2">Zero Account Friction</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You can browse and even post as a guest. We believe in removing barriers between you and your creativity, while offering advanced features for registered members.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="text-xl font-bold mb-2">Engage with Intent</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Like what moves you, save what inspires you, and leave meaningful comments. We're building a network of thinkers, not just a scrollable feed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-slate-900 dark:bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <PenTool size={64} className="mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to share your inner world?</h2>
          <p className="text-lg text-slate-300 dark:text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of storytellers and thinkers. Your first post only takes two minutes.
          </p>
          <Link href="/submit" className="inline-flex py-4 px-10 bg-white text-slate-900 rounded-full font-bold hover:scale-105 active:scale-95 transition-all">
            Submit Your First Story
          </Link>
        </div>
      </section>
    </main>
  );
}

