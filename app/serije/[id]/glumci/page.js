"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function CastPage({ params }) {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Params ID:", params.id); // Debugging: provjera ID-a
    const fetchCast = async () => {
      try {
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows/${params.id}/cast`
        );
        console.log("Fetched Cast Data:", data); // Debugging: provjera podataka
        setCast(data);
      } catch (err) {
        console.error("Error fetching cast:", err); // Debugging: ispis greške
        setError("Failed to fetch cast.");
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [params.id]);

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!cast || cast.length === 0) {
    return <p className="text-gray-600">Nema dostupnih podataka o glumcima.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Glumačka postava</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cast.map((member) => (
          <div key={member.person.id} className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-2">
              <Image
                src={member.person.image?.medium || "/placeholder.jpg"}
                alt={member.person.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <p className="text-lg font-semibold">{member.person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
