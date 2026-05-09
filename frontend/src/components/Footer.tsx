/**
 * Footer Component
 * Standard streaming service footer with essential links
 */

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: 'Help & Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Account', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Use', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Cookie Preferences', href: '#' },
        { label: 'Corporate Information', href: '#' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Investor Relations', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="relative bg-[var(--bg-card)] border-t border-[var(--border-default)] mt-20">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-12">
        {/* Social Links */}
        <div className="flex items-center gap-4 mb-8">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                       flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white/90 text-[14px] font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white/70 text-[13px] transition-colors inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Service Code Button */}
        <button
          className="mb-6 px-4 py-2 text-[13px] text-white/50 hover:text-white/70 border border-white/20 hover:border-white/30
                   rounded-[3px] transition-all"
        >
          Service Code
        </button>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-white/40 text-[12px]">
            © {new Date().getFullYear()} StreamPlatform, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
