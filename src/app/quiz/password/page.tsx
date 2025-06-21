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
    // Password security quiz questions (easy difficulty)
    const quizQuestions: Question[] = [
        {
            id: 1,
            text: "What makes a strong password?",
            options: [
                "Using your pet's name",
                "A combination of letters, numbers, and symbols",
                "Your birthday with your name",
                "The word 'password' with numbers"
            ],
            correctAnswer: 1,
            explanation: "Strong passwords combine uppercase and lowercase letters, numbers, and special symbols to make them harder to guess."
        },
        {
            id: 2,
            text: "How often should you change your passwords?",
            options: [
                "Every week",
                "Every 3-6 months",
                "Once a year",
                "Only when you think it's been compromised"
            ],
            correctAnswer: 1,
            explanation: "Experts recommend changing passwords every 3-6 months for important accounts."
        },
        {
            id: 3,
            text: "What is a password manager?",
            options: [
                "A person who remembers passwords for you",
                "A secure app that stores and generates passwords",
                "A notebook where you write down passwords",
                "A feature that automatically shares your passwords"
            ],
            correctAnswer: 1,
            explanation: "Password managers are secure applications that store and generate strong passwords for all your accounts."
        },
        {
            id: 4,
            text: "Why shouldn't you use the same password for multiple accounts?",
            options: [
                "It's harder to remember",
                "If one account is hacked, all accounts are vulnerable",
                "Some websites don't allow it",
                "It makes your accounts sync together"
            ],
            correctAnswer: 1,
            explanation: "Using the same password everywhere means if one account is compromised, hackers can access all your accounts."
        },
        {
            id: 5,
            text: "What is two-factor authentication (2FA)?",
            options: [
                "Using two passwords instead of one",
                "An extra security step like a code sent to your phone",
                "Having two separate accounts",
                "A double verification of your password"
            ],
            correctAnswer: 1,
            explanation: "2FA adds an extra layer of security by requiring both your password and a temporary code or authentication method."
        },
        {
            id: 6,
            text: "Which of these is the weakest password?",
            options: [
                "Summer2023!",
                "Tr0ub4dor&3",
                "correct horse battery staple",
                "123456"
            ],
            correctAnswer: 3,
            explanation: "'123456' is extremely weak and commonly used, making it very easy to guess or crack."
        },
        {
            id: 7,
            text: "What should you do if a website you use has a data breach?",
            options: [
                "Nothing if your password is strong",
                "Change your password immediately",
                "Delete your account forever",
                "Wait for the website to notify you"
            ],
            correctAnswer: 1,
            explanation: "Always change your password immediately after a breach, and change it on any other sites where you used the same password."
        },
        {
            id: 8,
            text: "What is a passphrase?",
            options: [
                "A long sentence used as a password",
                "A hint to remember your password",
                "A temporary password",
                "A password that's all letters"
            ],
            correctAnswer: 0,
            explanation: "A passphrase is a long, memorable sentence that's harder to crack than traditional passwords."
        },
        {
            id: 9,
            text: "Where is the safest place to store your passwords?",
            options: [
                "In your web browser",
                "On a sticky note on your monitor",
                "In a password manager",
                "In a text file on your desktop"
            ],
            correctAnswer: 2,
            explanation: "Password managers provide the most secure way to store and manage your passwords."
        },
        {
            id: 10,
            text: "Why should you avoid using personal information in passwords?",
            options: [
                "It makes passwords too long",
                "This information is often easy to find online",
                "Websites don't allow personal information",
                "It confuses password managers"
            ],
            correctAnswer: 1,
            explanation: "Personal information like birthdays or names is often publicly available, making these passwords easier to guess."
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