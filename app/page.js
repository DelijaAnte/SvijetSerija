"use client";

import { Badge } from "@/components/ui/badge"; // Import shadcn komponente
import GenreFilteredShows from "./components/GenreFilter";

export default function Home() {
  return (
    <div className="p-4">
      <div className="relative overflow-hidden whitespace-nowrap py-2 mb-6 bg-white">
        <div className="animate-marquee inline-flex space-x-8 px-4">
          {[...Array(2)].flatMap((_, i) =>
            [
              "Najbolje serije",
              "Istraži žanrove",
              "Top glumci",
              "Spremi favorite",
              "Najnovije epizode",
              "HD posteri",
            ].map((label, j) => (
              <Badge
                key={`${i}-${j}`}
                variant="outline"
                className="w-48 text-lg font-semibold text-black bg-yellow-300 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-300 flex justify-center"
              >
                {label}
              </Badge>
            ))
          )}
        </div>
      </div>

      <GenreFilteredShows />
    </div>
  );
}
