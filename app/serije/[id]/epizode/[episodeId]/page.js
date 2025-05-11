"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EpisodeDetailsPage({ params }) {
  const [episode, setEpisode] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);
  const router = useRouter();

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
        const { data: episodeData } = await axios.get(
          `https://api.tvmaze.com/episodes/${resolvedParams.episodeId}?embed=show`
        );
        setEpisode(episodeData);

        if (episodeData._embedded?.show?.id) {
          const { data: episodesData } = await axios.get(
            `https://api.tvmaze.com/shows/${episodeData._embedded.show.id}/episodes`
          );
          setAllEpisodes(episodesData);
        }
      } catch (err) {
        setError("Došlo je do greške pri učitavanju podataka.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeDetails();
  }, [resolvedParams]);

  const groupEpisodesBySeason = (episodes) => {
    return episodes.reduce((acc, episode) => {
      const season = episode.season;
      if (!acc[season]) acc[season] = [];
      acc[season].push(episode);
      return acc;
    }, {});
  };

  const getNavigationEpisodes = () => {
    if (!episode || allEpisodes.length === 0) return {};

    const seasons = groupEpisodesBySeason(allEpisodes);
    const seasonNumbers = Object.keys(seasons)
      .map(Number)
      .sort((a, b) => a - b);
    const currentSeason = episode.season;
    const currentSeasonIndex = seasonNumbers.indexOf(currentSeason);

    const seasonEpisodes = seasons[currentSeason].sort(
      (a, b) => a.number - b.number
    );
    const currentEpisodeIndex = seasonEpisodes.findIndex(
      (ep) => ep.id === episode.id
    );

    let previousEpisode = null;
    if (currentEpisodeIndex > 0) {
      previousEpisode = seasonEpisodes[currentEpisodeIndex - 1];
    } else if (currentSeasonIndex > 0) {
      const prevSeason = seasons[seasonNumbers[currentSeasonIndex - 1]];
      previousEpisode = prevSeason[prevSeason.length - 1];
    }

    let nextEpisode = null;
    if (currentEpisodeIndex < seasonEpisodes.length - 1) {
      nextEpisode = seasonEpisodes[currentEpisodeIndex + 1];
    } else if (currentSeasonIndex < seasonNumbers.length - 1) {
      const nextSeason = seasons[seasonNumbers[currentSeasonIndex + 1]];
      nextEpisode = nextSeason[0];
    }

    return {
      hasPrevious: !!previousEpisode,
      hasNext: !!nextEpisode,
      previousEpisode,
      nextEpisode,
    };
  };

  const { hasPrevious, hasNext, previousEpisode, nextEpisode } =
    getNavigationEpisodes();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between mt-8">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

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

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Epizoda nije pronađena.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Naslov i osnovne informacije */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {episode.name}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="px-3 py-1 bg-yellow-300 text-black rounded-full text-sm">
                  Sezona {episode.season}
                </span>
                <span className="px-3 py-1 bg-yellow-300 text-black rounded-full text-sm">
                  Epizoda {episode.number}
                </span>
                {episode.rating?.average && (
                  <span className="px-3 py-1 bg-yellow-300 text-black rounded-full text-sm">
                    Ocjena: {episode.rating.average.toFixed(1)}/10
                  </span>
                )}
              </div>
            </div>

            {/* Slika epizode */}
            {episode.image && (
              <div className="mb-6">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={episode.image.original || episode.image.medium}
                    alt={episode.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                </div>
              </div>
            )}

            {/* Detalji epizode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Datum emitiranja
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    {episode.airdate}
                  </p>
                </div>

                {episode.runtime && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Trajanje
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {episode.runtime} minuta
                    </p>
                  </div>
                )}
              </div>

              {/* Opis epizode */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Opis
                </h3>
                <p className="text-gray-700">
                  {episode.summary?.replace(/<[^>]+>/g, "") || "Nema opisa."}
                </p>
              </div>
            </div>

            {/* Navigacijske tipke */}
            <div className="flex justify-between mt-8">
              <button
                disabled={!hasPrevious}
                onClick={() =>
                  router.push(
                    `/serije/${episode._embedded.show.id}/epizode/${previousEpisode.id}`
                  )
                }
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  !hasPrevious
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                }`}
              >
                ← Prethodna epizoda
              </button>

              <button
                disabled={!hasNext}
                onClick={() =>
                  router.push(
                    `/serije/${episode._embedded.show.id}/epizode/${nextEpisode.id}`
                  )
                }
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  !hasNext
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                }`}
              >
                Sljedeća epizoda →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
