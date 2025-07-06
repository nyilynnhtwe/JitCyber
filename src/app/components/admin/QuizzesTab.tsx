import { Quiz } from "@/types/admin";
import Pagination from "./Pagination";

export default function QuizzesTab({ 
  quizzes, 
  isLoading,
  page,
  setPage,
  totalPages,
  setIsAddQuizModalOpen
}: { 
  quizzes: Quiz[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  setIsAddQuizModalOpen: (open: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Quiz Management</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          onClick={() => setIsAddQuizModalOpen(true)}
        >
          Add Quiz
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Explanation</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="mt-2 text-gray-500">Loading quizzes...</p>
                </td>
              </tr>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[120px] truncate">
                    {quiz._id}
                  </td>
                  
                  {/* Question - Bilingual */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {quiz.question.th}
                    </div>
                    {quiz.question.en && (
                      <div className="text-sm text-gray-600 mt-1">
                        {quiz.question.en}
                      </div>
                    )}
                  </td>
                  
                  {/* Answers - Bilingual */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {quiz.answers.map((ans, i) => (
                        <div key={i} className="flex items-start">
                          <span className="font-medium mr-1 text-gray-700">
                            {String.fromCharCode(65 + i)}:
                          </span>
                          <div>
                            {ans.th && <div className="text-sm">{ans.th}</div>}
                            {ans.en && <div className="text-xs text-gray-500">{ans.en}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  {/* Correct Answer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 font-medium mr-2">
                        {String.fromCharCode(65 + quiz.correctAnswerIndex)}
                      </span>
                      <div>
                        {quiz.answers[quiz.correctAnswerIndex]?.th && (
                          <div className="text-sm text-green-700 font-medium">
                            {quiz.answers[quiz.correctAnswerIndex].th}
                          </div>
                        )}
                        {quiz.answers[quiz.correctAnswerIndex]?.en && (
                          <div className="text-xs text-green-600">
                            {quiz.answers[quiz.correctAnswerIndex].en}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Explanation - Bilingual */}
                  <td className="px-6 py-4 max-w-[200px]">
                    {quiz.explanation.th ? (
                      <div className="text-sm text-gray-700">
                        {quiz.explanation.th}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No TH explanation</div>
                    )}
                    {quiz.explanation.en && (
                      <div className="text-xs text-gray-500 mt-1">
                        {quiz.explanation.en}
                      </div>
                    )}
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
                  No quizzes found
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
        totalItems={quizzes.length}
      />
    </div>
  );
}