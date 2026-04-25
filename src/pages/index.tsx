import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useExperience } from '@/components/experience-context';
import Script from 'next/script';

// YouTube IFrame API postMessage helper.
function ytCommand(iframe: HTMLIFrameElement, func: 'playVideo' | 'pauseVideo') {
  if (!iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*'
  );
}

export default function Home() {
  const router = useRouter();
  const { experience } = useExperience();

  // The hero YouTube embed is always-mounted (CSS-hidden when Engage is
  // active), driven via the YouTube IFrame API. This avoids the toggle bug
  // where unmount/remount fired autoplay while the previous player's audio
  // tail was still in flight, producing brief overlap.
  //
  // Subtlety: the responsive layout in `Main` renders this page in TWO
  // sibling containers (mobile + desktop), so there are TWO matching
  // iframes in the DOM at all times. We `playVideo` the one that is
  // currently CSS-visible and `pauseVideo` the rest — otherwise the
  // off-screen sibling autoplays its own audio over the visible player.
  // Listening for the YouTube player's `onReady` event lets us drive the
  // initial pause-the-hidden-one as soon as each player is alive.
  useEffect(() => {
    if (!router.isReady) return;

    function getYtIframes() {
      return Array.from(
        document.querySelectorAll<HTMLIFrameElement>(
          'iframe[src*="youtube.com/embed"]'
        )
      );
    }

    function applyState() {
      for (const iframe of getYtIframes()) {
        const isVisible = iframe.offsetParent !== null;
        ytCommand(
          iframe,
          experience === 'assistant' && isVisible ? 'playVideo' : 'pauseVideo'
        );
      }
    }

    // Subscribe to player events; required before YouTube starts emitting
    // `onReady` (and friends) for cross-origin postMessage consumers.
    for (const iframe of getYtIframes()) {
      if (!iframe.contentWindow) continue;
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
        '*'
      );
    }

    function onMessage(e: MessageEvent) {
      if (typeof e.data !== 'string') return;
      let data: unknown;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      if (
        data &&
        typeof data === 'object' &&
        'event' in data &&
        (data as { event?: string }).event === 'onReady'
      ) {
        applyState();
      }
    }

    window.addEventListener('message', onMessage);
    // Apply once now too — covers subsequent `experience` flips where the
    // players are already ready and `onReady` won't fire again.
    applyState();

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [experience, router.isReady]);

  if (!router.isReady) return null;

  const content =
    experience === 'assistant'
      ? {
          title: 'Frigade',
          subtitle:
            'Meet the Frigade Product Agent: an AI assistant that can answer product questions, guide users through onboarding, and proactively recommend next steps – boosting engagement and customer success.',
          detail: '',
        }
      : {
          title: 'Frigade Engage',
          subtitle:
            'A developer platform for onboarding with pre-built UI components and a powerful backend system for targeting, customization, and state management.',
          detail: '',
        };

  return (
    <div className="flex flex-col justify-center text-center gap-2 items-center w-full">
      <h2 className="font-medium">Welcome to the {content.title} demo</h2>
      <p className="text-sm text-muted-foreground max-w-[400px]">
        {content.subtitle}
      </p>
      <p className="text-xs text-muted-foreground max-w-[520px]">
        {content.detail}
      </p>

      <div className="flex flex-row gap-4 justify-center mt-6">
        {experience === 'assistant' ? (
          <>
            <Button asChild className="fr-button-primary">
              <Link href="https://app.frigade.ai/sign-up" target="_blank">
                Get started now
              </Link>
            </Button>
            <Button variant="outline" asChild className="fr-button-secondary">
              <Link
                href="https://cal.com/forms/ed0e923f-6f00-4191-a08f-7bebba6636b6"
                target="_blank"
              >
                Book a demo
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild className="fr-button-primary">
              <Link href="/forms">Begin</Link>
            </Button>
            <Button variant="outline" asChild className="fr-button-secondary">
              <Link
                href="https://cal.com/team/frigade/frigade-demo"
                target="_blank"
              >
                Book a call
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* Always mount the iframe so toggling the chooser doesn't remount
          the YouTube player. Hide via CSS when Engage is active, then drive
          play/pause through the YouTube IFrame API (`enablejsapi=1`) in the
          effect above. `autoplay=1` is kept so the visible iframe begins
          playing without requiring the user to click — the effect's
          `onReady` handler immediately pauses the off-screen sibling that
          the responsive layout in `Main` also renders. */}
      <div
        className={`w-full max-w-[800px] mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-100 ${
          experience === 'assistant' ? 'block' : 'hidden'
        }`}
      >
        <iframe
          src="https://www.youtube.com/embed/FhHSj8YpR2U?autoplay=1&controls=1&loop=1&playlist=FhHSj8YpR2U&enablejsapi=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '16/9',
          }}
          title="Frigade AI - The easiest way to guide and onboard your users"
        />
      </div>
    </div>
  );
}
