"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-top">
          
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo">
              <span>Cart</span>Ship.
            </Link>
            <p className="footer-desc">
              Your premium destination for modern lifestyle essentials, electronics, and smart home gadgets across Pakistan.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/products">Shop All</Link></li>
              <li><Link href="/products?category=electronics">Electronics</Link></li>
              <li><Link href="/products?category=kitchen">Kitchen</Link></li>
              <li><Link href="/track-order">Track Order</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Customer Care</h3>
            <ul className="footer-links">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/returns">Returns & Exchanges</Link></li>
              <li><Link href="/shipping">Shipping Policy</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>123 Commerce Street, Lahore, Pakistan</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+92 300 1234567</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>support@cartship.pk</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} CartShip. All rights reserved.
          </p>
          <div className="payment-methods">
            {/* Payment method icons placeholder */}
            <span className="payment-pill">COD</span>
            <span className="payment-pill">Visa</span>
            <span className="payment-pill">MasterCard</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--navy);
          color: var(--white);
          padding: 80px 0 0 0;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-logo {
          font-family: var(--font-outfit), sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--white);
          text-decoration: none;
          letter-spacing: -0.05em;
          display: inline-block;
          margin-bottom: 20px;
        }

        .footer-logo span {
          color: var(--orange);
        }

        .footer-desc {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 0 0 24px;
          max-width: 320px;
        }

        .footer-socials {
          display: flex;
          gap: 16px;
        }

        .footer-socials a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: var(--white);
          transition: all 0.3s ease;
        }

        .footer-socials a:hover {
          background: var(--orange);
          color: var(--white);
          transform: translateY(-2px);
        }

        .footer-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--white);
          margin: 0 0 24px;
          letter-spacing: 0.02em;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--orange);
        }

        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .contact-icon {
          color: var(--orange);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copyright {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .payment-methods {
          display: flex;
          gap: 8px;
        }

        .payment-pill {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
