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
import AuthButton from "./components/AuthButton"; // <--- import

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
    <html lang="en">
      <body>
        <Providers>
          <header className="bg-yellow-400 text-black py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link href="/" className="hover:underline">
                <h1 className="text-2xl font-bold">Svijet Serija</h1>
              </Link>
              <nav>
                <ul className="flex space-x-4 items-center">
                  <li>
                    <Link href="/" className="hover:underline">
                      Početna
                    </Link>
                  </li>
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
                    <BackButton />
                  </li>
                  <li>
                    <AuthButton /> {/* <--- dodan auth gumb */}
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <Toaster />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
