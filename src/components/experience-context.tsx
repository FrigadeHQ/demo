import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

// The demo ships two Frigade products on one page: Engage (the interactive
// walkthrough) and Assistant (a product video). The header toggle flips between
// them, and the choice is mirrored to the ?product= query param so a link can
// deep-link straight to either one. Assistant is the default landing view.
export type ExperienceType = 'assistant' | 'engage';

interface ExperienceContextType {
  experience: ExperienceType;
  setExperience: (experience: ExperienceType) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

const DEFAULT_EXPERIENCE: ExperienceType = 'assistant';

function isExperience(value: unknown): value is ExperienceType {
  return value === 'assistant' || value === 'engage';
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // A valid ?product= wins; otherwise we land on the Assistant view.
  const queryProduct = router.query.product;
  const initial: ExperienceType = isExperience(queryProduct) ? queryProduct : DEFAULT_EXPERIENCE;

  const [experience, setExperienceState] = useState<ExperienceType>(initial);

  // The query param is empty during static render and populated after
  // hydration, so re-sync state once it (or a later navigation) appears.
  useEffect(() => {
    if (isExperience(queryProduct) && queryProduct !== experience) {
      setExperienceState(queryProduct);
    }
  }, [queryProduct, experience]);

  const setExperience = (next: ExperienceType) => {
    setExperienceState(next);
    // Reflect the choice in the URL without navigating away from the page.
    router.replace(
      { pathname: router.pathname, query: { ...router.query, product: next } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
