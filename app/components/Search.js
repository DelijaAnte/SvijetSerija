"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState("shows");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      if (searchType === "shows") {
        const res = await fetch(
          `https://api.tvmaze.com/search/shows?q=${query}`
        );
        const data = await res.json();
        setResults(data);
      } else {
        const res = await fetch(
          `https://api.tvmaze.com/search/people?q=${query}`
        );
        const data = await res.json();

        const filtered = await Promise.all(
          data.map(async ({ person }) => {
            const creditsRes = await fetch(
              `https://api.tvmaze.com/people/${person.id}/castcredits?embed=show`
            );
            const credits = await creditsRes.json();
            if (credits.length > 0) {
              return { person };
            }
            return null;
          })
        );

        setResults(filtered.filter(Boolean)); // ukloni null vrijednosti
      }
    };

    fetchData();
  }, [query, searchType]);

  const handlePersonSelect = async (personId) => {
    try {
      const res = await fetch(
        `https://api.tvmaze.com/people/${personId}/castcredits?embed=show`
      );
      const data = await res.json();

      if (data.length > 0 && data[0]._embedded?.show?.id) {
        const showId = data[0]._embedded.show.id;
        router.push(`/serije/${showId}/glumci/${personId}`);
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju serije za glumca:", err);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="hover:underline">
        Traži
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Pretraži serije ili glumce..."
          value={query}
          onValueChange={setQuery}
        />
        <div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="mb-4 p-2"
          >
            <option value="shows">Serije</option>
            <option value="people">Glumci</option>
          </select>
        </div>
        <CommandList>
          <CommandEmpty>Nema rezultata.</CommandEmpty>
          <CommandGroup heading="Rezultati">
            {results.map(({ show, person }) => (
              <CommandItem
                key={show ? show.id : person.id}
                onSelect={() => {
                  if (show) {
                    router.push(`/serije/${show.id}`);
                  } else if (person) {
                    handlePersonSelect(person.id);
                  }
                  setOpen(false);
                }}
              >
                {show ? show.name : person.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
