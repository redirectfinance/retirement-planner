// app/share/page.tsx
import Link from "next/link";
import { Metadata } from "next";

type SharePageProps = {
  searchParams: Promise<{
    years?: string;
    wealth?: string;
    currency?: string;
  }>;
};

export const metadata: Metadata = {
  title: "My Freedom Timeline",
};

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;

  const years = params.years ? parseFloat(params.years) : NaN;
  const wealth = params.wealth ? parseFloat(params.wealth) : NaN;
  const currency = params.currency || "₱";

  if (isNaN(years) || isNaN(wealth)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Invalid share link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">🔓 My Freedom Timeline</h1>

        <p>
          I will escape the Rat Race in{" "}
          <span className="text-emerald-400 font-semibold">
            {years.toFixed(2)} years
          </span>.
        </p>


        <p className="text-sm text-gray-400">
        Built using{" "}
        <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition underline"
        >
            Escape the Rat Race 💰
        </a>
        </p>

      </div>
    </div>
  );
}