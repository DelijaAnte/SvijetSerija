/**
 * Komponenta za pretragu serija i glumaca pomoću TVmaze API-ja.
 * Korisnik može otvoriti dijalog, birati između pretrage serija ili glumaca,
 * unositi upit, i klikom na rezultat biti preusmjeren na stranicu serije ili glumca.
 * Pretraga glumaca također dohvaća njihove uloge u serijama.
 */

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
  const [query, setQuery] = useState(""); // Trenutni tekst upita
  const [results, setResults] = useState([]); // Dobiveni rezultati
  const [searchType, setSearchType] = useState("shows"); // Tip pretrage: "shows" ili "people"
  const router = useRouter();

  // Kada se promijeni upit ili tip pretrage, dohvaćaju se novi rezultati
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

        // Filtriraj samo glumce koji imaju barem jednu ulogu u seriji
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

        setResults(filtered.filter(Boolean));
      }
    };

    fetchData();
  }, [query, searchType]);

  // Funkcija za rukovanje klikom na glumca – preusmjerava na njihovu stranicu u kontekstu serije
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
