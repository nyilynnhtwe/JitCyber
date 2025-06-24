"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 text-xl font-semibold">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          Welcome, {session?.user?.id} 👋
        </h1>
        <div className="space-y-4 text-slate-700">
          <p>
            <span className="font-semibold text-slate-800">Name:</span> {session?.user?.fullName}
          </p>
          <p>
            <span className="font-semibold text-slate-800">Phone:</span> {session?.user?.phone}
          </p>
        </div>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
          className="mt-6 w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-rose-600 hover:to-red-700 transition-all shadow-md"
        >
          Sign Out
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

