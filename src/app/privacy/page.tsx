"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Shield size={14} />
                    Compliance
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Privacy Policy</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Last updated: March 2026</p>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <Eye size={16} /> 01. Introduction
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        At OpenThoughts, accessible from https://open-thoughts-pi.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by OpenThoughts and how we use it.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <Lock size={16} /> 02. Information We Collect
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                        If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We also use Firebase Authentication which may collect Google profile data if you sign in with Google.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <FileText size={16} /> 03. How We Use Your Information
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-4">
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Send you emails for updates or community news</li>
                        <li>Find and prevent fraud</li>
                    </ul>
                </section>

                <section className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Questions?</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at
                        <a href="mailto:info@openthoughts.com" className="text-indigo-600 ml-1 font-bold">info@openthoughts.com</a>.
                    </p>
                </section>
            </div>
        </main>
    );
}
