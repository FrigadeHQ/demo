'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormFieldProps } from '@frigade/react';

interface Movie {
  id: number;
  title: string;
}

export function MovieTypeaheadField({ field }: FormFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchMovies = async () => {
      if (field.value && field.value.length > 3) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=29ba16d0873c81ba95c281dded7c6b14&query=${field.value}`,
          );
          const data = await response.json();
          setMovies(
            data.results
              // filter dupes
              .filter(
                (movie: Movie, index: number, self: Movie[]) =>
                  index ===
                  self.findIndex(
                    (m) =>
                      m.title?.toLowerCase() === movie.title?.toLowerCase(),
                  ),
              ),
          );
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setMovies([]);
      }
    };

    fetchMovies();
  }, [field.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between fr-field-select"
        >
          {movies.find((movie) => movie.title === field.value)?.title ??
            'Search for your favorite movie...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="fr-card">
          <CommandInput
            placeholder="Search for a movie..."
            value={field.value || ''}
            onValueChange={(value) => {
              field.onChange(value);
              setOpen(true);
            }}
            className="w-[410px] fr-field-text"
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                {movies.length === 0 ? (
                  <CommandEmpty>No movies found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {movies.map((movie) => (
                      <CommandItem
                        key={movie.id}
                        value={movie.title}
                        onSelect={(currentValue) => {
                          field.onChange(
                            currentValue === field.value ? '' : currentValue,
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value === movie.title
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {movie.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
