"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import FavoriteActorButton from "@/app/components/FavoriteActorButton";

export default function ActorDetailsPage({ params }) {
  const [actor, setActor] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchActorDetails = async () => {
      try {
        const [actorResponse, showsResponse] = await Promise.all([
          axios.get(`https://api.tvmaze.com/people/${resolvedParams.glumciId}`),
          axios.get(
            `https://api.tvmaze.com/people/${resolvedParams.glumciId}/castcredits?embed=show`
          ),
        ]);

        setActor(actorResponse.data);
        setShows(showsResponse.data.map((credit) => credit._embedded.show));
      } catch (err) {
        setError("Failed to fetch actor details or shows.");
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [resolvedParams]);

  const sortShows = (showsToSort) => {
    switch (sortBy) {
      case "year-asc":
        return [...showsToSort].sort((a, b) => {
          const yearA = a.premiered ? parseInt(a.premiered.split("-")[0]) : 0;
          const yearB = b.premiered ? parseInt(b.premiered.split("-")[0]) : 0;
          return yearA - yearB;
        });
      case "year-desc":
        return [...showsToSort].sort((a, b) => {
          const yearA = a.premiered ? parseInt(a.premiered.split("-")[0]) : 0;
          const yearB = b.premiered ? parseInt(b.premiered.split("-")[0]) : 0;
          return yearB - yearA;
        });
      case "rating-asc":
        return [...showsToSort].sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingA - ratingB;
        });
      case "rating-desc":
        return [...showsToSort].sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });
      default:
        return showsToSort;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="aspect-[2/3] bg-gray-200 rounded-xl" />
            <div className="mt-4 h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="w-full md:w-2/3 space-y-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
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
            Pokusaj ponovo
          </button>
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Nema podataka o glumcu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 p-6">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                {actor.image ? (
                  <Image
                    src={actor.image.original || actor.image.medium}
                    alt={actor.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Nema dostupne slike</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <FavoriteActorButton
                  actor={{
                    id: actor.id,
                    name: actor.name,
                    image: actor.image?.medium,
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {actor.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <DetailItem
                  label="Datum rođenja"
                  value={actor.birthday || "N/A"}
                />
                <DetailItem
                  label="Mjesto rođenja"
                  value={actor.country?.name || "N/A"}
                />
                <DetailItem label="Spol" value={actor.gender || "N/A"} />
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Serije u kojima je glumio/la
                  </h2>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    >
                      <option value="default">Sortiraj po</option>
                      <option value="year-asc">Godina (najstarije)</option>
                      <option value="year-desc">Godina (najnovije)</option>
                      <option value="rating-asc">Rating (najniži)</option>
                      <option value="rating-desc">Rating (najviši)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {shows.length > 0 ? (
                  <div className="space-y-4">
                    {sortShows(shows).map((show, index) => (
                      <div
                        key={`${show.id}-${index}`}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Link href={`/serije/${show.id}`} className="block">
                          <h3 className="text-xl font-semibold text-yellow-400 hover:underline transition">
                            {show.name}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm">
                            <DetailItem
                              small
                              label="Žanr"
                              value={show.genres.join(", ") || "N/A"}
                            />
                            <DetailItem
                              small
                              label="Status"
                              value={show.status || "N/A"}
                            />
                            <DetailItem
                              small
                              label="Premijera"
                              value={show.premiered || "N/A"}
                            />
                            <DetailItem
                              small
                              label="Rating"
                              value={
                                show.rating?.average
                                  ? `${show.rating.average}/10`
                                  : "N/A"
                              }
                            />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Nema dostupnih podataka o serijama.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, small = false }) {
  return (
    <div className={small ? "" : "bg-white p-3 rounded-lg shadow-sm"}>
      <dt
        className={`${
          small ? "text-xs" : "text-sm"
        } font-medium text-gray-500 uppercase tracking-wider`}
      >
        {label}
      </dt>
      <dd
        className={`${
          small ? "text-sm" : "mt-1 text-lg"
        } font-medium text-gray-900`}
      >
        {value}
      </dd>
    </div>
  );
}
