"use client";

import { useState, useEffect } from "react";
import LearningTopicsTab from "@/app/components/admin/LearningTopicsTab";
import { AddTopicModal } from "@/app/components/admin/AddLearningTopicModal";
import { LearningTopic } from "@/types/admin";

export default function TopicsPage() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

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

  return (
    <>
      <LearningTopicsTab
        topics={topics}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setIsAddTopicModalOpen={setIsAddTopicModalOpen}
      />

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        onAddTopic={handleAddTopic}
      />
    </>
  );
}
