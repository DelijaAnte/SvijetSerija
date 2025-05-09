"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image komponentu
import { toast } from "sonner"; // Importujte toast funkciju

export default function FavoriteActorsPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Dohvaća favorite glumce s API-ja
    fetch("/api/favorites/actors")
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Failed to fetch favorite actors:", err));
  }, []);

  const handleRemove = (id) => {
    // Briše glumca iz favorita
    fetch(`/api/favorites/actors?id=${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFavorites(data.favorites || []); // Osigurajte da je `favorites` niz
        toast.success("Glumac je uspješno uklonjen iz favorita!"); // Prikaz obavijesti
      })
      .catch((err) => {
        console.error("Failed to remove favorite actor:", err);
        toast.error("Došlo je do greške prilikom uklanjanja glumca."); // Prikaz greške
      });
  };

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl font-bold text-gray-600">
          Nema favoriziranih glumaca.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Favorizirani Glumci
      </h1>
      <ul className="space-y-4">
        {favorites.map((actor) => (
          <li
            key={actor.id}
            className="flex items-center bg-stone-100 p-4 rounded shadow"
          >
            <div className="flex items-center space-x-4">
              <Link href={`/serije/id/glumci/${actor.id}`}>
                <Image
                  src={actor.image || "/placeholder.jpg"}
                  alt={actor.name}
                  width={50}
                  height={50}
                  className="rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/serije/id/glumci/${actor.id}`}>
                <h2 className="text-lg font-semibold text-yellow-400 hover:underline cursor-pointer">
                  {actor.name}
                </h2>
              </Link>
            </div>
            <button
              onClick={() => handleRemove(actor.id)}
              className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Ukloni
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
