// components/SiteFooter.js
export default function SiteFooter() {
  return (
    <footer className="bg-stone-100 text-black py-3 text-center text-xs border-t border-stone-200">
      <div className="container mx-auto px-4">
        <p className="font-light">
          Podaci sa{" "}
          <a
            href="https://www.tvmaze.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline font-medium"
          >
            TVmaze API-ja
          </a>{" "}
          © {new Date().getFullYear()} - Sva prava pridržana
        </p>
      </div>
    </footer>
  );
}
