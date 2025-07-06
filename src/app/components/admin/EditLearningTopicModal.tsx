"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { LearningTopic } from "@/types/admin";

export interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: LearningTopic | null;
  onEditTopic: (topic: {
    _id: string;
    title: string;
    description: string;
    titleInThai: string;
    descInThai: string;
  }) => void;
}

export const EditTopicModal = ({
  isOpen,
  onClose,
  topic,
  onEditTopic,
}: EditTopicModalProps) => {
  const [editedTopic, setEditedTopic] = useState({
    title: "",
    description: "",
    titleInThai: "",
    descInThai: "",
  });

  useEffect(() => {
    if (topic) {
      setEditedTopic({
        title: topic.title,
        description: topic.description,
        titleInThai: topic.titleInThai || "",
        descInThai: topic.descInThai || "",
      });
    }
  }, [topic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, titleInThai, descInThai } = editedTopic;

    if (
      !title.trim() ||
      !description.trim() ||
      !titleInThai.trim() ||
      !descInThai.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!topic) return;

    try {
      const res = await fetch(`/api/admin/topics/${topic._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTopic),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update topic");
        return;
      }

      toast.success("Topic updated successfully!");
      onEditTopic({ _id: topic._id, ...editedTopic });
      handleClose();
    } catch (error) {
      console.error("Error editing topic:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleClose = () => {
    setEditedTopic({
      title: "",
      description: "",
      titleInThai: "",
      descInThai: "",
    });
    onClose();
  };

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 bg-blue bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl drop-shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white flex justify-between items-center shadow-sm z-10">
          <h3 className="text-xl font-semibold text-gray-800">Edit Learning Topic</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title (EN) *
            </label>
            <input
              id="title"
              type="text"
              value={editedTopic.title}
              onChange={(e) =>
                setEditedTopic({ ...editedTopic, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic title in English"
              required
            />
          </div>

          <div>
            <label htmlFor="titleInThai" className="block text-sm font-medium text-gray-700 mb-2">
              Title (TH) *
            </label>
            <input
              id="titleInThai"
              type="text"
              value={editedTopic.titleInThai}
              onChange={(e) =>
                setEditedTopic({ ...editedTopic, titleInThai: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ใส่ชื่อหัวข้อเป็นภาษาไทย"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (EN) *
            </label>
            <textarea
              id="description"
              value={editedTopic.description}
              onChange={(e) =>
                setEditedTopic({ ...editedTopic, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic description in English"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="descInThai" className="block text-sm font-medium text-gray-700 mb-2">
              Description (TH) *
            </label>
            <textarea
              id="descInThai"
              value={editedTopic.descInThai}
              onChange={(e) =>
                setEditedTopic({ ...editedTopic, descInThai: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ใส่คำอธิบายหัวข้อเป็นภาษาไทย"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
