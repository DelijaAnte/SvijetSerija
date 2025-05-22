"use client";
/**
 * Stranica koja prikazuje popis epizoda za određenu seriju.
 */

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

  // Dohvaćanje podataka nakon što su parametri dostupni
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

  // Skeleton loading prikaz dok čekamo podatke s API-ja
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Prikaz poruke o grešci u slučaju neuspješnog dohvaćanja podataka
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

  // Render poruke ako nema epizoda
  if (!episodes || episodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Nema dostupnih epizoda.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Popis epizoda
            </h1>

            <div className="space-y-4">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                >
                  <Link
                    href={`/serije/${resolvedParams.id}/epizode/${episode.id}`}
                    className="block"
                  >
                    <h2 className="text-xl font-semibold text-yellow-400 hover:underline transition">
                      {episode.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 uppercase text-xs font-medium">
                          Sezona/Epizoda
                        </p>
                        <p className="text-gray-900 font-medium">
                          S{episode.season} E{episode.number}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 uppercase text-xs font-medium">
                          Datum emitiranja
                        </p>
                        <p className="text-gray-900 font-medium">
                          {episode.airdate}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 uppercase text-xs font-medium">
                          Trajanje
                        </p>
                        <p className="text-gray-900 font-medium">
                          {episode.runtime ? `${episode.runtime} min` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
