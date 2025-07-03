"use client";
import React from "react";
import { Eye, ChevronLeft, BookOpen, User, Shield, AlertOctagon, Clipboard, Globe } from "lucide-react";
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
                    <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-800 shadow-md">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Social Engineering
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
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                What is Social Engineering?
                            </h2>
                            <p className="mb-4">
                                Attack techniques that use psychological manipulation to trick people into revealing sensitive information or performing actions that compromise security.
                            </p>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                    <AlertOctagon className="w-5 h-5" />
                                    Why is it dangerous?
                                </h3>
                                <p className="text-yellow-700">
                                    Because it targets the weakest link in security - humans, not technology.
                                </p>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Common Techniques
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Phishing</h3>
                                    <p className="text-sm text-gray-600">
                                        Fake emails/messages appearing to be from trusted sources
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Pretexting</h3>
                                    <p className="text-sm text-gray-600">
                                        Creating a fabricated scenario to obtain information
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Baiting</h3>
                                    <p className="text-sm text-gray-600">
                                        Offering something enticing to install malware
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Tailgating</h3>
                                    <p className="text-sm text-gray-600">
                                        Following authorized persons into secure areas
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <Clipboard className="w-5 h-5 text-blue-600" />
                                Prevention Methods
                            </h2>
                            <ul className="space-y-3 mb-6 list-disc pl-5">
                                <li>Verify identities before sharing information</li>
                                <li>Never share sensitive info via phone/email</li>
                                <li>Adopt a 'verify before trust' approach</li>
                                <li>Beware of urgent requests or emotionally charged messages</li>
                                <li>Report suspicious incidents to IT</li>
                            </ul>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
                                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Key Takeaway
                                </h3>
                                <p className="text-blue-700">
                                    Healthy skepticism is your best defense against social engineering.
                                </p>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <AlertOctagon className="w-5 h-5 text-red-600" />
                                If You're a Victim
                            </h2>
                            <ol className="space-y-2 mb-6 list-decimal pl-5">
                                <li>Report the incident immediately</li>
                                <li>Change all affected passwords</li>
                                <li>Monitor accounts for suspicious activity</li>
                                <li>Alert colleagues and contacts</li>
                            </ol>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}