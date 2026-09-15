import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Users, Award, Wrench } from "lucide-react";

const About = () => {
  const { t } = useTranslation("static");
  const features = [
    { key: "certified", icon: ShieldCheck },
    { key: "customers", icon: Users },
    { key: "genuine", icon: Award },
    { key: "sameDay", icon: Wrench },
  ];
  return (
    <div>
      <section className="bg-ink-900 py-20 text-center text-white">
        <div className="container-px mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold">{t("about.title")}</h1>
          <p className="mt-4 text-gray-300">{t("about.subtitle")}</p>
        </div>
      </section>
      <section className="container-px section-y mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">{t("about.storyTitle")}</h2>
            <p className="text-gray-600">
              {t("about.storyBody")}
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80" alt={t("about.imgAlt")} className="rounded-2xl shadow-premium" />
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-4">
          {features.map((f) => (
            <div key={f.key} className="card flex flex-col items-center gap-2 p-6 text-center">
              <f.icon className="text-primary-600" size={28} />
              <span className="text-sm font-semibold">{t(`about.features.${f.key}`)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default About;