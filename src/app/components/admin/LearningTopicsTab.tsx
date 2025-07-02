"use client";

import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { LearningTopic } from "@/types/admin";
import { Pencil, Trash2, BookOpen, BookMarked, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LearningTopicsTab({
  topics,
  isLoading,
  page,
  setPage,
  totalPages,
  setIsAddTopicModalOpen,
  onEditTopicClick,
  onDeleteTopicClick,
}: {
  topics: LearningTopic[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  setIsAddTopicModalOpen: (open: boolean) => void;
  onEditTopicClick: (topic: LearningTopic) => void;
  onDeleteTopicClick: (topicId: string) => void;
}) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && topics.length === 0) {
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading, topics]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Learning Topics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage topics, quizzes, and stories
          </p>
        </div>
        <button
          onClick={() => setIsAddTopicModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          <span>Add Topic</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3.5 text-left font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3.5 text-left font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3.5 text-center font-medium text-gray-500 uppercase tracking-wider">
                Quizzes
              </th>
              <th className="px-5 py-3.5 text-center font-medium text-gray-500 uppercase tracking-wider">
                Stories
              </th>
              <th className="px-5 py-3.5 text-right font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-6 bg-gray-200 rounded w-6 mx-auto"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-6 bg-gray-200 rounded w-6 mx-auto"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : topics.length > 0 ? (
              topics.map((topic) => (
                <tr
                  key={topic._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                  onMouseEnter={() => setHoveredId(topic._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <td className="px-5 py-4 font-medium text-gray-900 max-w-[200px]">
                    <div className="truncate">{topic.title}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-700 max-w-[300px]">
                    <div className="truncate">
                      {topic.description || (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${topic.quizzesCount ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                      }`}>
                      {topic.quizzesCount ?? 0}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${topic.storiesCount ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      }`}>
                      {topic.storiesCount ?? 0}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        icon={<Pencil size={16} />}
                        label="Edit"
                        color="text-blue-600 hover:bg-blue-50"
                        onClick={() => onEditTopicClick(topic)}
                        isVisible={hoveredId === topic._id}
                      />
                      <ActionButton
                        icon={<BookOpen size={16} />}
                        label="Quizzes"
                        color="text-purple-600 hover:bg-purple-50"
                        onClick={() => router.push(`/dashboard/admin/topics/${topic._id}/quizzes`)}
                        isVisible={hoveredId === topic._id}
                      />
                      <ActionButton
                        icon={<BookMarked size={16} />}
                        label="Stories"
                        color="text-emerald-600 hover:bg-emerald-50"
                        onClick={() => router.push(`/dashboard/admin/topics/${topic._id}/stories`)}
                        isVisible={hoveredId === topic._id}
                      />
                      <ActionButton
                        icon={<Trash2 size={16} />}
                        label="Delete"
                        color="text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteTopicClick(topic._id)}
                        isVisible={hoveredId === topic._id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <BookMarked className="text-gray-400" size={28} />
                    </div>
                    <h3 className="text-gray-700 font-medium text-lg mb-2">
                      No learning topics found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Get started by creating your first learning topic
                    </p>
                    <button
                      onClick={() => setIsAddTopicModalOpen(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <Plus size={16} />
                      <span>Create Topic</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && topics.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalItems={topics.length}
          />
        </div>
      )}
    </div>
  );
}

const ActionButton = ({
  icon,
  label,
  color,
  onClick,
  isVisible
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
  isVisible: boolean;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      } ${color} group relative`}
    aria-label={label}
  >
    {icon}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {label}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
    </div>
  </button>
);