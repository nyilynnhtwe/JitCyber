"use client";
import React from "react";
import {
    Shield,
    ChevronLeft,
    BookOpen,
    Link as LinkIcon,
    AlertTriangle,
    Mail,
    Lock,
    Globe,
    User,
    Smartphone,
} from "lucide-react";
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
                            src="/Logo.svg"
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
                        Phishing Prevention Guide
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
                            {/* Section 1: What is Phishing? */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    What is Phishing?
                                </h2>
                                <p className="mb-4">
                                    Phishing is when attackers impersonate legitimate organizations to steal sensitive data like passwords, credit cards, or personal information.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700 font-medium flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            1 in 4 phishing emails bypass default security filters (2023 Verizon Report)
                                        </span>
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Common Types */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Common Phishing Types
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email Phishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Fake emails pretending to be from banks, Amazon, etc.
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Smishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Fraudulent text messages with urgent requests
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" />
                                            Clone Phishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Duplicates of real emails with malicious links
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Spear Phishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Personalized attacks targeting specific individuals
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Red Flags */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    How to Spot Phishing
                                </h2>
                                <ul className="space-y-3 mb-6 list-disc pl-5">
                                    <li>
                                        <strong>Urgent threats:</strong> "Your account will be closed in 24 hours!"
                                    </li>
                                    <li>
                                        <strong>Generic greetings:</strong> "Dear Customer" instead of your name
                                    </li>
                                    <li>
                                        <strong>Suspicious links:</strong> Hover to see if URL matches the displayed text
                                    </li>
                                    <li>
                                        <strong>Poor grammar/spelling:</strong> Professional companies proofread messages
                                    </li>
                                    <li>
                                        <strong>Unusual requests:</strong> Legit services never ask for passwords via email
                                    </li>
                                </ul>
                            </section>

                            {/* Section 4: Protection */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Protection Checklist
                                </h2>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span>Enable two-factor authentication (2FA) everywhere</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span>Bookmark important sites - never Google "PayPal login"</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span>Use a password manager to avoid reuse</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <LinkIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span>Report suspicious emails to your IT team</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Example */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Real-World Example
                                </h2>
                                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="text-sm font-medium">From: support@amaz0n.com</div>
                                    </div>
                                    <h3 className="font-bold mb-1">Urgent: Your Amazon account is locked!</h3>
                                    <p className="text-sm mb-2">
                                        Dear Customer, we detected suspicious activity. Click below to verify your account within 24 hours or it will be permanently closed.
                                    </p>
                                    <div className="bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded text-sm">
                                        Verify Account Now
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium mb-1 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Why this is phishing:
                                    </h4>
                                    <ul className="text-sm space-y-1 list-disc pl-5">
                                        <li>Misspelled domain (amaz0n vs amazon)</li>
                                        <li>Generic "Dear Customer" greeting</li>
                                        <li>Creates false urgency</li>
                                        <li>Requests account verification via link</li>
                                    </ul>
                                </div>
                            </section>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}