import { useState } from "react";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import {X} from "lucide-react";
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

    if (!selectedUser.id || !selectedUser.fullname || !selectedUser.phone || !selectedUser.dob) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const isValidDate = (dateStr: string) => !isNaN(Date.parse(dateStr));
    if (!isValidDate(selectedUser.dob)) {
      toast.error("Invalid date of birth.");
      return;
    }

    try {
      const response = await fetch("/api/admin/users/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update user.");
        return;
      }

      toast.success("User updated successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser!.id ? { ...user, ...selectedUser! } : user
        )
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An unexpected error occurred.");
    }
  };



  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteClick = (user: User) => {
    openDeleteModal(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userToDelete.id }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Delete failed");

      toast.success("User deleted successfully");

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

      closeDeleteModal();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user.");
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Registered Users</h3>
        <div className="flex space-x-3">
          <select
            className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All users</option>
            <option value="thai">Thai ID</option>
            <option value="passport">Passport</option>
          </select>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
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
                <td colSpan={7} className="px-6 py-8 text-center">
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
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>


                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </button>


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

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalItems={users.length}
      />
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="space-y-4">
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

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg text-gray-800"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 px-4 py-2 rounded-lg text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete <strong>{userToDelete.fullname}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg text-gray-800"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded-lg text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            {/* Header with title and close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form body */}
            <form className="px-6 py-5 space-y-5">
              <div>
                <label className="block mb-1 text-gray-700 font-medium" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium" htmlFor="idType">
                  ID Type
                </label>
                <input
                  id="idType"
                  type="text"
                  placeholder="Passport, NRC, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium" htmlFor="idNumber">
                  ID Number
                </label>
                <input
                  id="idNumber"
                  type="text"
                  placeholder="Enter ID number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}