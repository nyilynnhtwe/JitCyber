"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react"; // Icons
import { Quiz } from "@/types/admin";

export default function TopicQuizzesPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!topicId) return;

    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/admin/topics/${topicId}/quizzes`);
        if (!res.ok) throw new Error("Failed to load quizzes");
        const data = await res.json();
        setQuizzes(data.quizzes);
      } catch (err) {
        toast.error("Error loading quizzes");
        console.error(err);
      } finally {
        setIsLoading(false);
      }


    };

    fetchQuizzes();
  }, [topicId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🧠 Quizzes for Topic: <span className="text-blue-600">{topicId}</span>
          </h1>
          <button
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes/add`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            + Add Quiz
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500">Loading quizzes...</p>
            </div>
          ) : quizzes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz, index) => (
                <li
                  key={quiz._id}
                  className="p-6 hover:bg-gray-50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {index + 1}. {quiz.question}
                      </h2>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">
                        {quiz.answers.map((ans, i) => (
                          <li
                            key={i}
                            className={i === quiz.correctAnswerIndex ? "text-green-600 font-medium" : ""}
                          >
                            {String.fromCharCode(65 + i)}. {ans}
                          </li>
                        ))}
                      </ul>
                      {quiz.info && (
                        <p className="mt-2 text-sm text-gray-500">
                          💡 {quiz.info}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                      <button
                        onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes/${quiz._id}/edit`)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => toast.info("Delete functionality not implemented yet")}
                        className="flex items-center text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No quizzes available for this topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
