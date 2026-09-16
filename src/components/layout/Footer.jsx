import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, ShieldCheck, Truck, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo.png";

const Footer = () => {
  const { t } = useTranslation("nav");
  const f = (key) => t(`footer.${key}`);

  return (
    <footer className="mt-20 bg-ink-900 text-gray-300">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="mb-4 flex w-fit items-center">
            <img src={logo} alt="JAM Smart Tech" className="h-12 w-auto rounded-xl bg-white p-1.5 object-contain" />
          </Link>
          <p className="mb-5 max-w-sm text-sm text-gray-400">{f("tagline")}</p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-primary-600">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-white">{f("repairTitle")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/repair" className="hover:text-primary-400">{f("bookRepair")}</Link></li>
            <li><Link to="/track-repair" className="hover:text-primary-400">{t("trackRepair")}</Link></li>
            <li><Link to="/repair/smartphones" className="hover:text-primary-400">{f("smartphoneRepair")}</Link></li>
            <li><Link to="/repair/computers" className="hover:text-primary-400">{f("computerRepair")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-white">{f("shopTitle")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-primary-400">{f("allProducts")}</Link></li>
            <li><Link to="/track-order" className="hover:text-primary-400">{t("trackOrder")}</Link></li>
            <li><Link to="/cart" className="hover:text-primary-400">{f("cart")}</Link></li>
            <li><Link to="/profile/orders" className="hover:text-primary-400">{f("myOrders")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-white">{f("companyTitle")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-primary-400">{f("aboutUs")}</Link></li>
            <li><Link to="/contact" className="hover:text-primary-400">{t("contact")}</Link></li>
            <li><Link to="/faq" className="hover:text-primary-400">{f("faq")}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary-400">{f("privacyPolicy")}</Link></li>
            <li><Link to="/terms" className="hover:text-primary-400">{f("terms")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px mx-auto grid max-w-7xl grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm text-gray-400"><ShieldCheck size={20} className="text-primary-500" /> {f("genuineParts")}</div>
          <div className="flex items-center gap-3 text-sm text-gray-400"><Truck size={20} className="text-primary-500" /> {f("pickupDelivery")}</div>
          <div className="flex items-center gap-3 text-sm text-gray-400"><Clock size={20} className="text-primary-500" /> {f("sameDayRepair")}</div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} JAM Smart Tech. {f("rights")}
      </div>
    </footer>
  );
};

export default Footer;
