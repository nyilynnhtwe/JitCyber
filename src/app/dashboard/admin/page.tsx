"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Search,
  Bell,
  Menu
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ADMIN_ID } from "@/app/constants";

interface User {
  _id: string;
  idType: string;
  id: string;
  fullname: string;
  phone: string;
  createdAt: string;
  dob: string;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page]);


  const handleLogout = () => {
    signOut();
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session?.user?.id !== ADMIN_ID) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-700">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex-col">
        <div className="p-5 flex items-center space-x-3 border-b border-blue-700">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-xl font-bold">JitCyber Admin</h1>
        </div>

        <nav className="flex-1 py-4">
          <button
            className={`flex items-center w-full px-6 py-3 text-left ${activeTab === "dashboard"
              ? "bg-blue-700 border-l-4 border-cyan-400"
              : "hover:bg-blue-700"
              }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 text-left ${activeTab === "users"
              ? "bg-blue-700 border-l-4 border-cyan-400"
              : "hover:bg-blue-700"
              }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-5 h-5 mr-3" />
            User Management
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 text-left ${activeTab === "settings"
              ? "bg-blue-700 border-l-4 border-cyan-400"
              : "hover:bg-blue-700"
              }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button
            className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-700 rounded"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                className="p-1 mr-4 text-gray-600 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab.replace(/-/g, " ")}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md">
            <div className="grid grid-cols-4 gap-1 p-2">
              <button
                className={`flex flex-col items-center p-3 rounded ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                  }`}
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-xs mt-1">Dashboard</span>
              </button>

              <button
                className={`flex flex-col items-center p-3 rounded ${activeTab === "users" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                  }`}
                onClick={() => {
                  setActiveTab("users");
                  setMobileMenuOpen(false);
                }}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs mt-1">Users</span>
              </button>

              <button
                className={`flex flex-col items-center p-3 rounded ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                  }`}
                onClick={() => {
                  setActiveTab("settings");
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <div className="text-gray-500 text-sm mb-1">Total Users</div>
                <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                <div className="text-green-500 text-xs mt-2 flex items-center">
                  <span>↑ 12% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <div className="text-gray-500 text-sm mb-1">System Status</div>
                <div className="text-3xl font-bold text-green-600">Normal</div>
                <div className="text-gray-500 text-xs mt-2">All systems operational</div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">Registered Users</h3>
                <div className="flex space-x-3">
                  <select className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option>All users</option>
                    <option>Thai ID</option>
                    <option>Passport</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DOB
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                          <p className="mt-2 text-gray-500">Loading users...</p>
                        </td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.idType === "thai" ? "Thai ID" : "Passport"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{user.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(user.dob)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of{" "}
                  <span className="font-medium">{users.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;