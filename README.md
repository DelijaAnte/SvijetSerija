# Svijet Serija

**Svijet Serija** je moderna web aplikacija za pregled i pretragu serija, glumaca i epizoda, s detaljnim informacijama o svakom sadržaju. Korisnicima omogućuje i spremanje omiljenih serija i glumaca putem vlastitih API ruta. Aplikacija je optimizirana za performanse i testirana pomoću Lighthouse alata.

## 🔗 Link aplikacije

👉 [https://svijet-serija.vercel.app](https://svijet-serija.vercel.app)

## ⚙️ Tehnologije korištene

- [Next.js](https://nextjs.org/) – React framework za SSR i brzu izradu aplikacija
- [Tailwind CSS](https://tailwindcss.com/) – CSS framework za brzu i responzivnu izradu dizajna
- [shadcn/ui](https://ui.shadcn.com/) – Komponente za korisničko sučelje
- [Firebase](https://firebase.google.com/) – Baza podataka za spremanje favorita po korisniku
- [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps) – Autentifikacija korisnika putem GitHub računa
- [Vercel](https://vercel.com/) – Platforma za deploy aplikacije

## 🧩 Funkcionalnosti

- Pretraga i pregled serija, glumaca i epizoda
- Prikaz detalja za svaku seriju i glumca putem dinamičkih ruta
- Spremanje serija i glumaca u favorite po korisniku
- Favoriti se spremaju u **Firebase**, povezano s GitHub računom putem **OAuth prijave**
- Vlastite API rute za upravljanje favoritima
- Prilagođena **404 (Not Found)** stranica
- **Loading** komponente za bolje korisničko iskustvo tijekom učitavanja podataka
- Brzo, responzivno i pristupačno korisničko sučelje
- Visoke performanse (testirano s Lighthouse)

## 🛠️ Lokalno pokretanje aplikacije

```bash
git clone https://github.com/DelijaAnte/SvijetSerija.git
cd svijet-serija
npm install
npm run dev
```

📌 **Napomena**: Kreiraj `.env.local` datoteku i unesi sljedeće varijable:

```env
GITHUB_ID=Ov23lirLGVOGopXxGmNE
GITHUB_SECRET=da079459cd31e8f3a679fb781ad6ba4a9ac2a6d8
NEXTAUTH_SECRET=a1c0e2f3b4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Build & Deploy

Lokalni build:

```bash
npm run build
npm run start
```

Prijava putem GitHub-a možda neće raditi lokalno ako je Authorization callback URL postavljen na produkcijsku verziju – moguće je imati samo jednu aktivnu vrijednost u postavkama aplikacije.
