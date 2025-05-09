"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FavoriteButton({ show }) {
  const [isFavorite, setIsFavorite] = useState(false);

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
          rating: show.rating?.average,
          image: show.image?.medium,
        }),
      });

      if (response.ok) {
        setIsFavorite(true);
        toast.success(`${show.name} je dodano u favorite.`);
      } else {
        toast.error("Dodavanje u favorite nije uspjelo.");
      }
    } catch (err) {
      console.error("Error adding to favorites:", err);
      toast.error("Greška prilikom dodavanja u favorite.");
    }
  };

  const removeFromFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?id=${show.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsFavorite(false);
        toast.success(`${show.name} je uklonjeno iz favorita.`);
      } else {
        toast.error("Uklanjanje iz favorita nije uspjelo.");
      }
    } catch (err) {
      console.error("Error removing from favorites:", err);
      toast.error("Greška prilikom uklanjanja iz favorita.");
    }
  };

  const handleSwitchChange = (checked) => {
    if (checked) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch checked={isFavorite} onCheckedChange={handleSwitchChange} />
      <Label className="text-sm">
        {isFavorite ? "U favoritima" : "Nije u favoritima"}
      </Label>
    </div>
  );
}
