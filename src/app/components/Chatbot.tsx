'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    MessageCircle,
    X,
    Send,
    Paperclip,
    Bot,
    ChevronDown,
    ShieldCheck,
} from 'lucide-react';

// If you see this message, it means the code is being run in dashboard user page. When implementing ai apis, make sure the ai is supported for both thai and english languages with a opening message options for the user to choose from after the introduction of course. Thx yah

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
    const [isTyping, setIsTyping] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Can delete this just fine if you are implementing real AI responses with an API
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
        }, 1000 + Math.random() * 500);
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
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center
                    ${isChatOpen ? 'rotate-0' : 'hover:rotate-12'}`}
                aria-label="Open chatbot"
            >
                {isChatOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-6 w-6" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                )}
            </button>

            {/* Chatbot window */}
            {isChatOpen && (
                <div
                    className={`fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden
                        ${isChatOpen ? 'animate-fade-in-up' : 'animate-fade-out-down'}`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-700 rounded-full">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold">JitCyber Assistant</h2>
                                <p className="text-xs text-blue-100 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-blue-100 hover:text-white transition-colors"
                            onClick={() => setIsChatOpen(false)}
                        >
                            <ChevronDown className="h-5 w-5" />
                        </button>
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
                                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 transition-all duration-200 ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    } ${index === messages.length - 1 ? 'animate-message-in' : ''}`}
                                >
                                    {msg.image && (
                                        <div className="mb-2 overflow-hidden rounded">
                                            <Image
                                                src={msg.image}
                                                width={300}
                                                height={200}
                                                alt="User upload"
                                                className="rounded max-w-full h-auto object-cover"
                                            />
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 flex items-center">
                                    <Bot className="h-4 w-4 mr-2" />
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
                                    width={300}
                                    height={200}
                                    alt="Preview"
                                    className="rounded max-w-full h-32 object-contain border border-gray-200"
                                />
                                <button
                                    onClick={() => {
                                        setPreviewImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-100 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Attach file"
                            >
                                <Paperclip className="h-5 w-5" />
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
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={
                                    (!inputMessage.trim() && !previewImage) || isTyping
                                }
                                className={`p-2 rounded-full transition-colors ${
                                    (!inputMessage.trim() && !previewImage) || isTyping
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                                aria-label="Send message"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Some experimental styles for animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeOutDown {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                }

                @keyframes messageIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }

                .animate-fade-out-down {
                    animation: fadeOutDown 0.3s ease-out forwards;
                }

                .animate-message-in {
                    animation: messageIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};
