// /dashboard/admin/topics/[topicId]/stories/[storyId]/edit
'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function EditStoryPage() {
  const router = useRouter();
  const { topicId, storyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
  });
  const [lessons, setLessons] = useState([{ content: "" }]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/admin/stories/${storyId}`);
        if (!res.ok) throw new Error("Failed to load story");
        const data = await res.json();
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          content: data.content || "",
        });
        setLessons(data.lessons || [{ content: "" }]);
      } catch (err) {
        toast.error("Error loading story");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (index: number, value: string) => {
    const newLessons = [...lessons];
    newLessons[index].content = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { content: "" }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      const newLessons = [...lessons];
      newLessons.splice(index, 1);
      setLessons(newLessons);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lessons })
      });
      
      if (!res.ok) throw new Error("Failed to update story");
      
      toast.success("Story updated successfully!");
      router.push(`/dashboard/admin/topics/${topicId}/stories`);
    } catch (err) {
      toast.error("Error updating story");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Edit Story
          </h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Story Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Story Content</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Lessons Learned</h2>
                <button
                  type="button"
                  onClick={addLesson}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                >
                  + Add Lesson
                </button>
              </div>
              
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <label className="text-gray-700 font-medium">Lesson {index + 1}</label>
                      </div>
                      <textarea
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(index, e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories`)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}