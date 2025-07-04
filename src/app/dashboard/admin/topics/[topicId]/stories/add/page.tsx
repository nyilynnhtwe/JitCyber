"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, ChevronLeft, Loader2 } from "lucide-react";

type Lesson = {
  content: string;
};

export default function AddStoryPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([{ content: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLessonChange = (index: number, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index].content = value;
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { content: "" }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length === 1) {
      toast.info("At least one lesson is required");
      return;
    }
    const updatedLessons = lessons.filter((_, i) => i !== index);
    setLessons(updatedLessons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and Description are required.");
      return;
    }

    if (lessons.some((lesson) => !lesson.content.trim())) {
      toast.error("All lessons must have content.");
      return;
    }

    const storyData = {
      title,
      description,
      lessons,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/topics/${topicId}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to add story.");
        return;
      }

      toast.success("Story added successfully!");
      router.push(`/dashboard/admin/topics/${topicId}/stories`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 ml-4">
          Add New Story
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Story Card */}
        <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Story Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Story Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Enter story title"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Story Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Brief overview of the story"
                required
              />
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Story Lessons
            </h2>
            <button
              type="button"
              onClick={addLesson}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <PlusCircle size={18} className="mr-1.5" />
              Add Lesson
            </button>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-700">
                    Lesson {index + 1} <span className="text-red-500">*</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition-colors"
                    disabled={lessons.length === 1}
                    title="Remove lesson"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-4">
                  <textarea
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(index, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="Write the lesson content here..."
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              "Add Story"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}