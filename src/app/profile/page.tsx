"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, UserCircle, Phone, CalendarDays, BadgeInfo } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/unauthorized");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Prevent render while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-slate-200">
        <div className="text-center mb-6">
          <UserCircle className="mx-auto h-16 w-16 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-slate-800">
            Hello, {session?.user?.fullname || "User"} 👋
          </h1>
          <p className="text-sm text-slate-500">Profile Overview</p>
        </div>

        <div className="space-y-4 text-slate-700">
          <div className="flex items-center gap-3">
            <BadgeInfo className="w-5 h-5 text-blue-500" />
            <p>
              <span className="font-semibold">User ID:</span> {session?.user?.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UserCircle className="w-5 h-5 text-blue-500" />
            <p>
              <span className="font-semibold">Full Name:</span> {session?.user?.fullname}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <p>
              <span className="font-semibold">Phone:</span> {session?.user?.phone}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <p>
              <span className="font-semibold">Date of Birth:</span> {session?.user?.dob || "N/A"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-8 w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-rose-600 hover:to-red-700 transition-all shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
