/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, BookOpen, AlertCircle, Plus, Send, 
  Sparkles, GraduationCap, Calendar, Clock, CheckCircle, 
  FileSpreadsheet, UserCheck, RefreshCw, Volume2, FileDown,
  Folder, Check, X, ThumbsUp, Eye, FileText, Lock, Award, ArrowLeft
} from "lucide-react";
import { UserProfile, UserRole, Assignment, StudyResource, AppNotification } from "../types";
import { exportAnnouncementToPDF } from "../utils/pdfGenerator";

interface LecturerCornerProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  notifications: AppNotification[];
  resources: StudyResource[];
  attendanceSessions: any[];
  onAddAnnouncement: (ann: { 
    title: string; 
    message: string; 
    type: "announcement" | "grade" | "assignment";
    targetLecturer?: string;
    targetModule?: string;
  }) => void;
  onGradeAssignment: (assignmentId: string, studentId: string, grade: string, feedback: string) => void;
  onAddResource: (newResource: Omit<StudyResource, "id" | "downloadsCount" | "uploadedBy" | "uploadedById" | "uploadedAt">) => void;
  onApproveResource: (resourceId: string) => void;
  onApproveAttendanceSession: (sessionId: string) => void;
  onNavigate: (tab: string) => void;
  onRoleChange: (role: UserRole) => void;
  onUpdateLecturerProfile: (updated: UserProfile) => void;
}

export const LECTURER_PROFILES = [
  {
    id: "lecturer-user",
    name: "Dr. Emmanuel Mutangana",
    email: "emutangana@ines.ac.rw",
    studentId: "LEC-405",
    role: "Lecturer" as const,
    academicYear: "Year 4",
    joinedAt: new Date().toISOString()
  },
  {
    id: "lecturer-1",
    name: "Dr. Marie Claire",
    email: "mclaire@ines.ac.rw",
    studentId: "LEC-101",
    role: "Lecturer" as const,
    academicYear: "Year 4",
    joinedAt: new Date().toISOString()
  },
  {
    id: "lecturer-2",
    name: "Prof. Nkurunziza",
    email: "nkurunziza@ines.ac.rw",
    studentId: "LEC-202",
    role: "Lecturer" as const,
    academicYear: "Year 4",
    joinedAt: new Date().toISOString()
  }
];

export const LECTURER_MODULES: Record<string, string[]> = {
  "Dr. Emmanuel Mutangana": ["Advanced Clinical Therapeutics", "Pharma Regulation"],
  "Dr. Marie Claire": ["Clinical Pharmacy", "Pharmacology I", "Medicinal Chemistry II", "Pharmacognosy I"],
  "Prof. Nkurunziza": ["Pharmaceutics I", "Pharmaceutics II", "Biopharmaceutics"]
};

export default function LecturerCorner({
  currentUser,
  assignments,
  notifications,
  resources,
  attendanceSessions,
  onAddAnnouncement,
  onGradeAssignment,
  onAddResource,
  onApproveResource,
  onApproveAttendanceSession,
  onNavigate,
  onRoleChange,
  onUpdateLecturerProfile
}: LecturerCornerProps) {
  const isAuthorized = currentUser.role === "Lecturer";

  // Pending Works center states
  const [showPendingFolder, setShowPendingFolder] = useState(true);
  const [pendingTab, setPendingTab] = useState<"submissions" | "resources" | "attendance">("submissions");
  const [inlineGradingKey, setInlineGradingKey] = useState<string | null>(null);
  const [inlineGrade, setInlineGrade] = useState("A (48/50)");
  const [inlineFeedback, setInlineFeedback] = useState("Well organized report with comprehensive chemical diagrams.");

  // Compute pending works
  const pendingSubmissions = (assignments || []).flatMap(assign => 
    Object.entries(assign.submissions || {})
      .filter(([studentId, sub]) => !sub.grade)
      .map(([studentId, sub]) => ({
        assignmentId: assign.id,
        assignmentTitle: assign.title,
        courseCode: assign.courseCode,
        studentId,
        studentName: studentId === "std-1102" ? "Pascal Gasana" : (studentId === "student-rep" ? "Jean de Dieu" : "Pharmacy Student"),
        fileName: sub.fileName,
        submittedAt: sub.submittedAt,
        fileUrl: sub.fileUrl,
        points: assign.points
      }))
  );

  const pendingResources = (resources || []).filter(res => res.approved === false);
  const pendingSessions = (attendanceSessions || []).filter(sess => sess.approved === false);

  const totalPendingCount = pendingSubmissions.length + pendingResources.length + pendingSessions.length;

  // Login form state
  const [selectedLecturerIdx, setSelectedLecturerIdx] = useState(0);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [successText, setSuccessText] = useState("");

  // Grade Assignment form state
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("std-1102");
  const [grade, setGrade] = useState("A (48/50)");
  const [feedback, setFeedback] = useState("Excellent laboratory formulation accuracy and clear chemical structures.");

  // General announcement state
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annType, setAnnType] = useState<"announcement" | "grade" | "assignment">("announcement");
  
  // Announcement targeting states (folders and module tabs)
  const [targetLecturerName, setTargetLecturerName] = useState(currentUser.name || "Dr. Emmanuel Mutangana");
  const [targetModuleName, setTargetModuleName] = useState(LECTURER_MODULES[currentUser.name] ? LECTURER_MODULES[currentUser.name][0] : "Advanced Clinical Therapeutics");

  const studentsList = [
    { id: "std-1102", name: "Pascal Gasana (Year 2)" },
    { id: "std-9981", name: "Aliane Umutoni (Year 2)" },
    { id: "student-rep", name: "Jean de Dieu (Year 3 Class Rep)" }
  ];

  // Dynamically update default targeting module when target lecturer changes
  React.useEffect(() => {
    const modules = LECTURER_MODULES[targetLecturerName] || [];
    if (modules.length > 0) {
      setTargetModuleName(modules[0]);
    }
  }, [targetLecturerName]);

  // Handle lecturer portal login verification
  const handleLecturerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLecturer = LECTURER_PROFILES[selectedLecturerIdx];
    const cleanPass = passcode.trim();

    const isValid = cleanPass === "1234" || cleanPass === "password" || cleanPass.toUpperCase() === targetLecturer.studentId;
    if (isValid) {
      onUpdateLecturerProfile(targetLecturer);
      onRoleChange("Lecturer");
      setTargetLecturerName(targetLecturer.name);
      setSuccessText(`Successfully authenticated as ${targetLecturer.name}! Portal unlocked.`);
      setPasscode("");
      setAuthError("");
      setTimeout(() => setSuccessText(""), 4500);
    } else {
      setAuthError("Incorrect passcode. Access is strictly authorized for faculty data.");
    }
  };

  const handleSignOutLecturer = () => {
    onRoleChange("Student");
    setSuccessText("Securely signed out of Lecturer Portal. Session closed.");
    setTimeout(() => setSuccessText(""), 3500);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !selectedStudentId || !grade) {
      alert("Please fill in all grading fields.");
      return;
    }

    onGradeAssignment(selectedAssignmentId, selectedStudentId, grade, feedback);
    
    setSuccessText("Grade recorded successfully! The student has been notified.");
    setTimeout(() => setSuccessText(""), 4000);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) {
      alert("Please fill in both title and message.");
      return;
    }

    onAddAnnouncement({
      title: annTitle,
      message: annMessage,
      type: annType,
      targetLecturer: targetLecturerName,
      targetModule: targetModuleName
    });

    setAnnTitle("");
    setAnnMessage("");
    
    setSuccessText(`Official alert targeted and broadcasted to ${targetLecturerName}'s folder / ${targetModuleName}!`);
    setTimeout(() => setSuccessText(""), 4000);
  };

  const handleExportDraftPDF = () => {
    if (!annTitle.trim() || !annMessage.trim()) {
      alert("Please fill in both the title and body message first to generate a PDF.");
      return;
    }

    const mockNotification: AppNotification = {
      id: "draft-ann-" + Date.now(),
      title: annTitle,
      message: annMessage,
      type: annType,
      isRead: false,
      createdAt: new Date().toISOString(),
      targetRole: currentUser.role,
      targetLecturer: targetLecturerName,
      targetModule: targetModuleName
    };

    exportAnnouncementToPDF(mockNotification);
    setSuccessText("Draft summary compiled & exported to your local device!");
    setTimeout(() => setSuccessText(""), 4000);
  };

  if (!isAuthorized) {
    return (
      <div id="lecturer-corner-unauthorized" className="bg-glass rounded-2xl border border-white/8 p-8 text-center max-w-lg mx-auto space-y-6 animate-fade-in my-6 shadow-xl text-[#F8FAFC]">
        <div className="w-16 h-16 rounded-2xl bg-[#0284C7]/15 flex items-center justify-center text-[#38BDF8] mx-auto border border-[#0284C7]/30">
          <GraduationCap className="w-8 h-8" />
        </div>
        
        <div className="space-y-2 text-center">
          <h3 className="font-bold text-[#F8FAFC] text-lg">Lecturer Identification</h3>
        </div>

        {/* Lecturer Authentication Login form */}
        <form onSubmit={handleLecturerLogin} className="p-5 bg-[#0E1626] border border-white/8 rounded-xl text-left space-y-4">
          <h4 className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 border-b border-white/8 pb-2">
            <Lock className="w-4 h-4 text-[#38BDF8]" />
            <span>Lecturer portal</span>
          </h4>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Lecturer Account</label>
              <select
                value={selectedLecturerIdx}
                onChange={(e) => {
                  setSelectedLecturerIdx(Number(e.target.value));
                  setAuthError("");
                }}
                className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
              >
                {LECTURER_PROFILES.map((profile, index) => (
                  <option key={profile.id} value={index}>
                    {profile.name} ({profile.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Lecturer Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter 4-digit PIN (Try: 1234)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError("");
                }}
                className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono tracking-widest text-center"
              />
              {authError && (
                <p className="text-[10px] text-[#EC407A] font-mono mt-1 font-bold text-center">
                  ❌ {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full blue-gradient-btn text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md glow-blue-sm text-center"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate("Home Page")}
            className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="lecturer-corner-section" className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* Role Confirmation Header */}
      <div className="bg-glass text-white p-5 rounded-2xl border border-white/8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#0284C7]/20 text-[#38BDF8] rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="font-bold text-base text-[#F8FAFC]">Authorized Lecturer Action Portal</h2>
            <p className="text-xs text-[#94A3B8]">
              Authenticated as: <span className="font-mono font-bold text-[#38BDF8]">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase font-mono tracking-widest bg-[#10B981]/15 text-[#10B981] px-3 py-1 rounded-full border border-[#10B981]/30 font-bold">
            🔒 Secured Session
          </span>
          <button
            onClick={handleSignOutLecturer}
            className="text-[10px] font-bold uppercase tracking-wider bg-[#EC407A]/15 text-[#EC407A] hover:bg-[#EC407A] hover:text-white border border-[#EC407A]/30 px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Success alert */}
      {successText && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-left shadow-lg">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
          <span className="text-xs font-mono font-bold">{successText}</span>
        </div>
      )}

      {/* 📁 Pending Works & Approvals Folder */}
      <div id="pending-works-folder" className="bg-glass rounded-2xl border border-white/8 overflow-hidden shadow-md">
        <div 
          onClick={() => setShowPendingFolder(!showPendingFolder)}
          className="bg-[#0E1626] hover:bg-[#191D23] px-5 py-4 border-b border-white/8 flex items-center justify-between cursor-pointer transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F59E0B]/15 text-[#F59E0B] rounded-xl border border-[#F59E0B]/30">
              <Folder className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm text-[#F8FAFC]">
                Pending Actions & Approvals
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalPendingCount > 0 ? (
              <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold px-3 py-0.5 rounded-full text-[10px] font-mono animate-pulse">
                {totalPendingCount} Action Required
              </span>
            ) : (
              <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold px-3 py-0.5 rounded-full text-[10px] font-mono">
                All Cleared
              </span>
            )}
            <span className="text-xs text-[#94A3B8] font-bold">
              {showPendingFolder ? "Collapse [-]" : "Expand [+]"}
            </span>
          </div>
        </div>

        {showPendingFolder && (
          <div className="p-5 space-y-4 animate-fade-in bg-glass">
            {/* Folder Sub-Tabs */}
            <div className="flex border-b border-white/8 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPendingTab("submissions"); }}
                className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer shrink-0 ${
                  pendingTab === "submissions"
                    ? "border-[#0284C7] text-[#38BDF8]"
                    : "border-transparent text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                📝 Submissions ({pendingSubmissions.length})
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPendingTab("resources"); }}
                className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer shrink-0 ${
                  pendingTab === "resources"
                    ? "border-[#0284C7] text-[#38BDF8]"
                    : "border-transparent text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                📚 Resources ({pendingResources.length})
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPendingTab("attendance"); }}
                className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer shrink-0 ${
                  pendingTab === "attendance"
                    ? "border-[#0284C7] text-[#38BDF8]"
                    : "border-transparent text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                ⏰ Roll Call Requests ({pendingSessions.length})
              </button>
            </div>

            {/* Tab content */}
            <div>
              {pendingTab === "submissions" && (
                <div className="space-y-3">
                  {pendingSubmissions.length === 0 ? (
                    <div className="py-8 text-center bg-[#0E1626] border border-dashed border-white/10 rounded-xl">
                      <p className="text-xs text-[#94A3B8] italic font-mono">No student assignments awaiting grading or review.</p>
                    </div>
                  ) : (
                    pendingSubmissions.map((sub) => {
                      const gradingKey = `${sub.assignmentId}-${sub.studentId}`;
                      const isInlineGrading = inlineGradingKey === gradingKey;

                      return (
                        <div key={gradingKey} className="p-4 rounded-xl border border-white/8 bg-[#0E1626] hover:border-[#0284C7]/40 transition-all space-y-3">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div className="text-left space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono uppercase">
                                  {sub.courseCode}
                                </span>
                                <span className="text-xs text-[#F8FAFC] font-bold">
                                  {sub.assignmentTitle}
                                </span>
                              </div>
                              <p className="text-xs text-[#94A3B8]">
                                Submitted by: <strong className="text-[#F8FAFC]">{sub.studentName}</strong> ({sub.studentId})
                              </p>
                              <p className="text-[10px] text-[#64748B] font-mono">
                                File: <span className="text-[#CBD5E1] underline">{sub.fileName}</span> • {new Date(sub.submittedAt).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAssignmentId(sub.assignmentId);
                                  setSelectedStudentId(sub.studentId);
                                  
                                  if (isInlineGrading) {
                                    setInlineGradingKey(null);
                                  } else {
                                    setInlineGradingKey(gradingKey);
                                    setInlineGrade(`A (48/${sub.points})`);
                                    setInlineFeedback(`Excellent lab results, correct formulation calculations.`);
                                  }
                                }}
                                className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              >
                                {isInlineGrading ? "Cancel" : "Check & Mark"}
                              </button>
                            </div>
                          </div>

                          {/* Inline Grading Form */}
                          {isInlineGrading && (
                            <div className="bg-glass p-4 rounded-xl border border-[#0284C7]/30 space-y-3 animate-fade-in text-left">
                              <h4 className="font-bold text-[#38BDF8] border-b border-white/8 pb-1.5 mb-1.5 uppercase font-mono tracking-wider text-[10px]">
                                Grade Student Submission
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-1">
                                  <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase font-mono">Awarded Grade</label>
                                  <input
                                    type="text"
                                    value={inlineGrade}
                                    onChange={(e) => setInlineGrade(e.target.value)}
                                    placeholder="e.g. A (45/50)"
                                    className="w-full bg-[#0E1626] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase font-mono">Clinical Feedback / Remarks</label>
                                  <input
                                    type="text"
                                    value={inlineFeedback}
                                    onChange={(e) => setInlineFeedback(e.target.value)}
                                    placeholder="e.g. Accurate analysis of paracetamol dissolution rate."
                                    className="w-full bg-[#0E1626] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGradeAssignment(sub.assignmentId, sub.studentId, inlineGrade, inlineFeedback);
                                    setInlineGradingKey(null);
                                    setSuccessText(`Successfully graded ${sub.studentName}'s assignment!`);
                                    setTimeout(() => setSuccessText(""), 4000);
                                  }}
                                  className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve & Save Grade</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {pendingTab === "resources" && (
                <div className="space-y-3">
                  {pendingResources.length === 0 ? (
                    <div className="py-8 text-center bg-[#0E1626] border border-dashed border-white/10 rounded-xl">
                      <p className="text-xs text-[#94A3B8] italic font-mono">No student-submitted study resources pending approval.</p>
                    </div>
                  ) : (
                    pendingResources.map((res) => (
                      <div key={res.id} className="p-4 rounded-xl border border-white/8 bg-[#0E1626] hover:border-[#0284C7]/40 transition-all flex items-start justify-between flex-wrap gap-3 text-left">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono uppercase">
                              {res.courseCode}
                            </span>
                            <span className="text-xs text-[#F8FAFC] font-bold">
                              {res.title}
                            </span>
                            <span className="text-[9px] font-bold text-[#94A3B8] bg-glass border border-white/8 px-2 py-0.5 rounded font-mono uppercase">
                              {res.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8]">
                            Uploaded By: <strong className="text-[#F8FAFC]">{res.uploadedBy}</strong> • Year: {res.academicYear}
                          </p>
                          <p className="text-[10px] text-[#64748B] leading-relaxed">
                            {res.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApproveResource(res.id);
                              setSuccessText(`Successfully approved and published resource '${res.title}'!`);
                              setTimeout(() => setSuccessText(""), 4000);
                            }}
                            className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {pendingTab === "attendance" && (
                <div className="space-y-3">
                  {pendingSessions.length === 0 ? (
                    <div className="py-8 text-center bg-[#0E1626] border border-dashed border-white/10 rounded-xl">
                      <p className="text-xs text-[#94A3B8] italic font-mono">No roll call activation requests from Class Representatives.</p>
                    </div>
                  ) : (
                    pendingSessions.map((sess) => (
                      <div key={sess.id} className="p-4 rounded-xl border border-white/8 bg-[#0E1626] hover:border-[#0284C7]/40 transition-all flex items-start justify-between flex-wrap gap-3 text-left">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono">
                              {sess.courseCode}
                            </span>
                            <span className="text-xs text-[#F8FAFC] font-bold">
                              {sess.courseName}
                            </span>
                            <span className="text-[9px] font-bold text-[#94A3B8] bg-glass border border-white/8 px-2 py-0.5 rounded font-mono">
                              {sess.academicYear}
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8]">
                            Requested By Rep: <strong className="text-[#F8FAFC]">{sess.requestedBy || "Jean de Dieu"}</strong> • Hours: {sess.timeSlot}
                          </p>
                          <p className="text-[10px] font-mono text-[#38BDF8]">
                            Passcode: <span className="bg-glass border border-white/8 px-1.5 py-0.5 rounded font-bold">{sess.passcode}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApproveAttendanceSession(sess.id);
                              setSuccessText(`Successfully approved and activated roll call for ${sess.courseCode}!`);
                              setTimeout(() => setSuccessText(""), 4000);
                            }}
                            className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Activate</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        
        {/* Left Card: Broadcast announcements */}
        <div className="bg-glass rounded-2xl border border-white/8 p-6 space-y-4 shadow-md">
          <div className="border-b border-white/8 pb-3 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="font-bold text-[#F8FAFC] text-base">Broadcast Notice / Targeted Materials</h3>
          </div>

          <form onSubmit={handleAnnSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Alert Category</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAnnType("announcement")}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    annType === "announcement" ? "bg-[#0284C7] border-[#0284C7] text-white shadow-xs" : "bg-[#0E1626] border-white/8 text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  General Notice
                </button>
                <button
                  type="button"
                  onClick={() => setAnnType("assignment")}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    annType === "assignment" ? "bg-[#0284C7] border-[#0284C7] text-white shadow-xs" : "bg-[#0E1626] border-white/8 text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setAnnType("grade")}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    annType === "grade" ? "bg-[#0284C7] border-[#0284C7] text-white shadow-xs" : "bg-[#0E1626] border-white/8 text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  Grades Released
                </button>
              </div>
            </div>

            {/* Folder / Module tab targeting input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#0E1626] rounded-xl border border-white/8">
              <div>
                <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Target Folder</label>
                <select
                  value={targetLecturerName}
                  onChange={(e) => setTargetLecturerName(e.target.value)}
                  className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                >
                  {Object.keys(LECTURER_MODULES).map((lec) => (
                    <option key={lec} value={lec}>
                      {lec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Target Module Tab</label>
                <select
                  value={targetModuleName}
                  onChange={(e) => setTargetModuleName(e.target.value)}
                  className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                >
                  {(LECTURER_MODULES[targetLecturerName] || []).map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Pharmacology I Rescheduled Study Session"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Announcement Body</label>
              <textarea
                required
                placeholder="Write detailed information for students..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] h-24 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 blue-gradient-btn text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md glow-blue-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Notice</span>
              </button>
              <button
                type="button"
                onClick={handleExportDraftPDF}
                className="px-3 py-2.5 bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] hover:bg-[#EC407A] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Export notice directly as PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF Draft</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Grade Coursework */}
        <div className="bg-glass rounded-2xl border border-white/8 p-6 space-y-4 shadow-md">
          <div className="border-b border-white/8 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="font-bold text-[#F8FAFC] text-base">Coursework Grading Portal</h3>
          </div>

          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Select Assignment *</label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                required
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
              >
                <option value="">-- Choose Coursework / Lab Test --</option>
                {assignments.map((assign) => (
                  <option key={assign.id} value={assign.id}>
                    {assign.courseCode} - {assign.title} ({assign.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Student Recipient</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                >
                  {studentsList.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Grade Awarded</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., A (48/50)"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Lecturer Feedback Comment</label>
              <textarea
                required
                placeholder="Give constructive clinical feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full blue-gradient-btn text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md glow-blue-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Record Grade & Notify</span>
            </button>
          </form>
        </div>

      </div>

      {/* Broadcast History & Published Summaries Section */}
      <div className="bg-glass rounded-2xl border border-white/8 p-6 space-y-4 text-left shadow-md">
        <div className="border-b border-white/8 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="font-bold text-[#F8FAFC] text-base">Active Lecture Summaries & Official Notices</h3>
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider">
            PDF Archive
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Review previously broadcasted lecture summaries, exam timetables, or grading alerts below. Students and lecturers can save any of these notices as formatted official PDFs.
        </p>

        {notifications && notifications.filter(n => ["announcement", "assignment", "grade"].includes(n.type)).length > 0 ? (
          <div className="border border-white/8 rounded-xl divide-y divide-white/8 overflow-hidden bg-[#0E1626]">
            {notifications
              .filter(n => ["announcement", "assignment", "grade"].includes(n.type))
              .map((notif) => {
                return (
                  <div key={notif.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0E1626] hover:bg-[#191D23] transition-all">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                          notif.type === "assignment" 
                            ? "bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]" 
                            : notif.type === "grade" 
                            ? "bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA]" 
                            : "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]"
                        }`}>
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#F8FAFC] leading-tight">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed line-clamp-2 max-w-2xl">
                        {notif.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        exportAnnouncementToPDF(notif);
                        setSuccessText(`Exported official notice "${notif.title}" successfully to PDF!`);
                        setTimeout(() => setSuccessText(""), 4000);
                      }}
                      className="bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] hover:bg-[#EC407A] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0 transition-all cursor-pointer shadow-xs"
                      title="Save as PDF to local workstation"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#0E1626] rounded-xl border border-dashed border-white/10">
            <p className="text-xs text-[#94A3B8]">No academic notices or lecture summaries have been published yet in this session.</p>
          </div>
        )}
      </div>

    </div>
  );
}
