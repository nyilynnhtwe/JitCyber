"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Quiz {
  question: string;
  answers: string[];
  correctAnswer: string;
  info?: string;
}

// interface AddQuizModalProps 

const AddQuizModal = ({ isOpen, onClose, onAddQuiz }: {
  isOpen: boolean;
  onClose: () => void;
  onAddQuiz: (quiz: Omit<Quiz, "_id">) => void;
}) => {
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: "",
    info: ""
  });

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...newQuiz.answers];
    newAnswers[index] = value;
    setNewQuiz({ ...newQuiz, answers: newAnswers });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !newQuiz.question.trim() ||
      newQuiz.answers.some(a => !a.trim()) ||
      !newQuiz.correctAnswer
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onAddQuiz(newQuiz);
    handleClose();
  };

  const handleClose = () => {
    setNewQuiz({
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: "",
      info: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl drop-shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white flex justify-between items-center shadow-sm z-10">
          <h3 className="text-xl font-semibold text-gray-800">Add New Quiz</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={newQuiz.question}
              onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter your question here"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answers *
            </label>
            <div className="space-y-3">
              {newQuiz.answers.map((answer, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-2.5 mr-3 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-800">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <select
              value={newQuiz.correctAnswer}
              onChange={(e) => setNewQuiz({ ...newQuiz, correctAnswer: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select correct answer</option>
              {newQuiz.answers.map((_, index) => (
                <option key={index} value={index}>
                  {String.fromCharCode(65 + index)}: {newQuiz.answers[index] || `Option ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <input
              type="text"
              value={newQuiz.info}
              onChange={(e) => setNewQuiz({ ...newQuiz, info: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Explanation or reference link"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;