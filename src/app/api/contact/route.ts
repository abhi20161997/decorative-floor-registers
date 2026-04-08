import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "deepakbrass@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Decorative Floor Register <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c2420; font-family: 'Georgia', serif;">New Contact Form Submission</h2>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <h3 style="color: #2c2420; font-family: 'Georgia', serif;">Message</h3>
          <p style="color: #6b5d52; line-height: 1.6;">${message.replace(/\n/g, "<br />")}</p>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <p style="color: #9a7b4f; font-size: 12px;">
            Sent from the contact form at decorativefloorregister.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
