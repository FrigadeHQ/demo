import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const lowerCaseName: string = uniqueNamesGenerator({
  dictionaries: [colors, adjectives, animals],
  style: 'lowerCase',
  separator: '-',
});

const localStorageFieldUserId = 'frigadeUserId';
const localStorageFieldOrgId = 'frigadeOrgId';

export function getUserId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'unknown';
  }

  if (!localStorage.getItem(localStorageFieldUserId)) {
    generateNewUserId();
  }
  return localStorage.getItem(localStorageFieldUserId) ?? 'unknown';
}

export function resetAllIds() {
  localStorage.clear();
  // Refresh the page
  window.location.href = '/';
}

export function generateNewUserId() {
  localStorage.setItem(localStorageFieldUserId, getRandomString());
}

export function getRandomString() {
  return lowerCaseName;
}
