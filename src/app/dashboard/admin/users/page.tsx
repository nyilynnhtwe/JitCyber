"use client";

import UsersTab from "@/app/components/admin/UsersTab";
import { User } from "@/types/user";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        console.error("Failed to fetch users:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [page]);

  return (
    <UsersTab
      formatDate={date => new Date(date).toLocaleDateString()}
      users={users}
      setUsers={setUsers}
      isLoading={isLoading}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
    />
  );
}
