import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo_new.png";
import leastActionLogo from "../../assets/least-action-logo.png";
import "./footer.css";

const footerGroups = [
  {
    key: "repairTitle",
    links: [
      { to: "/repair", labelKey: "bookRepair" },
      { to: "/track-repair", navKey: "trackRepair" },
      { to: "/repair/smartphones", labelKey: "smartphoneRepair" },
      { to: "/repair/computers", labelKey: "computerRepair" },
    ],
  },
  {
    key: "shopTitle",
    links: [
      { to: "/shop", labelKey: "allProducts" },
      { to: "/track-order", navKey: "trackOrder" },
      { to: "/cart", labelKey: "cart" },
      { to: "/profile/orders", labelKey: "myOrders" },
    ],
  },
  {
    key: "companyTitle",
    links: [
      { to: "/about", labelKey: "aboutUs" },
      { to: "/contact", navKey: "contact" },
      { to: "/faq", labelKey: "faq" },
      { to: "/privacy-policy", labelKey: "privacyPolicy" },
      { to: "/terms", labelKey: "terms" },
    ],
  },
];

const promises = [
  { key: "genuineParts", icon: ShieldCheck },
  { key: "pickupDelivery", icon: Truck },
  { key: "sameDayRepair", icon: Clock },
];

const Footer = () => {
  const { t } = useTranslation("nav");
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const f = (key) => t(`footer.${key}`);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--pointer-x", "72%");
    event.currentTarget.style.setProperty("--pointer-y", "10%");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      ref={footerRef}
      className={`site-footer ${isVisible ? "is-visible" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="site-footer__backdrop" aria-hidden="true">
        <span className="site-footer__orb site-footer__orb--orange" />
        <span className="site-footer__orb site-footer__orb--gold" />
        <span className="site-footer__orb site-footer__orb--blue" />
      </div>

      <div className="site-footer__frame">
        <section className="site-footer__cta site-footer__reveal" style={{ "--reveal-delay": "0ms" }} aria-labelledby="footer-cta-title">
          <div className="site-footer__cta-copy">
            <p className="site-footer__eyebrow"><span />{f("ctaEyebrow")}</p>
            <h2 id="footer-cta-title">{f("ctaTitle")} <em>{f("ctaHighlight")}</em></h2>
            <p className="site-footer__cta-text">{f("ctaText")}</p>
            <div className="site-footer__actions">
              <Link to="/repair" className="site-footer__button site-footer__button--primary">
                <span>{f("bookRepair")}</span><i><ArrowRight size={18} /></i>
              </Link>
              <Link to="/shop" className="site-footer__button site-footer__button--secondary">
                <span>{f("shopCta")}</span><i><Sparkles size={17} /></i>
              </Link>
            </div>
          </div>

          <div className="site-footer__visual" aria-hidden="true">
            <span className="site-footer__visual-label">{f("visualLabel")}</span>
            <span className="site-footer__orbit site-footer__orbit--outer"><i /></span>
            <span className="site-footer__orbit site-footer__orbit--inner"><i /></span>
            <div className="site-footer__core">
              <span className="site-footer__core-glow" />
              <img src={logo} alt="" />
            </div>
            <span className="site-footer__tool site-footer__tool--wrench"><Wrench size={19} /></span>
            <span className="site-footer__tool site-footer__tool--shield"><ShieldCheck size={19} /></span>
            <span className="site-footer__tool site-footer__tool--zap"><Zap size={19} /></span>
            <span className="site-footer__system"><i />{f("systemReady")}</span>
          </div>
        </section>

        <div className="site-footer__marquee" aria-hidden="true">
          <div className="site-footer__marquee-track">
            {[0, 1].map((copy) => (
              <div className="site-footer__marquee-group" key={copy}>
                {promises.map(({ key, icon: Icon }, index) => (
                  <span className="site-footer__marquee-item" key={`${copy}-${key}`}>
                    <Icon size={17} /><b>{f(key)}</b><em>0{index + 1}</em>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer__main">
          <section className="site-footer__brand site-footer__reveal" style={{ "--reveal-delay": "80ms" }}>
            <Link to="/" className="site-footer__brand-link" aria-label="JAM Smart Tech — Home">
              <span className="site-footer__logo"><img src={logo} alt="JAM Smart Tech" /></span>
              <span className="site-footer__brand-name">JAM <b>SMART TECH</b></span>
            </Link>
            <p>{f("tagline")}</p>
            <div className="site-footer__status"><span />{f("serviceStatus")}</div>
          </section>

          <nav className="site-footer__navigation site-footer__reveal" style={{ "--reveal-delay": "160ms" }} aria-label={f("exploreNavigation")}>
            {footerGroups.map((group) => (
              <section className="site-footer__link-group" key={group.key}>
                <h3>{f(group.key)}</h3>
                <ul>
                  {group.links.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to}>
                        <span>{item.navKey ? t(item.navKey) : f(item.labelKey)}</span>
                        <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <aside className="site-footer__contact site-footer__reveal" style={{ "--reveal-delay": "240ms" }} aria-labelledby="footer-contact-title">
            <div className="site-footer__contact-heading">
              <span><Mail size={18} /></span>
              <h3 id="footer-contact-title">{f("contactTitle")}</h3>
            </div>
            <div className="site-footer__contact-list">
              <a href="mailto:support@jamsmarttech.com">
                <span><Mail size={17} /></span>
                <div><small>{f("emailLabel")}</small><strong>{f("email")}</strong></div>
              </a>
              <a href="tel:+31201234567">
                <span><Phone size={17} /></span>
                <div><small>{f("phoneLabel")}</small><strong>{f("phone")}</strong></div>
              </a>
              <div className="site-footer__contact-item">
                <span><MapPin size={17} /></span>
                <div><small>{f("addressLabel")}</small><strong>{f("address")}</strong></div>
              </div>
            </div>
          </aside>
        </div>

        <div className="site-footer__promises">
          {promises.map(({ key, icon: Icon }, index) => (
            <article className="site-footer__promise site-footer__reveal" style={{ "--reveal-delay": `${300 + index * 90}ms` }} key={key}>
              <span className="site-footer__promise-icon"><Icon size={20} /></span>
              <div><small>0{index + 1}</small><p>{f(key)}</p></div>
              <span className="site-footer__promise-arrow"><ArrowRight size={16} /></span>
            </article>
          ))}
        </div>

        <div className="site-footer__bottom site-footer__reveal" style={{ "--reveal-delay": "520ms" }}>
          <p>© {new Date().getFullYear()} JAM Smart Tech. {f("rights")}</p>
          <div className="site-footer__legal">
            <Link to="/privacy-policy">{f("privacyPolicy")}</Link>
            <Link to="/terms">{f("terms")}</Link>
          </div>
          <a className="site-footer__credit" href="https://www.leastactioncompany.com/" target="_blank" rel="noopener noreferrer">
            <span>{f("poweredBy")}</span>
            <span className="site-footer__credit-logo"><img src={leastActionLogo} alt="Least Action Company" /></span>
          </a>
          <button type="button" className="site-footer__top" onClick={scrollToTop} aria-label={f("backToTop")} title={f("backToTop")}>
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

