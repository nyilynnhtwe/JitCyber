"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import { Lesson } from "@/types/general";

export default function AddStoryPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState({ en: "", th: "" });
  const [subtitle, setSubtitle] = useState({ en: "", th: "" });
  const [content, setContent] = useState({ en: "", th: "" });
  const [lessons, setLessons] = useState<Lesson[]>([{ content: { en: "", th: "" } }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const hasContent = useCallback(() => {
    return (
      title.en.trim() || title.th.trim() ||
      subtitle.en.trim() || subtitle.th.trim() ||
      content.en.trim() || content.th.trim() ||
      lessons.some(l => l.content.en.trim() || l.content.th.trim())
    );
  }, [title, subtitle, content, lessons]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasContent()) {
        localStorage.setItem(`storyDraft_${topicId}`, JSON.stringify({
          title, subtitle, content, lessons
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [title, subtitle, content, lessons, topicId, hasContent]);

  useEffect(() => {
    const draft = localStorage.getItem(`storyDraft_${topicId}`);
    if (draft) {
      const { title, subtitle, content, lessons } = JSON.parse(draft);
      setTitle(title);
      setSubtitle(subtitle);
      setContent(content);
      setLessons(lessons);
    }
  }, [topicId]);



  const handleLessonChange = (index: number, lang: keyof Lesson['content'], value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index].content[lang] = value;
    setLessons(updatedLessons);
    clearError(`lesson-${index}-${lang}`);
  };

  const addLesson = () => {
    setLessons([...lessons, { content: { en: "", th: "" } }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length === 1) {
      toast.info("At least one lesson is required");
      return;
    }
    const updatedLessons = lessons.filter((_, i) => i !== index);
    setLessons(updatedLessons);
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, boolean> = {};

    if (!title.en.trim()) {
      newErrors['title-en'] = true;
      isValid = false;
    }
    if (!title.th.trim()) {
      newErrors['title-th'] = true;
      isValid = false;
    }
    if (!content.en.trim()) {
      newErrors['content-en'] = true;
      isValid = false;
    }
    if (!content.th.trim()) {
      newErrors['content-th'] = true;
      isValid = false;
    }

    lessons.forEach((lesson, index) => {
      if (!lesson.content.en.trim()) {
        newErrors[`lesson-${index}-en`] = true;
        isValid = false;
      }
      if (!lesson.content.th.trim()) {
        newErrors[`lesson-${index}-th`] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
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

      // Clear draft on success
      localStorage.removeItem(`storyDraft_${topicId}`);

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
      {/* Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => {
            if (hasContent()) {
              if (confirm('You have unsaved changes. Leave without saving?')) {
                router.push(`/dashboard/admin/topics/${topicId}/stories`);
              }
            } else {
              router.push(`/dashboard/admin/topics/${topicId}/stories`);
            }
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
          Back to stories
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to create a new story</p>

        {hasContent() && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
            <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-blue-800 text-sm">
              Your progress is auto-saved locally. Unsaved changes will be restored if you return.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Story Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Story Information</h2>
            <p className="text-gray-500 text-sm mt-1">Basic details about your story</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Story Title <span className="text-red-500">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">English</label>
                  <input
                    value={title.en}
                    onChange={(e) => {
                      setTitle({ ...title, en: e.target.value });
                      clearError('title-en');
                    }}
                    placeholder="Enter a compelling title"
                    className={`w-full px-4 py-3 border rounded-lg ${errors['title-en'] ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {errors['title-en'] && (
                    <p className="text-red-500 text-xs mt-1">Title is required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                  <input
                    value={title.th}
                    onChange={(e) => {
                      setTitle({ ...title, th: e.target.value });
                      clearError('title-th');
                    }}
                    placeholder="กรอกชื่อเรื่อง"
                    className={`w-full px-4 py-3 border rounded-lg ${errors['title-th'] ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {errors['title-th'] && (
                    <p className="text-red-500 text-xs mt-1">Title is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Subtitle</label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">English</label>
                  <input
                    value={subtitle.en}
                    onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })}
                    placeholder="e.g. Facebook Hijack Incident"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                  <input
                    value={subtitle.th}
                    onChange={(e) => setSubtitle({ ...subtitle, th: e.target.value })}
                    placeholder="เช่น เหตุการณ์แฮกบัญชี Facebook"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Full Story Content <span className="text-red-500">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">English</label>
                  <textarea
                    value={content.en}
                    onChange={(e) => {
                      setContent({ ...content, en: e.target.value });
                      clearError('content-en');
                    }}
                    placeholder="Write the full story here..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg ${errors['content-en'] ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {errors['content-en'] && (
                    <p className="text-red-500 text-xs mt-1">Content is required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                  <textarea
                    value={content.th}
                    onChange={(e) => {
                      setContent({ ...content, th: e.target.value });
                      clearError('content-th');
                    }}
                    placeholder="เขียนเนื้อหาเรื่องราวที่นี่..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg ${errors['content-th'] ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {errors['content-th'] && (
                    <p className="text-red-500 text-xs mt-1">Content is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Story Lessons</h2>
              <p className="text-gray-500 text-sm mt-1">Add content for each lesson in both languages</p>
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
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    Lesson {index + 1}
                    <span className="ml-2 text-xs font-normal bg-gray-200 rounded-full px-2 py-0.5">
                      {index === 0 && "First"}
                      {index === lessons.length - 1 && "Last"}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className={`text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors ${lessons.length === 1 ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    disabled={lessons.length === 1}
                    aria-label="Remove lesson"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">English <span className="text-red-500">*</span></label>
                    <textarea
                      value={lesson.content.en}
                      onChange={(e) => handleLessonChange(index, "en", e.target.value)}
                      placeholder="Write lesson content in English..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg ${errors[`lesson-${index}-en`] ? 'border-red-500 bg-red-50' : ''}`}
                      required
                    />
                    <div className="flex justify-between mt-1">
                      {errors[`lesson-${index}-en`] && (
                        <p className="text-red-500 text-xs">Content is required</p>
                      )}
                      <div className="text-right text-xs text-gray-500">
                        {lesson.content.en.length}/2000 characters
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Thai <span className="text-red-500">*</span></label>
                    <textarea
                      value={lesson.content.th}
                      onChange={(e) => handleLessonChange(index, "th", e.target.value)}
                      placeholder="เขียนเนื้อหาบทเรียนภาษาไทย..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg ${errors[`lesson-${index}-th`] ? 'border-red-500 bg-red-50' : ''}`}
                      required
                    />
                    <div className="flex justify-between mt-1">
                      {errors[`lesson-${index}-th`] && (
                        <p className="text-red-500 text-xs">Content is required</p>
                      )}
                      <div className="text-right text-xs text-gray-500">
                        {lesson.content.th.length}/2000 characters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (hasContent()) {
                if (confirm('You have unsaved changes. Discard draft?')) {
                  localStorage.removeItem(`storyDraft_${topicId}`);
                  router.push(`/dashboard/admin/topics/${topicId}/stories`);
                }
              } else {
                router.push(`/dashboard/admin/topics/${topicId}/stories`);
              }
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition flex items-center justify-center disabled:opacity-75"
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