import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext.jsx";

const Contact = () => {
  const { t } = useTranslation("static");
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast(t("contact.toastSuccess"), "success");
      e.target.reset();
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="container-px section-y mx-auto max-w-5xl">
      <h1 className="mb-10 text-center font-display text-3xl font-bold">{t("contact.title")}</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <a href={`mailto:${t("contact.emailValue")}`} className="flex items-start gap-3 group cursor-pointer"><Mail className="text-primary-600" size={20} /><div><p className="font-semibold group-hover:text-primary-600 transition-colors">{t("contact.emailLabel")}</p><p className="text-sm text-gray-500 group-hover:text-primary-500 transition-colors">{t("contact.emailValue")}</p></div></a>
          <a href={`tel:${t("contact.phoneValue")}`} className="flex items-start gap-3 group cursor-pointer"><Phone className="text-primary-600" size={20} /><div><p className="font-semibold group-hover:text-primary-600 transition-colors">{t("contact.phoneLabel")}</p><p className="text-sm text-gray-500 group-hover:text-primary-500 transition-colors">{t("contact.phoneValue")}</p></div></a>
          <div className="flex items-start gap-3"><MapPin className="text-primary-600" size={20} /><div><p className="font-semibold">{t("contact.storeLabel")}</p><p className="text-sm text-gray-500">{t("contact.storeValue")}</p></div></div>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div><label className="label">{t("contact.form.name")}</label><input required className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, '')} /></div>
          <div><label className="label">{t("contact.form.email")}</label><input required type="email" className="input" /></div>
          <div><label className="label">{t("contact.form.message")}</label><textarea required rows={4} className="input" /></div>
          <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? t("contact.form.sending") : t("contact.form.send")}</button>
        </form>
      </div>
    </div>
  );
};
export default Contact;