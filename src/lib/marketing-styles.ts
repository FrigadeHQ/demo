import type { CSSProperties } from 'react';

// One borderless frame for every marketing video. A translucent border over a
// dark player background reads as a black stroke, even at very low opacity.
export const MARKETING_VIDEO_FRAME: CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  borderRadius: 0,
  overflow: 'hidden',
  background: '#fff',
  border: 0,
  boxShadow: '0 8px 24px rgba(18,24,40,.04)',
};
