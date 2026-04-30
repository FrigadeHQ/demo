import React, { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { CtaButton } from '@/components/ui/cta-button';
import { useExperience } from '@/components/experience-context';

export default function Home() {
  const { experience } = useExperience();

  // Initialize both Cal.com popup namespaces once. Each CTA below targets
  // its corresponding namespace via data-cal-namespace.
  useEffect(() => {
    (async () => {
      const calAssistant = await getCalApi({ namespace: 'frigade-demo-call' });
      calAssistant('ui', { hideEventTypeDetails: false, layout: 'month_view' });
      const calEngage = await getCalApi({ namespace: 'frigade-engage-demo' });
      calEngage('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  // The hero video is always-mounted (CSS-hidden when Engage is active) so
  // toggling the experience chooser doesn't remount the player. The
  // responsive layout in `Main` renders this page in TWO sibling containers
  // (mobile + desktop), so there are TWO matching <video> elements in the
  // DOM at all times. We `play()` the one that is currently CSS-visible
  // and `pause()` the rest — otherwise the off-screen sibling autoplays
  // its own audio over the visible player. We also re-apply on tab focus
  // because some browsers pause background <video> elements to save
  // resources and don't auto-resume on focus return.
  useEffect(() => {
    function getVideos() {
      return Array.from(
        document.querySelectorAll<HTMLVideoElement>('video[data-hero-video]')
      );
    }

    function applyState() {
      for (const video of getVideos()) {
        // offsetParent is null iff display: none. Wrapper uses Tailwind `hidden`
        // for the off-experience case — don't switch to visibility/opacity hiding
        // without updating this check.
        const isVisible = video.offsetParent !== null;
        if (experience === 'assistant' && isVisible) {
          // play() returns a promise; muted+playsInline should let autoplay
          // succeed in every modern browser. Swallow rejection so a failed
          // autoplay doesn't surface as an unhandled rejection.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }

    function onLoadedData() {
      applyState();
    }

    const videos = getVideos();
    for (const video of videos) {
      video.addEventListener('loadeddata', onLoadedData);
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        applyState();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    applyState();

    return () => {
      for (const video of videos) {
        video.removeEventListener('loadeddata', onLoadedData);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [experience]);

  const content =
    experience === 'assistant'
      ? {
          title: 'Frigade Assistant',
          subtitle:
            'AI that learns your product and guides users in real time.',
        }
      : {
          title: 'Frigade Engage',
          subtitle:
            'Drop-in React components for onboarding and product tours.',
        };

  return (
    <div className="flex flex-col justify-center text-center gap-2 items-center w-full">
      <h2 className="font-medium">Welcome to the {content.title} demo</h2>
      <p className="text-sm text-muted-foreground max-w-[400px]">
        {content.subtitle}
      </p>

      <div className="flex flex-row gap-4 justify-center mt-6">
        {experience === 'assistant' ? (
          <>
            <CtaButton
              href="https://app.frigade.ai/sign-up?ref=demo"
              variant="primary"
            >
              Get started
            </CtaButton>
            <CtaButton
              calLink="team/frigade/frigade-demo-call"
              calNamespace="frigade-demo-call"
              calConfig='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              variant="secondary"
            >
              Book a demo
            </CtaButton>
          </>
        ) : (
          <>
            <CtaButton href="/forms" variant="engage">
              Begin
            </CtaButton>
            <CtaButton
              calLink="team/frigade/frigade-engage-demo"
              calNamespace="frigade-engage-demo"
              calConfig='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              variant="secondary"
            >
              Book a call
            </CtaButton>
          </>
        )}
      </div>

      {/* Always mount the video so toggling the chooser doesn't remount
          the player. Hide via CSS when Engage is active, then drive
          play/pause via the effect above. autoPlay+muted+playsInline lets
          the visible video begin playing without requiring the user to
          click — the effect's loadeddata handler immediately pauses the
          off-screen sibling that the responsive layout in Main also
          renders. */}
      <div
        className={`w-full max-w-[800px] mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-100 ${
          experience === 'assistant' ? 'block' : 'hidden'
        }`}
      >
        <video
          data-hero-video=""
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="auto"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '1566 / 1080',
          }}
        />
      </div>
    </div>
  );
}
