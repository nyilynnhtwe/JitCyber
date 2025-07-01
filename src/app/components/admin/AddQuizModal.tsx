"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function AddQuizModal({ setIsAddQuizModalOpen, topicId }: { setIsAddQuizModalOpen: (open: boolean) => void; topicId: string }) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!question || answers.some(a => !a) || !correctAnswer) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/topics/${topicId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answers,
          correctAnswer,
          info,
        }),
      });

      if (!res.ok) throw new Error("Failed to create quiz");

      toast.success("Quiz added successfully!");
      setIsAddQuizModalOpen(false);
      // You might want to refetch the quiz list here too
    } catch (error) {
      toast.error("Error adding quiz");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl px-8 py-6 space-y-6 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Create Quiz</h2>
          <button
            onClick={() => setIsAddQuizModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:outline-none"
              placeholder="Type your question..."
            />
          </div>

          {answers.map((answer, index) => (
            <div key={index}>
              <label className="block text-sm text-gray-700 font-medium mb-1">Answer {String.fromCharCode(65 + index)}</label>
              <input
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter answer ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select correct answer</option>
              {answers.map((_, index) => (
                <option key={index} value={answers[index]}>
                  Answer {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:outline-none"
              placeholder="Explain the correct answer..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddQuizModalOpen(false)}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
