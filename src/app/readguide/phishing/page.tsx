"use client";
import React from "react";
import { Shield, ChevronLeft, BookOpen, Globe, Mail, Link as LinkIcon, AlertTriangle, Smartphone, AlertOctagon, User } from "lucide-react";
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
                        Phishing Defense Guide
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
                            {/* Section 1: Introduction */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    The Phishing Epidemic
                                </h2>
                                <p className="mb-4">
                                    36% of all data breaches involve phishing (Verizon 2023). Attackers evolve their tactics daily, making awareness your best defense.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700 font-medium flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <span>The average organization sees 1,200+ phishing attempts monthly (SlashNext)</span>
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Attack Types */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Modern Phishing Variants
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Smishing (SMS Phishing)
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Fake delivery notifications or bank alerts via text
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" />
                                            Clone Phishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Duplicates of legitimate emails with malicious links
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Spear Phishing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Highly personalized attacks targeting specific individuals
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Whaling
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Attacks targeting C-level executives
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Detection Guide */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    The 5-Second Email Check
                                </h2>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">1.</span>
                                            <span>Check sender address (look for misspellings like "amaz0n")</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">2.</span>
                                            <span>Hover over links (do URLs match the displayed text?)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">3.</span>
                                            <span>Look for urgent language ("Act now!")</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">4.</span>
                                            <span>Check for poor grammar/spelling</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">5.</span>
                                            <span>Ask: Was I expecting this message?</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Real-World Example */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertOctagon className="w-5 h-5 text-red-600" />
                                    Case Study: Google Docs Phishing
                                </h2>
                                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="text-sm font-medium">2017 Attack</div>
                                    </div>
                                    <p className="mb-3">
                                        A fake Google Docs invite compromised 1 million accounts in hours. The email appeared to come from a trusted contact with subject: "[Name] has shared a document on Google Docs with you"
                                    </p>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm">
                                        "Click to view document" → Malicious OAuth permissions request
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium mb-1 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Why it worked:
                                    </h4>
                                    <ul className="text-sm space-y-1 list-disc pl-5">
                                        <li>Appeared to come from known contacts</li>
                                        <li>Used Google's real OAuth flow</li>
                                        <li>Bypassed traditional spam filters</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Protection */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Advanced Protection
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2">For Individuals</h3>
                                        <ul className="text-sm space-y-2 list-disc pl-5">
                                            <li>Use email aliases for different services</li>
                                            <li>Enable U2F security keys for critical accounts</li>
                                            <li>Bookmark important sites (don't Google "PayPal login")</li>
                                        </ul>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2">For Organizations</h3>
                                        <ul className="text-sm space-y-2 list-disc pl-5">
                                            <li>Implement DMARC/DKIM/SPF email authentication</li>
                                            <li>Conduct quarterly phishing simulations</li>
                                            <li>Deploy AI-based email security solutions</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}