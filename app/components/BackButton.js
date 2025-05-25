/**
 * Komponenta za gumb koji korisnika vraća na prethodnu stranicu.
 */
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  function handleClick() {
    router.back();
  }

  return (
    <button
      onClick={handleClick}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
    >
      <ArrowLeft className="w-6 h-6 text-black" />
    </button>
  );
}
