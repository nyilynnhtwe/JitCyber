"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusCircle, X, CheckCircle, BookOpen, ChevronLeft } from "lucide-react";

export default function EditQuizPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const quizId = params.quizId as string;
  const router = useRouter();

  // Updated states for bilingual content
  const [question, setQuestion] = useState({ th: "", en: "" });
  const [answers, setAnswers] = useState<{ th: string; en: string }[]>([
    { th: "", en: "" },
    { th: "", en: "" },
    { th: "", en: "" },
    { th: "", en: "" }
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState({ th: "", en: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/admin/topics/${topicId}/quizzes/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();
        
        // Set bilingual data from API
        setQuestion(data.question || { th: "", en: "" });
        setAnswers(data.answers || [
          { th: "", en: "" },
          { th: "", en: "" },
          { th: "", en: "" },
          { th: "", en: "" }
        ]);
        setCorrectAnswerIndex(data.correctAnswerIndex ?? 0);
        setExplanation(data.explanation || { th: "", en: "" });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topicId, quizId]);

  const handleAnswerChange = (index: number, lang: 'th' | 'en', value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [lang]: value };
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one language exists for question
    if (!question.th.trim() && !question.en.trim()) {
      toast.error("Please enter the question in at least one language.");
      return;
    }

    // Validate answers - each must have at least one language
    if (answers.some(a => !a.th.trim() && !a.en.trim())) {
      toast.error("All answer fields must have content in at least one language.");
      return;
    }

    const updatedQuiz = {
      question,
      answers,
      correctAnswerIndex,
      explanation,
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/topics/${topicId}/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedQuiz),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update quiz.");
        return;
      }

      toast.success("Quiz updated successfully!");
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
      setAnswers([...answers, { th: "", en: "" }]);
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
      setCorrectAnswerIndex(0);
    } else if (correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-gray-600">Loading quiz data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 my-6">
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Quiz</h1>
          <p className="text-gray-600 mt-1">Update the question and answers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Quiz Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Question - Bilingual */}
          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-700">
              Question <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 font-normal ml-2">(At least one language required)</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">THAI</span>
                </div>
                <textarea
                  value={question.th}
                  onChange={(e) => setQuestion({...question, th: e.target.value})}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  placeholder="คำถาม (Thai)..."
                />
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">ENGLISH</span>
                </div>
                <textarea
                  value={question.en}
                  onChange={(e) => setQuestion({...question, en: e.target.value})}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Question (English)..."
                />
              </div>
            </div>
          </div>

          {/* Answer Options - Bilingual */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-medium text-gray-700">
                Answer Options <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 font-normal ml-2">(At least one language per answer)</span>
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
            
            <div className="space-y-6">
              {answers.map((answer, i) => (
                <div key={i} className="flex flex-col gap-3 group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
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
                      <div className="flex flex-col gap-2">
                        <div className="flex">
                          <span className="bg-gray-100 text-gray-800 font-medium rounded-l-lg border border-r-0 border-gray-300 px-3 py-2">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <input
                            type="text"
                            value={answer.th}
                            onChange={(e) => handleAnswerChange(i, 'th', e.target.value)}
                            placeholder={`ตัวเลือก ${i + 1} (ไทย)...`}
                            className="flex-1 min-w-0 rounded-r-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                        
                        <div className="flex">
                          <span className="bg-gray-100 text-gray-800 font-medium rounded-l-lg border border-r-0 border-gray-300 px-3 py-2 opacity-60">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <input
                            type="text"
                            value={answer.en}
                            onChange={(e) => handleAnswerChange(i, 'en', e.target.value)}
                            placeholder={`Option ${i + 1} (English)...`}
                            className="flex-1 min-w-0 rounded-r-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {answers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(i)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 self-start mt-1"
                        title="Remove answer"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 ml-9">
                    <CheckCircle size={14} className="mr-1.5 text-green-500" />
                    <span>Click the radio button to mark the correct answer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation - Bilingual */}
          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-700">
              Explanation (Optional)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">THAI</span>
                </div>
                <textarea
                  value={explanation.th}
                  onChange={(e) => setExplanation({...explanation, th: e.target.value})}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  placeholder="คำอธิบาย (ไทย)..."
                />
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">ENGLISH</span>
                </div>
                <textarea
                  value={explanation.en}
                  onChange={(e) => setExplanation({...explanation, en: e.target.value})}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Explanation (English)..."
                />
              </div>
            </div>
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
                "Update Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}