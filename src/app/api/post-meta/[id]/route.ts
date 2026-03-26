import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ REQUIRED

    let ref = doc(db, "posts", id);
    let snap = await getDoc(ref);

    if (!snap.exists()) {
      const q = query(collection(db, "posts"), where("slug", "==", id), limit(1));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        snap = querySnap.docs[0];
      }
    }

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const data = snap.data();

    return NextResponse.json({
      title: data.title,
      content: data.content,
      authorName: data.authorName,
      category: data.category,
      slug: data.slug || snap.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch post metadata" },
      { status: 500 }
    );
  }
}
