/**
 * Komponenta za dodavanje ili uklanjanje glumca iz favorita pomoću toggle switcha.
 */
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function FavoriteActorButton({ actor }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    const checkFavorite = async () => {
      const res = await fetch("/api/favorites/actors");
      const data = await res.json();
      const exists = Array.isArray(data)
        ? data.some((item) => item.id === actor.id)
        : false;
      setIsFavorite(exists);
    };
    checkFavorite();
  }, [userEmail, actor.id]);

  const handleChange = async (checked) => {
    if (!userEmail) {
      toast.error("Prvo se moraš prijaviti.");
      return;
    }

    if (checked) {
      const res = await fetch("/api/favorites/actors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: actor.id, name: actor.name }),
      });
      if (res.ok) {
        setIsFavorite(true);
        toast.success(`${actor.name} je dodan u favorite.`);
      } else {
        toast.error("Greška prilikom dodavanja u favorite.");
      }
    } else {
      const res = await fetch(`/api/favorites/actors?id=${actor.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsFavorite(false);
        toast.success(`${actor.name} je uklonjen iz favorita.`);
      } else {
        toast.error("Greška prilikom uklanjanja iz favorita.");
      }
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id={`favorite-actor-${actor.id}`}
        checked={isFavorite}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={`favorite-actor-${actor.id}`}>
        {isFavorite ? "U favoritima" : "Nije u favoritima"}
      </Label>
    </div>
  );
}
