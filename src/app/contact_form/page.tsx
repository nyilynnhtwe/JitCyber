"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import {
    Mail,
    Phone,
    MessageSquare,
    Send,
    User,
    CheckCircle,
    Clock,
    Users,
    Award,
    Zap,
    Home,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            inquiryType: 'general'
        });
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-blue-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                    <p className="text-gray-600 mb-8">
                        Thanks for reaching out! We'll get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={resetForm}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Another
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header */}
            <header className="bg-white/90 border-b border-blue-100 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Image
                                width={100}
                                height={100}
                                src="/logo.svg"
                                alt="JitCyber Logo"
                                className="w-12 h-12"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">JitCyber</h1>
                                <p className="text-sm text-blue-500">Student Cybersecurity Project</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                <Zap className="w-4 h-4" />
                                <span>Hackathon 2024</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                                <Users className="w-4 h-4" />
                                <span>Student Team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Homepage
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Have questions about our cybersecurity tools? Want to collaborate or provide feedback?
                                We'd love to hear from you!
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            <div className="bg-white border border-blue-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 shadow-sm group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow group-hover:rotate-6 transition-transform">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                                        <p className="text-blue-500 hover:text-blue-600 transition-colors">team@jitcyber.edu</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-purple-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 shadow-sm group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow group-hover:rotate-6 transition-transform">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Response Time</h3>
                                        <p className="text-purple-500 hover:text-purple-600 transition-colors">Usually within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-cyan-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 shadow-sm group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl flex items-center justify-center shadow group-hover:rotate-6 transition-transform">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Project Status</h3>
                                        <p className="text-cyan-500 hover:text-cyan-600 transition-colors">Active Development</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Note */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-purple-500" />
                                About Our Team
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We're a group of passionate IT students who created JitCyber as part of our hackathon project.
                                Our goal is to make cybersecurity education more accessible and engaging for fellow students or Thai people in general.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-8 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
                        <div className="absolute top-1/4 -left-8 w-16 h-16 bg-cyan-100 rounded-full opacity-20"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Send className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                                <p className="text-gray-500">We'd love to hear your thoughts and feedback!</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                {/* Inquiry Type */}
                                <div>
                                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Inquiry Type
                                    </label>
                                    <select
                                        id="inquiryType"
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                    >
                                        <option value="general">General Question</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="collaboration">Collaboration</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="feature">Feature Request</option>
                                    </select>
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                                        placeholder="Brief description of your message"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder:text-gray-400"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-xs text-gray-500 text-center mt-6">
                                * Required fields. We respect your privacy and won't share your information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;