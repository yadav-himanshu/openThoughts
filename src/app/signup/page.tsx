"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update display name
            await updateProfile(userCredential.user, { displayName: name });

            // Store user profile in firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                displayName: name,
                photoURL: "",
                createdAt: new Date(),
            });

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Google signup failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-10 px-4">
            <div className="w-full max-w-md p-8 bg-secondary rounded-2xl shadow-sm border border-theme">
                <h1 className="text-2xl font-bold text-primary mb-6 text-center">
                    Join OpenThoughts
                </h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-theme rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary"
                            required
                        />
                    </div>
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
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-primary text-white rounded-md hover:opacity-90 transition font-medium"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b border-theme w-1/5 lg:w-1/4"></span>
                    <span className="text-xs text-center text-secondary uppercase">
                        or signup with
                    </span>
                    <span className="border-b border-theme w-1/5 lg:w-1/4"></span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full mt-6 py-2 border border-theme rounded-md flex items-center justify-center gap-2 hover:bg-theme transition text-primary"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                        />
                    </svg>
                    Google
                </button>

                <p className="mt-8 text-center text-sm text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
