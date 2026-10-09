"use client";

import { useState } from "react";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const MAX_CV_BYTES = 4 * 1024 * 1024;

const inputClass =
  "w-full rounded-lg border border-linen bg-warm-white px-4 py-3 text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold";
const labelClass =
  "text-label-sm mb-2 block uppercase tracking-widest text-umber";

function Field({
  id,
  label,
  optional,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && (
          <span className="ml-1 normal-case tracking-normal text-umber/60">
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export default function ApplicationForm({ role }: { role: string }) {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const cv = formData.get("cv");
    if (cv instanceof File && cv.size > MAX_CV_BYTES) {
      setFormState({
        status: "error",
        message: "Your CV must be smaller than 4 MB.",
      });
      return;
    }

    setFormState({ status: "submitting", message: "" });

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Something went wrong.");
      }

      setFormState({
        status: "success",
        message:
          "Thank you for applying. Every application is read by our leadership team, and we'll be in touch if your profile is a fit for the next stage.",
      });
      form.reset();
    } catch (err) {
      setFormState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  if (formState.status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-display text-xl text-espresso">Application received</p>
        <p className="mt-2 text-sm leading-relaxed">{formState.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="role" value={role} />
      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name">
          <input type="text" id="name" name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field id="email" label="Email">
          <input type="email" id="email" name="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </Field>
        <Field id="phone" label="Phone / WhatsApp">
          <input type="tel" id="phone" name="phone" required autoComplete="tel" className={inputClass} placeholder="+91" />
        </Field>
        <Field id="location" label="Current city">
          <input type="text" id="location" name="location" required className={inputClass} placeholder="e.g. Aligarh, Noida, Pune" />
        </Field>
        <Field id="relocate" label="Willing to relocate to Hathras?">
          <select id="relocate" name="relocate" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select one
            </option>
            <option>Yes</option>
            <option>Already in / near Hathras</option>
            <option>Open to discuss</option>
            <option>No</option>
          </select>
        </Field>
        <Field id="experience" label="Relevant experience">
          <select id="experience" name="experience" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select one
            </option>
            <option>Under 4 years</option>
            <option>4–6 years</option>
            <option>7–10 years</option>
            <option>10+ years</option>
          </select>
        </Field>
        <Field id="currentCtc" label="Current CTC" optional>
          <input type="text" id="currentCtc" name="currentCtc" className={inputClass} placeholder="e.g. ₹7 LPA" />
        </Field>
        <Field id="expectedCtc" label="Expected CTC">
          <input type="text" id="expectedCtc" name="expectedCtc" required className={inputClass} placeholder="e.g. ₹9 LPA" />
        </Field>
        <Field id="noticePeriod" label="Notice period">
          <input type="text" id="noticePeriod" name="noticePeriod" required className={inputClass} placeholder="e.g. 30 days" />
        </Field>
        <Field id="linkedin" label="LinkedIn profile" optional>
          <input type="url" id="linkedin" name="linkedin" className={inputClass} placeholder="https://linkedin.com/in/…" />
        </Field>
      </div>

      <Field id="improvement" label="A quality or process problem you personally solved">
        <textarea
          id="improvement"
          name="improvement"
          required
          rows={5}
          maxLength={4000}
          className={`${inputClass} resize-y`}
          placeholder="What was the problem, what did you change, and what was the measurable result? A few honest sentences are better than a polished essay."
        />
      </Field>

      <Field id="cv" label="CV (PDF or Word, max 4 MB)">
        <input
          type="file"
          id="cv"
          name="cv"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full text-sm text-umber file:mr-4 file:rounded-lg file:border-0 file:bg-linen file:px-4 file:py-2.5 file:text-label-sm file:uppercase file:tracking-widest file:text-espresso hover:file:bg-brass/30"
        />
      </Field>

      {formState.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {formState.message}
        </div>
      )}

      <button
        type="submit"
        disabled={formState.status === "submitting"}
        className="light-sweep w-full rounded-lg bg-antique-gold px-6 py-3 text-label-md uppercase tracking-widest text-white transition-colors hover:bg-brass disabled:cursor-not-allowed disabled:opacity-50"
      >
        {formState.status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
      <p className="text-center text-xs text-umber/70">
        Your details are used only to assess this application and are never shared.
      </p>
    </form>
  );
}
