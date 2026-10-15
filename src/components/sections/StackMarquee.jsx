import React from 'react';
import Marquee from '@/components/animations/Marquee';
import { methods } from '@/data/siteData';

/** Slow ticker of the methods we build with: ivory band, hairline edges, serif words alternating with outlines. */
export default function StackMarquee() {
  const items = methods.map((word, i) => (
    <span key={word} className={i % 2 ? 'outline-text' : ''}>
      {word}
    </span>
  ));
  return (
    <div className="relative z-20 border-y border-ink/15 bg-slab py-7 text-ink md:py-9">
      <Marquee items={items} speed={2.2} itemClassName="h-display leading-none text-[clamp(1.6rem,3.2vw,2.9rem)]" />
    </div>
  );
}
