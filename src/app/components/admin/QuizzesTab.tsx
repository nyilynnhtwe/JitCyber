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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{quiz.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quiz.answers?.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {quiz.correctAnswer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.info || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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