"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-black leading-tight">
          Turn Your Loan Into a Better Deal
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-light">
          Cutting your interest rate up to <span className="text-blue-600 font-medium">50%</span>
        </p>
        <div className="pt-8">
          <button
            onClick={() => router.push("/form")}
            className="bg-blue-600 text-white px-12 py-4 text-lg font-medium hover:bg-blue-700 transition-colors duration-200 rounded-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
