"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddQuizPage() {
  const params = useParams();
  const topicId = params.topicId;
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | "">("");
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter the question.");
      return;
    }

    if (answers.some((a) => !a.trim())) {
      toast.error("All answer fields are required.");
      return;
    }

    if (correctAnswerIndex === "") {
      toast.error("Select the correct answer.");
      return;
    }

    const newQuiz = {
      question,
      answers,
      correctAnswerIndex: Number(correctAnswerIndex),
      explanation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/topics/${topicId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add quiz.");
        return;
      }

      toast.success("Quiz added successfully!");
      router.push(`/dashboard/admin/topics/${topicId}/quizzes`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 my-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🧠 Add New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Question *</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write the quiz question here..."
            required
          />
        </div>

        {/* Answer Options */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Answer Options *</label>
          <div className="space-y-4">
            {answers.map((answer, i) => (
              <input
                key={i}
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            ))}
          </div>

        </div>

        {/* Correct Answer Selector */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Correct Answer *</label>
          <select
            value={correctAnswerIndex}
            onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select the correct answer</option>
            {answers.map((answer, i) => (
              <option key={i} value={i}>
                {String.fromCharCode(65 + i)}: {answer || `Option ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* Explanation */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Explanation (Optional)</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Add explanation or learning note here..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes`)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all"
          >
            {isSubmitting ? "Saving..." : "Add Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
