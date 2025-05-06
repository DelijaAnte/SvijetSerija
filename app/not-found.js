import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400">
        404 - Stranica nije pronađena
      </h1>
      <p className="text-gray-600 mb-6">
        Ova stranica ne postoji. Provjerite URL ili se vratite na početnu
        stranicu.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
      >
        Povratak na početnu
      </Link>
    </div>
  );
}
