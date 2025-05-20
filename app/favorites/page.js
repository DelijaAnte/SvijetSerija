"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch favorites:", err);
        setIsLoading(false);
      });
  }, []);

  const handleRemove = (id) => {
    fetch(`/api/favorites?id=${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data.favorites);
        toast.success("Serija je uspješno uklonjena iz favorita!");
      })
      .catch((err) => {
        console.error("Failed to remove favorite:", err);
        toast.error("Došlo je do greške prilikom uklanjanja serije.");
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="bg-yellow-100 p-6 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Nema favoriziranih serija
        </h2>
        <p className="text-gray-500">
          Dodajte serije u favorite kako biste ih vidjeli ovdje
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Omiljene Serije
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {favorites.length} {favorites.length === 1 ? "serija" : "serije"} u
            vašoj listi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/serije/${fav.id}`}>
                <div className="relative aspect-[2/3]">
                  <Image
                    src={fav.image || "/placeholder.jpg"}
                    alt={fav.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/serije/${fav.id}`}>
                  <h2 className="text-lg font-bold text-gray-900 hover:text-yellow-500 transition-colors mb-1 truncate">
                    {fav.name}
                  </h2>
                </Link>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-600">
                      {fav.rating || "N/A"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(fav.id)}
                    className="px-3 py-1 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
