"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FavoriteActorButton({ actor }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    checkIfFavorite();
  }, [actor.id]);

  const handleChange = async (checked) => {
    if (checked) {
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
          setIsFavorite(true);
          toast.success(`${actor.name} je dodan u favorite.`);
        } else {
          toast.error("Dodavanje glumca nije uspjelo.");
        }
      } catch (err) {
        console.error("Error adding actor:", err);
        toast.error("Greška pri dodavanju glumca.");
      }
    } else {
      try {
        const response = await fetch(`/api/favorites/actors?id=${actor.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorite(false);
          toast.success(`${actor.name} je uklonjen iz favorita.`);
        } else {
          toast.error("Uklanjanje glumca nije uspjelo.");
        }
      } catch (err) {
        console.error("Error removing actor:", err);
        toast.error("Greška pri uklanjanju glumca.");
      }
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id={`favorite-actor-${actor.id}`}
        checked={isFavorite}
        onCheckedChange={handleChange}
        disabled={loading}
      />
      <Label htmlFor={`favorite-actor-${actor.id}`}>
        {isFavorite ? "U favoritima" : "Nije u favoritima"}
      </Label>
    </div>
  );
}
