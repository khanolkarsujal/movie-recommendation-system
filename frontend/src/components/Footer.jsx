import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

// Social icon SVG wrappers (compatible with all lucide versions)
const GithubIcon    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>;
const TwitterIcon   = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const YoutubeIcon   = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const LINKS = {
  Company: ['About Us', 'Careers', 'Press', 'Blog'],
  Help:    ['FAQ', 'Help Center', 'Contact Us', 'Accessibility'],
  Legal:   ['Privacy Policy', 'Terms of Use', 'Cookie Preferences', 'Corporate Info'],
};

const SOCIALS = [
  { icon: TwitterIcon,   href: '#', label: 'Twitter/X' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: YoutubeIcon,   href: '#', label: 'YouTube' },
  { icon: GithubIcon,    href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--bg-base)] px-6 md:px-[var(--row-padding)] pt-12 pb-8 mt-16">
      {/* Social icons */}
      <div className="flex items-center gap-4 mb-10">
        {SOCIALS.map(({ icon: Icon, href, label }, i) => (
          <a
            key={i}
            href={href}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all hover:-translate-y-0.5"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>

      {/* Links grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-white/30 mb-4">{section}</h3>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-[13px] text-white/50 hover:text-white/80 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="h-px bg-white/5 mb-6" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-white/25">
          © 2026 CineStream. All rights reserved.
        </p>
        <p className="text-[12px] text-white/25 flex items-center gap-1.5">
          Made with <Heart size={11} className="text-red-500/70" fill="currentColor" /> for film lovers
        </p>
      </div>
    </footer>
  );
}
