import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

export type ExperienceType = 'assistant' | 'engage';

interface ExperienceContextType {
  experience: ExperienceType;
  setExperience: (experience: ExperienceType) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

const ENGAGE_ROUTES = ['/forms', '/tours', '/hints', '/checklists', '/modals', '/cards'];

export { ENGAGE_ROUTES };

function isExperience(value: unknown): value is ExperienceType {
  return value === 'assistant' || value === 'engage';
}

function inferFromPath(pathname: string): ExperienceType {
  return ENGAGE_ROUTES.some((route) => pathname.startsWith(route)) ? 'engage' : 'assistant';
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // 1. Query param wins. 2. Path inference falls back.
  const queryProduct = router.query.product;
  const initial: ExperienceType = isExperience(queryProduct)
    ? queryProduct
    : inferFromPath(router.pathname);

  const [experience, setExperienceState] = useState<ExperienceType>(initial);

  // If the URL changes (or the query param appears after first render via
  // hydration), sync state to it.
  useEffect(() => {
    if (isExperience(queryProduct) && queryProduct !== experience) {
      setExperienceState(queryProduct);
    }
  }, [queryProduct, experience]);

  const setExperience = (next: ExperienceType) => {
    setExperienceState(next);
    // Reflect the choice in the URL without navigating.
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
