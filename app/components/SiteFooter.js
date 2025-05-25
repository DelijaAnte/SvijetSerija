/**
 * Footer komponenta prikazuje informacije o izvoru podataka (TVmaze API),
 * godinu, te link na GitHub profil. Prilagođena je da bude pri dnu stranice.
 */
export default function Footer() {
  return (
    <footer className="bg-stone-100 text-black py-3 text-center text-xs border-t border-stone-200 w-full mt-auto relative">
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
      <a
        href="https://github.com/DelijaAnte"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 bottom-3 text-black hover:text-stone-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
    </footer>
  );
}
