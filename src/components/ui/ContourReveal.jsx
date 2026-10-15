import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animate, m as motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

const PIXEL_COLUMNS = 20;

function drawPixelPreview(canvas, img) {
  const ratio = 4 / 5;
  const width = PIXEL_COLUMNS;
  const height = Math.round(width / ratio);
  const imageRatio = img.naturalWidth / img.naturalHeight;
  let sourceWidth = img.naturalWidth;
  let sourceHeight = img.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > ratio) {
    sourceWidth = sourceHeight * ratio;
    sourceX = (img.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = sourceWidth / ratio;
    sourceY = (img.naturalHeight - sourceHeight) / 2;
  }

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable for the portrait pixel preview.');
  context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

/* `when` holds the reveal back (e.g. until the page loader has cleared) so it plays in view on every refresh. */
export default function ContourReveal({ imgProps, alt, delay = 0.5, className = '', when = true }) {
  const reduce = useReducedMotion();
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const controls = useRef(null);
  const [pixelReady, setPixelReady] = useState(false);
  const [pixelFailed, setPixelFailed] = useState(false);
  const progress = useMotionValue(reduce ? 100 : 0);
  const clearClip = useTransform(progress, (value) => `inset(${100 - value}% 0 0 0)`);
  const imageScale = useTransform(progress, [0, 100], [1.16, 1]);

  const play = useCallback(
    (wait = 0) => {
      if (reduce) {
        progress.set(100);
        return;
      }
      controls.current?.stop();
      progress.set(0);
      controls.current = animate(progress, 100, {
        duration: 1.7,
        delay: wait,
        ease: [0.22, 1, 0.36, 1],
      });
    },
    [reduce, progress],
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;
    let cancelled = false;

    const preparePreview = () => {
      if (cancelled || !canvasRef.current || !img.naturalWidth) return;
      try {
        drawPixelPreview(canvasRef.current, img);
        setPixelReady(true);
      } catch (error) {
        console.error('Could not create the portrait pixel preview.', error);
        setPixelFailed(true);
      }
    };

    const failPreview = () => setPixelFailed(true);
    if (img.complete) {
      if (img.naturalWidth) preparePreview();
      else failPreview();
    } else {
      img.addEventListener('load', preparePreview, { once: true });
      img.addEventListener('error', failPreview, { once: true });
    }
    return () => {
      cancelled = true;
      img.removeEventListener('load', preparePreview);
      img.removeEventListener('error', failPreview);
    };
  }, []);

  useEffect(() => {
    if (!pixelReady || pixelFailed || !when) return undefined;
    play(delay);
    return () => controls.current?.stop();
  }, [pixelReady, pixelFailed, when, delay, play]);

  return (
    <div role="img" aria-label={alt} className={`relative aspect-[4/5] select-none overflow-hidden bg-hoarding ${className}`}>
      <img ref={imgRef} {...imgProps} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 h-full w-full object-cover object-center" />
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        {!pixelFailed && (
          <>
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full ${pixelReady ? 'opacity-100' : 'opacity-0'}`}
              style={{ imageRendering: 'pixelated' }}
            />
            <motion.img
              src={imgProps.src}
              srcSet={imgProps.srcSet}
              sizes={imgProps.sizes}
              alt=""
              aria-hidden="true"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={{ clipPath: clearClip }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
