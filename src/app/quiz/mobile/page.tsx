"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

const QuizPage = () => {
    // Mobile security quiz questions (easy difficulty)
    const quizQuestions: Question[] = [
        {
            id: 1,
            text: "What should you do when you receive an app update notification?",
            options: [
                "Update immediately through the official app store",
                "Click any update link you receive",
                "Ignore all updates to save data",
                "Only update when your phone stops working"
            ],
            correctAnswer: 0,
            explanation: "Always update apps through official app stores as updates often contain important security fixes."
        },
        {
            id: 2,
            text: "What's the safest way to connect to public Wi-Fi?",
            options: [
                "Use it for all activities including banking",
                "Avoid accessing sensitive accounts",
                "Never use public Wi-Fi at all",
                "Ask the café staff for their password"
            ],
            correctAnswer: 1,
            explanation: "Public Wi-Fi networks can be insecure. Avoid accessing bank accounts or entering passwords on public networks."
        },
        {
            id: 3,
            text: "What should you do with old phones you no longer use?",
            options: [
                "Throw them in the trash",
                "Sell or donate without wiping data",
                "Perform a factory reset before disposing",
                "Keep them forever in a drawer"
            ],
            correctAnswer: 2,
            explanation: "Always perform a factory reset to erase all personal data before disposing of or giving away old devices."
        },
        {
            id: 4,
            text: "Why should you review app permissions?",
            options: [
                "To see which apps can access your contacts or location",
                "It's required by law",
                "To make your phone faster",
                "Only developers need to check permissions"
            ],
            correctAnswer: 0,
            explanation: "Reviewing permissions helps you understand what data apps can access and prevent unnecessary sharing of personal information."
        },
        {
            id: 5,
            text: "What's the best way to lock your smartphone?",
            options: [
                "Don't lock it for convenience",
                "Use a simple swipe pattern",
                "Use biometrics (fingerprint/face) or a strong PIN",
                "Write your password on the back of the phone"
            ],
            correctAnswer: 2,
            explanation: "Biometric authentication or a strong PIN provides the best security for your mobile device."
        }
    ];

    // State management
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        // Update score if correct
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setShowResult(true);
        }
    };


    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    {showResult ? (
                        <div className="text-center space-y-6">
                            {/* Trophy icon and completion message */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                                <p className="text-gray-600">You've answered all the questions</p>
                            </div>

                            {/* Score display with circular progress */}
                            <div className="relative w-40 h-40 mx-auto">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        className="text-gray-200"
                                        strokeWidth="8"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    {/* Progress circle */}
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

                            {/* Performance message based on score */}
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

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                                <Link
                                    href="../learn"
                                    className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Back to Learning
                                </Link>
                                <Link
                                    href="../leaderboard"
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
                                            disabled={showExplanation && selectedOption !== index}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle} ${
                                                selectedOption === index ? 'ring-2 ring-offset-2 ring-blue-400' : ''
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

                            <div className="flex justify-end">
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