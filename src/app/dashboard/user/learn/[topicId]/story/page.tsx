'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Story } from "@/types/general";
import { useParams, useRouter } from "next/navigation";

export default function StoryViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { topicId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentStory = stories[currentIndex];


  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsCompleting(true);
    }
  }, [currentIndex, stories.length]);

  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrevious();
      if (e.key === ' ') setIsPlaying(prev => !prev);
      if (e.key === 'Escape') router.push("/dashboard/user/learn");
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious, router]);

  // Touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goNext();
    } else if (touchEnd - touchStart > 50) {
      goPrevious();
    }
  };

  // Fetch stories
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch(`/api/admin/topics/${topicId}/stories`);
        const fetchedData = await response.json();
        const storyData: Story[] = fetchedData.stories;

        if (!storyData || storyData.length === 0) {
          console.error("No stories found for this topic.");
          return;
        }

        const transformedStories: Story[] = storyData.map(s => ({
          title: s.title,
          subtitle: s.subtitle || "",
          content: s.content,
          lessons: s.lessons,
          imageUrl: s.imageUrl || "/chibi.svg",
        }));

        setStories(transformedStories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchQuizQuestions();
    }
  }, [topicId]);

  // Reset auto-play when component unmounts
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Story Not Found</h2>
          <p className="text-gray-600 mt-2">
            We couldn't find any stories for this topic. Please try another one.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            onClick={() => router.push('/dashboard/user/learn')}
          >
            Explore Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center py-8 px-4">
      {/* Completion overlay */}
      {isCompleting && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center animate-bounce-in">
            <div className="bg-green-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
            <p className="text-gray-600 mb-6">You've completed all stories in this topic.</p>
            <button
              onClick={() => router.push("/dashboard/user/learn")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90 transition-all"
            >
              Back to Learning Dashboard
            </button>
          </div>
        </div>
      )}

      <div
        className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl relative z-10"
        ref={storyContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1.5 relative">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header with navigation */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-indigo-100">
          <button
            onClick={() => router.push("/dashboard/user/learn")}
            className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Learn
          </button>

          <div className="flex items-center">
            <button
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="mx-4 text-sm font-medium text-gray-500">
              {currentIndex + 1} <span className="text-gray-400">/</span> {stories.length}
            </div>
            <button
              onClick={goNext}
              disabled={currentIndex === stories.length - 1}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Story Content */}
        <div className="p-6">
          {/* Story title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              {currentStory.title}
            </h1>
            {currentStory.subtitle && (
              <p className="text-gray-600 text-lg font-light">{currentStory.subtitle}</p>
            )}
          </div>

          {/* Story image */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-8 group">
            {currentStory.imageUrl ? (
              <Image
                src={currentStory.imageUrl}
                alt="Story Illustration"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
                <div className="text-gray-400">No Image Available</div>
              </div>
            )}

            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-purple-400 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-purple-400 rounded-br-xl"></div>
          </div>

          {/* Story content */}
          <div className="mb-8">
            <div className="relative bg-indigo-50 rounded-xl p-6 shadow-inner">
              <div className="absolute top-3 left-3 text-indigo-200 text-5xl font-serif">“</div>
              <p className="text-gray-700 text-lg leading-relaxed relative z-10 pl-6">
                {currentStory.content}
              </p>
              <div className="absolute bottom-3 right-3 text-indigo-200 text-5xl font-serif transform rotate-180">“</div>
            </div>
          </div>

          {/* Lessons learned */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Key Lessons</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStory.lessons.map((lesson, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex"
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-700 font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{lesson.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation footer */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-indigo-100">
          <div className="flex justify-between">
            <button
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="px-5 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={goNext}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90 transition-all flex items-center"
            >
              {currentIndex === stories.length - 1 ? "Finish Story" : "Next"}
              {currentIndex < stories.length - 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tips for user */}
      <div className="mt-6 text-center text-sm text-gray-500 max-w-md">
        <p>Tip: Use keyboard arrows ← → to navigate stories | Space to pause/resume</p>
        <p className="mt-1">Swipe left/right on mobile devices | Esc to exit</p>
      </div>
    </div>
  );
}