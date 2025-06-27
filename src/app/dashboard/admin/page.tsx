"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { ADMIN_ID } from "@/app/constants";
import AddQuizModal from "./quiz/page";
import Sidebar from "@/app/components/admin/SideBar";
import Topbar from "@/app/components/admin/TopBar";
import MobileMenu from "@/app/components/admin/MobileMenu";
import DashboardTab from "@/app/components/admin/DashboardTab";
import UsersTab from "@/app/components/admin/UsersTab";
import QuizzesTab from "@/app/components/admin/QuizzesTab";
import UnauthorizedPage from "@/app/unauthorized/page";
import { fetchQuizzes } from "@/lib/utils";

interface User {
  _id: string;
  idType: string;
  id: string;
  fullname: string;
  phone: string;
  createdAt: string;
  dob: string;
}

interface Quiz {
  _id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  info?: string;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
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



  useEffect(() => {
    fetchQuizzes(setQuizzes, setIsLoading, page, limit);
  }, [page]);

  const handleAddNewQuiz = async (quizData: Omit<Quiz, "_id">) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quizData)
      });

      if (res.ok) {
        fetchQuizzes(setQuizzes, setIsLoading, page, limit);
      } else {
        console.error("Failed to add quiz");
      }
    } catch (err) {
      console.error("Error adding quiz:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
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
      <UnauthorizedPage />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          activeTab={activeTab}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {mobileMenuOpen && (
          <MobileMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        )}

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === "dashboard" && <DashboardTab numOfUsers={users.length} />}

          {activeTab === "users" && (
            <UsersTab
              users={users}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              formatDate={formatDate}
            />
          )}

          {activeTab === "quizzes" && (
            <QuizzesTab
              quizzes={quizzes}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              setIsAddQuizModalOpen={setIsAddQuizModalOpen}
            />
          )}
        </div>
      </div>

      {isAddQuizModalOpen && (
        <AddQuizModal
          isOpen={isAddQuizModalOpen}
          onClose={() => setIsAddQuizModalOpen(false)}
          onAddQuiz={handleAddNewQuiz}
        />
      )}
    </div>
  );
};

export default AdminDashboard;