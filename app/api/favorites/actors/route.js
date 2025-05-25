import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";

// GET metoda dohvaća sve favorite glumaca za prijavljenog korisnika
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
    });
  }

  const userEmail = session.user.email;
  const favsCol = collection(db, "users", userEmail, "favorites_actors");
  const favsSnapshot = await getDocs(favsCol);
  const favorites = favsSnapshot.docs.map((doc) => doc.data());

  return new Response(JSON.stringify(favorites), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST metoda dodaje glumca u favorite korisnika
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { id, name } = body;

  if (!id || !name) {
    return new Response(JSON.stringify({ error: "Neispravni podaci" }), {
      status: 400,
    });
  }

  const userEmail = session.user.email;
  const docRef = doc(db, "users", userEmail, "favorites_actors", `${id}`);

  // Pokušaj dohvatiti sliku glumca s TVmaze API-ja, ako ne uspije koristi placeholder
  let image = "/placeholder.jpg";
  try {
    const actorResponse = await axios.get(
      `https://api.tvmaze.com/people/${id}`
    );
    image = actorResponse.data.image?.medium || image;
  } catch {
    // API nije dostupan, koristi default sliku
  }

  await setDoc(docRef, {
    id,
    name,
    image,
  });

  return new Response(JSON.stringify({ message: "Dodano u favorite" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// DELETE metoda uklanja glumca iz favorita prema ID-u
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
    });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "ID je obavezan" }), {
      status: 400,
    });
  }

  const userEmail = session.user.email;
  const docRef = doc(db, "users", userEmail, "favorites_actors", id);
  await deleteDoc(docRef);

  // Nakon brisanja, dohvatimo ažuriranu listu favorita
  const favsCol = collection(db, "users", userEmail, "favorites_actors");
  const favsSnapshot = await getDocs(favsCol);
  const favorites = favsSnapshot.docs.map((doc) => doc.data());

  return new Response(JSON.stringify({ favorites }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
