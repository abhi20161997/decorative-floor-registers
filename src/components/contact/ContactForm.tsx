"use client";

import { useState } from "react";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ status: "submitting", message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Something went wrong.");
      }

      setFormState({
        status: "success",
        message:
          "Thank you for reaching out! We will get back to you within 1\u20132 business days.",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="text-label-sm mb-2 block uppercase tracking-widest text-umber"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-linen bg-warm-white px-4 py-3 text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-label-sm mb-2 block uppercase tracking-widest text-umber"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-linen bg-warm-white px-4 py-3 text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="text-label-sm mb-2 block uppercase tracking-widest text-umber"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg border border-linen bg-warm-white px-4 py-3 text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-label-sm mb-2 block uppercase tracking-widest text-umber"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-linen bg-warm-white px-4 py-3 text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
          placeholder="Tell us more about your inquiry..."
        />
      </div>

      {formState.status === "success" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {formState.message}
        </div>
      )}

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
        {formState.status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
