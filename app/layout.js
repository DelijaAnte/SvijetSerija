import "./globals.css";

export const metadata = {
  title: "SvijetSerija",
  description: "A simple Next.js app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Globalni header */}
        <header className="bg-yellow-400 text-black py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">SvijetSerija</h1>
          </div>
        </header>
        {/* Glavni sadržaj stranice */}
        <main>{children}</main>
      </body>
    </html>
  );
}
