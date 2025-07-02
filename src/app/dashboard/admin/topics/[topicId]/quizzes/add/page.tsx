"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusCircle, X, CheckCircle, BookOpen, ChevronLeft } from "lucide-react";

export default function AddQuizPage() {
  const params = useParams();
  const topicId = params.topicId;
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | 0>(0);
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    
    // Auto-select the answer if it's the only one with content
    if (value.trim() && newAnswers.filter(a => a.trim()).length === 1) {
      setCorrectAnswerIndex(index);
    }
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

    if (correctAnswerIndex === null) {
      toast.error("Please select the correct answer.");
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

  const addAnotherAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, ""]);
    } else {
      toast.info("Maximum of 6 answers allowed");
    }
  };

  const removeAnswer = (index: number) => {
    if (answers.length <= 2) {
      toast.info("At least 2 answers are required");
      return;
    }
    
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
    
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(0); // Reset to first answer if the correct one is removed
    } else if (correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 my-6">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes`)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Quizzes
        </button>
        
        <div className="flex items-start gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
            <BookOpen size={24} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Quiz</h1>
            <p className="text-gray-600 mt-1">Add questions and answers to test knowledge</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Quiz Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Question */}
          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-700">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              placeholder="Write the quiz question here..."
              required
            />
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-medium text-gray-700">
                Answer Options <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addAnotherAnswer}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <PlusCircle size={16} className="mr-1" />
                Add Answer
              </button>
            </div>
            
            <div className="space-y-4">
              {answers.map((answer, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="flex items-center h-full pt-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswerIndex === i}
                      onChange={() => setCorrectAnswerIndex(i)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex">
                      <span className="bg-gray-100 text-gray-800 font-medium rounded-l-lg border border-r-0 border-gray-300 px-3 py-2">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleAnswerChange(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 min-w-0 rounded-r-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        required
                      />
                    </div>
                  </div>
                  
                  {answers.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeAnswer(i)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove answer"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <CheckCircle size={16} className="mr-1.5 text-green-500" />
              <span>Click the radio button to mark the correct answer</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-700">
              Explanation (Optional)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              placeholder="Add explanation or learning note here..."
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be shown to users after they answer the question
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.push(`/dashboard/admin/topics/${topicId}/quizzes`)}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-md transition flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Create Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}