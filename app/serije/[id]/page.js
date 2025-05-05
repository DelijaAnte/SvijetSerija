"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

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

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">{show.name}</h1>
      <p className="text-gray-600 mb-4 text-center">
        {show.summary.replace(/<[^>]+>/g, "")}
      </p>
      <div className="relative w-full max-w-2xl h-auto mb-4">
        <Image
          src={show.image?.original || "/placeholder.jpg"}
          alt={show.name}
          width={800}
          height={450}
          className="rounded-md mx-auto"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
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

      {/* Dugme za glumačku postavu */}
      <Link
        href={`/serije/${resolvedParams?.id}/cast`}
        className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition duration-200"
      >
        Vidi glumce
      </Link>
    </div>
  );
}
