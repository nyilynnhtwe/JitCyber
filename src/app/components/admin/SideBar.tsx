import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow min-h-screen hidden md:flex flex-col">
      {/* Logo + Platform name */}
      <div className="p-6 flex items-center gap-3 justify-center border-b border-gray-200">
        <Image
          src="/chibi.svg" // Ensure this exists in your public folder
          alt="Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl font-semibold text-gray-800">JitCyber Admin</span>
      </div>

      {/* Navigation */}
      <div className="p-4 mt-4 space-y-2">
        <Link href="/dashboard/admin" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
        <Link href="/dashboard/admin/users" className="block p-2 rounded hover:bg-gray-100">Users</Link>
        <Link href="/dashboard/admin/topics" className="block p-2 rounded hover:bg-gray-100">Topics</Link>
      </div>
    </aside>
  );
}
