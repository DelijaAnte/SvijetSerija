"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("https://api.tvmaze.com/shows");
        const sortedShows = data
          .filter((show) => show.rating && show.rating.average !== null) // Filtriraj serije bez ocjene
          .sort((a, b) => b.rating.average - a.rating.average); // Sortiraj po ocjeni
        setShows(sortedShows);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };
    fetchShows();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShows = shows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      {/* Opis aplikacije */}
      <p className="text-center text-gray-700 mb-4">
        Ova aplikacija omogućuje pregled informacija o serijama, pomaže
        korisnicima u donošenju odluke što gledati i pruža uvid u najbolje
        ocijenjene serije.
      </p>

      {/* Naslov stranice */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        Najbolje ocijenjene:
      </h2>

      {/* Grid za prikaz serija */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentShows.map((show) => (
          <Card
            key={show.id}
            className="hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <CardHeader className="flex justify-center items-center h-[60px]">
              <CardTitle className="text-center text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                {show.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Image
                src={show.image?.medium || "/placeholder.jpg"}
                alt={show.name}
                width={210}
                height={295}
                className="rounded-md"
              />
              <p className="mt-2 text-sm text-gray-600">
                Rating: {show.rating.average || "N/A"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigacija za paginaciju */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              startIndex + itemsPerPage < shows.length ? prev + 1 : prev
            )
          }
          disabled={startIndex + itemsPerPage >= shows.length}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
