"use client";
import DashboardTab from "@/app/components/admin/DashboardTab";
import { useState, useEffect } from "react";

export default function AdminHomePage() {
  const [numOfUsers, setNumOfUsers] = useState(0);

  useEffect(() => {
    async function fetchUsersCount() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setNumOfUsers(data.totalCount || data.users.length || 0);
      } catch (e) {
        console.error(e);
      }
    }
    fetchUsersCount();
  }, []);

  return <DashboardTab numOfUsers={numOfUsers} />;
}
