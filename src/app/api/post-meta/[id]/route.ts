import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ REQUIRED

    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);

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
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch post metadata" },
      { status: 500 }
    );
  }
}
