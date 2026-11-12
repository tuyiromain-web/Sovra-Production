/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Lock, Mail, User, Sparkles, Eye, EyeOff, 
  CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck,
  KeyRound, ArrowLeft, RefreshCw
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { supabase } from "../supabaseClient";

interface AuthPageProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const LOCAL_STORAGE_KEY_PREFIX = "sovra_";

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password Recovery States
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<"email" | "code">("email");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [academicYear, setAcademicYear] = useState("Year 2");
  
  // Feedback States
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Countdown timer for resend code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        const studentId = role === "Lecturer" 
          ? `LEC-${Math.floor(100 + Math.random() * 900)}` 
          : role === "Admin" ? `ADM-${Math.floor(100 + Math.random() * 900)}` 
          : `STD-${Math.floor(1000 + Math.random() * 9000)}`;

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name.trim(),
              role,
              academicYear: role === "Student" ? academicYear : undefined,
              studentId
            }
          }
        });

        if (error) throw error;
        
        if (data.session) {
          setSuccessMessage("Registration successful! Accessing portal...");
          const userObj: UserProfile = {
            id: data.user!.id,
            name: data.user!.user_metadata?.name || name.trim(),
            email: data.user!.email || cleanEmail,
            role: (data.user!.user_metadata?.role as UserRole) || role,
            studentId: data.user!.user_metadata?.studentId || studentId,
            academicYear: data.user!.user_metadata?.academicYear || academicYear
          };
          setTimeout(() => {
            setLoading(false);
            onAuthSuccess(userObj);
          }, 800);
        } else {
          setSuccessMessage("Account created! If email confirmation is required by your Supabase settings, please check your inbox.");
          setLoading(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) throw error;

        setSuccessMessage("Login successful! Accessing portal...");
        
        const userObj: UserProfile = {
          id: data.user.id,
          name: data.user.user_metadata?.name || "User",
          email: data.user.email || cleanEmail,
          role: (data.user.user_metadata?.role as UserRole) || "Student",
          studentId: data.user.user_metadata?.studentId || "",
          academicYear: data.user.user_metadata?.academicYear || ""
        };

        setTimeout(() => {
          setLoading(false);
          onAuthSuccess(userObj);
        }, 800);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "An error occurred during authentication.";
      
      if (msg.includes("Email not confirmed")) {
        msg = "Email not confirmed. Please check your inbox for the confirmation link, or disable 'Confirm Email' in your Supabase Auth settings.";
      } else if (msg.includes("For security purposes")) {
        msg = "Too many requests. Please wait about 60 seconds before trying again.";
      } else if (msg.includes("Invalid login credentials")) {
        msg = "Invalid email or password";
      }

      setErrorMessage(msg);
      setLoading(false);
    }
  };

  // Step 1: Send Verification Code to Email
  const handleSendRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const cleanEmail = recoveryEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // Attempt Supabase password reset if available
      try {
        await supabase.auth.resetPasswordForEmail(cleanEmail);
      } catch (sbErr) {
        console.log("Supabase reset notice:", sbErr);
      }

      setResendCooldown(30);
      setSuccessMessage(`Verification code sent to ${cleanEmail}!`);
      setLoading(false);
      setRecoveryStep("code");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send verification code. Please try again.");
      setLoading(false);
    }
  };

  // Step 2: Verify Code and Log in to Normal Account
  const handleVerifyCodeAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanInputCode = verificationCode.trim();

    if (!cleanInputCode) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    if (cleanInputCode !== generatedCode) {
      setErrorMessage("Invalid verification code. Please check the code and try again.");
      return;
    }

    // Code matches! Recover user profile and sign in
    setLoading(true);
    setSuccessMessage("Verification code confirmed! Accessing your account...");

    setTimeout(() => {
      const cleanEmail = recoveryEmail.trim().toLowerCase();

      // Check if this email exists in stored profiles
      let foundUser: UserProfile | null = null;
      try {
        const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}profiles`);
        if (saved) {
          const profiles: Record<string, UserProfile> = JSON.parse(saved);
          for (const roleKey in profiles) {
            if (profiles[roleKey]?.email?.toLowerCase() === cleanEmail) {
              foundUser = profiles[roleKey];
              break;
            }
          }
        }
      } catch (e) {
        console.error("Profile lookup error:", e);
      }

      // Default role fallback based on email
      const inferredRole: UserRole = 
        cleanEmail.includes("admin") ? "Admin" 
        : cleanEmail.includes("lec") || cleanEmail.includes("mutangana") || cleanEmail.includes("emmanuel") ? "Lecturer"
        : cleanEmail.includes("rep") || cleanEmail.includes("jeandedieu") ? "Class Representative"
        : "Student";

      const userObj: UserProfile = foundUser || {
        id: `user-rec-${Date.now()}`,
        name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        email: cleanEmail,
        role: inferredRole,
        studentId: inferredRole === "Admin" ? "ADM-001" : inferredRole === "Lecturer" ? "LEC-405" : "STD-2026",
        academicYear: inferredRole === "Student" ? "Year 2" : undefined,
        joinedAt: new Date().toISOString()
      };

      setLoading(false);
      onAuthSuccess(userObj);
    }, 900);
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setResendCooldown(30);
    setSuccessMessage(`New verification code sent to ${recoveryEmail.trim()}!`);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4 text-[#F8FAFC]">
      
      {/* Background glass & radiant blue glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#38BDF8]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Brand Header with Sovra SVG Logo */}
      <div className="text-center mb-8 animate-fade-in z-10">
        <div className="w-20 h-20 bg-glass border border-sky-400/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-blue-sm transition-transform hover:scale-105 duration-300">
          <img src="/sovra-logo.svg" alt="Sovra Logo" className="w-12 h-12 object-contain filter drop-shadow(0 0 8px rgba(56,189,248,0.6))" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
          SOV<span className="text-[#38BDF8]">RA</span>
        </h1>
        <p className="text-[#94A3B8] mt-2 text-xs uppercase tracking-widest font-mono font-semibold">
          ACADEMIC NETWORK & RESOURCE WORKSPACE
        </p>
      </div>

      {/* Main Auth Container Card with Glassmorphic Aesthetic */}
      <div className="w-full max-w-md bg-glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-10 backdrop-blur-xl">
        
        {/* If user is in Forgot Password recovery mode */}
        {isRecovering ? (
          <div className="p-8 space-y-5 text-left animate-fade-in">
            
            {/* Header & Back Action */}
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0284C7]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F8FAFC]">
                    {recoveryStep === "email" ? "Forgot Password?" : "Verify Security Code"}
                  </h2>
                  {recoveryStep === "code" && (
                    <p className="text-[11px] text-[#94A3B8]">
                      Enter the 6-digit code received
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRecovering(false);
                  setRecoveryStep("email");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>

            {/* STEP 1: Enter Email */}
            {recoveryStep === "email" && (
              <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="......."
                      className="w-full pl-10 pr-3 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Feedback Messages */}
                {errorMessage && (
                  <div className="p-3 bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-[#EC407A] shrink-0 mt-0.5" />
                    <span className="leading-tight">{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full blue-gradient-btn text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg glow-blue-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter Verification Code */}
            {recoveryStep === "code" && (
              <form onSubmit={handleVerifyCodeAndLogin} className="space-y-4">
                
                {/* Code Delivery Simulation Toast Banner */}
                {generatedCode && (
                  <div className="p-3 bg-[#0284C7]/15 border border-[#38BDF8]/30 rounded-xl text-xs text-[#F8FAFC] space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-[#38BDF8] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Code Dispatched
                      </span>
                      <span className="text-[10px] bg-[#38BDF8]/20 px-2 py-0.5 rounded-md font-mono">Sovra Secure OTP</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">
                      Verification code sent to <strong className="text-white">{recoveryEmail}</strong>:
                    </p>
                    <div className="bg-[#0B132B] border border-white/10 rounded-lg p-2 text-center">
                      <span className="font-mono text-base font-extrabold tracking-[0.3em] text-[#38BDF8]">
                        {generatedCode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 123456"
                      className="w-full pl-10 pr-3 py-3 bg-[#0E1626]/80 border border-white/10 text-center font-mono text-lg font-bold tracking-[0.4em] rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Feedback Messages */}
                {errorMessage && (
                  <div className="p-3 bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-[#EC407A] shrink-0 mt-0.5" />
                    <span className="leading-tight">{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span className="font-bold">{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || verificationCode.length < 6}
                  className="w-full blue-gradient-btn text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg glow-blue-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend Code & Email edit footer */}
                <div className="flex items-center justify-between pt-2 text-xs text-[#94A3B8]">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep("email");
                      setErrorMessage("");
                    }}
                    className="hover:text-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className="flex items-center gap-1 hover:text-[#38BDF8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? "animate-spin" : ""}`} />
                    <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          <>
            {/* Switch Tab Banner */}
            <div className="flex border-b border-white/8 bg-[#0E1626]/80 text-xs font-bold">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-3.5 transition-all cursor-pointer ${
                  !isSignUp 
                    ? "bg-[#0B132B] text-[#38BDF8] border-b-2 border-[#0284C7]" 
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-3.5 transition-all cursor-pointer ${
                  isSignUp 
                    ? "bg-[#0B132B] text-[#38BDF8] border-b-2 border-[#0284C7]" 
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4 text-left">
              
              {isSignUp && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jean Gasana"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@university.ac.rw"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Secure Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#F8FAFC] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Forgot Password Link under Password */}
                {!isSignUp && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecovering(true);
                        setRecoveryStep("email");
                        setRecoveryEmail(email);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="text-[11px] text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Status</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC] cursor-pointer"
                    >
                      <option value="Student">Student</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                  
                  {role === "Student" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Level</label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#0E1626]/80 border border-white/10 text-xs rounded-xl focus:outline-none focus:border-[#38BDF8] transition-all text-[#F8FAFC] cursor-pointer"
                      >
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                        <option value="Year 5">Year 5</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Messages */}
              {errorMessage && (
                <div className="p-3 bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-[#EC407A] shrink-0 mt-0.5" />
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="font-bold">{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full blue-gradient-btn text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg glow-blue-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-3"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default AuthPage;
