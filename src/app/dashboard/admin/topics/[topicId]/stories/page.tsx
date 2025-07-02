"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";

type Lesson = {
  _id: string;
  title?: string;
  content?: string;
};

type Story = {
  _id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export default function AdminStoriesPage() {
  const router = useRouter();
  const { topicId } = useParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/admin/stories");
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

    fetchStories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📖 Stories</h1>
          <button
            onClick={() => router.push(`/dashboard/admin/topics/${topicId}/stories/add`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            + Add Story
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500">Loading stories...</p>
            </div>
          ) : stories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stories.map((story, index) => (
                <li
                  key={story._id}
                  className="p-6 hover:bg-gray-50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {index + 1}. {story.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {story.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        📚 {story.lessons?.length || 0} lessons
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/admin/stories/${story._id}/edit`)
                        }
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => toast.info("Delete functionality not implemented yet")}
                        className="flex items-center text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No stories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
