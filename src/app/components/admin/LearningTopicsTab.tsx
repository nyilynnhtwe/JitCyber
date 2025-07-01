"use client";

import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { LearningTopic } from "@/types/admin";


export default function LearningTopicsTab({
  topics,
  isLoading,
  page,
  setPage,
  totalPages,
  setIsAddTopicModalOpen,
}: {
  topics: LearningTopic[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  setIsAddTopicModalOpen: (open: boolean) => void;
}) {
  const router = useRouter();


  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Learning Topics</h3>
        <button
          onClick={() => setIsAddTopicModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Topic
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quizzes</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stories</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                  </div>
                  <p className="mt-2">Loading topics...</p>
                </td>
              </tr>
            ) : topics.length > 0 ? (
              topics.map((topic) => (
                <tr key={topic._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{topic.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{topic.description}</td>
                  <td className="px-6 py-4 text-center text-sm text-blue-600 font-semibold">
                    {topic.quizzesCount}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">
                    {topic.storiesCount}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => router.push(`dashboard/admin/topics/${topic._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-purple-600 hover:underline text-sm"
                      onClick={() => router.push(`/dashboard/admin/topics/${topic._id}/quizzes`)}
                    >
                      Manage Quizzes
                    </button>
                    <button
                      className="text-emerald-600 hover:underline text-sm"
                      onClick={() => router.push(`dashboard/admin/topics/${topic._id}/stories`)}
                    >
                      Manage Stories
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No learning topics found.
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
        totalItems={topics.length}
      />
    </div>
  );
}
