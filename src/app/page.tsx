// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to Data Alchemist</h1>
      <p className="text-lg text-center mb-6 max-w-md">
        Transform messy spreadsheets into organized, validated data with AI-powered tools. Upload your files, create rules, and set priorities with ease.
      </p>
      <Link
        href="/dashboard"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}