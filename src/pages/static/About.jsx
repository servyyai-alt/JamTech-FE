import React from "react";
import { ShieldCheck, Users, Award, Wrench } from "lucide-react";

const About = () => (
  <div>
    <section className="bg-ink-900 py-20 text-center text-white">
      <div className="container-px mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold">About JAM Smart Tech</h1>
        <p className="mt-4 text-gray-300">Premium device repair and electronics retail, built around trust, speed, and genuine parts.</p>
      </div>
    </section>
    <section className="container-px section-y mx-auto max-w-5xl">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">Our Story</h2>
          <p className="text-gray-600">
            JAM Smart Tech started as a neighborhood repair counter and grew into a full-service
            destination for device repair and accessories. Every repair is backed by a warranty, every
            part is genuine or manufacturer-grade, and every customer gets real-time tracking from
            booking to delivery.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80" alt="Repair technician" className="rounded-2xl shadow-premium" />
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "Certified Repairs" },
          { icon: Users, label: "10,000+ Happy Customers" },
          { icon: Award, label: "Genuine Parts" },
          { icon: Wrench, label: "Same-Day Service" },
        ].map((f) => (
          <div key={f.label} className="card flex flex-col items-center gap-2 p-6 text-center">
            <f.icon className="text-primary-600" size={28} />
            <span className="text-sm font-semibold">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);
export default About;
