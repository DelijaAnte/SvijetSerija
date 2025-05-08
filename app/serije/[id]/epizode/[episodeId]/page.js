"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function EpisodeDetailsPage({ params }) {
  const [episode, setEpisode] = useState(null);
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

    const fetchEpisodeDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.tvmaze.com/episodes/${resolvedParams.episodeId}`
        );
        setEpisode(data);
      } catch (err) {
        setError("Failed to fetch episode details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeDetails();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-[450px] bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!episode) {
    return <p className="text-gray-600">Nema dostupnih podataka o epizodi.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{episode.name}</h1>
      {episode.image && (
        <div className="mb-4">
          <Image
            src={episode.image.original || episode.image.medium}
            alt={episode.name}
            width={800}
            height={450}
            className="rounded-md"
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
          />
        </div>
      )}
      <p className="text-gray-600 mb-4">
        <strong>Sezona:</strong> {episode.season}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Epizoda:</strong> {episode.number}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Datum emitiranja:</strong> {episode.airdate}
      </p>
      <p className="text-gray-600">
        {episode.summary?.replace(/<[^>]+>/g, "")}
      </p>
      <div className="flex justify-between mt-6">
        <button
          disabled={episode.number === 1}
          onClick={() => {
            const prev = episode.number - 1;
            if (prev > 0) {
              window.location.href = `/serije/${
                episode._embedded?.show?.id
              }/epizode/${episode.id - 1}`;
            }
          }}
          className={`px-4 py-2 rounded-md ${
            episode.number === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          Prethodna
        </button>

        <button
          onClick={() => {
            window.location.href = `/serije/${
              episode._embedded?.show?.id
            }/epizode/${episode.id + 1}`;
          }}
          className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500"
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
}
