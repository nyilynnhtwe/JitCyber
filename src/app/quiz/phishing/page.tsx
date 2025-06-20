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
    // Phishing quiz questions (medium difficulty)
    const quizQuestions: Question[] = [
        {
            id: 1,
            text: "You receive an email claiming to be from your bank asking you to click a link to verify your account. What should you do?",
            options: [
                "Click the link and log in to verify your account",
                "Forward the email to your bank's fraud department",
                "Reply to the email with your account details",
                "Call the phone number provided in the email"
            ],
            correctAnswer: 1,
            explanation: "Legitimate banks never ask for verification via email links. Always forward suspicious emails to your bank's fraud department."
        },
        {
            id: 2,
            text: "What's a common sign of a phishing website?",
            options: [
                "The URL contains the company's name",
                "The website has a valid SSL certificate",
                "The URL has subtle misspellings (like 'paypai' instead of 'paypal')",
                "The website loads quickly"
            ],
            correctAnswer: 2,
            explanation: "Phishers often use URLs with subtle misspellings to mimic legitimate sites while hosting their fraudulent pages."
        },
        {
            id: 3,
            text: "You get a text message saying you've won a prize with a link to claim it. You didn't enter any contest. What's this likely to be?",
            options: [
                "A legitimate surprise prize",
                "A smishing (SMS phishing) attempt",
                "A wrong number message",
                "A delayed contest notification"
            ],
            correctAnswer: 1,
            explanation: "This is smishing - SMS phishing. Never click links in unexpected prize notifications."
        },
        {
            id: 4,
            text: "What should you do if you accidentally enter credentials on a phishing site?",
            options: [
                "Nothing, it's probably fine",
                "Change your password immediately on the real site",
                "Wait to see if you get unauthorized access notifications",
                "Email the site to ask if it's legitimate"
            ],
            correctAnswer: 1,
            explanation: "Immediately change your password on the legitimate site and enable two-factor authentication if available."
        },
        {
            id: 5,
            text: "Which of these is NOT a common phishing tactic?",
            options: [
                "Creating a sense of urgency",
                "Using legitimate company logos",
                "Threatening account suspension",
                "Asking you to mail a physical check"
            ],
            correctAnswer: 3,
            explanation: "Phishing typically happens digitally. While mail fraud exists, it's not considered phishing."
        },
        {
            id: 6,
            text: "What's the best way to check if an email is legitimate?",
            options: [
                "Look at the sender's display name",
                "Check the email headers for the actual sender address",
                "See if the email is well-written",
                "Check if the email includes your name"
            ],
            correctAnswer: 1,
            explanation: "The display name can be faked. Always check the actual email address in the headers."
        },
        {
            id: 7,
            text: "A colleague sends you an unexpected Dropbox link via chat. What should you do?",
            options: [
                "Click it immediately as it's from a colleague",
                "Ask the colleague in person if they sent it",
                "Forward it to your IT department",
                "Both B and C"
            ],
            correctAnswer: 3,
            explanation: "Compromised accounts are common in phishing. Verify unexpected links through another channel."
        },
        {
            id: 8,
            text: "What does 'HTTPS' in a URL guarantee?",
            options: [
                "The website is legitimate",
                "The connection is encrypted",
                "The company is trustworthy",
                "The site has no malware"
            ],
            correctAnswer: 1,
            explanation: "HTTPS only means the connection is encrypted. Phishing sites can have HTTPS too."
        },
        {
            id: 9,
            text: "You receive an invoice attachment from an unknown sender. What should you do?",
            options: [
                "Open it to see what it's about",
                "Forward it to your accounting department",
                "Delete it without opening",
                "Reply asking for more information"
            ],
            correctAnswer: 2,
            explanation: "Unexpected attachments are dangerous. Delete them without opening."
        },
        {
            id: 10,
            text: "What's 'vishing'?",
            options: [
                "Video phishing through platforms like Zoom",
                "Voice phishing through phone calls",
                "Virtual reality phishing",
                "Verified phishing"
            ],
            correctAnswer: 1,
            explanation: "Vishing is voice phishing, where scammers call pretending to be from legitimate organizations."
        },
        {
            id: 11,
            text: "Which of these is a red flag in an email?",
            options: [
                "Professional branding",
                "A generic greeting like 'Dear Customer'",
                "A clear unsubscribe link",
                "Proper grammar and spelling"
            ],
            correctAnswer: 1,
            explanation: "While not definitive, generic greetings are common in phishing as they're sent en masse."
        },
        {
            id: 12,
            text: "What should you do if you suspect a phishing attempt at work?",
            options: [
                "Report it to your IT security team",
                "Forward it to coworkers as an example",
                "Reply to the sender to confront them",
                "Ignore it if you didn't fall for it"
            ],
            correctAnswer: 0,
            explanation: "Always report phishing attempts to your IT team so they can protect others."
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