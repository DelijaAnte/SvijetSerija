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

async function getFavorites(userEmail) {
  const favsCol = collection(db, "users", userEmail, "favorites_series");
  const favsSnapshot = await getDocs(favsCol);
  return favsSnapshot.docs.map((doc) => doc.data());
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const favorites = await getFavorites(session.user.email);
  return new Response(JSON.stringify({ favorites }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  if (!body || !body.id) {
    return new Response(JSON.stringify({ error: "Neispravni podaci" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userEmail = session.user.email;
  const docRef = doc(db, "users", userEmail, "favorites_series", `${body.id}`);

  await setDoc(docRef, {
    id: body.id,
    name: body.name,
    rating: body.rating,
    image: body.image,
  });

  const favorites = await getFavorites(userEmail);

  return new Response(
    JSON.stringify({ message: "Dodano u favorite", favorites }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Niste prijavljeni" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "ID je obavezan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userEmail = session.user.email;
  const docRef = doc(db, "users", userEmail, "favorites_series", id);
  await deleteDoc(docRef);

  const favorites = await getFavorites(userEmail);

  return new Response(
    JSON.stringify({ message: "Uklonjeno iz favorita", favorites }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
