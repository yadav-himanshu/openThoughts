import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, message } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"OpenThoughts" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject,
      html: `
        <div style="font-family: Arial; line-height:1.6">
          <h3>${subject}</h3>
          <p>${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Mail failed" },
      { status: 500 },
    );
  }
}
