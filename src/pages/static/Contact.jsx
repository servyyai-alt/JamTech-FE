import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, AlertCircle, Wrench, PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext.jsx";
import "./contact-page.css";

const MESSAGE_MAX = 500;
const sanitizePhone = (value) => value.replace(/[^\d\s+()-]/g, "");

const Contact = () => {
  const { t } = useTranslation("static");
  const { showToast } = useToast();
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 7) {
      setPhoneError(t("contact.form.phoneInvalid"));
      return;
    }
    setPhoneError("");
    setSubmitting(true);
    setTimeout(() => {
      showToast(t("contact.toastSuccess"), "success");
      formRef.current?.reset();
      setPhone("");
      setMessage("");
      setSubmitting(false);
    }, 800);
  };

  const handlePhoneChange = (e) => {
    setPhone(sanitizePhone(e.target.value));
    if (phoneError) setPhoneError("");
  };

  const channels = [
    { key: "email", icon: Mail, label: t("contact.emailLabel"), value: t("contact.emailValue"), href: `mailto:${t("contact.emailValue")}` },
    { key: "phone", icon: Phone, label: t("contact.phoneLabel"), value: t("contact.phoneValue"), href: `tel:${t("contact.phoneValue").replace(/\s/g, "")}` },
    { key: "store", icon: MapPin, label: t("contact.storeLabel"), value: t("contact.storeValue") },
  ];

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <header className="contact-hero">
        <span className="contact-hero__grid" aria-hidden="true" />
        <span className="contact-hero__glow contact-hero__glow--a" aria-hidden="true" />
        <span className="contact-hero__glow contact-hero__glow--b" aria-hidden="true" />
        <span className="contact-hero__kicker">{t("contact.kicker")}</span>
        <h1 className="contact-hero__title">{t("contact.title")} <span>{t("contact.highlight")}</span></h1>
        <p className="contact-hero__subtitle">{t("contact.subtitle")}</p>
      </header>

      <div className="contact-layout">
        <div className="contact-cards">
          {channels.map((channel, i) => {
            const Icon = channel.icon;
            const content = (
              <>
                <span className="contact-card__bar" aria-hidden="true" />
                <span className="contact-card__icon"><Icon size={20} /></span>
                <span className="contact-card__copy">
                  <span className="contact-card__label">{channel.label}</span>
                  <span className="contact-card__value">{channel.value}</span>
                </span>
              </>
            );
            const style = { "--i": i };
            return channel.href ? (
              <a key={channel.key} href={channel.href} className="contact-card" style={style}>{content}</a>
            ) : (
              <div key={channel.key} className="contact-card" style={style}>{content}</div>
            );
          })}
          <div className="contact-cta" style={{ "--i": channels.length }}>
            <Link to="/repair"><Wrench size={15} /> {t("contact.ctaRepair")}</Link>
            <Link to="/track-repair"><PackageSearch size={15} /> {t("contact.ctaTrack")}</Link>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <h2 className="contact-form__title">{t("contact.form.title")}</h2>
          <p className="contact-form__hint">{t("contact.form.hint")}</p>

          <div className="contact-form__grid">
            <div className="contact-form__row">
              <div>
                <label className="label" htmlFor="contact-name">{t("contact.form.name")}</label>
                <input id="contact-name" name="name" required autoComplete="name" className="input contact-form__input" onInput={(e) => { e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, ""); }} />
              </div>
              <div>
                <label className="label" htmlFor="contact-email">{t("contact.form.email")}</label>
                <input id="contact-email" name="email" type="email" required autoComplete="email" className="input contact-form__input" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="contact-phone">{t("contact.form.phone")}</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                placeholder={t("contact.form.phonePlaceholder")}
                aria-invalid={phoneError ? "true" : "false"}
                aria-describedby={phoneError ? "contact-phone-error" : undefined}
                className={`input contact-form__input ${phoneError ? "contact-form__input--error" : ""}`}
                value={phone}
                onChange={handlePhoneChange}
              />
              {phoneError && (
                <p className="contact-form__error" id="contact-phone-error">
                  <AlertCircle size={13} /> {phoneError}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="contact-message">{t("contact.form.message")}</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={MESSAGE_MAX}
                placeholder={t("contact.form.messagePlaceholder")}
                className="input contact-form__input resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className={`contact-form__counter ${message.length > MESSAGE_MAX * 0.9 ? "contact-form__counter--warn" : ""}`}>
                {t("contact.form.counter", { used: message.length, max: MESSAGE_MAX })}
              </p>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary contact-form__submit disabled:opacity-70">
              {submitting ? <span className="contact-form__spinner" aria-hidden="true" /> : <Send size={16} />}
              {submitting ? t("contact.form.sending") : t("contact.form.send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Contact;
