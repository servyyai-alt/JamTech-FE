import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

const Contact = () => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast("Message sent! We'll get back to you soon.", "success");
      e.target.reset();
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="container-px section-y mx-auto max-w-5xl">
      <h1 className="mb-10 text-center font-display text-3xl font-bold">Get In Touch</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3"><Mail className="text-primary-600" size={20} /><div><p className="font-semibold">Email</p><p className="text-sm text-gray-500">support@jamsmarttech.com</p></div></div>
          <div className="flex items-start gap-3"><Phone className="text-primary-600" size={20} /><div><p className="font-semibold">Phone</p><p className="text-sm text-gray-500">+31 20 123 4567</p></div></div>
          <div className="flex items-start gap-3"><MapPin className="text-primary-600" size={20} /><div><p className="font-semibold">Store</p><p className="text-sm text-gray-500">123 Tech Street, Amsterdam, Netherlands</p></div></div>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div><label className="label">Name</label><input required className="input" /></div>
          <div><label className="label">Email</label><input required type="email" className="input" /></div>
          <div><label className="label">Message</label><textarea required rows={4} className="input" /></div>
          <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? "Sending..." : "Send Message"}</button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
