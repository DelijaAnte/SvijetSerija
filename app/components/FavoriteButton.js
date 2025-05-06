"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function FavoriteButton({ show }) {
  const [isFavorite, setIsFavorite] = useState(false); // Praćenje stanja favorita

  // Provjera je li serija već u favoritima prilikom učitavanja
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const favorites = await response.json();
          const isAlreadyFavorite = favorites.some((fav) => fav.id === show.id);
          setIsFavorite(isAlreadyFavorite);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    checkIfFavorite();
  }, [show.id]);

  const addToFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: show.id,
          name: show.name,
          rating: show.rating.average,
          image: show.image?.medium,
        }),
      });

      if (response.ok) {
        setIsFavorite(true); // Označi seriju kao dodanu u favorite
        toast.success(`${show.name} je uspješno dodano u favorite!`); // Prikaz uspješne poruke
      } else {
        console.error("Failed to add to favorites");
        toast.error("Dodavanje u favorite nije uspjelo."); // Prikaz greške
      }
    } catch (err) {
      console.error("Error adding to favorites:", err);
      toast.error("Došlo je do greške prilikom dodavanja u favorite."); // Prikaz greške
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
