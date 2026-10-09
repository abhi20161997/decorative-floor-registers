import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { getJob } from "@/lib/careers";

// Comma-separated list; override with CAREERS_EMAIL in the environment.
const CAREERS_EMAILS = (
  process.env.CAREERS_EMAIL || "deepakbrass@gmail.com,reachabhijitkumar@gmail.com"
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// Vercel caps request bodies at 4.5 MB, so keep the CV comfortably under that.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const ALLOWED_CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(formData: FormData, key: string, maxLength = 500) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Honeypot: real users never see or fill this field.
    if (field(formData, "website")) {
      return NextResponse.json({ success: true });
    }

    const job = getJob(field(formData, "role"));
    const name = field(formData, "name", 120);
    const email = field(formData, "email", 200);
    const phone = field(formData, "phone", 40);
    const location = field(formData, "location", 120);
    const relocate = field(formData, "relocate", 40);
    const experience = field(formData, "experience", 40);
    const currentCtc = field(formData, "currentCtc", 60);
    const expectedCtc = field(formData, "expectedCtc", 60);
    const noticePeriod = field(formData, "noticePeriod", 60);
    const linkedin = field(formData, "linkedin", 300);
    const improvement = field(formData, "improvement", 4000);
    const cv = formData.get("cv");

    if (!job) {
      return NextResponse.json({ error: "This role is no longer open." }, { status: 400 });
    }
    if (!name || !email || !phone || !location || !relocate || !expectedCtc || !noticePeriod || !improvement) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (!(cv instanceof File) || cv.size === 0) {
      return NextResponse.json({ error: "Please attach your CV." }, { status: 400 });
    }
    const cvExtension = ALLOWED_CV_TYPES[cv.type];
    if (!cvExtension) {
      return NextResponse.json(
        { error: "Your CV must be a PDF or Word document." },
        { status: 400 }
      );
    }
    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "Your CV must be smaller than 4 MB." },
        { status: 400 }
      );
    }

    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Current location", location],
      ["Willing to relocate to Hathras", relocate],
      ["Relevant experience", experience || "—"],
      ["Current CTC", currentCtc || "—"],
      ["Expected CTC", expectedCtc],
      ["Notice period", noticePeriod],
      ["LinkedIn", linkedin || "—"],
    ];

    const safeFileName = `${name.replace(/[^a-z0-9]+/gi, "_").slice(0, 60) || "candidate"}_CV.${cvExtension}`;

    const { error } = await resend.emails.send({
      from: "Sanjay Overseas Careers <onboarding@resend.dev>",
      to: CAREERS_EMAILS,
      replyTo: email,
      subject: `Application: ${job.title} — ${name} (${location})`,
      attachments: [
        { filename: safeFileName, content: Buffer.from(await cv.arrayBuffer()) },
      ],
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c2420; font-family: 'Georgia', serif;">New application: ${escapeHtml(job.title)}</h2>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <table style="border-collapse: collapse; width: 100%;">
            ${rows
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding: 6px 12px 6px 0; color: #9a7b4f; vertical-align: top; white-space: nowrap;">${label}</td>
                <td style="padding: 6px 0; color: #2c2420;">${escapeHtml(value)}</td>
              </tr>`
              )
              .join("")}
          </table>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <h3 style="color: #2c2420; font-family: 'Georgia', serif;">A quality or process improvement they delivered</h3>
          <p style="color: #6b5d52; line-height: 1.6;">${escapeHtml(improvement).replace(/\n/g, "<br />")}</p>
          <hr style="border: none; border-top: 1px solid #f0ebe4; margin: 16px 0;" />
          <p style="color: #9a7b4f; font-size: 12px;">
            CV attached. Reply to this email to contact the candidate directly.<br />
            Sent from the careers page at decorativefloorregister.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error (careers):", error);
      return NextResponse.json(
        { error: "We couldn't submit your application. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Careers application error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
