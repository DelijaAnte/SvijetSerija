"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function EpisodesPage({ params }) {
  const [episodes, setEpisodes] = useState([]);
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

    const fetchEpisodes = async () => {
      try {
        const { data } = await axios.get(
          `https://api.tvmaze.com/shows/${resolvedParams.id}/episodes`
        );
        setEpisodes(data);
      } catch (err) {
        setError("Failed to fetch episodes.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="space-y-2 border-b pb-2 animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!episodes || episodes.length === 0) {
    return <p className="text-gray-600">Nema dostupnih epizoda.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Popis epizoda</h1>
      <ul className="space-y-4">
        {episodes.map((episode) => (
          <li key={episode.id} className="border-b pb-2">
            <Link
              href={`/serije/${resolvedParams.id}/epizode/${episode.id}`}
              className="text-lg font-semibold text-yellow-400 hover:underline"
            >
              {episode.name}
            </Link>
            <p className="text-gray-600">
              Sezona {episode.season}, Epizoda {episode.number}
            </p>
            <p className="text-gray-600">{episode.airdate}</p>
            <p className="text-gray-600">
              <strong>Trajanje:</strong>{" "}
              {episode.runtime ? `${episode.runtime} min` : "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
