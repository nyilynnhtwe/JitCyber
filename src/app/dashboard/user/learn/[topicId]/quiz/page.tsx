"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface QuizQuestion {
  _id: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  explanation: string;
  topicId: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { topicId } = useParams();
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const historyBlocked = useRef(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const pathname = usePathname();


  useEffect(() => {
    const started = userAnswers.some(answer => answer !== -1);
    setHasStarted(started);
  }, [userAnswers]);

  // Block browser navigation when quiz is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted && !showResult) {
        e.preventDefault();
        e.returnValue = 'You have unanswered questions. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted, showResult]);

  useEffect(() => {
    if (!hasStarted || showResult) return;

    const handleBeforeRouteChange = () => {
      const confirmLeave = window.confirm(
        'You have unanswered questions. Are you sure you want to leave? Your progress will be lost.'
      );

      if (!confirmLeave) {
        // Push current path again to cancel transition
        router.push(pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeRouteChange);
    };
  }, [hasStarted, showResult, pathname, router]);


  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch(`/api/admin/topics/${topicId}/quizzes`);
        const fetchedData = await response.json();
        const quizzData: QuizQuestion[] = fetchedData.quizzes;

        const transformedQuestions: Question[] = quizzData.map(q => ({
          id: q._id,
          text: q.question,
          options: q.answers,
          correctAnswer: q.correctAnswerIndex,
          explanation: q.explanation
        }));

        setQuizQuestions(transformedQuestions);
        // Initialize userAnswers array with -1 for each question
        setUserAnswers(new Array(transformedQuestions.length).fill(-1));
      } catch (error) {
        console.error("Failed to fetch quiz questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchQuizQuestions();
    }
  }, [topicId]);

  useEffect(() => {
    if (!hasStarted || showResult) return;

    const handlePopState = () => {
      if (!window.confirm('You have unanswered questions. Are you sure you want to leave? Your progress will be lost.')) {
        // Re-add current URL to history
        history.pushState(null, '', window.location.href);
      }
    };

    // Block history navigation
    if (!historyBlocked.current) {
      history.pushState(null, '', window.location.href);
      historyBlocked.current = true;
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasStarted, showResult]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    // Save the user's answer for this question
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Check if the selected option is correct and update score
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore); // update state early

    // Save answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);

      const updateScore = async () => {
        try {
          await fetch('/api/user/score', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session?.user?.id,
              topicId,
              score: newScore, // <-- use the updated score
            }),
          });
        } catch (error) {
          console.error("Failed to update user score:", error);
        }
      };

      updateScore();
    }
  };


  // NEW: Function to go back to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      // Restore the user's previous answer
      setSelectedOption(userAnswers[prevIndex]);
      setShowExplanation(userAnswers[prevIndex] !== -1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!loading && quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Quiz Available</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any questions for this topic. Please try another topic.
          </p>
          <Link
            href="/dashoboard/user/learn"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
          >
            Back to Learning
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Conditionally show back button only on first question */}
          {!showResult && currentQuestionIndex === 0 && !hasStarted && (
            <div className="mb-4">
              <Link
                href="/dashboard/user/learn"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Learning
              </Link>
            </div>
          )}

          {showResult ? (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                <p className="text-gray-600">You've answered all the questions</p>
              </div>

              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${(score / quizQuestions.length) * 251} 251`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {score}
                  </div>
                  <div className="text-gray-500 text-sm">out of {quizQuestions.length}</div>
                </div>
              </div>

              <div className="pt-2">
                {score === quizQuestions.length ? (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Perfect Score! Excellent work!
                  </div>
                ) : score >= quizQuestions.length * 0.7 ? (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Great Job! You did well!
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Good effort! Keep learning!
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Link
                  href="/dashboard/user/learn"
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Back to Learning
                </Link>
                <Link
                  href="/dashboard/user/leaderboard"
                  className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  View Leaderboard
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
                  <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-6 leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  let optionStyle = "bg-white border-gray-200 hover:border-blue-400 text-gray-800";
                  if (selectedOption !== null) {
                    if (index === currentQuestion.correctAnswer) {
                      optionStyle = "bg-green-50 border-green-400 text-green-800";
                    } else if (index === selectedOption && index !== currentQuestion.correctAnswer) {
                      optionStyle = "bg-red-50 border-red-400 text-red-800";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={userAnswers[currentQuestionIndex] !== -1 || (showExplanation && selectedOption !== index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle} ${selectedOption === index ? 'ring-2 ring-offset-2 ring-blue-400' : ''
                        }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
                  <p className="font-medium">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-between">
                {/* Previous button */}
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    Previous
                  </button>
                )}
                <div className="flex-grow"></div> {/* Spacer */}
                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;