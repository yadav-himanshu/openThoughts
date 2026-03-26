"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FollowButton({ authorName }: { authorName: string }) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && authorName) {
            checkFollowStatus();
        }
    }, [user, authorName]);

    const getFollowDocId = () => {
        return `${user?.uid}_${authorName.replace(/\s+/g, '_')}`;
    };

    const checkFollowStatus = async () => {
        if (!user) return;
        try {
            const followRef = doc(db, "follows", getFollowDocId());
            const snap = await getDoc(followRef);
            setIsFollowing(snap.exists());
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFollow = async () => {
        if (!user) {
            alert("Please login to follow authors.");
            return;
        }

        // Disable if user tries to follow themselves
        if (user.displayName === authorName) {
            alert("You can't follow yourself!");
            return;
        }

        setLoading(true);
        const followRef = doc(db, "follows", getFollowDocId());

        try {
            if (isFollowing) {
                await deleteDoc(followRef);
                setIsFollowing(false);
            } else {
                await setDoc(followRef, {
                    followerId: user.uid,
                    followingName: authorName,
                    createdAt: new Date(),
                });
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to toggle follow status.");
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.displayName === authorName) return null;

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${isFollowing
                    ? "bg-secondary border border-theme text-primary hover:bg-theme"
                    : "bg-primary text-white hover:opacity-90"
                }`}
        >
            {loading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
    );
}
