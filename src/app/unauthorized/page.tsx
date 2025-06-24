"use client";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-10 text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6 shadow-inner">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-2 text-lg">
            You don't have permission to view this page.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            This section is restricted to authorized administrators only.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-5 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Think this is a mistake? Reach us at{" "}
            <a
              href="mailto:support@jitcyber.com"
              className="text-blue-600 font-medium hover:underline"
            >
              support@jitcyber.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
