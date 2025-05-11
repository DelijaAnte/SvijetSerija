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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="aspect-video bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No show data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Show image */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={show.image?.original || "/placeholder.jpg"}
                alt={show.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <FavoriteButton show={show} />
            </div>
          </div>

          {/* Show details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.name}</h1>

            {/* Genres */}
            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-yellow-300 text-dark rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {show.summary && (
              <div
                className="prose max-w-none mb-6 text-gray-700"
                dangerouslySetInnerHTML={{ __html: show.summary }}
              />
            )}

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <DetailCard
                label="Ocjena"
                value={show.rating?.average || "N/A"}
              />
              <DetailCard label="Status" value={show.status || "N/A"} />
              <DetailCard label="Jezik" value={show.language || "N/A"} />
              <DetailCard label="Premijera" value={show.premiered || "N/A"} />
              <DetailCard
                label="Raspored"
                value={
                  show.schedule?.days?.length > 0
                    ? `${show.schedule.days.join(", ")} at ${
                        show.schedule.time || "N/A"
                      }`
                    : "N/A"
                }
              />
              <DetailCard
                label="Trajanje"
                value={show.runtime ? `${show.runtime} minutes` : "N/A"}
              />
              <DetailCard
                label="Platforma"
                value={show.network?.name || "N/A"}
              />
              {show.officialSite && (
                <DetailCard
                  label="Službena stranica"
                  value={
                    <a
                      href={show.officialSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Site
                    </a>
                  }
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/serije/${resolvedParams?.id}/glumci`}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors shadow-md"
              >
                Vidi glumce
              </Link>
              <Link
                href={`/serije/${resolvedParams?.id}/epizode`}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors shadow-md"
              >
                Vidi epizode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}
