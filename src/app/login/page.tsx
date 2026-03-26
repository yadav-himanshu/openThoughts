"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to login");
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Google login failed");
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md p-8 bg-secondary rounded-2xl shadow-sm border border-theme">
                <h1 className="text-2xl font-bold text-primary mb-6 text-center">
                    Welcome Back
                </h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-theme rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary text-white rounded-md hover:opacity-90 transition font-medium"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b border-theme w-1/5 lg:w-1/4"></span>
                    <span className="text-xs text-center text-secondary uppercase">
                        or login with
                    </span>
                    <span className="border-b border-theme w-1/5 lg:w-1/4"></span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full mt-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold disabled:opacity-50"
                >
                    {isGoogleLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></span>
                            Authenticating...
                        </span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                                />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

                <p className="mt-8 text-center text-sm text-secondary">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
