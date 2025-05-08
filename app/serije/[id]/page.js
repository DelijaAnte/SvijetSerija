"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";

export default function ShowDetails({ params }) {
  const [show, setShow] = useState(null);
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

    const fetchShowDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows/${resolvedParams.id}`
        );
        setShow(data);
      } catch (err) {
        setError("Failed to fetch show details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [resolvedParams]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (loading) {
    return (
      <div className="p-4 animate-pulse space-y-4">
        <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-full" />
        <div className="h-[450px] bg-gray-300 rounded w-full max-w-2xl mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!show) {
    return <p className="text-gray-600">Nema dostupnih podataka o seriji.</p>;
  }

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">{show.name}</h1>
      <p className="text-gray-600 mb-4 text-center">
        {show.summary.replace(/<[^>]+>/g, "")}
      </p>
      <div className="w-full max-w-2xl mb-4 mx-auto">
        <Image
          src={show.image?.original || "/placeholder.jpg"}
          alt={show.name}
          width={800}
          height={450}
          className="rounded-md object-contain"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
          priority
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      <p className="text-gray-600">
        <strong>Genres:</strong> {show.genres.join(", ")}
      </p>
      <p className="text-gray-600">
        <strong>Rating:</strong> {show.rating.average || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Language:</strong> {show.language || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Premiered:</strong> {show.premiered || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Runtime:</strong>{" "}
        {show.runtime ? `${show.runtime} minutes` : "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Official Site:</strong>{" "}
        {show.officialSite ? (
          <a
            href={show.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Visit
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p className="text-gray-600">
        <strong>Status:</strong> {show.status || "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Schedule:</strong>{" "}
        {show.schedule?.days.length > 0
          ? `${show.schedule.days.join(", ")} at ${show.schedule.time || "N/A"}`
          : "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Network:</strong> {show.network ? show.network.name : "N/A"}
      </p>

      {/* Komponenta FavoriteButton za dodavanje u favorite */}
      <FavoriteButton show={show} />

      {/* Dugme za glumačku postavu */}
      <Link
        href={`/serije/${resolvedParams?.id}/glumci`}
        className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition duration-200"
      >
        Vidi glumce
      </Link>

      {/* Dugme za popis epizoda */}
      <Link
        href={`/serije/${resolvedParams?.id}/epizode`}
        className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition duration-200"
      >
        Vidi epizode
      </Link>
    </div>
  );
}
