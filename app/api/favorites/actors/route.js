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

  // Dohvati dodatne podatke o glumcu s TVmaze API-ja
  let image = "/placeholder.jpg";
  try {
    const actorResponse = await axios.get(
      `https://api.tvmaze.com/people/${id}`
    );
    image = actorResponse.data.image?.medium || image;
  } catch {
    // Ako API ne radi, koristi placeholder
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

  // Nakon brisanja dohvati preostale favorite da bi frontend mogao ažurirati stanje
  const favsCol = collection(db, "users", userEmail, "favorites_actors");
  const favsSnapshot = await getDocs(favsCol);
  const favorites = favsSnapshot.docs.map((doc) => doc.data());

  return new Response(JSON.stringify({ favorites }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
