import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone, Tablet, Laptop, Gamepad2, Wrench, ShieldCheck, Truck, Clock,
  ArrowRight, Star, ShoppingBag, Battery, ScreenShare, MessageSquareText,
} from "lucide-react";
import * as catalogService from "../services/catalogService.js";
import * as productService from "../services/productService.js";
import ProductCard from "../components/ecommerce/ProductCard.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";

const CATEGORY_ICONS = { Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2 };

const HOW_IT_WORKS = [
  { title: "Choose Your Device", desc: "Select category, brand and exact model in seconds." },
  { title: "Pick a Repair", desc: "See transparent pricing before you commit to anything." },
  { title: "Book & Track", desc: "Store visit, pickup, mail-in or on-site — your choice." },
  { title: "Get It Fixed", desc: "Certified technicians, genuine parts, real warranty." },
];

const REVIEWS = [
  { name: "Aisha K.", text: "Screen replacement on my iPhone was done same day and looks brand new.", rating: 5 },
  { name: "Marco R.", text: "Ordered a charger and a case — fast delivery, great packaging, fair prices.", rating: 5 },
  { name: "Lena T.", text: "Booked a pickup repair for my laptop battery, super smooth from start to finish.", rating: 4 },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      catalogService.getDeviceCategories(),
      productService.getProducts({ limit: 4, sort: "popular" }),
      productService.getProducts({ limit: 4, sort: "rating" }),
    ])
      .then(([cats, feat, best]) => {
        setCategories(cats.data || []);
        setFeatured(feat.data || []);
        setBestSellers(best.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-600/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl animate-float" />
        <div className="container-px relative mx-auto grid max-w-7xl items-center gap-10 py-20 md:py-28 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-gold-400">
              <ShieldCheck size={14} /> Certified repairs · Genuine parts
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Smart Repair.<br />
              <span className="bg-gradient-to-r from-primary-500 to-gold-400 bg-clip-text text-transparent">Smart Solutions.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-gray-300">
              Premium repair services for phones, tablets, computers and consoles — plus a full store for
              the accessories you need. All in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/repair" className="btn-primary">
                <Wrench size={18} /> Book a Repair
              </Link>
              <Link to="/shop" className="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-ink-900">
                <ShoppingBag size={18} /> Shop Now
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="animate-float rounded-3xl bg-gradient-to-br from-primary-600/20 to-gold-500/20 p-1">
              <img
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900&q=80"
                alt="Device repair workspace"
                className="h-[420px] w-full rounded-3xl object-cover shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEVICE CATEGORIES */}
      <section className="section-y container-px mx-auto max-w-7xl">
        <h2 className="mb-2 font-display text-2xl font-bold text-ink-900 md:text-3xl">Choose Your Device</h2>
        <p className="mb-8 text-gray-500">Repairs available for every major category.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories.length ? categories : [{ name: "Smartphones" }, { name: "Tablets" }, { name: "Computers" }, { name: "Gaming Devices" }]).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || Smartphone;
            return (
              <Link
                key={cat.name}
                to={`/repair/${(cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="card group flex flex-col items-center gap-3 p-6 text-center hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-gold-50 text-primary-600 transition group-hover:scale-110">
                  <Icon size={28} />
                </div>
                <span className="font-display font-semibold text-ink-900">{cat.name}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-primary-600">
                  Repair now <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR REPAIRS */}
      <section className="section-y bg-gray-50">
        <div className="container-px mx-auto max-w-7xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-ink-900 md:text-3xl">Popular Repair Services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ScreenShare, name: "Screen Replacement", desc: "45–60 min · 90 day warranty" },
              { icon: Battery, name: "Battery Replacement", desc: "30 min · 12 month warranty" },
              { icon: MessageSquareText, name: "Software & Diagnostics", desc: "Same day · Free diagnosis" },
              { icon: Wrench, name: "General Repair", desc: "Varies · Genuine parts" },
            ].map((s) => (
              <div key={s.name} className="card p-6">
                <s.icon className="mb-3 text-primary-600" size={28} />
                <h3 className="font-display font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-y container-px mx-auto max-w-7xl">
        <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink-900 md:text-3xl">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 font-display text-lg font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-display font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-y bg-gray-50">
        <div className="container-px mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Featured Products</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-primary-600">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section-y container-px mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Best Sellers</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-primary-600">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-y bg-ink-900 text-white">
        <div className="container-px mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <ShieldCheck className="text-primary-500" size={32} />
            <h3 className="font-display font-semibold">Certified Technicians</h3>
            <p className="text-sm text-gray-400">Every repair backed by genuine parts and real warranty.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <Truck className="text-primary-500" size={32} />
            <h3 className="font-display font-semibold">Flexible Service</h3>
            <p className="text-sm text-gray-400">Store visit, pickup & delivery, mail-in or on-site repair.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <Clock className="text-primary-500" size={32} />
            <h3 className="font-display font-semibold">Fast Turnaround</h3>
            <p className="text-sm text-gray-400">Most repairs completed same day, tracked in real time.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-y container-px mx-auto max-w-7xl">
        <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink-900 md:text-3xl">What Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card p-6">
              <div className="mb-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < r.rating ? "fill-gold-500 text-gold-500" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <p className="text-sm text-gray-600">"{r.text}"</p>
              <p className="mt-4 text-sm font-semibold">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section-y bg-gradient-to-r from-primary-600 to-gold-500">
        <div className="container-px mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Stay in the loop</h2>
          <p className="mt-2 text-white/90">Get repair tips, exclusive deals and product launches straight to your inbox.</p>
          <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="you@example.com" className="input flex-1 !bg-white/95" />
            <button className="rounded-xl bg-ink-900 px-6 py-3 font-semibold text-white transition hover:bg-black">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
