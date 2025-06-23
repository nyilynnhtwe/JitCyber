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
    // Phishing quiz questions (all 12 questions maintained)
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