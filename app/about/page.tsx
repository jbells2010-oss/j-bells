import type { Metadata } from 'next';
import { LineIcon, type IconName } from '../../components/LineIcon';
import { PageShell } from '../../components/SiteChrome';
import { isoCertification, locations } from '../../lib/business';

export const metadata: Metadata = { title: 'About J Bells | Smart Phone Service Center', description: 'About J Bells Smart Phone Service Center in Trivandrum — a walk-in smartphone repair shop serving customers since 2010.', alternates: { canonical: '/about' } };
const reasons: [string, string, string, IconName][] = [['01', 'DIAGNOSIS FIRST', 'We open the phone and explain the fault before any work begins.', 'wrench'], ['02', 'CLEAR ESTIMATES', 'We tell you what the job involves and what it will cost before we start.', 'shield'], ['03', 'REPAIR AT THE BENCH', 'The work is carried out at our Trivandrum counter, not sent away.', 'check'], ['04', 'STRAIGHT ANSWERS', 'If a repair is not worth it, we will tell you.', 'badge'], ['05', 'LOCAL TO TRIVANDRUM', 'A walk-in counter in Thiruvananthapuram — drop off, collect, follow up.', 'calendar']];

export default function AboutPage() { return <PageShell active="about">
  <section className="page-hero"><p className="eyebrow">ABOUT J BELLS</p><h1>A smartphone repair<br /><span>bench in</span><br />Trivandrum.</h1><p className="lede">J Bells has been repairing smartphones at the same Trivandrum counter since 2010. We handle the common faults, and we tell you what is wrong before we touch the phone.</p></section>
  <section className="inner-section about-story"><div><p className="eyebrow">OUR STORY</p><h2>Started in 2010,<br /><span>still at the bench.</span></h2></div><div className="story-copy"><p className="body-copy">J Bells started as a small smartphone service counter in Thiruvananthapuram. The work has not changed much — diagnose the phone, agree on the repair, do the job, and stand behind it.</p><div className="since-card"><span className="since-number">2010</span><span className="since-label">SERVING CUSTOMERS<br />SINCE 2010</span></div></div></section>
  <section className="about-values inner-section"><p className="eyebrow">WHY CHOOSE J BELLS</p><h2>What we do<br /><span>when you walk in.</span></h2><div className="feature-grid">{reasons.map(([n, title, text, icon]) => <article className="feature-item" key={n}><b>{n}</b><LineIcon name={icon} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="iso-section inner-section" aria-labelledby="iso-heading">
    <div className="iso-mark" aria-hidden="true"><LineIcon name="shield" /></div>
    <div className="iso-content">
      <p className="eyebrow">A TRUST SIGNAL</p>
      <h2 id="iso-heading">ISO 9001:2015<br /><span>Quality Management System</span></h2>
      <p className="body-copy">
        J Bells is certified to ISO 9001:2015 for its Quality Management System,
        with the scope: &ldquo;Provision of Smart Phone Service Center.&rdquo;
      </p>
      <dl className="iso-details">
        <div><dt>Standard</dt><dd>ISO 9001:2015</dd></div>
        <div><dt>Certifying Body</dt><dd>QRO (Quality Research Organization)</dd></div>
        <div><dt>Certificate Number</dt><dd>{isoCertification.certificateNumber}</dd></div>
        <div><dt>Certified On</dt><dd>{isoCertification.certifiedOn}</dd></div>
        <div><dt>1st Surveillance Audit Due</dt><dd>{isoCertification.firstSurveillanceDue}</dd></div>
        <div><dt>2nd Surveillance Audit Due</dt><dd>{isoCertification.secondSurveillanceDue}</dd></div>
        <div><dt>Valid Until</dt><dd>{isoCertification.validUntil}</dd></div>
        <div><dt>Location</dt><dd>{isoCertification.location}</dd></div>
      </dl>
    </div>
  </section>
  <section className="inner-section locations-section"><p className="eyebrow">FIND J.BELLS</p><h2>Two places to<br /><span>find us.</span></h2><div className="location-mini-grid">{locations.map((location) => <a key={location.name} className="location-card" href={location.mapUrl} target="_blank" rel="noreferrer"><LineIcon name="search" /><div><h3>{location.name}</h3><p>{location.latitude}, {location.longitude}</p><span>Open in Google Maps <LineIcon name="arrowUpRight" /></span></div></a>)}</div></section>
 </PageShell> }
