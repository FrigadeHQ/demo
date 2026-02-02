import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useExperience } from '@/components/experience-context';
import Script from 'next/script';

export default function Home() {
  const { experience } = useExperience();
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

      {experience === 'assistant' && (
        <div className="w-full max-w-[800px] mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <iframe
            src="https://www.youtube.com/embed/FhHSj8YpR2U?autoplay=1&controls=1&loop=1&playlist=FhHSj8YpR2U"
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
      )}
    </div>
  );
}
