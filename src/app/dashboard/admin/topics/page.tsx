"use client";

import { useState, useEffect } from "react";
import LearningTopicsTab from "@/app/components/admin/LearningTopicsTab";
import { AddTopicModal } from "@/app/components/admin/AddLearningTopicModal";
import { LearningTopic } from "@/types/admin";
import { EditTopicModal } from "@/app/components/admin/EditLearningTopicModal";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/components/admin/ConfirmModal";

export default function TopicsPage() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<LearningTopic | null>(null);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);


  const limit = 10;

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/topics?page=${page}&limit=${limit}`);
        const data = await res.json();
        setTopics(data.topics);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (e) {
        console.error("Error fetching topics:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, [page]);



  const handleAddTopic = async (newTopic: { title: string; description: string }) => {
    try {
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTopic),
      });

      if (!res.ok) throw new Error("Failed to create topic");

      const saved = await res.json();
      setTopics((prev) => [saved.topic, ...prev]); // Prepend the new topic
    } catch (error) {
      console.error("Add topic failed:", error);
    }
  };

  const handleEditTopic = async (updated: { _id: string; title: string; description: string }) => {
    try {
      const res = await fetch(`/api/admin/topics/${updated._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updated.title, description: updated.description }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedTopic = await res.json();

      setTopics((prev) =>
        prev.map((t) => (t._id === updatedTopic.topic._id ? updatedTopic.topic : t))
      );
    } catch (error) {
      console.error("Edit topic failed:", error);
    }
  };

  const handleDeleteTopic = async () => {
    if (!deleteTopicId) return;
    try {
      const res = await fetch(`/api/admin/topics/${deleteTopicId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete topic");

      setTopics((prev) => prev.filter((t) => t._id !== deleteTopicId));
      toast.success("Topic deleted successfully");
    } catch (error) {
      console.error("Delete topic failed:", error);
      toast.error("Failed to delete topic.");
    } finally {
      setDeleteTopicId(null);
    }
  };

  return (
    <>
      <LearningTopicsTab
        topics={topics}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setIsAddTopicModalOpen={setIsAddTopicModalOpen}
        onEditTopicClick={setEditingTopic}
        onDeleteTopicClick={(id) => setDeleteTopicId(id)}

      />

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        onAddTopic={handleAddTopic}
      />

      <EditTopicModal
        isOpen={!!editingTopic}
        onClose={() => setEditingTopic(null)}
        topic={editingTopic}
        onEditTopic={handleEditTopic}
      />

      <ConfirmModal
        isOpen={!!deleteTopicId}
        onClose={() => setDeleteTopicId(null)}
        onConfirm={handleDeleteTopic}
        title="Delete this topic?"
        message="This will permanently remove the topic and its related data."
        confirmText="Delete"
      />

    </>
  );
}
