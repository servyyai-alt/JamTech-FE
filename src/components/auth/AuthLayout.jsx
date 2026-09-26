import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import phoneImg from "../../assets/device_phone.jpg";
import laptopImg from "../../assets/device_laptop.jpg";
import tabletImg from "../../assets/device_tablet.jpg";
import "./auth-page.css";

// Fixed coordinates: rendering must stay pure, so these cannot be generated
// during render (Math.random() there reshuffled every re-render).
const PARTICLES = [
  { left: 8, top: 72, duration: 11, delay: 0 },
  { left: 17, top: 34, duration: 14, delay: 1.4 },
  { left: 26, top: 88, duration: 12, delay: 3.1 },
  { left: 34, top: 18, duration: 15, delay: 0.6 },
  { left: 43, top: 62, duration: 13, delay: 2.2 },
  { left: 52, top: 28, duration: 16, delay: 4.4 },
  { left: 61, top: 80, duration: 11.5, delay: 1.1 },
  { left: 69, top: 46, duration: 14.5, delay: 3.7 },
  { left: 77, top: 90, duration: 12.5, delay: 0.3 },
  { left: 84, top: 24, duration: 15.5, delay: 2.8 },
  { left: 91, top: 58, duration: 13.5, delay: 5.1 },
  { left: 96, top: 12, duration: 12, delay: 1.9 },
  { left: 13, top: 50, duration: 16.5, delay: 4.9 },
  { left: 71, top: 6, duration: 14.2, delay: 2.4 },
];

const DEVICES = [
  { id: "phone", icon: Smartphone, img: phoneImg, alt: "phone" },
  { id: "laptop", icon: Laptop, img: laptopImg, alt: "laptop" },
  { id: "tablet", icon: Tablet, img: tabletImg, alt: "tablet" },
];

const ROTATE_MS = 4500;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

const AuthShowcase = () => {
  const { t } = useTranslation("auth");
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hidden = useRef(false);

  // Auto-advance only while the tab is visible and motion is welcome.
  useEffect(() => {
    if (reducedMotion || paused) return undefined;

    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % DEVICES.length);
    }, ROTATE_MS);

    const onVisibility = () => {
      hidden.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, paused]);

  const onKeyDown = useCallback((e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => (i + 1) % DEVICES.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => (i - 1 + DEVICES.length) % DEVICES.length);
    }
  }, []);

  return (
    <aside
      className="auth-showcase"
      aria-label={t("showcase.regionLabel")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div className="auth-showcase__glow auth-showcase__glow--a" />
      <div className="auth-showcase__glow auth-showcase__glow--b" />

      <div className="auth-showcase__particles">
        {PARTICLES.map((p) => (
          <span
            key={`${p.left}-${p.top}`}
            className="auth-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative: the headline and the picker below carry the meaning. */}
      <div className="auth-showcase__stage" aria-hidden="true">
        {DEVICES.map((device, idx) => {
          const state =
            idx === active ? "auth-device--active" : idx === (active - 1 + DEVICES.length) % DEVICES.length ? "auth-device--prev" : "auth-device--next";
          return (
            <div key={device.id} className={`auth-device ${state} ${device.id === "laptop" ? "auth-device--laptop" : ""}`}>
              <img src={device.img} alt="" />
            </div>
          );
        })}
      </div>

      <div className="auth-showcase__body">
        <div className="auth-showcase__copy">
          <p className="auth-showcase__title">{t("showcase.title")}</p>
          <p className="auth-showcase__sub">{t("showcase.subtitle")}</p>
        </div>

        <div className="auth-showcase__dots" role="group" aria-label={t("showcase.chooseDevice")}>
          {DEVICES.map((device, idx) => {
            const Icon = device.icon;
            const isActive = idx === active;
            return (
              <button
                key={device.id}
                type="button"
                className="auth-dot"
                aria-pressed={isActive}
                onClick={() => setActive(idx)}
              >
                <span className="auth-dot__icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="auth-dot__label">{t(`showcase.devices.${device.id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

const AuthLayout = ({ children }) => (
  <div className="auth-shell">
    <AuthShowcase />
    <main className="auth-panel">{children}</main>
  </div>
);

export default AuthLayout;
