/**
 * Komponenta koja prikazuje serije s mogućnošću filtriranja po žanrovima.
 * Pomoću checkboxa korisnik može odabrati jedan ili više žanrova,
 * a kod provjerava da li serije sadrže sve odabrane žanrove.
 * Komponenta također podržava paginaciju, prikazujući 4 serije po stranici.
 */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function GenreFilteredShows() {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("https://api.tvmaze.com/shows");
        const sorted = data
          .filter((s) => s.rating && s.rating.average !== null)
          .sort((a, b) => b.rating.average - a.rating.average);
        setShows(sorted);
        setFilteredShows(sorted);
      } catch (err) {
        console.error("Greška pri dohvaćanju serija:", err);
      }
    };
    fetchShows();
  }, []);

  const toggleGenre = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updatedGenres);

    if (updatedGenres.length === 0) {
      setFilteredShows(shows);
    } else {
      const filtered = shows.filter((show) =>
        updatedGenres.every((g) => show.genres.includes(g))
      );
      setFilteredShows(filtered);
    }

    setCurrentPage(1);
  };

  const allGenres = Array.from(new Set(shows.flatMap((show) => show.genres)));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShows = filteredShows.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentShows.map((show) => (
          <Link key={show.id} href={`/serije/${show.id}`}>
            <Card className="bg-stone-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center cursor-pointer h-full">
              <CardHeader className="flex flex-col justify-center items-center px-4 py-2 w-full">
                <CardTitle className="text-lg font-semibold text-black flex justify-center items-center h-16 w-full">
                  {show.name.split(" ").length > 3
                    ? `${show.name.split(" ").slice(0, 3).join(" ")}...`
                    : show.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Ocjena: {show.rating.average}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Image
                  src={show.image?.medium || "/placeholder.jpg"}
                  alt={show.name}
                  width={210}
                  height={295}
                  className="rounded-md"
                  priority
                />
              </CardContent>
              <CardFooter className="text-sm text-gray-600">
                <p>{show.genres.join(", ")}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 disabled:opacity-50"
        >
          Prethodna
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500">
              Filtriraj po žanru
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <ScrollArea className="h-48 pr-2">
              {allGenres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                  />
                  <label htmlFor={genre} className="text-sm">
                    {genre}
                  </label>
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              startIndex + itemsPerPage < filteredShows.length ? prev + 1 : prev
            )
          }
          disabled={startIndex + itemsPerPage >= filteredShows.length}
          className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 disabled:opacity-50"
        >
          Sljedeća
        </button>
      </div>
    </>
  );
}
