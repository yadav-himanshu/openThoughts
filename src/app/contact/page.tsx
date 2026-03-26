"use client";

import { useState } from "react";

import { Info, Mail, MessageSquare, Send, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `OpenThoughts Contact: ${name}`,
          message: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #6366f1;">New message from ${name}</h2>
              <p><b>Email:</b> ${email}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
              <p style="white-space: pre-line; line-height: 1.6;">${message}</p>
            </div>
          `,
        }),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      {/* Header Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          <MessageCircle size={14} />
          Reach Out
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Get in touch with us.</h1>
        <p className="text-slate-700 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
          Need help? Want to give feedback? Or perhaps you're interested in a collaboration. We're here to listen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Contact Channels</h3>

            <div className="space-y-6">
              <a href="mailto:info@openthoughts.com" className="flex items-start gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-indigo-500 group-hover:border-indigo-500/30 transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Us</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">info@openthoughts.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500">
                  <Instagram size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Social Media</p>
                  <div className="flex gap-3">
                    <a href="#" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-500">Instagram</a>
                    <span className="text-slate-300">•</span>
                    <a href="#" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-500">Twitter</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-indigo-500 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <MessageSquare size={120} />
            </div>
            <h4 className="text-xl font-bold mb-3 relative z-10">Feedback is a Gift</h4>
            <p className="text-sm text-indigo-100 mb-6 relative z-10 leading-relaxed">
              Your feedback helps us build a better sanctuary for writers. Don't hesitate to share your thoughts.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest relative z-10">
              <Info size={14} />
              Responds in 24h
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={submitForm} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Your Message</label>
              <textarea
                placeholder="Share your thoughts or questions here..."
                className="w-full h-48 px-6 py-6 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-500/10"
            >
              {loading ? "Transmitting..." : (
                <>
                  <Send size={18} />
                  Dispatch Message
                </>
              )}
            </button>

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">✓</div>
                Acknowledge! Your message has been sent successfully.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

