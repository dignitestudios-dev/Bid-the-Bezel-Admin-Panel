"use client";

import { Logo } from "@/components/logo";
import GridShape from "@/components/grid-shape";
import { PublicRoute } from "@/components/PublicRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="flex h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          {children}
        </div>

        {/* Right side - Brand */}
        <div className="lg:w-1/2 w-full h-full bg-linear-to-br from-gray-900 to-gray-300   lg:grid items-center hidden">
          <div className="relative flex items-center justify-center z-10">
            {/* Optional background */}
            {/* <GridShape /> */}

            <div className="flex flex-col items-center max-w-xs">
              <Logo size={100} className="mb-4" />
              <h1 className="text-white text-4xl font-semibold">
                Bid The Bezel
              </h1>

              <p className="text-gray-400 mt-2 text-lg">Admin Panel</p>

              <p className="text-center text-white mt-2 text-sm">
                Manage auctions, users, and listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
