"use client";
import React from "react";
import { Shield, ChevronLeft, BookOpen, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PhishingGuide() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1 flex items-center justify-center w-12 h-12">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                        Jitcyber
                    </span>
                </Link>

                {/* Language switcher */}
                <button
                    className="flex items-center gap-1 px-3 py-2 rounded-full bg-blue-100 hover:bg-gray-200 transition-colors cursor-default"
                    disabled
                >
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">EN</span>
                </button>
            </nav>

            {/* Back button */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Link 
                    href="/learn" 
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to courses
                </Link>
            </div>

            {/* Main content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div 
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-md">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Phishing Prevention
                    </h1>
                </motion.div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="p-6 sm:p-8">
                        <motion.div 
                            className="prose prose-blue max-w-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-semibold mb-4">
                                What is Phishing?
                            </h2>
                            <p className="mb-4">
                                Phishing is a cyber attack where attackers impersonate trustworthy organizations to trick victims into revealing sensitive information like passwords or credit card details.
                            </p>

                            <h2 className="text-2xl font-semibold mb-4 mt-8">
                                How to Identify Phishing Emails
                            </h2>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>
                                        Sender's email address looks suspicious or doesn't match the organization
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>
                                        Urgent or threatening language demanding immediate action
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>
                                        Suspicious links or attachments
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>
                                        Grammar and spelling mistakes
                                    </span>
                                </li>
                            </ul>

                            <h2 className="text-2xl font-semibold mb-4 mt-8">
                                Prevention Tips
                            </h2>
                            <ol className="space-y-3 mb-6 list-decimal pl-5">
                                <li>Don't click links or open attachments from unknown sources</li>
                                <li>Hover over links to check URLs before clicking</li>
                                <li>Enable two-factor authentication (2FA)</li>
                                <li>Report suspicious emails to your IT department</li>
                            </ol>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
                                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Key Takeaway
                                </h3>
                                <p className="text-blue-700">
                                    When in doubt, delete it! Legitimate organizations will never ask for sensitive information via email.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}