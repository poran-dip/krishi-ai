import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="text-center space-y-4">
        <Image src="/logo.svg" alt="KrishiAI Logo" width={80} height={80} className="w-20 mx-auto" priority />
        <h1 className="text-3xl font-bold text-gray-800">KrishiAI</h1>
        <p className="text-gray-600">AI-powered farming decisions, simplified</p>
      </div>

      <Link href="/dashboard">
        <button className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold shadow-md transition-all">
          Get Started →
        </button>
      </Link>

      <p className="mt-4 text-sm text-gray-500">
        Helping farmers make smarter crop choices.
      </p>
    </div>
  );
}
