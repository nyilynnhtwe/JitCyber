"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Trash2, PlusCircle, Loader2 } from "lucide-react";

export default function EditStoryPage() {
  const router = useRouter();
  const { topicId, storyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: { en: "", th: "" },
    subtitle: { en: "", th: "" },
    content: { en: "", th: "" }
  });

  const [lessons, setLessons] = useState([{
    content: { en: "", th: "" }
  }]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges) {
        localStorage.setItem(`storyDraft_${topicId}_${storyId}`, JSON.stringify({
          formData, lessons
        }));
        toast.info("Draft auto-saved");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, lessons, hasChanges, topicId, storyId]);

  // Load story data
  useEffect(() => {
    const loadStory = async () => {
      try {
        // Check for draft first
        const draft = localStorage.getItem(`storyDraft_${topicId}_${storyId}`);

        if (draft) {
          const { formData: draftData, lessons: draftLessons } = JSON.parse(draft);
          setFormData(draftData);
          setLessons(draftLessons);
          setHasChanges(true);
          toast.info("Loaded unsaved draft");
        } else {
          // Fetch from server if no draft
          const res = await fetch(`/api/admin/stories/${storyId}`);
          if (!res.ok) throw new Error("Failed to load story");

          const data = await res.json();
          setFormData({
            title: data.title || { en: "", th: "" },
            subtitle: data.subtitle || { en: "", th: "" },
            content: data.content || { en: "", th: "" }
          });
          setLessons(data.lessons || [{ content: { en: "", th: "" } }]);
        }
      } catch (err) {
        toast.error("Error loading story");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (storyId) loadStory();
  }, [storyId, topicId]);

  const handleFormChange = (field: string, lang: 'en' | 'th', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof formData], [lang]: value }
    }));
    setHasChanges(true);
    clearError(`${field}-${lang}`);
  };

  const handleLessonChange = (index: number, lang: 'en' | 'th', value: string) => {
    const newLessons = [...lessons];
    newLessons[index].content[lang] = value;
    setLessons(newLessons);
    setHasChanges(true);
    clearError(`lesson-${index}-${lang}`);
  };

  const addLesson = () => {
    setLessons([...lessons, { content: { en: "", th: "" } }]);
    setHasChanges(true);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      const newLessons = [...lessons];
      newLessons.splice(index, 1);
      setLessons(newLessons);
      setHasChanges(true);
    }
  };



  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, boolean> = {};

    // Validate title
    if (!formData.title.en.trim()) {
      newErrors['title-en'] = true;
      isValid = false;
    }
    if (!formData.title.th.trim()) {
      newErrors['title-th'] = true;
      isValid = false;
    }

    // Validate content
    if (!formData.content.en.trim()) {
      newErrors['content-en'] = true;
      isValid = false;
    }
    if (!formData.content.th.trim()) {
      newErrors['content-th'] = true;
      isValid = false;
    }

    // Validate lessons
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

    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lessons })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update story");
      }

      // Clear draft on success
      localStorage.removeItem(`storyDraft_${topicId}_${storyId}`);

      toast.success("Story updated successfully!");
      router.push(`/dashboard/admin/topics/${topicId}/stories`);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error updating story");
        console.error(err);
      } else {
        toast.error("An unknown error occurred");
        console.error(err);
      }
    }
    finally {
      setIsSaving(false);
      setHasChanges(false);
    }
  };

  const confirmNavigation = () => {
    if (!hasChanges) return true;

    return confirm(
      "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">Loading story details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => {
              if (confirmNavigation()) {
                router.push(`/dashboard/admin/topics/${topicId}/stories`);
              }
            }}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-0.5" />
            Back to Stories
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Edit Story
          </h1>

          {hasChanges && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Unsaved changes
            </div>
          )}
        </div>

        {hasChanges && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-700 text-sm">
              Your changes are auto-saved locally every 30 seconds. Don't worry about losing progress.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-indigo-100">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Story Information */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Story Information</h2>
                <p className="text-gray-500 text-sm mt-1">Basic details about your story</p>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">English</label>
                      <input
                        value={formData.title.en}
                        onChange={(e) => handleFormChange("title", "en", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg ${errors['title-en'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Story title in English"
                        required
                      />
                      {errors['title-en'] && (
                        <p className="text-red-500 text-xs mt-1">Title is required</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                      <input
                        value={formData.title.th}
                        onChange={(e) => handleFormChange("title", "th", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg ${errors['title-th'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="ชื่อเรื่องภาษาไทย"
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
                  <label className="block font-medium text-gray-700 mb-2">Subtitle</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">English</label>
                      <input
                        value={formData.subtitle.en}
                        onChange={(e) => handleFormChange("subtitle", "en", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="Subtitle in English"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                      <input
                        value={formData.subtitle.th}
                        onChange={(e) => handleFormChange("subtitle", "th", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="คำบรรยายภาษาไทย"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">English</label>
                      <textarea
                        value={formData.content.en}
                        onChange={(e) => handleFormChange("content", "en", e.target.value)}
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-lg ${errors['content-en'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Story content in English"
                        required
                      />
                      {errors['content-en'] && (
                        <p className="text-red-500 text-xs mt-1">Content is required</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Thai</label>
                      <textarea
                        value={formData.content.th}
                        onChange={(e) => handleFormChange("content", "th", e.target.value)}
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-lg ${errors['content-th'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="เนื้อหาเรื่องภาษาไทย"
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
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Story Lessons</h2>
                  <p className="text-gray-500 text-sm mt-1">Key takeaways from the story</p>
                </div>
                <button
                  type="button"
                  onClick={addLesson}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                  Add Lesson
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {lessons.map((lesson, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700 flex items-center">
                        Lesson {index + 1}
                        <span className="ml-2 text-xs font-normal bg-gray-200 rounded-full px-2 py-0.5">
                          {index === 0 && "First"}
                          {index === lessons.length - 1 && "Last"}
                        </span>
                      </h3>
                      {lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(index)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Remove lesson"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                          English <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={lesson.content.en}
                          onChange={(e) => handleLessonChange(index, "en", e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg ${errors[`lesson-${index}-en`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Lesson in English"
                          required
                        />
                        {errors[`lesson-${index}-en`] && (
                          <p className="text-red-500 text-xs mt-1">Lesson content is required</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                          Thai <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={lesson.content.th}
                          onChange={(e) => handleLessonChange(index, "th", e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg ${errors[`lesson-${index}-th`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="บทเรียนภาษาไทย"
                          required
                        />
                        {errors[`lesson-${index}-th`] && (
                          <p className="text-red-500 text-xs mt-1">Lesson content is required</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Discard all changes and clear draft?")) {
                    localStorage.removeItem(`storyDraft_${topicId}_${storyId}`);
                    router.push(`/dashboard/admin/topics/${topicId}/stories`);
                  }
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(`storyDraft_${topicId}_${storyId}`);
                    setHasChanges(false);
                    toast.success("Draft cleared");
                  }}
                  className="px-6 py-3 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                  disabled={!hasChanges}
                >
                  Clear Draft
                </button>

                <button
                  type="submit"
                  disabled={isSaving || !hasChanges}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}