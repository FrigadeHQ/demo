import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ExperienceType = 'assistant' | 'engage';

interface ExperienceContextType {
  experience: ExperienceType;
  setExperience: (experience: ExperienceType) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(
  undefined,
);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experience, setExperience] = useState<ExperienceType>('assistant');

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
