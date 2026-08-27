'use client';

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';

type FrameGeometry = {
  src: string;
  style: CSSProperties;
};

const FRAME_PARAM = '__landscape_frame';
const DESKTOP_CANVAS_WIDTH = 1180;

export default function MobileRotatedViewport({ children }:{ children:ReactNode }) {
  const [frame, setFrame] = useState<FrameGeometry | null>(null);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (window.self !== window.top || currentUrl.searchParams.has(FRAME_PARAM)) return;

    const touchDevice = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => {
      if (!touchDevice.matches) {
        document.documentElement.classList.remove('mobile-frame-host');
        setFrame(null);
        return;
      }

      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const portrait = viewportHeight >= viewportWidth;
      const availableLongSide = portrait ? viewportHeight : viewportWidth;
      const availableShortSide = portrait ? viewportWidth : viewportHeight;
      const canvasWidth = Math.max(DESKTOP_CANVAS_WIDTH, availableLongSide);
      const scale = availableLongSide / canvasWidth;
      const canvasHeight = availableShortSide / scale;
      const source = new URL(window.location.href);
      source.searchParams.set(FRAME_PARAM, '1');

      document.documentElement.classList.add('mobile-frame-host');
      setFrame({
        src: source.toString(),
        style: portrait ? {
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `translateX(${viewportWidth}px) rotate(90deg) scale(${scale})`,
        } : {
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
        },
      });
    };

    update();
    touchDevice.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      touchDevice.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      document.documentElement.classList.remove('mobile-frame-host');
    };
  }, []);

  return (
    <>
      <div className="mobile-native-root">{children}</div>
      {frame && (
        <iframe
          className="mobile-rotated-frame"
          src={frame.src}
          style={frame.style}
          title="LJH 横向作品集"
        />
      )}
    </>
  );
}
