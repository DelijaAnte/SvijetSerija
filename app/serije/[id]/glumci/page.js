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
import { Skeleton } from "@/components/ui/skeleton";

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
        setLoading(true);
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows/${resolvedParams.id}/cast`
        );
        setCast(data);
      } catch (err) {
        console.error("Error fetching cast:", err);
        setError("Došlo je do greške pri učitavanju glumačke postave.");
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Glumačka postava
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center group">
              <Skeleton className="w-32 h-32 rounded-full mb-3" />
              <Skeleton className="w-24 h-5 mt-2" />
              <Skeleton className="w-20 h-4 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Pokušajte ponovo
        </button>
      </div>
    );
  }

  if (!cast || cast.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 text-lg">
          Trenutno nema dostupnih podataka o glumcima
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Glumačka postava
      </h1>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: "auto",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {cast.map((member) => (
              <CarouselItem
                key={`${member.person.id}-${member.character.id}`}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <div className="flex flex-col items-center p-4">
                  <Link
                    href={`/serije/${resolvedParams.id}/glumci/${member.person.id}`}
                    className="group"
                  >
                    <div className="relative w-32 h-32 mb-3 group-hover:ring-4 group-hover:ring-primary/50 rounded-full transition-all">
                      <Image
                        src={
                          member.person.image?.medium ||
                          "/placeholder-actor.jpg"
                        }
                        alt={member.person.name}
                        fill
                        className="object-cover rounded-full border-2 border-gray-200"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold group-hover:text-primary transition">
                        {member.person.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {member.character.name}
                      </p>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary text-white hover:bg-primary-dark hover:text-white size-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary text-white hover:bg-primary-dark hover:text-white size-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl" />
        </Carousel>
      </div>

      <div className="mt-8 text-center">
        <p className="bg-yellow-400 text-black py-2 px-4 rounded-lg inline-block text-sm">
          Ukupno glumaca: {cast.length}
        </p>
      </div>
    </div>
  );
}
