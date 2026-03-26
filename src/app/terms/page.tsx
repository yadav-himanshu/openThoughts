"use client";

import { Scale, Gavel, CheckCircle, AlertCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Scale size={14} />
                    Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Terms of Service</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Last updated: March 2026</p>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <Gavel size={16} /> 01. Acceptance of Terms
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        By accessing or using the OpenThoughts platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <CheckCircle size={16} /> 02. Use License
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                        Permission is granted to temporarily download one copy of the materials on OpenThoughts' website for personal, non-commercial transitory viewing only.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-4">
                        <li>Modify or copy the materials;</li>
                        <li>Use the materials for any commercial purpose;</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400 uppercase text-xs font-black tracking-widest">
                        <AlertCircle size={16} /> 03. Disclaimer
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        The materials on OpenThoughts' website are provided on an 'as is' basis. OpenThoughts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="p-8 bg-indigo-600 rounded-[2rem] text-white">
                    <h3 className="text-lg font-bold mb-4">Contacting Us</h3>
                    <p className="text-indigo-100 font-medium">
                        For any queries regarding these terms, please contact us at info@openthoughts.com.
                    </p>
                </section>
            </div>
        </main>
    );
}
