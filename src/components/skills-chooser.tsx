import React, { useEffect, useRef, useState } from 'react';

// The Skills demo: the assistant learned to drive Jira, Spotify, and Hacker News with
// no code. Company logos are the chooser; the three short clips are stacked and
// crossfade on switch, looping muted with no controls. Deep-linkable via ?skill=<app>.
// Shared by the main Assistant page and the standalone /hn embed so they stay in sync.

// Videos live in public/videos/skills/ and are routed through VIDEO_BASE so they can be
// swapped for a hosted CDN with a one-line change.
export const VIDEO_BASE = '';

export type SkillVideo = { key: string; label: string; color: string; src: string };
export const SKILL_VIDEOS: SkillVideo[] = [
  { key: 'jira', label: 'Jira', color: '#2684FF', src: '/videos/skills/jira.mp4' },
  { key: 'spotify', label: 'Spotify', color: '#1DB954', src: '/videos/skills/spotify.mp4' },
  { key: 'hackernews', label: 'Hacker News', color: '#FF6600', src: '/videos/skills/hackernews.mp4' },
  { key: 'full-demo', label: 'Full demo', color: '#0155F8', src: '/videos/skills/full-demo.mp4' },
];
export const isSkill = (v: unknown): v is string => typeof v === 'string' && SKILL_VIDEOS.some((s) => s.key === v);

// The chooser sits on light surfaces in both contexts, so these tokens are fixed.
const INK = '#1a233c';
const MUTED = '#6b7180';

// Brand marks. Hacker News uses the Y Combinator "Y" in its orange square; Spotify and
// Jira are single-path glyphs (simple-icons) in brand color.
function SkillLogo({ k }: { k: string }) {
  if (k === 'hackernews') return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden><rect width="24" height="24" rx="4" fill="#FF6600" /><path fill="#fff" d="M6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" /></svg>
  );
  if (k === 'spotify') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#1DB954" aria-hidden><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
  );
  if (k === 'full-demo') return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden><rect width="24" height="24" rx="4" fill="#0155F8" /><path fill="#fff" d="M9 7.5v9l7-4.5-7-4.5z" /></svg>
  );
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#2684FF" aria-hidden><path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" /></svg>
  );
}

// scrollTargetId: when a ?skill= deep link arrives without a #hash, scroll this element
// into view (used on the full page; omitted on the bare /hn embed).
export function SkillsChooser({ defaultSkill = 'jira', scrollTargetId, allowFullscreen = false }: { defaultSkill?: string; scrollTargetId?: string; allowFullscreen?: boolean }) {
  // Start on the default clip so the server and first client render match, then switch
  // to any ?skill= deep link in the mount effect below. Reading the URL after mount
  // (not in the useState initializer) keeps this a normal SSR component that always
  // renders, instead of a client-only one that has to wait for its own chunk to load.
  const [active, setActive] = useState<string>(defaultSkill);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('skill');
    if (isSkill(p)) setActive(p);
  }, []);
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);
  // Full-screen is opt-in: the standalone /hn embed passes allowFullscreen; the main
  // page leaves it off and is unchanged. Track the browser state so the button toggles.
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    if (!allowFullscreen) return;
    const sync = () => setIsFs(Boolean((document as any).fullscreenElement || (document as any).webkitFullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync as any);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync as any);
    };
  }, [allowFullscreen]);
  const toggleFullscreen = () => {
    const el = stageRef.current as any;
    const doc = document as any;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
    else if (el) (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
  };
  // The button overlaps the video, so it only appears while the cursor is moving over
  // the stage and fades back out after a moment of stillness. Resting on the button
  // itself keeps it visible (hiding a control under a cursor about to click it is worse
  // than any overlap). Keyboard focus bypasses all of this via :focus-visible in CSS.
  const [fsBtnOn, setFsBtnOn] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const overFsBtn = useRef(false);
  const cancelHide = () => { if (hideTimer.current !== null) { window.clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const wakeFsBtn = () => {
    setFsBtnOn(true);
    cancelHide();
    hideTimer.current = window.setTimeout(() => { if (!overFsBtn.current) setFsBtnOn(false); }, 2500);
  };
  useEffect(() => cancelHide, []);
  // On a bare ?skill= deep link (no #hash), scroll the target section into view.
  useEffect(() => {
    if (!scrollTargetId || window.location.hash) return;
    const p = new URLSearchParams(window.location.search).get('skill');
    if (isSkill(p)) setTimeout(() => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }, [scrollTargetId]);
  // Play only the active clip, restarting it from the top; pause the rest. The
  // full-demo tab is the exception: it's a real narrated demo with audio, so we
  // leave it paused for the user to hit play, and preserve currentTime across
  // tab switches so switching away and back doesn't lose their place.
  useEffect(() => {
    SKILL_VIDEOS.forEach((s) => {
      const v = refs.current[s.key];
      if (!v) return;
      if (s.key === active) {
        if (s.key !== 'full-demo') {
          try { v.currentTime = 0; } catch { /* not ready yet */ }
          const pr = v.play();
          if (pr && pr.catch) pr.catch(() => {});
        }
      } else {
        v.pause();
      }
    });
  }, [active]);
  const choose = (key: string) => {
    setActive(key);
    // Reflect the choice in the URL (shallow) so the state is shareable.
    try { const url = new URL(window.location.href); url.searchParams.set('skill', key); window.history.replaceState(null, '', url.toString()); } catch { /* noop */ }
  };
  return (
    <>
      {allowFullscreen && (
        <style dangerouslySetInnerHTML={{ __html: `
          .sc-fsbtn{opacity:0;pointer-events:none;transition:background .16s ease,transform .12s ease,opacity .3s ease}
          .sc-fsbtn-on,.sc-fsbtn:focus-visible{opacity:.82;pointer-events:auto;transition:background .16s ease,transform .12s ease,opacity .16s ease}
          .sc-fsbtn-on:hover{background:rgba(13,20,36,.72);opacity:1}
          .sc-fsbtn:active{transform:scale(.94)}
          .sc-stage:fullscreen{width:100vw!important;height:100vh!important;max-width:none!important;border-radius:0!important;background:#000!important}
          .sc-stage:-webkit-full-screen{width:100vw!important;height:100vh!important;max-width:none!important;border-radius:0!important;background:#000!important}
          .sc-stage:fullscreen video{object-fit:contain!important}
          .sc-stage:-webkit-full-screen video{object-fit:contain!important}
        ` }} />
      )}
      <div role="tablist" aria-label="Choose a demo" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
        {SKILL_VIDEOS.map((s) => {
          const on = s.key === active;
          return (
            <button key={s.key} role="tab" aria-selected={on} onClick={() => choose(s.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px 10px', background: 'transparent', border: 0, borderBottom: `2px solid ${on ? INK : 'transparent'}`, color: on ? INK : MUTED, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: on ? 1 : 0.62, transition: 'color .15s ease, border-color .15s ease, opacity .15s ease' }}>
              <SkillLogo k={s.key} />{s.label}
            </button>
          );
        })}
      </div>
      <div
        ref={stageRef}
        className={allowFullscreen ? 'sc-stage' : undefined}
        onMouseMove={allowFullscreen ? wakeFsBtn : undefined}
        onMouseLeave={allowFullscreen ? () => { cancelHide(); overFsBtn.current = false; setFsBtnOn(false); } : undefined}
        style={{ position: 'relative', maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#0d1424', boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)', cursor: isFs && !fsBtnOn ? 'none' : undefined }}
      >
        {SKILL_VIDEOS.map((s) => {
          const isFullDemo = s.key === 'full-demo';
          // Full-demo tab differs from the looping app clips: no autoplay, no
          // mute (audio is the point of this clip), no loop, and browser
          // controls exposed so the user can hit play. pointerEvents is opened
          // on the active full-demo video so its controls receive clicks.
          return (
            <video
              key={s.key}
              ref={(el) => { refs.current[s.key] = el; }}
              src={VIDEO_BASE + s.src}
              poster={VIDEO_BASE + s.src.replace('.mp4', '.jpg')}
              {...(isFullDemo ? { controls: true } : { autoPlay: true, muted: true, loop: true })}
              playsInline
              preload="auto"
              aria-label={`${s.label} demo`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: isFullDemo ? 'contain' : 'cover', opacity: s.key === active ? 1 : 0, transition: 'opacity .3s ease', pointerEvents: isFullDemo && s.key === active ? 'auto' : 'none' }}
            />
          );
        })}
        {allowFullscreen && (
          <button type="button" onClick={toggleFullscreen} aria-label={isFs ? 'Exit full screen' : 'Full screen'} className={fsBtnOn ? 'sc-fsbtn sc-fsbtn-on' : 'sc-fsbtn'} onMouseEnter={() => { overFsBtn.current = true; }} onMouseLeave={() => { overFsBtn.current = false; }} style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 3, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, background: 'rgba(13,20,36,.5)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', cursor: 'pointer', WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}>
            {isFs ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
            )}
          </button>
        )}
      </div>
    </>
  );
}
