import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 text-center">
      {/* Logo & branding */}
      <div className="space-y-4">
        <Image src="/logo.svg" alt="KrishiAI Logo" width={80} height={80} className="mx-auto" priority />
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500">
          Oops! Looks like the page you were looking for doesn’t exist.
        </p>
      </div>

      {/* Back to dashboard button */}
      <Link href="/dashboard">
        <button className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold shadow-md transition-all">
          <span className="text-lg mr-2">←</span> Go Back Home
        </button>
      </Link>

      {/* Footer tagline */}
      <p className="mt-4 text-sm text-gray-500">
        AI-powered farming decisions, simplified.
      </p>
    </div>
  );
}
