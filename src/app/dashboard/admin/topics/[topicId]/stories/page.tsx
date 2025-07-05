'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, BookOpen, ArrowLeft } from "lucide-react";
import { Story } from "@/types/general";

export default function AdminStoriesPage() {
  const router = useRouter();
  const { topicId } = useParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/admin/topics/${topicId}/stories`);
        if (!res.ok) throw new Error("Failed to load stories");
        const data = await res.json();
        setStories(data.stories || []);
      } catch (err) {
        toast.error("Error loading stories");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (topicId) {
      fetchStories();
    }
  }, [topicId]);

  const openDeleteModal = (story: Story) => {
    setStoryToDelete(story);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setStoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!storyToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/stories/${storyToDelete._id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Failed to delete story");

      toast.success("Story deleted successfully!");
      setStories(stories.filter(story => story._id !== storyToDelete._id));
      closeDeleteModal();
    } catch (err) {
      toast.error("Error deleting story");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/dashboard/admin/topics")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Topics
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
              Manage Stories
            </h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage your learning stories</p>
          </div>

          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Stories in Topic</h2>
              <p className="text-gray-600 text-sm mt-1">
                {stories.length} {stories.length === 1 ? "story" : "stories"} available
              </p>
            </div>

            <button
              onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories/add`)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Story
            </button>
          </div>
        </div>

        {/* Stories List */}
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg">Loading stories...</p>
            </div>
          ) : stories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stories.map((story, index) => (
                <li
                  key={story._id}
                  className="p-6 hover:bg-indigo-50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {story.title}
                          </h2>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {story.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mt-4">
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
                          {story.lessons?.length || 0} lessons
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories/${story._id}/edit`)}
                        className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(story)}
                        className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mt-4">No stories found</h3>
              <p className="text-gray-500 mt-2 mb-6">Get started by adding your first story</p>
              <button
                onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories/add`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" /> Create First Story
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && storyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Delete Story?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{storyToDelete.title}</span>? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Story"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}