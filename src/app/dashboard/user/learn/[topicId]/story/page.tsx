'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { Story } from "@/types/general";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/context/LocalContext";

export default function StoryViewer() {
  const { locale } = useLocale();
  const language = locale === 'en' ? 'en' : 'th';
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

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || isCompleting) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      return;
    }

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current!);
          goNext();
          return 0;
        }
        return prev + 1; // adjust speed as needed
      });
    }, 100); // controls speed, smaller = faster

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentIndex, isCompleting]);

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

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) goNext();
    else if (touchEnd - touchStart > 50) goPrevious();
  };

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`/api/admin/topics/${topicId}/stories`);
        const data = await response.json();
        const storyData: Story[] = data.stories || [];

        const transformed = storyData.map(s => ({
          title: s.title,
          subtitle: s.subtitle || "",
          content: s.content,
          lessons: s.lessons || [],
          imageUrl: s.imageUrl || "/chibi.svg",
        }));

        setStories(transformed);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) fetchStories();
  }, [topicId]);

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
      {isCompleting && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center animate-bounce-in">
            <div className="bg-green-100 rounded-full p-4 w-24 h-24 mx-auto mb-6">
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
        className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 relative"
        ref={storyContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full bg-gray-200 h-1.5 relative">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <button onClick={() => router.push("/dashboard/user/learn")} className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Learn
          </button>

          <div className="flex items-center">
            <button onClick={goPrevious} disabled={currentIndex === 0} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="mx-4 text-sm font-medium text-gray-500">
              {currentIndex + 1} / {stories.length}
            </div>
            <button onClick={goNext} disabled={currentIndex === stories.length - 1} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50">
            {isPlaying ? (
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Story Content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              {typeof currentStory?.title === 'string'
                ? currentStory.title
                : currentStory?.title?.[language]}
            </h1>
            {currentStory?.subtitle && (
              <p className="text-gray-600 text-lg font-light">
                {typeof currentStory.subtitle === 'string'
                  ? currentStory.subtitle
                  : currentStory?.subtitle?.[language]}
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="relative bg-indigo-50 rounded-xl p-6 shadow-inner">
              <p className="text-gray-700 text-lg leading-relaxed relative z-10 pl-6">
                {typeof currentStory?.content === 'string'
                  ? currentStory.content
                  : currentStory?.content?.[language]}
              </p>
            </div>
          </div>

          {/* Lessons */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStory?.lessons?.map((lesson, i) => (
                <div key={i}>
                  <p className="text-gray-700">
                    {typeof lesson.content === 'string'
                      ? lesson.content
                      : lesson.content?.[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <div className="flex justify-between max-w-2xl w-full">
          <button onClick={goPrevious} disabled={currentIndex === 0} className="px-5 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Previous
          </button>

          <button onClick={goNext} className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90 flex items-center">
            {currentIndex === stories.length - 1 ? "Finish Story" : "Next"}
            {currentIndex < stories.length - 1 && (
              <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 max-w-md mx-auto">
          <p>Tip: Use keyboard arrows ← → to navigate stories | Space to pause/resume</p>
          <p className="mt-1">Swipe left/right on mobile devices | Esc to exit</p>
        </div>
      </div>
    </div>
  );
}