'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export const Chatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<
        Array<{ text: string; sender: 'user' | 'bot'; image?: string }>
    >([
        {
            text: "Hello! I'm JitCyber AI Assistant. How can I help you with cybersecurity today?",
            sender: 'bot',
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'th'>('en');
    const [isTyping, setIsTyping] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getMockResponse = (message: string) => {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('password')) {
            return (
                "Our password checker evaluates:\n- Length (minimum 12 chars)\n- Character diversity\n- Common pattern avoidance\n- Dictionary word checks"
            );
        } else if (lowerMsg.includes('email')) {
            return (
                "Our email checker verifies:\n- DNS records\n- SPF/DKIM/DMARC configuration\n- Known breach involvement\n- Phishing risk indicators"
            );
        } else if (lowerMsg.includes('quiz')) {
            return (
                "Our cybersecurity quizzes cover:\n1. Basic security principles\n2. Phishing identification\n3. Password best practices\n4. Network security fundamentals"
            );
        } else {
            return (
                "I'm the JitCyber AI assistant. I can help with:\n- Password security checks\n- Email security analysis\n- Cybersecurity quizzes\n- General advice"
            );
        }
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() && !previewImage) return;
        const userMessage = {
            text: inputMessage,
            sender: 'user' as const,
            ...(previewImage && { image: previewImage }),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setPreviewImage(null);
        setIsTyping(true);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    text: getMockResponse(inputMessage),
                    sender: 'bot' as const,
                },
            ]);
            setIsTyping(false);
        }, 1000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot toggle button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
                aria-label="Open chatbot"
            >
                {isChatOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                )}
            </button>

            {/* Chatbot window */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <h2 className="font-semibold">JitCyber Assistant</h2>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setSelectedLanguage('en')}
                                className={`px-2 py-1 text-xs rounded ${
                                    selectedLanguage === 'en'
                                        ? 'bg-blue-800'
                                        : 'bg-blue-400'
                                }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setSelectedLanguage('th')}
                                className={`px-2 py-1 text-xs rounded ${
                                    selectedLanguage === 'th'
                                        ? 'bg-blue-800'
                                        : 'bg-blue-400'
                                }`}
                            >
                                TH
                            </button>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div
                        className="flex-1 p-4 overflow-y-auto bg-gray-50"
                        style={{ maxHeight: '60vh' }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-4 flex ${
                                    msg.sender === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {msg.image && (
                                        <div className="mb-2">
                                            <Image
                                                src={msg.image}
                                                alt="User upload"
                                                className="rounded max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.4s' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="border-t border-gray-200 p-3 bg-white">
                        {previewImage && (
                            <div className="relative mb-2">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    className="rounded max-w-full h-32 object-contain"
                                />
                                <button
                                    onClick={() => {
                                        setPreviewImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-75 text-white rounded-full p-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                                aria-label="Attach file"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                    />
                                </svg>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </button>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    selectedLanguage === 'en'
                                        ? 'Type your message...'
                                        : 'พิมพ์ข้อความของคุณ...'
                                }
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={
                                    (!inputMessage.trim() && !previewImage) || isTyping
                                }
                                className={`p-2 rounded-full ${
                                    (!inputMessage.trim() && !previewImage) || isTyping
                                        ? 'text-gray-400'
                                        : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                aria-label="Send message"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};