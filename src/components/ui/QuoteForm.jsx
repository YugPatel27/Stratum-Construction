import React, { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { quoteTypes, siteConfig } from '@/data/siteData';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your name.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter an email address we can reply to, like name@company.com.';
  if (values.message.trim().length < 10) errors.message = 'Tell us a little about the project (at least 10 characters).';
  return errors;
}

export function buildMailto(values) {
  const subject = `Quote request: ${values.type}`;
  const body = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    values.phone.trim() ? `Phone: ${values.phone.trim()}` : null,
    `Project type: ${values.type}`,
    '',
    values.message.trim(),
  ]
    .filter((l) => l !== null)
    .join('\n');
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Quote request. There is no backend: a valid request opens the visitor's email app with everything filled in.
 * To send to a server instead (Formspree, your own API), replace the `window.location.href` line in onSubmit.
 */
export default function QuoteForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', type: quoteTypes[0], message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`quote-${first}`)?.focus();
      return;
    }
    window.location.href = buildMailto(values);
    setSent(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="border border-on-dark/20 bg-on-dark/[0.04] p-6 md:p-8"
        >
          <h3 className="h-display text-[2.4rem] leading-[0.9] text-on-dark">Your request is ready.</h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-on-dark/75">
            Your email app should have opened with the details filled in. Press send there and we will reply within one working day. If nothing opened, write to{' '}
            <a className="link-fx text-ply" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="btn-fx btn-fx--ply mt-6 rounded-lg border border-on-dark/30 px-5 py-2.5 text-sm font-bold text-on-dark"
          >
            Edit the request
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid gap-6"
          aria-label="Request a quote"
        >
          <fieldset>
            <legend className="field__label">What do you want built?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {quoteTypes.map((t) => (
                <label key={t} className="chip">
                  <input type="radio" name="type" value={t} checked={values.type === t} onChange={set('type')} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="field">
              <span className="field__label">Your name</span>
              <input
                id="quote-name"
                className="field__input"
                value={values.name}
                onChange={set('name')}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
                placeholder="Asha Mehta"
              />
              {errors.name && (
                <p id="err-name" role="alert" className="field__error">
                  {errors.name}
                </p>
              )}
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                id="quote-email"
                type="email"
                className="field__input"
                value={values.email}
                onChange={set('email')}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                placeholder="asha@company.com"
              />
              {errors.email && (
                <p id="err-email" role="alert" className="field__error">
                  {errors.email}
                </p>
              )}
            </label>
          </div>

          <label className="field">
            <span className="field__label">Phone (optional)</span>
            <input
              id="quote-phone"
              type="tel"
              className="field__input"
              value={values.phone}
              onChange={set('phone')}
              autoComplete="tel"
              placeholder="So we can call you back"
            />
          </label>

          <label className="field">
            <span className="field__label">The project</span>
            <textarea
              id="quote-message"
              className="field__input"
              rows={4}
              value={values.message}
              onChange={set('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'err-message' : undefined}
              placeholder="Where is the site, how big is it, and when do you need it finished?"
            />
            {errors.message && (
              <p id="err-message" role="alert" className="field__error">
                {errors.message}
              </p>
            )}
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="btn-fx btn-fx--ply inline-flex items-center gap-2.5 rounded-lg bg-survey px-7 py-3.5 text-[15px] font-bold text-ink"
            >
              Send quote request <span className="fx-dot" aria-hidden="true" />
            </button>
            <p className="text-sm text-on-dark/60">{siteConfig.reply}</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
