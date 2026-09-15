import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone, Tablet, Laptop, Gamepad2, Wrench, ShieldCheck, Truck, Clock,
  ArrowRight, Star, ShoppingBag, Battery, ScreenShare, MessageSquareText,
  ChevronLeft, ChevronRight, Zap, Award, HeadphonesIcon, CheckCircle2,
} from "lucide-react";
import * as catalogService from "../services/catalogService.js";
import * as productService from "../services/productService.js";
import ProductCard from "../components/ecommerce/ProductCard.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";

/* ─── constants ─────────────────────────────────────────────── */
const CATEGORY_ICONS = {
  Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2,
};
const FALLBACK_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Tablets", slug: "tablets" },
  { name: "Computers", slug: "computers" },
  { name: "Gaming Devices", slug: "gaming-devices" },
];
const REPAIR_SERVICES = [
  { icon: ScreenShare, name: "Screen Replacement", time: "45–60 min", warranty: "90-day warranty", color: "#F97316" },
  { icon: Battery, name: "Battery Replacement", time: "30 min", warranty: "12-month warranty", color: "#F59E0B" },
  { icon: MessageSquareText, name: "Software & Diagnostics", time: "Same day", warranty: "Free diagnosis", color: "#EF4444" },
  { icon: Wrench, name: "General Repair", time: "Varies", warranty: "Genuine parts", color: "#8B5CF6" },
];
const HOW_IT_WORKS = [
  { title: "Choose Your Device", desc: "Select category, brand and exact model in seconds.", icon: Smartphone },
  { title: "Pick a Repair", desc: "See transparent pricing before you commit to anything.", icon: ShieldCheck },
  { title: "Book & Track", desc: "Store visit, pickup, mail-in or on-site — your choice.", icon: Truck },
  { title: "Get It Fixed", desc: "Certified technicians, genuine parts, real warranty.", icon: Award },
];
const REVIEWS = [
  { name: "Aisha K.", role: "Verified Customer", text: "Screen replacement on my iPhone was done same day. Looks absolutely brand new — couldn't be happier.", rating: 5, device: "iPhone 14 Pro" },
  { name: "Marco R.", role: "Verified Customer", text: "Ordered a charger and a case — fast delivery, great packaging, genuinely fair prices. Will be back.", rating: 5, device: "Samsung Galaxy" },
  { name: "Lena T.", role: "Verified Customer", text: "Booked a pickup repair for my laptop battery. Super smooth from start to finish, kept me updated throughout.", rating: 4, device: "MacBook Pro" },
  { name: "James O.", role: "Verified Customer", text: "Gaming console repair was handled with care. They even cleaned the unit — above and beyond service.", rating: 5, device: "PlayStation 5" },
  { name: "Priya M.", role: "Verified Customer", text: "Software issue resolved remotely within hours. Saved me a trip to the store entirely.", rating: 5, device: "Dell XPS" },
];
const MARQUEE_ITEMS = [
  "Certified Technicians", "Same-Day Repairs", "90-Day Warranty", "Genuine Parts",
  "Free Diagnostics", "Pickup & Delivery", "All Major Brands", "Competitive Pricing",
];
const STATS = [
  { value: "50K+", label: "Devices Repaired" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2 Hr", label: "Avg. Turnaround" },
  { value: "100%", label: "Parts Guaranteed" },
];

/* ─── hooks ─────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} style={{ color: i < rating ? "#F97316" : "#E2E8F0", fill: i < rating ? "#F97316" : "#E2E8F0" }} />
      ))}
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────── */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const featCarouselRef = useRef(null);
  const bestCarouselRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    Promise.all([
      catalogService.getDeviceCategories(),
      productService.getProducts({ limit: 8, sort: "popular" }),
      productService.getProducts({ limit: 8, sort: "rating" }),
    ])
      .then(([cats, feat, best]) => {
        setCategories(cats.data || []);
        setFeatured(feat.data || []);
        setBestSellers(best.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setReviewIdx((i) => (i + 1) % REVIEWS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const scroll = (ref, dir) => { if (ref.current) ref.current.scrollBy({ left: dir * 280, behavior: "smooth" }); };
  const displayCats = categories.length ? categories : FALLBACK_CATEGORIES;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#ffffff", color: "#1A1A2E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .syne { font-family: 'Syne', sans-serif; }

        /* marquee */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        /* hero float */
        @keyframes hfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .hero-float { animation: hfloat 5s ease-in-out infinite; }

        /* pulse ring */
        @keyframes ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
        .ring { animation: ring 2.4s ease-out infinite; }

        /* carousel */
        .p-carousel { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 8px; }
        .p-carousel::-webkit-scrollbar { display: none; }
        .p-carousel > * { scroll-snap-align: start; flex: 0 0 260px; }

        /* lift */
        .lift { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .lift:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(249,115,22,0.16); }

        /* cat card */
        .cat-card { transition: all 0.25s ease; border: 2px solid #F3F4F6; background: #fff; }
        .cat-card:hover { border-color: #F97316; background: #FFF7ED; }
        .cat-card:hover .cat-icon { background: linear-gradient(135deg, #F97316, #F59E0B); color: #fff; transform: scale(1.1) rotate(-5deg); }
        .cat-icon { transition: all 0.25s ease; background: #FFF7ED; color: #F97316; }

        /* svc card */
        .svc-card { border: 2px solid #F3F4F6; transition: all 0.25s ease; }
        .svc-card:hover { border-color: var(--svc-color); background: var(--svc-bg); }

        /* step connector */
        .step-conn { flex: 1; height: 2px; background: linear-gradient(to right, #F97316, #FED7AA); margin: 0 8px; margin-bottom: 44px; }
        @media (max-width: 767px) { .step-conn { display: none; } .p-carousel > * { flex: 0 0 220px; } }

        /* btn */
        .btn-o { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; }
        .btn-o.solid { background: linear-gradient(135deg, #F97316, #F59E0B); color: #fff; box-shadow: 0 6px 20px rgba(249,115,22,0.35); }
        .btn-o.solid:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.45); }
        .btn-o.outline { background: transparent; color: #1A1A2E; border: 2px solid #E5E7EB; }
        .btn-o.outline:hover { border-color: #F97316; color: #F97316; background: #FFF7ED; }

        /* input focus */
        input:focus { outline: none; border-color: #F97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }

        @media (prefers-reduced-motion: reduce) { .hero-float, .marquee-track, .ring { animation: none; } }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 50%, #FEF3C7 100%)", minHeight: "92vh", display: "flex", alignItems: "center" }}>

        {/* decorative circles */}
        <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* subtle dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px clamp(20px,5vw,60px)", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* left copy */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(32px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <Zap size={13} style={{ color: "#F97316" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#EA580C", letterSpacing: "0.02em" }}>Certified repairs · Genuine parts · Real warranty</span>
            </div>

            <h1 className="syne" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.08, color: "#1A1A2E", marginBottom: 20 }}>
              Device broken?<br />
              <span style={{ background: "linear-gradient(90deg, #F97316, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We fix that fast.</span>
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#6B7280", maxWidth: 480, marginBottom: 36 }}>
              Premium repair services for phones, tablets, computers and consoles — plus a full accessories store. Most repairs done same day.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <Link to="/repair" className="btn-o solid"><Wrench size={17} /> Book a Repair</Link>
              <Link to="/shop" className="btn-o outline"><ShoppingBag size={17} /> Shop Accessories</Link>
            </div>

            {/* stats */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ opacity: heroVisible ? 1 : 0, transition: `opacity 0.5s ease ${0.3 + i * 0.1}s` }}>
                  <div className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#F97316", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right — floating image */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div className="hero-float" style={{ position: "relative", width: "100%", maxWidth: 440 }}>

              {/* main image */}
              <div style={{
                borderRadius: 28, overflow: "hidden",
                border: "3px solid rgba(249,115,22,0.15)",
                boxShadow: "0 32px 80px rgba(249,115,22,0.2), 0 0 0 1px rgba(249,115,22,0.08)",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "none" : "scale(0.95)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}>
                <img src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=85" alt="Technician repairing device" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.3) 0%, transparent 60%)" }} />
              </div>

              {/* badge 1 — repair complete */}
              <div className="lift" style={{
                position: "absolute", bottom: 32, left: -28,
                background: "#fff", borderRadius: 18, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6",
                opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateX(-20px)",
                transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #F97316, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={18} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>Repair Complete</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>iPhone 15 · Screen fixed</div>
                </div>
              </div>

              {/* badge 2 — rating */}
              <div className="lift" style={{
                position: "absolute", top: 20, right: -20,
                background: "#fff", borderRadius: 14, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: "0 8px 28px rgba(0,0,0,0.1)", border: "1px solid #F3F4F6",
                opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s ease 0.65s",
              }}>
                <Star size={15} style={{ color: "#F97316", fill: "#F97316" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>4.9</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>50k+ reviews</span>
              </div>

              {/* pulse ring on badge */}
              <div style={{ position: "absolute", top: 14, right: -26, width: 50, height: 50, borderRadius: "50%", border: "2px solid rgba(249,115,22,0.4)", pointerEvents: "none" }} className="ring" />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ──────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(90deg, #F97316, #F59E0B)", padding: "13px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "0 24px", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, color: "#fff" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block", flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── DEVICE CATEGORIES ───────────────────────────────────── */}
      <section style={{ padding: "80px clamp(20px,5vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>What needs fixing?</p>
              <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>Choose Your Device</h2>
            </div>
            <Link to="/repair" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none" }}>
              All services <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
          {displayCats.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.name] || Smartphone;
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Reveal key={cat.name} delay={i * 0.08}>
                <Link to={`/repair/${slug}`} style={{ textDecoration: "none" }}>
                  <div className="cat-card lift" style={{ borderRadius: 20, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16, cursor: "pointer" }}>
                    <div className="cat-icon" style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={26} />
                    </div>
                    <div>
                      <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{cat.name}</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF" }}>Repair & parts available</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#F97316" }}>
                      Book now <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR REPAIR SERVICES ──────────────────────────────── */}
      <section style={{ background: "#FFF7ED", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Most requested</p>
            <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E", marginBottom: 40 }}>Popular Repair Services</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {REPAIR_SERVICES.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.1}>
                <div className="svc-card lift" style={{ "--svc-color": s.color, "--svc-bg": `${s.color}0d`, borderRadius: 20, padding: "28px 24px", background: "#fff" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <s.icon size={24} style={{ color: s.color }} />
                  </div>
                  <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 10 }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", borderRadius: 6, padding: "3px 10px" }}>{s.time}</span>
                    <span style={{ fontSize: 12, color: s.color, background: `${s.color}15`, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>{s.warranty}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section style={{ padding: "80px clamp(20px,5vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>Simple process</p>
          <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 60 }}>How It Works</h2>
        </Reveal>
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
          {HOW_IT_WORKS.map((step, i) => (
            <React.Fragment key={step.title}>
              <Reveal delay={i * 0.1} style={{ flex: "1 1 200px", textAlign: "center", padding: "0 12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", border: "2px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.icon size={26} style={{ color: "#F97316" }} />
                    </div>
                    <div style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(249,115,22,0.4)" }}>{i + 1}</div>
                  </div>
                  <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{step.title}</div>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, maxWidth: 180 }}>{step.desc}</p>
                </div>
              </Reveal>
              {i < HOW_IT_WORKS.length - 1 && <div className="step-conn" style={{ marginTop: 32 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#FB923C", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>Why us</p>
            <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 60 }}>The JAM Smart Tech Difference</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { icon: ShieldCheck, color: "#F97316", title: "Certified Technicians", desc: "Every repair handled by trained specialists using genuine OEM parts backed by warranty." },
              { icon: Truck, color: "#F59E0B", title: "Flexible Service", desc: "Walk in, book a pickup, mail it in, or have us come to you — whatever fits your schedule." },
              { icon: Clock, color: "#EF4444", title: "Fast Turnaround", desc: "Most repairs completed same day. Track your repair status in real time from any device." },
              { icon: HeadphonesIcon, color: "#8B5CF6", title: "After-Service Support", desc: "Our support team is available post-repair to ensure everything is working perfectly." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="lift" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS carousel ───────────────────────────── */}
      <section style={{ padding: "80px 0 80px clamp(20px,5vw,60px)", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingRight: "clamp(20px,5vw,60px)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>Hand-picked</p>
                <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>Featured Products</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link to="/shop" style={{ fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none", marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>View all <ArrowRight size={14} /></Link>
                {[ChevronLeft, ChevronRight].map((Ic, j) => (
                  <button key={j} onClick={() => scroll(featCarouselRef, j === 0 ? -1 : 1)} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #E5E7EB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}>
                    <Ic size={18} />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <div ref={featCarouselRef} className="p-carousel" style={{ paddingRight: "clamp(20px,5vw,60px)" }}>
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS carousel ────────────────────────────────── */}
      <section style={{ padding: "0 0 80px clamp(20px,5vw,60px)", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingRight: "clamp(20px,5vw,60px)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>Top rated</p>
                <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>Best Sellers</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link to="/shop" style={{ fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none", marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>View all <ArrowRight size={14} /></Link>
                {[ChevronLeft, ChevronRight].map((Ic, j) => (
                  <button key={j} onClick={() => scroll(bestCarouselRef, j === 0 ? -1 : 1)} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #E5E7EB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}>
                    <Ic size={18} />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <div ref={bestCarouselRef} className="p-carousel" style={{ paddingRight: "clamp(20px,5vw,60px)" }}>
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────── */}
      <section style={{ background: "#FFF7ED", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>Customer stories</p>
            <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 48 }}>What Customers Say</h2>
          </Reveal>

          {/* featured large quote */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(24px,4vw,48px)", maxWidth: 680, margin: "0 auto 36px", boxShadow: "0 8px 40px rgba(249,115,22,0.08)", border: "1px solid #FED7AA", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 20, right: 28, fontSize: 80, lineHeight: 1, color: "rgba(249,115,22,0.08)", fontFamily: "serif", fontWeight: 900 }}>"</div>
            <StarRow rating={REVIEWS[reviewIdx].rating} />
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#374151", lineHeight: 1.8, margin: "18px 0 22px", fontStyle: "italic" }}>
              "{REVIEWS[reviewIdx].text}"
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{REVIEWS[reviewIdx].name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{REVIEWS[reviewIdx].role} · {REVIEWS[reviewIdx].device}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {REVIEWS.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)} style={{ width: i === reviewIdx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === reviewIdx ? "#F97316" : "#E5E7EB", transition: "all 0.3s ease" }} />
                ))}
              </div>
            </div>
          </div>

          {/* mini cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {REVIEWS.slice(0, 3).map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="lift" onClick={() => setReviewIdx(i)} style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", cursor: "pointer", border: `2px solid ${reviewIdx === i ? "#F97316" : "#F3F4F6"}`, transition: "border-color 0.25s" }}>
                  <StarRow rating={r.rating} />
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "10px 0 12px", lineHeight: 1.65 }}>"{r.text.slice(0, 80)}…"</p>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.device}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────── */}
      <section style={{ padding: "80px clamp(20px,5vw,60px)", background: "linear-gradient(135deg, #F97316 0%, #F59E0B 100%)" }}>
        <Reveal>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Zap size={26} style={{ color: "#fff" }} />
            </div>
            <h2 className="syne" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>Stay in the loop</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 32, lineHeight: 1.7 }}>
              Repair tips, exclusive deals and product launches — straight to your inbox. No spam.
            </p>
            {subscribed ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 16, padding: "16px 24px", color: "#fff", fontWeight: 600, fontSize: 15 }}>
                <CheckCircle2 size={18} /> You're subscribed — thanks!
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto", flexWrap: "wrap" }}>
                <input
                  type="email" required placeholder="your@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, minWidth: 200, background: "#fff", border: "none", borderRadius: 12, padding: "14px 18px", color: "#1A1A2E", fontSize: 14, outline: "none" }}
                />
                <button type="submit" style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.2s", fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#111"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1A1A2E"}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
