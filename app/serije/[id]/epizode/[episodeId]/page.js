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
        // Dohvat epizode sa podacima o seriji
        const { data: episodeData } = await axios.get(
          `https://api.tvmaze.com/episodes/${resolvedParams.episodeId}?embed=show`
        );
        setEpisode(episodeData);

        // Dohvat svih epizoda serije
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

  // Grupiranje epizoda po sezonama
  const groupEpisodesBySeason = (episodes) => {
    return episodes.reduce((acc, episode) => {
      const season = episode.season;
      if (!acc[season]) acc[season] = [];
      acc[season].push(episode);
      return acc;
    }, {});
  };

  // Određivanje navigacijskih epizoda
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

    // Pronalazak prethodne epizode
    let previousEpisode = null;
    if (currentEpisodeIndex > 0) {
      previousEpisode = seasonEpisodes[currentEpisodeIndex - 1];
    } else if (currentSeasonIndex > 0) {
      const prevSeason = seasons[seasonNumbers[currentSeasonIndex - 1]];
      previousEpisode = prevSeason[prevSeason.length - 1];
    }

    // Pronalazak sljedeće epizode
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
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (!episode) {
    return <p className="p-4 text-gray-600">Epizoda nije pronađena.</p>;
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

      <div className="space-y-2 mb-6">
        <p className="text-gray-600">
          <strong>Sezona:</strong> {episode.season}
        </p>
        <p className="text-gray-600">
          <strong>Epizoda:</strong> {episode.number}
        </p>
        <p className="text-gray-600">
          <strong>Datum emitiranja:</strong> {episode.airdate}
        </p>
        <p className="text-gray-600">
          <strong>Ocjena:</strong>{" "}
          {episode.rating?.average
            ? `${episode.rating.average.toFixed(1)}/10`
            : "N/A"}
        </p>
        <p className="text-gray-600 mt-4">
          {episode.summary?.replace(/<[^>]+>/g, "") || "Nema opisa."}
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={!hasPrevious}
          onClick={() =>
            router.push(
              `/serije/${episode._embedded.show.id}/epizode/${previousEpisode.id}`
            )
          }
          className={`px-4 py-2 rounded-md ${
            !hasPrevious
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          Prethodna
        </button>

        <button
          disabled={!hasNext}
          onClick={() =>
            router.push(
              `/serije/${episode._embedded.show.id}/epizode/${nextEpisode.id}`
            )
          }
          className={`px-4 py-2 rounded-md ${
            !hasNext
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
}
