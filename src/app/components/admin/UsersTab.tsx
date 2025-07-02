import { useState } from "react";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { X, Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";

interface User {
  _id: string;
  idType: string;
  id: string;
  fullname: string;
  phone: string;
  createdAt: string;
  dob: string;
}

export default function UsersTab({
  users,
  setUsers,
  isLoading,
  page,
  setPage,
  totalPages,
  formatDate
}: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  formatDate: (date: string) => string;
}) {
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    idType: "thai",
    id: "",
    fullname: "",
    phone: "",
    dob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle edit user
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    // Validation logic remains the same...

    setIsSubmitting(false);
  };

  // Handle delete user
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);

    // Delete logic remains the same...

    setIsSubmitting(false);
  };

  // Handle add new user
  const handleAddUserChange = (field: keyof typeof newUser, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate new user data
      if (!newUser.id || !newUser.fullname || !newUser.phone || !newUser.dob) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const response = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add user");
      }

      toast.success("User added successfully");
      setUsers(prev => [data.user, ...prev]);
      setIsAddUserModalOpen(false);
      setNewUser({
        idType: "thai",
        id: "",
        fullname: "",
        phone: "",
        dob: "",
      });
    } catch (error) {
      console.error("Add user error:", error);
      toast.error("Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function
  const isValidDate = (dateStr: string) => !isNaN(Date.parse(dateStr));

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-800">Registered Users</h3>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <select
            className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All users</option>
            <option value="thai">Thai ID</option>
            <option value="passport">Passport</option>
          </select>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Table */}
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
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    <p className="mt-2 text-gray-500">Loading users...</p>
                  </div>
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
                    <div className="text-sm text-gray-700 font-mono">{user.id}</div>
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
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => handleEditClick(user)}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        onClick={() => openDeleteModal(user)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalItems={users.length}
      />

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedUser?.idType ?? ""}
                  onChange={(e) => handleInputChange("idType", e.target.value)}
                >
                  <option value="thai">Thai ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedUser?.id ?? ""}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  placeholder="ID Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedUser?.fullname ?? ""}
                  onChange={(e) => handleInputChange("fullname", e.target.value)}
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedUser?.phone ?? ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedUser?.dob ?? ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 gap-3">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
                <p className="font-medium text-red-800">{userToDelete.fullname}</p>
                <p className="text-red-700 text-sm">{userToDelete.idType === "thai" ? "Thai ID" : "Passport"}: {userToDelete.id}</p>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 gap-3">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={closeDeleteModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.fullname}
                  onChange={(e) => handleAddUserChange("fullname", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    ID Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUser.idType}
                    onChange={(e) => handleAddUserChange("idType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="thai">Thai ID</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.id}
                    onChange={(e) => handleAddUserChange("id", e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => handleAddUserChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newUser.dob}
                    onChange={(e) => handleAddUserChange("dob", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}