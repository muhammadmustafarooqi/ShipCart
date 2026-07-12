"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/useSettings";

const DEFAULT_SOCIALS = [
  { platform: "facebook", url: "https://facebook.com" },
  { platform: "instagram", url: "https://instagram.com" },
  { platform: "whatsapp", url: "https://whatsapp.com" },
];

export default function SocialSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const socialLinks = settings?.footer?.socialLinks || DEFAULT_SOCIALS;

  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="social-sidebar">
      {socialLinks.map((social: any) => {
        let icon = null;
        switch (social.platform.toLowerCase()) {
          case "facebook":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            );
            break;
          case "twitter":
          case "x":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            );
            break;
          case "instagram":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            );
            break;
          case "youtube":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            );
            break;
          case "whatsapp":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            );
            break;
          case "linkedin":
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            );
            break;
          default:
            icon = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            );
        }

        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="social-sidebar-link"
          >
            {icon}
          </a>
        );
      })}

      <style jsx>{`
        .social-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: linear-gradient(135deg, var(--orange), var(--orange-deep, #e65c00));
          padding: 16px 12px;
          border-radius: 40px;
          box-shadow: 0 10px 25px rgba(255, 107, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .social-sidebar-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: var(--white);
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(4px);
        }

        .social-sidebar-link:hover {
          color: var(--orange);
          background: var(--white);
          transform: scale(1.1) translateX(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .social-sidebar {
            top: auto;
            bottom: 24px;
            right: auto;
            left: 24px;
            transform: none;
            flex-direction: row;
            padding: 10px 14px;
            gap: 12px;
            z-index: 998;
          }
          .social-sidebar-link {
            width: 36px;
            height: 36px;
          }
          .social-sidebar-link:hover {
            transform: scale(1.1) translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
