import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone, Tablet, Laptop, Gamepad2, Wrench, ShieldCheck, Truck, Clock,
  ArrowRight, Star, ShoppingBag, Battery, ScreenShare, MessageSquareText,
  ChevronLeft, ChevronRight, Zap, Award, HeadphonesIcon, Pause, Play, ArrowDown, BadgeCheck, ScanLine, BadgeDollarSign,
} from "lucide-react";
import * as catalogService from "../services/catalogService.js";
import * as productService from "../services/productService.js";
import ProductCard from "../components/ecommerce/ProductCard.jsx";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import { useTranslation } from "react-i18next";
import "./home-hero.css";
import "./repair-services.css";
import bg_image from "../assets/bg_image.png";
import bg_image1 from "../assets/bg_image1.png";
import heroBackgroundVideo from "../assets/anime_video.mp4";
import catPhoneImg from "../assets/cat_phone.jpg";
import catTabletImg from "../assets/cat_tablet.jpg";
import catComputerImg from "../assets/cat_computer.jpg";
import catLaptopImg from "../assets/cat_laptop.jpg";
import catGamingImg from "../assets/cat_gaming.jpg";

/* ─── constants ─────────────────────────────────────────────── */
const SERVICE_ICONS = [BadgeCheck, Clock, ShieldCheck, Wrench, ScanLine, Truck, Smartphone, BadgeDollarSign];

const CATEGORY_KEYS = {
  Smartphones: "smartphones", Tablets: "tablets", Computers: "computers", Laptops: "laptops", "Gaming Devices": "gaming_devices",
};
const CATEGORY_IMAGES = {
  "Smartphones": catPhoneImg,
  "Tablets": catTabletImg,
  "Computers": catComputerImg,
  "Laptops": catLaptopImg,
  "Laptop": catLaptopImg,
  "laptop": catLaptopImg,
  "Gaming Devices": catGamingImg,
};
const CATEGORY_ICONS = {
  Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, Laptops: Laptop, "Gaming Devices": Gamepad2,
};
const FALLBACK_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Tablets", slug: "tablets" },
  { name: "Computers", slug: "computers" },
  { name: "Gaming Devices", slug: "gaming-devices" },
];
const REPAIR_SERVICES = [
  { key: "screen", icon: ScreenShare, color: "#F97316" },
  { key: "battery", icon: Battery, color: "#F59E0B" },
  { key: "software", icon: MessageSquareText, color: "#EF4444" },
  { key: "general", icon: Wrench, color: "#8B5CF6" },
];
const HOW_IT_WORKS = [
  { key: "choose", icon: Smartphone },
  { key: "pick", icon: ShieldCheck },
  { key: "book", icon: Truck },
  { key: "fix", icon: Award },
];
const REVIEWS = [
  { key: "aisha", rating: 5 },
  { key: "marco", rating: 5 },
  { key: "lena", rating: 4 },
  { key: "james", rating: 5 },
  { key: "priya", rating: 5 },
];
const STATS = [
  { key: "devicesRepaired" },
  { key: "avgRating" },
  { key: "avgTurnaround" },
  { key: "partsGuaranteed" },
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

function Reveal({ children, delay = 0, className = "", style = {}, direction = "up", duration = 0.6 }) {
  const [ref, inView] = useInView();
  
  let transformHidden = "translateY(26px)";
  if (direction === "left") transformHidden = "translateX(-60px)";
  
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0, 0)" : transformHidden,
      transition: `opacity ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
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
  const { t } = useTranslation("home");
  const marqueeItems = t("marquee.items", { returnObjects: true });
  const catName = (name) => t(`categoryNames.${CATEGORY_KEYS[name] || name.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: name });
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  const heroVideoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const video = heroVideoRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (preference.matches) video.pause();
      else video.play().catch(() => {});
    };
    syncPlayback();
    preference.addEventListener("change", syncPlayback);
    return () => preference.removeEventListener("change", syncPlayback);
  }, []);

  const toggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

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
        .hero-display { font-family: 'Space Grotesk', sans-serif; }

        /* hero layout */
        .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 60px; align-items: center; }
        .hero-section { position: relative; height: calc(100vh - 122px); min-height: 550px; display: flex; align-items: center; overflow: hidden; background: #0B0F19; }
        @media (max-width: 900px) { 
          .hero-grid { grid-template-columns: 1fr; gap: 40px; } 
          .hero-section { height: auto; min-height: calc(100vh - 122px); padding: 40px 0; }
        }

        @media (max-width: 768px) {
          .step-conn-wrapper { display: none !important; }
        }

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
        .cat-card:hover { border-color: #F97316; background: #FFF7ED; box-shadow: 0 10px 25px rgba(249,115,22,0.1); }
        .cat-card:hover img.cat-image { transform: scale(1.05); }
        .cat-image { transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); }

        /* svc card */
        .svc-card { border: 2px solid #F3F4F6; transition: all 0.25s ease; }
        .svc-card:hover { border-color: var(--svc-color); background: var(--svc-bg); }

        /* step connector */
        .step-conn { flex: 1; height: 2px; background: linear-gradient(to right, #F97316, #FED7AA); margin: 0 8px; margin-bottom: 44px; }
        @media (max-width: 767px) { .step-conn { display: none; } .p-carousel { display: grid; grid-template-columns: 1fr; gap: 20px; overflow-x: visible; padding-right: 20px; } .carousel-nav { display: none !important; } }

        /* btn */
        .btn-o { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; justify-content: center; }
        .btn-o.solid { background: linear-gradient(135deg, #F97316, #F59E0B); color: #fff; box-shadow: 0 6px 20px rgba(249,115,22,0.35); }
        .btn-o.solid:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.45); }
        .btn-o.outline { background: transparent; color: #1A1A2E; border: 2px solid #E5E7EB; }
        .btn-o.outline:hover { border-color: #F97316; color: #F97316; background: #FFF7ED; }
        .btn-o-glass { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #fff; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.2s; text-decoration: none; }
        .btn-o-glass:hover { transform: translateY(-2px); background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.45); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }

        /* input focus */
        input:focus { outline: none; border-color: #F97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
        
        .hero-stats { display: flex; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 26px; row-gap: 20px; }
        .hero-stat-item { padding-right: 38px; border-right: 1px solid rgba(255,255,255,0.12); }
        .hero-stat-item:last-child { border-right: none; padding-right: 0; }
        .hero-buttons { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
        
        @media (max-width: 600px) {
          .hero-stat-item { padding-right: 20px; width: 50%; border-right: none; }
          .hero-stat-item:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.12); }
          .hero-buttons { flex-direction: column; width: 100%; }
          .hero-buttons > * { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) { .hero-float, .ring { animation: none; } }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="premium-hero" aria-labelledby="hero-heading">
        <video
          ref={heroVideoRef}
          className="premium-hero__video"
          src={heroBackgroundVideo}
          poster={bg_image}
          loop muted playsInline aria-hidden="true"
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
        />
        <div className="premium-hero__shade" />
        <div className="premium-hero__inner">
          <div className={`premium-hero__content ${heroVisible ? "is-visible" : ""}`}>
            <div className="premium-hero__eyebrow"><span /> JAM SMART TECH <span className="premium-hero__eyebrow-divider">/</span> {t("hero.eyebrow")}</div>
            <h1 id="hero-heading" className="premium-hero__heading">
              {t("hero.titlePart1")}<br />
              <span>{t("hero.titlePart2")}</span>
            </h1>
            <p className="premium-hero__description">{t("hero.subtitle")}</p>
            <div className="premium-hero__actions">
              <Link to="/repair" className="premium-hero__primary">{t("hero.ctaRepair")}<span><ArrowRight size={20} /></span></Link>
              <Link to="/shop" className="premium-hero__secondary"><ShoppingBag size={18} />{t("hero.ctaShop")}</Link>
            </div>
            <div className="premium-hero__promise"><ShieldCheck size={17} /><span>{t("hero.badge")}</span></div>
          </div>
          <div className="premium-hero__footer">
            <div className="premium-hero__stats">
              {STATS.map((stat) => (
                <div className="premium-hero__stat" key={stat.key}>
                  <strong>{t(`stats.${stat.key}.value`)}</strong>
                  <span>{t(`stats.${stat.key}.label`)}</span>
                </div>
              ))}
            </div>
            <div className="premium-hero__tools">
              <a href="#home-devices" className="premium-hero__explore">{t("hero.explore")}<ArrowDown size={16} /></a>
              <button type="button" className="premium-hero__playback" onClick={toggleHeroVideo} aria-label={t(videoPlaying ? "hero.pauseVideo" : "hero.playVideo")} title={t(videoPlaying ? "hero.pauseVideo" : "hero.playVideo")}>
                {videoPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service guarantees */}
      <section className="service-ribbon" aria-label={t("marquee.label")}>
        <div className="service-ribbon__inner">
          <div className="service-ribbon__intro">
            <span className="service-ribbon__kicker">{t("marquee.kicker")}</span>
            <h2>{t("marquee.title")}</h2>
          </div>
          <ul className="service-ribbon__list">
            {marqueeItems.map((item, i) => {
              const Icon = SERVICE_ICONS[i] || ShieldCheck;
              return (
                <li className="service-ribbon__item" key={item}>
                  <span className="service-ribbon__icon"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── DEVICE CATEGORIES ───────────────────────────────────── */}
      <section id="home-devices" style={{ scrollMarginTop: 120, padding: "80px clamp(20px,5vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>{t("categories.kicker")}</p>
              <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>{t("categories.title")}</h2>
            </div>
            <Link to="/repair" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none" }}>
              {t("categories.allServices")} <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
          {displayCats.map((cat, i) => {
            const catImg = CATEGORY_IMAGES[cat.name] || catPhoneImg;
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Reveal key={cat.name} delay={i * 0.08}>
                <Link to={`/repair/${slug}`} style={{ textDecoration: "none" }}>
                  <div className="cat-card lift" style={{ borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", background: "#fff", border: "2px solid #F3F4F6", height: "100%" }}>
                    <div style={{ height: 170, width: "100%", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid #F3F4F6" }}>
                      <img src={catImg} alt={cat.name} className="cat-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8, flexGrow: 1 }}>
                      <div style={{ flexGrow: 1 }}>
                        <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{catName(cat.name)}</div>
                        <div style={{ fontSize: 13, color: "#9CA3AF" }}>{t("categories.subtitle")}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#F97316", marginTop: 4 }}>
                        {t("categories.bookNow")} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR REPAIR SERVICES ──────────────────────────────── */}
      <section className="repair-showcase" aria-labelledby="repair-services-heading">
        <div className="repair-showcase__inner">
          <div className="repair-showcase__header">
            <div>
              <p className="repair-showcase__eyebrow"><span />{t("repairServices.kicker")}</p>
              <h2 id="repair-services-heading">{t("repairServices.title")}</h2>
              <p className="repair-showcase__intro">{t("repairServices.subtitle")}</p>
            </div>
            <Link to="/repair" className="repair-showcase__all">{t("categories.allServices")}<ArrowRight size={17} /></Link>
          </div>
          <div className="repair-showcase__grid">
            {REPAIR_SERVICES.map((service, i) => (
              <article key={service.key} className={`repair-service ${i === 0 ? "repair-service--featured" : ""}`}>
                <div className="repair-service__top">
                  <span className="repair-service__icon"><service.icon size={29} strokeWidth={1.5} aria-hidden="true" /></span>
                  <span className="repair-service__number" aria-hidden="true">0{i + 1}</span>
                </div>
                <h3>{t(`repairServices.${service.key}.name`)}</h3>
                <p className="repair-service__description">{t(`repairServices.${service.key}.description`)}</p>
                <div className="repair-service__details">
                  <span><Clock size={14} aria-hidden="true" />{t(`repairServices.${service.key}.time`)}</span>
                  <span><ShieldCheck size={14} aria-hidden="true" />{t(`repairServices.${service.key}.warranty`)}</span>
                </div>
                <Link to="/repair" className="repair-service__link" aria-label={`${t("repairServices.cta")}: ${t(`repairServices.${service.key}.name`)}`}>
                  {t("repairServices.cta")}<span><ArrowRight size={18} /></span>
                </Link>
              </article>
            ))}
          </div>
          <div className="repair-showcase__help"><MessageSquareText size={18} aria-hidden="true" /><p>{t("repairServices.help")}</p><Link to="/repair">{t("repairServices.helpCta")}<ArrowRight size={14} /></Link></div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section style={{ padding: "80px clamp(20px,5vw,60px)", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>{t("howItWorks.kicker")}</p>
          <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 60 }}>{t("howItWorks.title")}</h2>
        </Reveal>
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
          {HOW_IT_WORKS.map((step, i) => (
            <React.Fragment key={step.key}>
              <Reveal direction="left" duration={1.2} delay={i * 0.35} style={{ flex: "1 1 200px", textAlign: "center", padding: "24px 12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", border: "2px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.icon size={26} style={{ color: "#F97316" }} />
                    </div>
                    <div style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(249,115,22,0.4)" }}>{i + 1}</div>
                  </div>
                  <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{t(`howItWorks.${step.key}.title`)}</div>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, maxWidth: 180 }}>{t(`howItWorks.${step.key}.desc`)}</p>
                </div>
              </Reveal>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="step-conn-wrapper" style={{ flex: 1 }}><Reveal direction="left" duration={1.2} delay={i * 0.35 + 0.17}>
                  <div className="step-conn" style={{ marginTop: 32 }} />
                </Reveal></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)", padding: "80px clamp(20px,5vw,60px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#FB923C", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>{t("whyUs.kicker")}</p>
            <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 60 }}>{t("whyUs.title")}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { key: "certified", icon: ShieldCheck, color: "#F97316" },
              { key: "flexible", icon: Truck, color: "#F59E0B" },
              { key: "fast", icon: Clock, color: "#EF4444" },
              { key: "support", icon: HeadphonesIcon, Pause, Play, ArrowDown, BadgeCheck, ScanLine, BadgeDollarSign, color: "#8B5CF6" },
            ].map((item, i) => (
              <Reveal key={item.key} delay={i * 0.1}>
                <div className="lift" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{t(`whyUs.${item.key}.title`)}</div>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65 }}>{t(`whyUs.${item.key}.desc`)}</p>
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
                <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>{t("featured.kicker")}</p>
                <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>{t("featured.title")}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link to="/shop" style={{ fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none", marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>{t("featured.viewAll")} <ArrowRight size={14} /></Link>
                {[ChevronLeft, ChevronRight].map((Ic, j) => (
                  <button key={j} className="carousel-nav" onClick={() => scroll(featCarouselRef, j === 0 ? -1 : 1)} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #E5E7EB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", transition: "all 0.2s" }}
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
                <p style={{ fontSize: 12, fontWeight: 600, color: "#F59E0B", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>{t("bestSellers.kicker")}</p>
                <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E" }}>{t("bestSellers.title")}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link to="/shop" style={{ fontSize: 14, fontWeight: 600, color: "#F97316", textDecoration: "none", marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>{t("bestSellers.viewAll")} <ArrowRight size={14} /></Link>
                {[ChevronLeft, ChevronRight].map((Ic, j) => (
                  <button key={j} className="carousel-nav" onClick={() => scroll(bestCarouselRef, j === 0 ? -1 : 1)} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #E5E7EB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", transition: "all 0.2s" }}
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
            <p style={{ fontSize: 12, fontWeight: 600, color: "#F97316", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>{t("reviews.kicker")}</p>
            <h2 className="syne" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "#1A1A2E", textAlign: "center", marginBottom: 48 }}>{t("reviews.title")}</h2>
          </Reveal>

          {/* featured large quote */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(24px,4vw,48px)", maxWidth: 680, margin: "0 auto 36px", boxShadow: "0 8px 40px rgba(249,115,22,0.08)", border: "1px solid #FED7AA", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 20, right: 28, fontSize: 80, lineHeight: 1, color: "rgba(249,115,22,0.08)", fontFamily: "serif", fontWeight: 900 }}>"</div>
            <StarRow rating={REVIEWS[reviewIdx].rating} />
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#374151", lineHeight: 1.8, margin: "18px 0 22px", fontStyle: "italic" }}>
              "{t(`reviews.items.${REVIEWS[reviewIdx].key}.text`)}"
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{t(`reviews.items.${REVIEWS[reviewIdx].key}.name`)}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t("reviews.role")} · {t(`reviews.items.${REVIEWS[reviewIdx].key}.device`)}</div>
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
              <Reveal key={r.key} delay={i * 0.08}>
                <div className="lift" onClick={() => setReviewIdx(i)} style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", cursor: "pointer", border: `2px solid ${reviewIdx === i ? "#F97316" : "#F3F4F6"}`, transition: "border-color 0.25s" }}>
                  <StarRow rating={r.rating} />
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "10px 0 12px", lineHeight: 1.65 }}>"{t(`reviews.items.${r.key}.text`).slice(0, 80)}…"</p>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>{t(`reviews.items.${r.key}.name`)}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{t(`reviews.items.${r.key}.device`)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
