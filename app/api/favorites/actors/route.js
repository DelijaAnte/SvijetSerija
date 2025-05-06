let favoriteActors = []; // Privremena memorija za favorite glumce

export async function GET(req) {
  return new Response(JSON.stringify(favoriteActors), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, image } = body;

    // Provjera da li glumac već postoji u favoritima
    const exists = favoriteActors.some((actor) => actor.id === id);
    if (exists) {
      return new Response(
        JSON.stringify({ message: "Glumac je već u favoritima." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Dodavanje glumca u favorite
    favoriteActors.push({ id, name, image });
    return new Response(
      JSON.stringify({
        message: "Glumac je dodan u favorite.",
        favoriteActors,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Greška prilikom dodavanja glumca." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "ID nije dostavljen." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Uklanjanje glumca iz liste favorita
    favoriteActors = favoriteActors.filter(
      (actor) => actor.id !== parseInt(id)
    );
    return new Response(
      JSON.stringify({
        message: "Glumac je uklonjen iz favorita.",
        favorites: favoriteActors,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Greška prilikom uklanjanja glumca." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
