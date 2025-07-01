"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { LearningTopic } from "@/types/admin";



export interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topic: Omit<LearningTopic, "_id" | "quizzesCount" | "storiesCount">) => void;
}

export const AddTopicModal = ({ isOpen, onClose, onAddTopic }: AddTopicModalProps) => {
  const [newTopic, setNewTopic] = useState({
    title: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTopic.title.trim() || !newTopic.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onAddTopic(newTopic);
    toast.success("Topic added successfully!");
    handleClose();
  };

  const handleClose = () => {
    setNewTopic({ title: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl drop-shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white flex justify-between items-center shadow-sm z-10">
          <h3 className="text-xl font-semibold text-gray-800">Add New Learning Topic</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic title"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={newTopic.description}
              onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic description"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
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
              Add Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
