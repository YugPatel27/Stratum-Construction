import React from 'react';

/* One shared pill for desktop + mobile: label rolls Menu → Close, the + spins a half turn and becomes an ×. */
export default function MenuToggle({ open, onClick, isScrolled, className = '' }) {
  const tone = 'border-white/15 bg-white/[0.06]';
  const size = isScrolled ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2.5 text-[14px]';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
      aria-controls="site-menu"
      className={`menu-toggle border font-medium ${tone} ${size} ${className}`}
    >
      <span className="menu-toggle__label" aria-hidden="true">
        <span>Menu</span>
        <span>Close</span>
      </span>
      <span className="menu-toggle__icon" aria-hidden="true">
        <i />
        <i />
      </span>
    </button>
  );
}
