"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CastPage({ params }) {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchCast = async () => {
      try {
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows/${resolvedParams.id}/cast`
        );
        setCast(data);
      } catch (err) {
        setError("Failed to fetch cast.");
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [resolvedParams]);

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
      <h1 className="text-2xl font-bold mb-4 text-center">Glumačka postava</h1>
      <Carousel className="relative">
        <CarouselContent>
          {cast.map((member, index) => (
            <CarouselItem
              key={`${member.person.id}-${index}`}
              className="flex flex-col items-center basis-1/5"
            >
              <Link
                href={`/serije/${resolvedParams.id}/glumci/${member.person.id}`}
              >
                <div className="relative w-32 h-32 mb-2">
                  <Image
                    src={member.person.image?.medium || "/placeholder.jpg"}
                    alt={member.person.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </Link>
              <p className="text-lg font-semibold">{member.person.name}</p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2">
          Previous
        </CarouselPrevious>
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2">
          Next
        </CarouselNext>
      </Carousel>
    </div>
  );
}
