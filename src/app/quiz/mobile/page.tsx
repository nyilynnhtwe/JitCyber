"use client";

import { useState } from 'react';

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
        setShowExplanation(false);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        // Update score if correct
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }

        setShowExplanation(true);

        setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setShowExplanation(false);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setShowExplanation(false);
    };

    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    {showResult ? (
                        <div className="text-center space-y-6">
                            <h1 className="text-3xl font-bold text-gray-900">Quiz Completed!</h1>
                            <div className="text-4xl font-bold text-blue-600">
                                {score} <span className="text-gray-500">/ {quizQuestions.length}</span>
                            </div>
                            <div className="text-xl text-gray-600">
                                ({Math.round((score / quizQuestions.length) * 100)}%)
                            </div>
                            <button
                                onClick={handleRestart}
                                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Take Quiz Again
                            </button>
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
                                            disabled={showExplanation}
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