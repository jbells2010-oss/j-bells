'use client';
import { useState } from 'react';
import Image from 'next/image';
import { LineIcon } from './LineIcon';
import { businessContact } from '../lib/business';

import { trackEvent } from '../lib/analytics';

export function BrandLogo() {
  return <Image className="brand-logo" src="/android-chrome-192x192.png" alt="J Bells Service Center" width={192} height={192} priority />;
}

export function SiteNav({ active }: { active?: 'home' | 'services' | 'about' | 'blog' | 'contact' }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <a className="brand" href="/" aria-label="J Bells Service Center home">
        <BrandLogo />
        <span className="brand-name">J BELLS</span>
      </a>
      <div className={`nav-links ${open ? 'mobile-open' : ''}`} onClick={() => setOpen(false)}>
        <a className={active === 'home' || active === undefined ? 'active' : ''} href="/">Home</a>
        <a className={active === 'services' ? 'active' : ''} href="/services">Services</a>
        <a className={active === 'about' ? 'active' : ''} href="/about">About Us</a>
        <a className={active === 'blog' ? 'active' : ''} href="/blog">Blog</a>
        <a className={active === 'contact' ? 'active' : ''} href="/contact">Contact</a>
        <a
          className="mobile-menu-cta"
          href="/contact"
          onClick={() => {
            trackEvent('mobile_menu_cta_clicked', { button_name: 'Book a Repair' });
            trackEvent('book_repair_clicked', { location: 'mobile_nav' });
          }}
        >
          Book a Repair <LineIcon name="arrowUpRight" />
        </a>
      </div>
      <a
        className="button nav-cta"
        href="/contact"
        onClick={() => {
          trackEvent('hero_cta_clicked', { button_name: 'Book a Repair', location: 'navbar' });
          trackEvent('book_repair_clicked', { location: 'navbar' });
        }}
      >
        Book a Repair <LineIcon name="arrowUpRight" />
      </a>
      <button
        className={`menu ${open ? 'is-active' : ''}`}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="menu-lines" aria-hidden="true" />
        <span className="menu-lines" aria-hidden="true" />
        <span className="menu-lines" aria-hidden="true" />
      </button>
    </nav>
  );
}

export function SiteFooter() {
  return <footer className="footer site-footer">
    <div className="footer-brand"><a className="brand" href="/"><BrandLogo /></a><p>{businessContact.businessName}</p></div>
    <div><small className="footer-heading">EXPLORE</small><div className="footer-links"><a href="/">Home</a><a href="/services">Services</a><a href="/about">About Us</a><a href="/blog">Blog</a><a href="/contact">Contact</a></div></div>
    <div><small className="footer-heading">CALL</small><div className="footer-links">{businessContact.phones.map((p) => <a key={p.tel} href={p.tel}>{p.display}</a>)}</div></div>
    <div><small className="footer-heading">EMAIL</small><div className="footer-links"><a href={businessContact.email.href}>{businessContact.email.address}</a></div></div>
    <div><small className="footer-heading">WHATSAPP</small><div className="footer-links"><a href={businessContact.whatsapp.href} target="_blank" rel="noreferrer">{businessContact.whatsapp.display}</a></div></div>
    <div><small className="footer-heading">INSTAGRAM</small><div className="footer-links"><a href={businessContact.instagram.href} target="_blank" rel="noreferrer">{businessContact.instagram.handle}</a></div></div>
    <div><small className="footer-heading">YOUTUBE</small><div className="footer-links"><a href={businessContact.youtube.href} target="_blank" rel="noreferrer">{businessContact.youtube.handle}</a></div></div>
    <div><small className="footer-heading">LOCATIONS</small><div className="footer-links"><a href="https://maps.app.goo.gl/ezLs9QCEB5pfHchK6" target="_blank" rel="noreferrer">J.BELLS · Location 1</a><a href="https://maps.app.goo.gl/iwPGkCkKoWbjHjP38" target="_blank" rel="noreferrer">J.Bells · Location 2</a></div></div>
    <small className="footer-copy">Copyright 2026 J Bells Service Center. All rights reserved.</small>
  </footer>;
}

export function PageShell({ active, children }: { active: 'home' | 'services' | 'about' | 'blog' | 'contact'; children: React.ReactNode }) {
  return <main><SiteNav active={active} />{children}<SiteFooter /></main>;
}
