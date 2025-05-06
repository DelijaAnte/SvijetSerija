let favorites = []; // In-memory storage za favorite (nije trajno)

export async function GET(req) {
  // Dohvaća sve favorite
  return new Response(JSON.stringify(favorites), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  // Dodaje novu seriju u favorite
  const body = await req.json();
  if (!body || !body.id) {
    return new Response(JSON.stringify({ error: "Invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Provjera postoji li već serija u favoritima
  const exists = favorites.some((fav) => fav.id === body.id);
  if (exists) {
    return new Response(
      JSON.stringify({ error: "Series already in favorites" }),
      {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  favorites.push(body);
  return new Response(
    JSON.stringify({ message: "Series added to favorites", favorites }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(req) {
  // Briše seriju iz favorita
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  favorites = favorites.filter((fav) => fav.id !== parseInt(id));
  return new Response(
    JSON.stringify({ message: "Series removed from favorites", favorites }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
