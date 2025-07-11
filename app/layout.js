/**
 * Root layout komponenta koja definira osnovnu strukturu aplikacije.
 * Sadrži globalne meta podatke, providers, header, main content i footer.
 * Ovo je glavni template koji se primjenjuje na sve stranice u aplikaciji.
 */
import "./globals.css";
import Link from "next/link";
import BackButton from "./components/BackButton";
import { Toaster } from "@/components/ui/sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Search from "./components/Search";
import Providers from "./providers";
import AuthButton from "./components/AuthButton";
import SiteFooter from "./components/SiteFooter";
import ScrollToTop from "./components/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Svijet Serija - Najbolje serije na jednom mjestu",
  description:
    "Pronađite informacije o najboljim serijama i njihovim detaljima.",
  keywords: "serije, TV serije, najbolje serije, informacije o serijama",
  icons: {
    icon: "/favicon.ico",
  },
  author: "Ante Delija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <header className="bg-yellow-400 text-black py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link href="/" className="hover:underline">
                <h1 className="text-2xl font-bold">Svijet Serija</h1>
              </Link>
              <nav>
                <ul className="flex space-x-4 items-center">
                  <li>
                    <Search />
                  </li>
                  <li>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="hover:underline">Favoriti</button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white shadow-md rounded p-0 w-auto">
                        <ul className="space-y-0">
                          <li>
                            <Link
                              href="/favorites"
                              className="text-yellow-400 hover:underline block text-sm px-4 py-2"
                            >
                              Serije
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/favorites/glumci"
                              className="text-yellow-400 hover:underline block text-sm px-4 py-2"
                            >
                              Glumci
                            </Link>
                          </li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </li>
                  <li>
                    <AuthButton />
                  </li>
                  <li>
                    <BackButton />
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <Toaster />
          <main className="flex-grow">{children}</main>
          <ScrollToTop />
          <SiteFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
