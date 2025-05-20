"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function FavoriteButton({ show }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    const checkFavorite = async () => {
      const ref = doc(db, "users", userEmail, "favorites_series", `${show.id}`);
      const snap = await getDoc(ref);
      setIsFavorite(snap.exists());
    };
    checkFavorite();
  }, [userEmail, show.id]);

  const handleSwitchChange = async (checked) => {
    if (!userEmail) return toast.error("Prvo se moraš prijaviti.");
    const ref = doc(db, "users", userEmail, "favorites_series", `${show.id}`);

    if (checked) {
      const dataToSave = {
        id: show.id,
        name: show.name,
        rating: show.rating?.average ?? null,
        image: show.image?.medium ?? null,
      };
      await setDoc(ref, dataToSave);
      setIsFavorite(true);
      toast.success(`${show.name} je dodano u favorite.`);
    } else {
      await deleteDoc(ref);
      setIsFavorite(false);
      toast.success(`${show.name} je uklonjeno iz favorita.`);
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch checked={isFavorite} onCheckedChange={handleSwitchChange} />
      <Label>{isFavorite ? "U favoritima" : "Nije u favoritima"}</Label>
    </div>
  );
}
