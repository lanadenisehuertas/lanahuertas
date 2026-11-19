"use client";

import { useRef, useState, type FormEvent } from "react";
import { profile } from "@/lib/content";
import { oops, sent } from "@/lib/dusk/sound";

/*
 * Message form. Posts straight to Lana's inbox through FormSubmit's AJAX
 * endpoint, so the site needs no server or API key. The very first message
 * triggers a one-time activation email from FormSubmit to the inbox; after
 * that link is clicked, every message is delivered.
 *
 * Fields validate when you leave them, errors sit under their field, and a
 * failed send keeps everything typed and offers email as a way out.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function check(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Add your name so I know who's writing.";
  if (!f.email.trim()) e.email = "Add your email so I can reply.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "That email looks incomplete. Check for a typo.";
  if (f.message.trim().length < 10) e.message = "Write a little more, at least 10 characters.";
  return e;
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const honey = useRef<HTMLInputElement>(null);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...fields, [k]: e.target.value };
    setFields(next);
    // Once a field has an error, clear it as soon as the input becomes valid.
    if (errors[k] && !check(next)[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const blur = (k: keyof Fields) => () => {
    if (!fields[k]) return;
    setErrors((prev) => ({ ...prev, [k]: check(fields)[k] }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = check(fields);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[])[0];
    if (first) {
      oops();
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Bots fill the hidden field; pretend it worked and send nothing.
    if (honey.current?.value) {
      setStatus("sent");
      sent();
      return;
    }

    setStatus("sending");
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          _replyto: fields.email.trim(),
          _subject: `Portfolio message from ${fields.name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(data.success) !== "true") throw new Error("not sent");
      setStatus("sent");
      sent();
    } catch {
      setStatus("failed");
      oops();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="form-done">
        <span aria-hidden className="px-mark" />
        <p className="form-done-title">Message sent</p>
        <p className="form-done-text">
          Thank you{fields.name.trim() ? `, ${fields.name.trim().split(" ")[0]}` : ""}. I&apos;ll reply to {fields.email.trim() || "your email"} within a few days.
        </p>
        <button
          type="button"
          onClick={() => {
            setFields({ name: "", email: "", message: "" });
            setStatus("idle");
          }}
          className="link"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-labelledby="form-heading"
      className="form backing"
    >
      <h3 id="form-heading" className="form-title">
        Send a message
      </h3>
      <p className="form-note">It goes straight to my inbox.</p>

      <div className="form-pair">
        <Field id="cf-name" label="Name" error={errors.name}>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={fields.name}
            onChange={set("name")}
            onBlur={blur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            className="field"
            placeholder="Your name"
          />
        </Field>
        <Field id="cf-email" label="Email" error={errors.email}>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={set("email")}
            onBlur={blur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            className="field"
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field id="cf-message" label="Message" error={errors.message}>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            value={fields.message}
            onChange={set("message")}
            onBlur={blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "cf-message-err" : undefined}
            className="field form-area"
            placeholder="A role, a project, a brand or event you need designed…"
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <input ref={honey} type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {status === "failed" && (
        <p role="alert" className="form-alert">
          Your message didn&apos;t send. The connection dropped or the mail service didn&apos;t answer. Everything you typed is still here: try again,
          or email{" "}
          <a href={`mailto:${profile.email}`} className="link">
            {profile.email}
          </a>
          .
        </p>
      )}

      <div className="form-acts">
        <button type="submit" disabled={sending} aria-busy={sending} className="btn">
          {sending ? "Sending…" : "Send message"}
          {!sending && <span aria-hidden>↗</span>}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="contact-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="field-err">
          {error}
        </p>
      )}
    </div>
  );
}
