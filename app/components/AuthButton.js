/**
 * Komponenta za prikaz gumba za prijavu ili odjavu ovisno o statusu sesije.
 */
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <p className="text-gray-900 font-bold">Bok, {session.user.name}</p>
        <button
          onClick={() => signOut()}
          className="text-red-500 hover:underline font-bold"
        >
          Odjavi se
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="text-gray-900 hover:underline font-bold"
    >
      Prijavi se preko GitHuba
    </button>
  );
}
