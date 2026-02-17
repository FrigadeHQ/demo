import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

export type ExperienceType = 'assistant' | 'engage';

interface ExperienceContextType {
  experience: ExperienceType;
  setExperience: (experience: ExperienceType) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(
  undefined,
);

const ENGAGE_ROUTES = ['/forms', '/tours', '/hints', '/checklists', '/modals', '/cards'];

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const initialExperience: ExperienceType = ENGAGE_ROUTES.some(
    (route) => router.pathname.startsWith(route),
  )
    ? 'engage'
    : 'assistant';

  const [experience, setExperience] = useState<ExperienceType>(initialExperience);

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
