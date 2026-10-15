import React from 'react';

/** Wordmark: three-layer mark (the strata) plus the letter-spaced name. */
export default function Brand({ className = '', dataBrand = false, style }) {
  return (
    <span className={`st-mark ${className}`.trim()} style={style} {...(dataBrand ? { 'data-st-brand': '' } : {})} aria-hidden="true">
      <i className="st-mark__layers">
        <i />
        <i />
        <i />
      </i>
      <span>Stratum</span>
    </span>
  );
}
