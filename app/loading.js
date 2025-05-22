/**
 * Globalni loading placeholder (dodatna provjera uz ugrađene loading state-ove u stranicama).
 */
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <p className="text-xl font-semibold text-yellow-400">Učitavanje...</p>
    </div>
  );
}
