/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  User, Mail, Fingerprint, Calendar, Shield, Sparkles, 
  RefreshCw, CheckCircle, GraduationCap, Users, UserCog,
  Upload, Image, Award, ChevronRight, Check, Trash2, ArrowUpCircle,
  Lock, Eye, EyeOff
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { RenderAvatar, getAvatarTheme, renderAvatarIcon } from "./AvatarHelper";

interface ProfileTabProps {
  currentUser: UserProfile;
  profiles: Record<UserRole, UserProfile>;
  onChangeProfile: (updatedProfile: UserProfile) => void;
  onRoleChange: (newRole: UserRole) => void;
}

export function getRankName(level: number): string {
  if (level <= 1) return "Pharmacy Apprentice";
  if (level === 2) return "Apothecary Scholar";
  if (level === 3) return "Clinical Therapeutics Specialist";
  if (level === 4) return "Medicinal Chemistry Researcher";
  return "Master of Clinical Pharmacy";
}

export default function ProfileTab({
  currentUser,
  profiles,
  onChangeProfile,
  onRoleChange
}: ProfileTabProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [academicYear, setAcademicYear] = useState(currentUser.academicYear);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
  
  const [successMsg, setSuccessMsg] = useState("");

  // Secure Portal authentication states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRolePending, setAuthRolePending] = useState<UserRole | null>(null);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authPasscode, setAuthPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Keep local state in sync when active level/profile changes
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setStudentId(currentUser.studentId);
    setAcademicYear(currentUser.academicYear);
    setAvatarUrl(currentUser.avatarUrl || "");
  }, [currentUser]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      ...currentUser,
      name,
      email,
      studentId,
      academicYear,
      avatarUrl: avatarUrl ? avatarUrl : undefined
    };

    onChangeProfile(updatedProfile);

    setSuccessMsg("Academic profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === "Student") {
      onRoleChange("Student");
      setSuccessMsg("Switched session back to: Student.");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setAuthRolePending(newRole);
      setAuthStep(1);
      setAuthEmail("");
      setAuthPassword("");
      setShowAuthPassword(false);
      setAuthPasscode("");
      setAuthError("");
      setShowAuthModal(true);
    }
  };

  const handleVerifyStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authRolePending) return;

    const emailLower = authEmail.trim().toLowerCase();
    const cleanPassword = authPassword.trim();

    let isValid = false;

    // 1. Check static lecturer profiles
    if (authRolePending === "Lecturer") {
      const isStaticLecturer = [
        "emutangana@ines.ac.rw",
        "mclaire@ines.ac.rw",
        "nkurunziza@ines.ac.rw"
      ].includes(emailLower) && cleanPassword === "password";
      
      if (isStaticLecturer) {
        isValid = true;
      }
    } else if (authRolePending === "Class Representative") {
      // Check static class rep profile
      const isStaticRep = emailLower === "jeandedieu@ines.ac.rw" && cleanPassword === "password";
      if (isStaticRep) {
        isValid = true;
      }
    } else if (authRolePending === "Admin") {
      // Check static admin profile
      const isStaticAdmin = emailLower === "admin@ines.ac.rw" && cleanPassword === "password";
      if (isStaticAdmin) {
        isValid = true;
      }
    }

    // 2. Also fallback to allow cross-matching static credentials (any admin profile with "password")
    if (!isValid) {
      if ([
        "emutangana@ines.ac.rw",
        "mclaire@ines.ac.rw",
        "nkurunziza@ines.ac.rw",
        "jeandedieu@ines.ac.rw",
        "admin@ines.ac.rw"
      ].includes(emailLower) && cleanPassword === "password") {
        isValid = true;
      }
    }

    // 3. Match against the currently logged-in user's active email (if they edited it on-screen)
    if (!isValid) {
      if (currentUser.email.toLowerCase() === emailLower && cleanPassword === "password") {
        isValid = true;
      }
    }

    // 4. Check simulated local registered user registry
    if (!isValid) {
      try {
        const savedProfilesStr = localStorage.getItem("sovra_local_users") || localStorage.getItem("pharmalink_local_users") || "[]";
        const localUsers = JSON.parse(savedProfilesStr);
        const foundLocal = localUsers.find(
          (u: any) => u.email === emailLower && u.password === cleanPassword
        );
        if (foundLocal) {
          isValid = true;
        }
      } catch (err) {
        console.error("Failed to parse local users", err);
      }
    }

    if (isValid) {
      setAuthStep(2);
      setAuthError("");
    } else {
      setAuthError(`Invalid email or password for the ${authRolePending} role verification.`);
    }
  };

  const handleVerifyStepTwo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authRolePending) return;

    // Secured passcode verification
    const cleanPass = authPasscode.trim().toUpperCase();
    const isLecturerValid = authRolePending === "Lecturer" && (cleanPass === "1234" || cleanPass === "LEC405" || cleanPass === "PASSWORD" || cleanPass === "LEC-405" || cleanPass === "LEC-101" || cleanPass === "LEC-202");
    const isRepValid = authRolePending === "Class Representative" && (cleanPass === "5678" || cleanPass === "REP301" || cleanPass === "PASSWORD" || cleanPass === "STUDENT-REP");
    const isAdminValid = authRolePending === "Admin" && (cleanPass === "9999" || cleanPass === "ADM001" || cleanPass === "PASSWORD" || cleanPass === "ADMIN-SECURE" || cleanPass === "ADM-001");

    if (isLecturerValid || isRepValid || isAdminValid) {
      onRoleChange(authRolePending);
      setSuccessMsg(`Simulating session as: ${authRolePending}! Access credential verified.`);
      setTimeout(() => setSuccessMsg(""), 4500);
      setShowAuthModal(false);
      setAuthRolePending(null);
      setAuthEmail("");
      setAuthPassword("");
      setAuthPasscode("");
      setAuthError("");
    } else {
      setAuthError(`Incorrect passcode. Two-way security check failed for ${authRolePending}.`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Image size is too large! Please upload a profile picture under 1.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="profile-tab-section" className="space-y-6 max-w-4xl mx-auto animate-fade-in relative pb-12 text-[#F8FAFC]">
      
      {/* Success Notification */}
      {successMsg && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-xl p-4 flex items-center justify-between gap-3 animate-fade-in text-left">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
            <span className="text-xs font-mono font-semibold">{successMsg}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
            PROFILE SYNCHRONIZED
          </span>
        </div>
      )}

      {/* Role Switcher Sandbox */}
      <div className="bg-glass rounded-2xl border border-white/8 p-6 text-left space-y-4 shadow-md">
        <div className="flex items-center gap-2.5">
          <UserCog className="w-5 h-5 text-[#38BDF8]" />
          <h3 className="font-bold text-base text-[#F8FAFC]">Evaluation Sandbox: Toggle Role Profiles</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Student option */}
          <button
            type="button"
            onClick={() => handleRoleChange("Student")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative ${
              currentUser.role === "Student"
                ? "bg-[#0E1626] text-[#F8FAFC] border-[#0284C7] ring-1 ring-[#0284C7]"
                : "bg-[#0E1626]/60 hover:bg-[#0E1626] text-[#94A3B8] border-white/8 hover:border-white/15"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Tier 1</span>
            <div className="flex items-center gap-2 mt-2">
              <User className={`w-4 h-4 ${currentUser.role === "Student" ? "text-[#38BDF8]" : "text-[#94A3B8]"}`} />
              <span className="font-bold text-xs text-[#F8FAFC]">Student</span>
            </div>
            {currentUser.role === "Student" && <span className="absolute top-3 right-3 w-2 h-2 bg-[#0284C7] rounded-full animate-pulse" />}
          </button>

          {/* Class Rep option */}
          <button
            type="button"
            onClick={() => handleRoleChange("Class Representative")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative ${
              currentUser.role === "Class Representative"
                ? "bg-[#0E1626] text-[#F8FAFC] border-[#10B981] ring-1 ring-[#10B981]"
                : "bg-[#0E1626]/60 hover:bg-[#0E1626] text-[#94A3B8] border-white/8 hover:border-white/15"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Tier 2</span>
            <div className="flex items-center gap-2 mt-2">
              <Users className={`w-4 h-4 ${currentUser.role === "Class Representative" ? "text-[#10B981]" : "text-[#94A3B8]"}`} />
              <span className="font-bold text-xs text-[#F8FAFC]">Class Rep</span>
            </div>
            {currentUser.role === "Class Representative" && <span className="absolute top-3 right-3 w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />}
          </button>

          {/* Lecturer option */}
          <button
            type="button"
            onClick={() => handleRoleChange("Lecturer")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative ${
              currentUser.role === "Lecturer"
                ? "bg-[#0E1626] text-[#F8FAFC] border-[#8B5CF6] ring-1 ring-[#8B5CF6]"
                : "bg-[#0E1626]/60 hover:bg-[#0E1626] text-[#94A3B8] border-white/8 hover:border-white/15"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Tier 3</span>
            <div className="flex items-center gap-2 mt-2">
              <GraduationCap className={`w-4 h-4 ${currentUser.role === "Lecturer" ? "text-[#A78BFA]" : "text-[#94A3B8]"}`} />
              <span className="font-bold text-xs text-[#F8FAFC]">Lecturer Portal</span>
            </div>
            {currentUser.role === "Lecturer" && <span className="absolute top-3 right-3 w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse" />}
          </button>

          {/* Admin option */}
          <button
            type="button"
            onClick={() => handleRoleChange("Admin")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative ${
              currentUser.role === "Admin"
                ? "bg-[#0E1626] text-[#F8FAFC] border-[#EC407A] ring-1 ring-[#EC407A]"
                : "bg-[#0E1626]/60 hover:bg-[#0E1626] text-[#94A3B8] border-white/8 hover:border-white/15"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Tier 4</span>
            <div className="flex items-center gap-2 mt-2">
              <Shield className={`w-4 h-4 ${currentUser.role === "Admin" ? "text-[#EC407A]" : "text-[#94A3B8]"}`} />
              <span className="font-bold text-xs text-[#F8FAFC]">System Admin</span>
            </div>
            {currentUser.role === "Admin" && <span className="absolute top-3 right-3 w-2 h-2 bg-[#EC407A] rounded-full animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Main Profile Identity Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Left Column: Visual Avatar Card */}
        <div className="space-y-6">
          <div className="bg-glass rounded-2xl border border-white/8 p-6 flex flex-col items-center justify-center text-center space-y-5 shadow-md">
            
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-direct-upload"
              />
              <label htmlFor="avatar-direct-upload" className="cursor-pointer block relative">
                <div className="relative overflow-hidden rounded-2xl">
                  <RenderAvatar avatarUrl={avatarUrl} name={name} sizeClass="w-24 h-24 text-4xl" textClass="text-4xl font-bold" iconClass="w-10 h-10" />
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Upload className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-[9px] text-white font-mono font-bold uppercase tracking-wider">Upload Photo</span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 p-1.5 bg-[#0284C7] text-white rounded-full border-2 border-[#111418] shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-3.5 h-3.5" />
                </span>
              </label>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-[#F8FAFC] text-lg">{name}</h4>
              <p className="text-[10px] font-mono font-bold bg-[#0284C7]/15 text-[#38BDF8] border border-[#0284C7]/30 px-3 py-0.5 rounded-full inline-block uppercase tracking-wider">
                {currentUser.role}
              </p>
              {currentUser.role !== "Class Representative" && (
                <p className="text-[10px] text-[#94A3B8] font-mono block mt-1">ID: {currentUser.studentId}</p>
              )}
            </div>

            <div className="w-full border-t border-white/8 pt-4 text-xs text-[#94A3B8] space-y-2">
              <div className="flex justify-between font-mono">
                <span>Department:</span>
                <strong className="text-[#F8FAFC]">Pharmacy</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span>Academic level:</span>
                <strong className="text-[#F8FAFC]">{currentUser.academicYear}</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span>Institution:</span>
                <strong className="text-[#F8FAFC]">INES-Ruhengeri</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-glass rounded-2xl border border-white/8 p-6 shadow-md">
            <h3 className="font-bold text-[#F8FAFC] text-base mb-4 flex items-center gap-2 border-b border-white/8 pb-3">
              <User className="w-5 h-5 text-[#38BDF8]" />
              <span>Edit Academic Profile Information</span>
            </h3>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={currentUser.role === "Class Representative" ? "md:col-span-2" : ""}>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  />
                </div>

                {currentUser.role !== "Class Representative" && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Student ID / Registration ID</label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Current Level / Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] cursor-pointer"
                  >
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="blue-gradient-btn text-white font-bold px-6 py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md glow-blue-sm"
              >
                <span>Save Profile Changes</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Secure Role Passcode Modal Overlay */}
      {showAuthModal && authRolePending && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-glass border border-white/10 rounded-2xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl relative animate-slide-in text-[#F8FAFC]">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#0284C7]/20 flex items-center justify-center text-[#38BDF8] border border-[#0284C7]/30">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase tracking-wider bg-[#0284C7]/15 px-2.5 py-0.5 rounded-full border border-[#0284C7]/30">
                Security Verification (Step {authStep} of 2)
              </span>
              <h3 className="font-bold text-lg text-[#F8FAFC] pt-2">
                Verify {authRolePending} Access
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {authStep === 1 
                  ? "Step 1: Authenticate with official faculty email address and password."
                  : "Step 2: Authenticate with secure secondary portal passcode PIN."}
              </p>
            </div>

            {authStep === 1 ? (
              <form onSubmit={handleVerifyStepOne} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
                    <input
                      type="email"
                      required
                      placeholder={authRolePending === "Lecturer" ? "emutangana@ines.ac.rw" : "jeandedieu@ines.ac.rw"}
                      value={authEmail}
                      onChange={(e) => {
                        setAuthEmail(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
                    <input
                      type={showAuthPassword ? "text" : "password"}
                      required
                      placeholder="Enter password (e.g. password)"
                      value={authPassword}
                      onChange={(e) => {
                        setAuthPassword(e.target.value);
                        setAuthError("");
                      }}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#F8FAFC]"
                    >
                      {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-[11px] text-[#EC407A] font-mono text-center font-bold">
                    ⚠️ {authError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setAuthRolePending(null);
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthError("");
                    }}
                    className="border border-white/10 hover:bg-[#0E1626] text-[#94A3B8] font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="blue-gradient-btn text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md glow-blue-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyStepTwo} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
                    Enter Passcode PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={
                      authRolePending === "Admin"
                        ? "Try: 9999 or ADM001"
                        : authRolePending === "Lecturer"
                        ? "Try: 1234 or LEC405"
                        : "Try: 5678 or REP301"
                    }
                    value={authPasscode}
                    onChange={(e) => {
                      setAuthPasscode(e.target.value);
                      setAuthError("");
                    }}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-center font-mono tracking-widest text-lg font-bold text-[#38BDF8]"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-[11px] text-[#EC407A] font-mono mt-1 text-center font-bold">
                      ⚠️ {authError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep(1);
                      setAuthPasscode("");
                      setAuthError("");
                    }}
                    className="border border-white/10 hover:bg-[#0E1626] text-[#94A3B8] font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Back to Step 1
                  </button>
                  <button
                    type="submit"
                    className="blue-gradient-btn text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md glow-blue-sm"
                  >
                    Verify PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
