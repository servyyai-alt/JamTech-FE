import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, ShieldCheck, Truck, Clock, Mail } from "lucide-react";

const Footer = () => (
  <footer className="mt-20 bg-ink-900 text-gray-300">
    <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 font-display text-lg font-extrabold text-white">J</div>
          <span className="font-display text-lg font-extrabold text-white">JAM Smart Tech</span>
        </div>
        <p className="mb-5 max-w-sm text-sm text-gray-400">
          Premium device repair and electronics store for smartphones, tablets, computers and gaming consoles.
          Smart repair, smart solutions — trusted by thousands of customers.
        </p>
        <div className="flex gap-3">
          {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-primary-600">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-display font-semibold text-white">Repair</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/repair" className="hover:text-primary-400">Book a Repair</Link></li>
          <li><Link to="/track-repair" className="hover:text-primary-400">Track Repair</Link></li>
          <li><Link to="/repair/smartphones" className="hover:text-primary-400">Smartphone Repair</Link></li>
          <li><Link to="/repair/computers" className="hover:text-primary-400">Computer Repair</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-display font-semibold text-white">Shop</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/shop" className="hover:text-primary-400">All Products</Link></li>
          <li><Link to="/track-order" className="hover:text-primary-400">Track Order</Link></li>
          <li><Link to="/cart" className="hover:text-primary-400">Cart</Link></li>
          <li><Link to="/profile/orders" className="hover:text-primary-400">My Orders</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-display font-semibold text-white">Company</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/about" className="hover:text-primary-400">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-primary-400">Contact</Link></li>
          <li><Link to="/faq" className="hover:text-primary-400">FAQ</Link></li>
          <li><Link to="/privacy-policy" className="hover:text-primary-400">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-primary-400">Terms & Conditions</Link></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-px mx-auto grid max-w-7xl grid-cols-1 gap-6 py-8 sm:grid-cols-3">
        <div className="flex items-center gap-3 text-sm text-gray-400"><ShieldCheck size={20} className="text-primary-500" /> Genuine parts & warranty</div>
        <div className="flex items-center gap-3 text-sm text-gray-400"><Truck size={20} className="text-primary-500" /> Pickup & delivery available</div>
        <div className="flex items-center gap-3 text-sm text-gray-400"><Clock size={20} className="text-primary-500" /> Same-day repair options</div>
      </div>
    </div>

    <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} JAM Smart Tech. All rights reserved.
    </div>
  </footer>
);

export default Footer;
