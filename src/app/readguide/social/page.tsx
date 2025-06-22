"use client";
import React from "react";
import { Eye, ChevronLeft, BookOpen, User, Shield, AlertOctagon, Clipboard, Globe, Mail, Smartphone, HardHat } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SocialEngineeringGuide() {
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
                    <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-800 shadow-md">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Social Engineering Defense Guide
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
                                    <User className="w-5 h-5 text-blue-600" />
                                    The Human Firewall
                                </h2>
                                <p className="mb-4">
                                    Social engineering accounts for 98% of cyber attacks (IBM 2023). Unlike software vulnerabilities, humans can't be patched - we must build awareness.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700 font-medium flex items-start gap-2">
                                        <AlertOctagon className="w-5 h-5 flex-shrink-0" />
                                        <span>Attackers spend 2-3 hours researching targets before launching attacks (Proofpoint)</span>
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Attack Breakdown */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Anatomy of an Attack
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Phase 1: Reconnaissance
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Scouring LinkedIn, company websites, and social media for personal details
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Phase 2: Hook
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Crafting believable pretexts ("IT needs your password for maintenance")
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <HardHat className="w-4 h-4" />
                                            Phase 3: Play
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Executing the attack via phone, email, or in-person
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Clipboard className="w-4 h-4" />
                                            Phase 4: Exit
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Covering tracks while maintaining access
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Defense Strategies */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Defense Framework
                                </h2>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                    <h3 className="font-medium mb-3">The SLAM Method</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">S</span>
                                            <span><strong>Sender:</strong> Verify email addresses/phone numbers</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">L</span>
                                            <span><strong>Links:</strong> Hover before clicking</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">A</span>
                                            <span><strong>Attachments:</strong> Never open unexpected files</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold">M</span>
                                            <span><strong>Message:</strong> Check for urgency/grammar errors</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Real-World Case */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertOctagon className="w-5 h-5 text-red-600" />
                                    Case Study: The Twitter Bitcoin Scam
                                </h2>
                                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="text-sm font-medium">July 2020 Attack</div>
                                    </div>
                                    <p className="mb-3">
                                        Hackers compromised 130 high-profile Twitter accounts (Obama, Musk, Gates) through a phone spear-phishing attack on employees.
                                    </p>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm">
                                        "Send Bitcoin to this address and we'll double your money!"
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium mb-1 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Lessons Learned:
                                    </h4>
                                    <ul className="text-sm space-y-1 list-disc pl-5">
                                        <li>Even tech companies can fall victim</li>
                                        <li>Internal access controls are critical</li>
                                        <li>Social media verification systems failed</li>
                                        <li>$118,000 stolen in 3 hours</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Training Resources */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Clipboard className="w-5 h-5 text-blue-600" />
                                    Security Culture Tips
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2">For Employees</h3>
                                        <ul className="text-sm space-y-2 list-disc pl-5">
                                            <li>Monthly security awareness training</li>
                                            <li>Phishing simulation exercises</li>
                                            <li>Clear reporting procedures</li>
                                        </ul>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2">For Families</h3>
                                        <ul className="text-sm space-y-2 list-disc pl-5">
                                            <li>Teach kids about online stranger danger</li>
                                            <li>Verify unusual payment requests via call</li>
                                            <li>Use family password managers</li>
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