"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md p-8 bg-secondary rounded-2xl shadow-sm border border-theme">
                <h1 className="text-2xl font-bold text-primary mb-2 text-center">
                    Reset Password
                </h1>
                <p className="text-sm text-secondary text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-theme rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary text-white rounded-md hover:opacity-90 transition font-medium"
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-secondary">
                    Remember your password?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
