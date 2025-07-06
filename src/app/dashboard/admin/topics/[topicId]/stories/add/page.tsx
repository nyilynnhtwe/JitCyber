// // /dashboard/admin/topics/[topicId]/stories/add
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import { Lesson } from "@/types/general";



export default function AddStoryPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");  // NEW
  const [content, setContent] = useState("");    // renamed from 'description'

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

    if (!title.trim() || !content.trim()) {
      toast.error("Title and Description are required.");
      return;
    }

    if (lessons.some((lesson) => !lesson.content.trim())) {
      toast.error("All lessons must have content.");
      return;
    }

    const storyData = {
      title,
      subtitle,
      content,
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
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
          Back to stories
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to create a new story</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Story Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Story Information</h2>
            <p className="text-gray-500 text-sm mt-1">Basic details about your story</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Story Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Enter a compelling title"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Story Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Short subtitle or context like 'Facebook Hijack Incident'"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Story Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Write the full story here..."
                required
              />
            </div>

          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Story Lessons</h2>
              <p className="text-gray-500 text-sm mt-1">Add content for each lesson</p>
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Lesson
            </button>
          </div>

          <div className="p-6 space-y-8">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">
                    Lesson {index + 1} <span className="text-red-500">*</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className={`text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors ${lessons.length === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={lessons.length === 1}
                    title={lessons.length === 1 ? "Cannot remove the only lesson" : "Remove lesson"}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <textarea
                  value={lesson.content}
                  onChange={(e) => handleLessonChange(index, e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Write the lesson content here..."
                  required
                />
                <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                  {lesson.content.length}/2000 characters
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Creating Story...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Story
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}