'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTheme } from 'next-themes';

const frameworks = [
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'windows',
    label: 'Windows',
  },
  {
    value: 'spotify',
    label: 'Spotify',
  },
  {
    value: 'vaporwave',
    label: 'Vaporwave',
  },
  {
    value: 'linear',
    label: 'Linear',
  },
];

export function ThemeDropdown() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(theme ?? 'light');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTheme(value);
  }, [setTheme, value]);

  if (!mounted) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[160px] justify-between fr-button-secondary"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Select theme...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="fr-dropdown">
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((themes) => (
                <CommandItem
                  key={themes.value}
                  value={themes.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === themes.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {themes.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
