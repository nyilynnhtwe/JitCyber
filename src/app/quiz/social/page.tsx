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
    // Social Engineering quiz questions (HARD difficulty)
    const quizQuestions: Question[] = [
        {
            id: 1,
            text: "What is the most sophisticated form of social engineering that targets specific high-value individuals?",
            options: [
                "Phishing",
                "Whaling",
                "Vishing",
                "Baiting"
            ],
            correctAnswer: 1,
            explanation: "Whaling attacks specifically target C-level executives or high-net-worth individuals with highly personalized tactics."
        },
        {
            id: 2,
            text: "Which psychological principle do social engineers exploit when creating fake urgency in emails?",
            options: [
                "Reciprocity",
                "Scarcity",
                "Authority",
                "Consensus"
            ],
            correctAnswer: 1,
            explanation: "Scarcity principle makes people act quickly when they believe an opportunity is limited or time-sensitive."
        },
        {
            id: 3,
            text: "What's the primary difference between pretexting and phishing?",
            options: [
                "Pretexting uses false identities, phishing uses fake websites",
                "Pretexting is always phone-based, phishing is email-based",
                "Pretexting requires malware, phishing doesn't",
                "They're identical techniques"
            ],
            correctAnswer: 0,
            explanation: "Pretexting involves creating a fabricated scenario/identity to extract information, while phishing typically uses deceptive communications."
        },
        {
            id: 4,
            text: "Which of these is NOT a red flag in a potential social engineering attack?",
            options: [
                "Requests for sensitive information via unofficial channels",
                "Unsolicited attachments from known contacts",
                "Verified digital signatures on documents",
                "Pressure to bypass normal procedures"
            ],
            correctAnswer: 2,
            explanation: "Verified digital signatures are a security feature, while the other options are common social engineering indicators."
        },
        {
            id: 5,
            text: "What makes 'spear phishing' different from regular phishing?",
            options: [
                "Use of voice calls instead of emails",
                "Highly targeted towards specific individuals",
                "Involves physical documents",
                "Always includes malware payloads"
            ],
            correctAnswer: 1,
            explanation: "Spear phishing uses personalized information to target specific individuals or organizations."
        },
        {
            id: 6,
            text: "Which cognitive bias do 'CEO fraud' attacks primarily exploit?",
            options: [
                "Confirmation bias",
                "Authority bias",
                "Bandwagon effect",
                "Choice-supportive bias"
            ],
            correctAnswer: 1,
            explanation: "Authority bias makes people comply with requests from perceived authority figures without proper verification."
        },
        {
            id: 7,
            text: "What is 'tailgating' in social engineering?",
            options: [
                "Following someone through secured access points",
                "Adding malicious footers to emails",
                "Monitoring social media posts",
                "Creating fake social media profiles"
            ],
            correctAnswer: 0,
            explanation: "Tailgating is a physical security breach where unauthorized persons follow authorized personnel into restricted areas."
        },
        {
            id: 8,
            text: "Which technique involves researching discarded materials?",
            options: [
                "Shoulder surfing",
                "Dumpster diving",
                "Water holing",
                "Elicitation"
            ],
            correctAnswer: 1,
            explanation: "Dumpster diving retrieves sensitive information from discarded documents, devices, or materials."
        },
        {
            id: 9,
            text: "What is the most effective defense against business email compromise (BEC)?",
            options: [
                "Strong spam filters",
                "Multi-factor authentication",
                "Verbal confirmation for financial transactions",
                "Employee awareness training"
            ],
            correctAnswer: 2,
            explanation: "Verbal confirmation through established protocols is the most reliable defense against BEC scams."
        },
        {
            id: 10,
            text: "Which social engineering attack exploits current news events?",
            options: [
                "Honeytraps",
                "Watering hole attacks",
                "Newsjacking",
                "Quid pro quo"
            ],
            correctAnswer: 2,
            explanation: "Newsjacking leverages breaking news or popular trends to add credibility to malicious communications."
        },
        {
            id: 11,
            text: "What is 'elicitation' in social engineering?",
            options: [
                "Extracting information through casual conversation",
                "Sending mass phishing emails",
                "Creating fake websites",
                "Impersonating tech support"
            ],
            correctAnswer: 0,
            explanation: "Elicitation is the subtle extraction of information through seemingly normal conversations."
        },
        {
            id: 12,
            text: "Which psychological principle makes 'quid pro quo' attacks effective?",
            options: [
                "Reciprocity",
                "Commitment",
                "Liking",
                "Social proof"
            ],
            correctAnswer: 0,
            explanation: "Reciprocity makes people feel obligated to return favors, even to malicious actors."
        },
        {
            id: 13,
            text: "What is the primary goal of 'watering hole' attacks?",
            options: [
                "Compromise frequently visited websites of targets",
                "Create fake social media profiles",
                "Intercept water utility systems",
                "Distribute malware through water-themed emails"
            ],
            correctAnswer: 0,
            explanation: "Watering hole attacks compromise websites that specific target groups are known to visit."
        },
        {
            id: 14,
            text: "Which verification method is MOST resistant to social engineering?",
            options: [
                "Knowledge-based authentication",
                "Behavioral biometrics",
                "Security questions",
                "One-time codes via SMS"
            ],
            correctAnswer: 1,
            explanation: "Behavioral biometrics (typing patterns, mouse movements) are extremely difficult for attackers to replicate."
        },
        {
            id: 15,
            text: "What makes 'deepfake' social engineering particularly dangerous?",
            options: [
                "Bypasses all multi-factor authentication",
                "Creates convincing fake audio/video of trusted individuals",
                "Automates phishing at massive scale",
                "Infects systems with undetectable malware"
            ],
            correctAnswer: 1,
            explanation: "Deepfakes can realistically impersonate executives or colleagues in video/audio, bypassing normal skepticism."
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