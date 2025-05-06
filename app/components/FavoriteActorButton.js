"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function FavoriteActorButton({ actor }) {
  const [isFavorite, setIsFavorite] = useState(false); // Praćenje stanja favorita

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await fetch("/api/favorites/actors");
        if (response.ok) {
          const favorites = await response.json();
          const isAlreadyFavorite = favorites.some(
            (fav) => fav.id === actor.id
          );
          setIsFavorite(isAlreadyFavorite);
        } else {
          console.error("Failed to fetch favorite actors");
        }
      } catch (err) {
        console.error("Error fetching favorite actors:", err);
      }
    };

    checkIfFavorite();
  }, [actor.id]);

  const addToFavorites = async () => {
    try {
      const response = await fetch("/api/favorites/actors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: actor.id,
          name: actor.name,
          image: actor.image?.medium,
        }),
      });

      if (response.ok) {
        setIsFavorite(true); // Označi glumca kao dodanog u favorite
        toast.success(`${actor.name} je uspješno dodan u favorite!`); // Prikaz uspješne poruke
      } else {
        console.error("Failed to add actor to favorites");
        toast.error("Dodavanje glumca u favorite nije uspjelo."); // Prikaz greške
      }
    } catch (err) {
      console.error("Error adding actor to favorites:", err);
      toast.error("Došlo je do greške prilikom dodavanja glumca u favorite."); // Prikaz greške
    }
  };

  return (
    <button
      onClick={addToFavorites}
      disabled={isFavorite}
      className={`mt-4 px-4 py-2 rounded-md transition duration-200 ${
        isFavorite
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-yellow-400 text-black hover:bg-yellow-500"
      }`}
    >
      {isFavorite ? "Dodano u favorite" : "Dodaj u favorite"}
    </button>
  );
}
