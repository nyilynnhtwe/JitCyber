"use client";
import React from "react";
import { Key, ChevronLeft, BookOpen, Lock, AlertTriangle, RefreshCw, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PasswordSecurityGuide() {
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

                {/* Language switcher (visual only) */}
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
                    <div className="p-3 rounded-lg bg-gradient-to-br from-teal-600 to-blue-700 shadow-md">
                        <Key className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Password Security
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
                                <Lock className="w-5 h-5 text-blue-600" />
                                Creating Strong Passwords
                            </h2>
                            <p className="mb-4">
                                A strong password is your first line of defense against account hacking.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Do's
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>
                                                Use 12+ characters
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>
                                                Mix upper/lower case, numbers & symbols
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>
                                                Use unique passwords for each account
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h3 className="font-semibold text-red-800 mb-2">
                                        Don'ts
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-600">✗</span>
                                            <span>
                                                Use personal info (birthdays, names)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-600">✗</span>
                                            <span>
                                                Use common passwords ('password123')
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-600">✗</span>
                                            <span>
                                                Store passwords in insecure places
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-blue-600" />
                                Password Management
                            </h2>
                            <p className="mb-4">
                                Password managers help you:
                            </p>
                            <ul className="space-y-3 mb-6 list-disc pl-5">
                                <li>Securely generate and store strong passwords</li>
                                <li>Auto-fill passwords on websites and apps</li>
                                <li>Sync passwords across all your devices</li>
                            </ul>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                When Passwords Are Compromised
                            </h2>
                            <ol className="space-y-3 mb-6 list-decimal pl-5">
                                <li>Change the password immediately</li>
                                <li>Enable two-factor authentication (2FA)</li>
                                <li>Check recent activity on the account</li>
                                <li>Change any similar passwords elsewhere</li>
                            </ol>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
                                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Key Takeaway
                                </h3>
                                <p className="text-blue-700">
                                    Strong, unique passwords for each account are cybersecurity fundamentals.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}