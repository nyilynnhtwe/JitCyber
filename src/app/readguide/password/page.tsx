"use client";
import React from "react";
import {
    Key,
    ChevronLeft,
    BookOpen,
    Lock,
    AlertTriangle,
    RefreshCw,
    Shield,
    Globe,
    Cpu,
    Database,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PasswordGuide() {
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
                    <div className="p-3 rounded-lg bg-gradient-to-br from-teal-600 to-blue-700 shadow-md">
                        <Key className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Password Security Guide
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
                            {/* Section 1: Why Password Security Matters */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Why Passwords Matter
                                </h2>
                                <p className="mb-4">
                                    81% of data breaches are caused by weak or stolen passwords (Verizon 2023). Your password is the first line of defense against hackers.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700 font-medium flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <span>"123456" was used in 23 million breaches last year</span>
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Common Threats */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Password Threats
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Cpu className="w-4 h-4" />
                                            Brute Force Attacks
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Hackers try millions of combinations per second
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Database className="w-4 h-4" />
                                            Credential Stuffing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Reusing passwords across sites leads to domino breaches
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Key className="w-4 h-4" />
                                            Password Spraying
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Trying common passwords against many accounts
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-red-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            Shoulder Surfing
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            People peeking as you type in public spaces
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Creating Strong Passwords */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                    Password Creation Guide
                                </h2>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                    <h3 className="font-medium mb-2">Do:</h3>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li>Use 12+ characters (14+ for important accounts)</li>
                                        <li>Mix uppercase, numbers, and symbols (!@#$%)</li>
                                        <li>
                                            Create memorable passphrases:{" "}
                                            <code className="bg-gray-100 px-1 rounded">
                                                PurpleTiger$Eats_8Pizzas!
                                            </code>
                                        </li>
                                        <li>Change passwords every 90 days (for critical accounts)</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h3 className="font-medium mb-2">Don't:</h3>
                                    <ul className="space-y-2 list-disc pl-5">
                                        <li>Use personal info (birthdays, pet names)</li>
                                        <li>Repeat passwords across sites</li>
                                        <li>Store passwords in browsers or notes</li>
                                        <li>Use common sequences (qwerty, 123456)</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Protection Tools */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Security Tools
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Key className="w-4 h-4" />
                                            Password Managers
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Stores and generates unique passwords securely
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Recommended: Bitwarden, 1Password, KeePass
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-blue-50">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            2FA/MFA
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Requires second verification step
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Use: Authy, Google Authenticator, YubiKey
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Example */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    Password Strength Test
                                </h2>
                                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium mb-1">
                                                "
                                                <span className="line-through">iloveyou123</span>
                                                "
                                            </p>
                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                <div
                                                    className="bg-red-500 h-2 rounded"
                                                    style={{ width: "10%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-red-600 mt-1">
                                                Cracked in &lt;1 second
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">
                                                "
                                                <span className="line-through">J!tcyb3r2023</span>
                                                "
                                            </p>
                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded"
                                                    style={{ width: "60%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Cracked in 2 weeks
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1">
                                                "
                                                <span className="text-green-600">
                                                    Winter$un_Shines7!
                                                </span>
                                                "
                                            </p>
                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                <div
                                                    className="bg-green-500 h-2 rounded"
                                                    style={{ width: "100%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-green-600 mt-1">
                                                Takes 300+ years to crack
                                            </p>
                                        </div>
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