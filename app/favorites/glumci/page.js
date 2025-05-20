"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function FavoriteActorsPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites/actors")
      .then((res) => res.json())
      .then((data) => {
        // Sigurna provjera da je stigao niz
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.warn("Neočekivan format podataka:", data);
          setFavorites([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri dohvaćanju favorita:", err);
        setIsLoading(false);
      });
  }, []);

  const handleRemove = (id) => {
    fetch(`/api/favorites/actors?id=${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        const updatedFavorites = Array.isArray(data.favorites)
          ? data.favorites
          : [];
        setFavorites(updatedFavorites);
        toast.success("Glumac je uspješno uklonjen iz favorita!");
      })
      .catch((err) => {
        console.error("Greška pri uklanjanju glumca:", err);
        toast.error("Došlo je do greške prilikom uklanjanja glumca.");
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!Array.isArray(favorites) || favorites.length === 0) {
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
          Nema favoriziranih glumaca
        </h2>
        <p className="text-gray-500">
          Dodajte glumce u favorite kako biste ih vidjeli ovdje.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Favorizirani Glumci
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {favorites.length} {favorites.length === 1 ? "glumac" : "glumaca"} u
            vašoj listi
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
          {favorites.map((actor) => (
            <div
              key={actor.id}
              className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors"
            >
              <Link
                href={`/serije/id/glumci/${actor.id}`}
                className="flex-shrink-0"
              >
                <Image
                  src={actor.image || "/placeholder.jpg"}
                  alt={actor.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover h-16 w-16 border-2 border-yellow-400"
                />
              </Link>

              <div className="ml-4 flex-1 min-w-0">
                <Link href={`/serije/id/glumci/${actor.id}`}>
                  <h2 className="text-lg font-bold text-gray-900 hover:text-yellow-500 transition-colors truncate">
                    {actor.name}
                  </h2>
                </Link>
                {actor.character && (
                  <p className="text-sm text-gray-500 truncate">
                    {actor.character}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleRemove(actor.id)}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Ukloni
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
