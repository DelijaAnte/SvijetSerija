"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image komponentu
import { toast } from "sonner";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-stone-100 p-4 rounded shadow flex flex-col items-center"
          >
            <Link href={`/serije/${fav.id}`}>
              <Image
                src={fav.image || "/placeholder.jpg"} // Prikaz postera serije
                alt={fav.name}
                width={200} // Širina slike
                height={300} // Visina slike
                className="rounded-md mb-2 cursor-pointer"
                placeholder="blur"
                blurDataURL="/placeholder.jpg" // Placeholder za učitavanje
              />
            </Link>
            <h2 className="text-lg font-semibold text-yellow-400 text-center">
              {fav.name}
            </h2>
            <p className="text-sm text-gray-600">
              Ocjena: {fav.rating || "N/A"}
            </p>
            <button
              onClick={() => handleRemove(fav.id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Ukloni
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
