"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner"; // Importujte toast funkciju

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Dohvaća favorite s API-ja
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Failed to fetch favorites:", err));
  }, []);

  const handleRemove = (id) => {
    // Briše seriju iz favorita
    fetch(`/api/favorites?id=${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data.favorites);
        toast.success("Serija je uspješno uklonjena iz favorita!"); // Prikaz obavijesti
      })
      .catch((err) => {
        console.error("Failed to remove favorite:", err);
        toast.error("Došlo je do greške prilikom uklanjanja serije."); // Prikaz greške
      });
  };

  if (favorites.length === 0) {
    return <p className="text-center text-gray-600">Nema favorita.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Favoriti</h1>
      <ul className="space-y-4">
        {favorites.map((fav) => (
          <li
            key={fav.id}
            className="flex justify-between items-center bg-stone-100 p-4 rounded shadow"
          >
            <div>
              <Link href={`/serije/${fav.id}`}>
                <h2 className="text-lg font-semibold text-yellow-400 hover:underline cursor-pointer">
                  {fav.name}
                </h2>
              </Link>
              <p className="text-sm text-gray-600">Ocjena: {fav.rating}</p>
            </div>
            <button
              onClick={() => handleRemove(fav.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Ukloni
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
