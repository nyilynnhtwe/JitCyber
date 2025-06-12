"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { hashPassword } from "../lib/auth";
import { User, Globe, CreditCard, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [ThaiID, setThaiID] = useState("");
  const [Passport, setPassport] = useState("thai");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return {
      score: 0,
      label: "Empty",
      color: "text-gray-500 bg-gray-50 border-gray-200",
      feedback: "Password cannot be empty"
    };
    
    const checks = {
      length: password.length >= 8,
      length12: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const negatives = {
      common: ["password", "123456", "qwerty", "abc123", ThaiID].some(
        word => password.toLowerCase().includes(word.toLowerCase())
      ),
      sequential: /(abc|123|xyz|987|678|234)/i.test(password),
      repeated: /(.)\1{3,}/.test(password),
      userInfo: [fullname, phone].some(
        info => info && password.toLowerCase().includes(info.toLowerCase())
      ),
    };
    
    let score = Object.values(checks).filter(Boolean).length;
    
    if (negatives.common) score = Math.max(1, score - 2);
    if (negatives.sequential || negatives.repeated) score = Math.max(1, score - 1);
    if (negatives.userInfo) score = Math.max(1, score - 1);
    
    if (score <= 2) return {
      score,
      label: "Weak",
      color: "text-red-600 bg-red-50 border-red-200",
      feedback: "Add more character types (uppercase, numbers, symbols)"
    };
    
    if (score <= 3) return {
      score,
      label: "Fair",
      color: "text-orange-600 bg-orange-50 border-orange-200",
      feedback: "Try making it longer or adding symbols"
    };
    
    if (score <= 5) return {
      score,
      label: "Good",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      feedback: "Almost there - add another character type"
    };
    
    return {
      score,
      label: "Strong",
      color: "text-green-600 bg-green-50 border-green-200",
      feedback: "Great job! This password is secure"
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const isThaiIdValid = Passport !== "thai" ||
    (ThaiID.length === 13 && /^\d+$/.test(ThaiID));
  const isPassportValid = Passport !== "foreign" ||
    (ThaiID.length >= 6 && /^[a-zA-Z0-9]+$/.test(ThaiID));
  
  const showThaiIdError = Passport === "thai" && ThaiID.length > 0 && !isThaiIdValid;
  const showPassportError = Passport === "foreign" && ThaiID.length > 0 && !isPassportValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Passport === "thai" && (ThaiID.length !== 13 || !/^\d+$/.test(ThaiID))) {
      return;
    }
    
    if (Passport === "foreign" && ThaiID.length < 6) {
      return;
    }
    
    if (passwordStrength.score < 3) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const hashedPassword = await hashPassword(password);
      const userData = {
        idType: Passport === "thai" ? "thai" : "foreign",
        idNumber: ThaiID,
        password: hashedPassword,
        fullName: fullname,
        phoneNumber: phone
      };
      
      console.log("Sign Up", userData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-15 h-15 text-white" />
              <h1 className="text-2xl font-bold text-white">
                JitCyber Security Portal
              </h1>
            </div>

            <p className="text-blue-100 text-sm mt-1">
              Join the cybersecurity community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* ID Type Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                ID Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Globe className="w-5 h-5" />
                </div>
                <select
                  value={Passport}
                  onChange={(e) => setPassport(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                  required
                >
                  <option value="thai">Thai ID</option>
                  <option value="foreign">Passport</option>
                </select>
              </div>
            </div>

            {/* ID Number Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                {Passport === "thai" ? "Thai ID Number" : "Passport Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={ThaiID}
                  onChange={(e) => setThaiID(e.target.value)}
                  placeholder={
                    Passport === "thai"
                      ? "13-digit Thai ID number"
                      : "Passport number (min 6 characters)"
                  }
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    (showThaiIdError || showPassportError)
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  required
                />
              </div>
              
              {Passport === "thai" && showThaiIdError && (
                <div className="text-red-600 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Thai ID must be exactly 13 digits (numbers only)
                </div>
              )}
              {Passport === "thai" && !showThaiIdError && ThaiID.length > 0 && (
                <div className="text-green-600 text-xs mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Valid Thai ID format
                </div>
              )}
              
              {Passport === "foreign" && showPassportError && (
                <div className="text-red-600 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Passport must be at least 6 characters (letters and numbers only)
                </div>
              )}
              {Passport === "foreign" && !showPassportError && ThaiID.length > 0 && (
                <div className="text-green-600 text-xs mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Valid passport format
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+66 123 456 789"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {(isPasswordFocused || password) && (
                <div className="mt-2 space-y-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${passwordStrength.color}`}>
                    {passwordStrength.score >= 4 ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    Password Strength: {passwordStrength.label}
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p className="font-medium">Password must contain:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li className={password.length >= 8 ? "text-green-600" : ""}>
                        At least 8 characters (12+ recommended)
                      </li>
                      <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                        At least one uppercase letter
                      </li>
                      <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
                        At least one lowercase letter
                      </li>
                      <li className={/\d/.test(password) ? "text-green-600" : ""}>
                        At least one number
                      </li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}>
                        At least one special character
                      </li>
                      <li className={!passwordStrength.feedback.includes("common") ? "text-green-600" : "text-red-600"}>
                        Not a common password or contain personal info
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting ||
                (Passport === "thai" && !isThaiIdValid) ||
                (Passport === "foreign" && !isPassportValid) ||
                (passwordStrength.score < 3)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 rounded-lg text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          {/* Link to sign in */}
          <div className="px-6 pb-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
          </div>

          {/* Security Notice */}
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <p className="text-xs text-green-800">
                  Your data is protected with advanced security measures
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;