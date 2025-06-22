"use client";
import React from "react";
import { Smartphone, ChevronLeft, BookOpen, Shield, Wifi, Download, AlertTriangle, Lock, Globe, RefreshCw, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function MobileSecurityGuide() {
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
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 shadow-md">
                        <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Mobile Security
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
                                <Shield className="w-5 h-5 text-blue-600" />
                                Major Threats
                            </h2>
                            <ul className="space-y-3 mb-6 list-disc pl-5">
                                <li>Malicious apps containing malware</li>
                                <li>Unsecured public WiFi networks</li>
                                <li>Data theft through phishing attacks</li>
                                <li>Lost or stolen devices</li>
                                <li>Operating system vulnerabilities</li>
                            </ul>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                Essential Protections
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <h3 className="font-medium mb-2 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Device Locks
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Use PIN, password or biometric authentication
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <h3 className="font-medium mb-2 flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        App Sources
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Only download apps from official stores
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <h3 className="font-medium mb-2 flex items-center gap-2">
                                        <Wifi className="w-4 h-4" />
                                        Networks
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Use VPN on public WiFi networks
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <h3 className="font-medium mb-2 flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        Updates
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Regularly update OS and apps
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                Warning Signs
                            </h2>
                            <ul className="space-y-3 mb-6 list-disc pl-5">
                                <li>Abnormally fast battery drain</li>
                                <li>Noticeable performance decrease</li>
                                <li>Apps you didn't install</li>
                                <li>Unusual data activity</li>
                                <li>Excessive pop-up ads</li>
                            </ul>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
                                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Additional Tips
                                </h3>
                                <ul className="text-blue-700 space-y-2">
                                    <li>Turn off Bluetooth when not in use</li>
                                    <li>Review app permissions before granting</li>
                                    <li>Back up data regularly</li>
                                    <li>Enable device tracking features</li>
                                </ul>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                                <AlertOctagon className="w-5 h-5 text-red-600" />
                                If Device is Stolen
                            </h2>
                            <ol className="space-y-2 mb-6 list-decimal pl-5">
                                <li>Remotely lock the device</li>
                                <li>Remotely wipe data</li>
                                <li>Change all passwords</li>
                                <li>Notify your carrier</li>
                                <li>File police report if needed</li>
                            </ol>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}