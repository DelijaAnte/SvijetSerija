"use client";

import { Badge } from "@/components/ui/badge"; // Import shadcn komponente
import GenreFilteredShows from "./components/GenreFilter";

export default function Home() {
  return (
    <div className="p-4">
      <p className="text-center text-gray-700 mb-4 flex justify-center space-x-8">
        <Badge
          variant="outline"
          className="w-48 text-lg font-semibold text-black bg-yellow-300 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-300 flex justify-center"
        >
          Najbolje serije
        </Badge>
        <Badge
          variant="outline"
          className="w-48 text-lg font-semibold text-black bg-yellow-300 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-300 flex justify-center"
        >
          Top glumci
        </Badge>
        <Badge
          variant="outline"
          className="w-48 text-lg font-semibold text-black bg-yellow-300 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-300 flex justify-center"
        >
          Istraži žanrove
        </Badge>
      </p>
      <GenreFilteredShows />
    </div>
  );
}
