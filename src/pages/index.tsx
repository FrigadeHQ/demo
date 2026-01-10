import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useExperience } from '@/components/experience-context';
import Script from 'next/script';

export default function Home() {
  const { experience, setExperience } = useExperience();

  return (
    <div className="flex flex-col justify-center text-center gap-2 items-center w-full">
      <h2 className="font-medium">
        Welcome to the Frigade{' '}
        {experience === 'assistant' ? 'AI Assistant' : 'Engage'} demo
      </h2>
      <p className="text-sm text-muted-foreground max-w-[400px]">
        {experience === 'assistant'
          ? 'Effortlessly guide and onboard users through your product with AI-powered assistance – increasing retention and customer success.'
          : 'This demo contains a collection of Frigade Engage and the pre-built UI components and common onboarding patterns in action.'}
      </p>

      {experience === 'assistant' && (
        <div className="w-full max-w-[600px] mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <iframe
            src="https://player.vimeo.com/video/1069009672?autoplay=1&autopause=0&controls=0&loop=1&muted=1&app_id=122963"
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
          <Script src="https://player.vimeo.com/api/player.js" />
        </div>
      )}

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
    </div>
  );
}
