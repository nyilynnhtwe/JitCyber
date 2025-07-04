"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, PlusCircle, BookOpen, ChevronLeft } from "lucide-react";
import { Quiz } from "@/types/admin";

export default function TopicQuizzesPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topicName, setTopicName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!topicId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const topicRes = await fetch(`/api/admin/topics/${topicId}`);
        if (!topicRes.ok) throw new Error("Failed to load topic details");
        const topicData = await topicRes.json();
        setTopicName(topicData.topic.title);

        // Fetch quizzes
        const quizzesRes = await fetch(`/api/admin/topics/${topicId}/quizzes`);
        if (!quizzesRes.ok) throw new Error("Failed to load quizzes");
        const quizzesData = await quizzesRes.json();
        setQuizzes(quizzesData.quizzes);
      } catch (err) {
        toast.error("Error loading data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/dashboard/admin/topics`)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft size={18} className="mr-1" />
            Back to Topics
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen size={24} className="mr-2 text-blue-600" />
                {topicName || "Topic Quizzes"}
              </h1>
              <div className="mt-2 flex items-center text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                  Topic ID: {topicId}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes/add`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow flex items-center"
            >
              <PlusCircle size={18} className="mr-1.5" />
              Add Quiz
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500">Loading quizzes...</p>
            </div>
          ) : quizzes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz, index) => (
                <li
                  key={quiz._id}
                  className="p-6 hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {quiz.question}
                          </h2>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {quiz.answers.map((ans, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-xl border ${i === quiz.correctAnswerIndex
                                  ? "border-green-500 bg-green-50 shadow-sm"
                                  : "border-gray-200 bg-gray-50"
                                  }`}
                              >
                                <div className="flex items-start">
                                  <span className={`font-bold mr-2 ${i === quiz.correctAnswerIndex ? "text-green-700" : "text-gray-700"}`}>
                                    {String.fromCharCode(65 + i)}.
                                  </span>
                                  <span>{ans}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {quiz.explanation && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                              <p className="text-sm text-blue-700 flex items-start">
                                <span className="mr-2">💡</span>
                                {quiz.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-end gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes/${quiz._id}/edit`)}
                        className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this quiz?")) {
                            toast.info("Delete functionality not implemented yet");
                          }
                        }}
                        className="flex items-center text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-12 h-12 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No quizzes found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Get started by adding quizzes to this topic.
              </p>
              <button
                onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes/add`)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium shadow flex items-center mx-auto"
              >
                <PlusCircle size={18} className="mr-1.5" />
                Create First Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}