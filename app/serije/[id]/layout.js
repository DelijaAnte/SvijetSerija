export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Glavni sadržaj */}
      <main className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {children}
      </main>
    </div>
  );
}
