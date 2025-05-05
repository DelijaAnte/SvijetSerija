import "./globals.css";
import Link from "next/link";
import BackButton from "./components/BackButton";

export const metadata = {
  title: "Svijet Serija - Najbolje serije na jednom mjestu",
  description:
    "Pronađite informacije o najboljim serijama i njihovim detaljima.",
  keywords: "serije, TV serije, najbolje serije, informacije o serijama",
  author: "Ante Delija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Globalni header */}
        <header className="bg-yellow-400 text-black py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Svijet Serija</h1>
            {/* Navigacija */}
            <nav>
              <ul className="flex space-x-4 items-center">
                <li>
                  <Link href="/" className="hover:underline">
                    Početna
                  </Link>
                </li>
                <li>
                  <BackButton />
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Glavni sadržaj stranice */}
        <main>{children}</main>
      </body>
    </html>
  );
}
