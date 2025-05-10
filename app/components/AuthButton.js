"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <p className="text-sm">Bok, {session.user.name}</p>
        <button
          onClick={() => signOut()}
          className="text-red-500 hover:underline"
        >
          Odjavi se
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="text-blue-500 hover:underline"
    >
      Prijavi se preko GitHuba
    </button>
  );
}
