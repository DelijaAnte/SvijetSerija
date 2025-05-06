"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link"; // Dodano za korištenje linkova

export default function ActorDetailsPage({ params }) {
  const [actor, setActor] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params; // Razmotavanje params
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchActorDetails = async () => {
      try {
        // Dohvaćanje podataka o glumcu
        const actorResponse = await axios.get(
          `https://api.tvmaze.com/people/${resolvedParams.glumciId}`
        );
        setActor(actorResponse.data);

        // Dohvaćanje serija u kojima je glumac glumio
        const showsResponse = await axios.get(
          `https://api.tvmaze.com/people/${resolvedParams.glumciId}/castcredits?embed=show`
        );
        const embeddedShows = showsResponse.data.map(
          (credit) => credit._embedded.show
        );
        setShows(embeddedShows);
      } catch (err) {
        setError("Failed to fetch actor details or shows.");
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [resolvedParams]);

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!actor) {
    return <p className="text-gray-600">Nema dostupnih podataka o glumcu.</p>;
  }

  return (
    <div className="p-4 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">{actor.name}</h1>
      {actor.image && (
        <div className="mb-4">
          <Image
            src={actor.image.original || actor.image.medium}
            alt={actor.name}
            width={300}
            height={400}
            className="rounded-md"
          />
        </div>
      )}
      <p className="text-gray-600 mb-4">
        <strong>Datum rođenja:</strong> {actor.birthday || "N/A"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Mjesto rođenja:</strong> {actor.country?.name || "N/A"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Spol:</strong> {actor.gender || "N/A"}
      </p>

      {/* Prikaz serija u kojima je glumac glumio */}
      <h2 className="text-xl font-bold mt-6 mb-4">
        Serije u kojima je glumio:
      </h2>
      {shows.length > 0 ? (
        <ul className="space-y-4">
          {shows.map((show, index) => (
            <li key={`${show.id}-${index}`} className="border-b pb-2">
              <Link
                href={`/serije/${show.id}`} // Dodan link na stranicu detalja serije
                className="text-lg font-semibold text-yellow-400 hover:underline"
              >
                {show.name}
              </Link>
              <p className="text-gray-600">
                <strong>Žanr:</strong> {show.genres.join(", ") || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {show.status || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Premijera:</strong> {show.premiered || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Nema dostupnih podataka o serijama.</p>
      )}
    </div>
  );
}
