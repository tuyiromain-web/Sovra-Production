/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckCircle, MapPin, Award, ShieldAlert, Users, Plus, 
  Calendar, Clock, Eye, AlertCircle, RefreshCw, BarChart2, Download,
  Sparkles, Check, ChevronRight, Zap
} from "lucide-react";
import { UserProfile, AttendanceSession } from "../types";

interface AttendanceTabProps {
  currentUser: UserProfile;
  attendanceSessions: AttendanceSession[];
  onCheckIn: (sessionId: string, passcode: string, studentName: string) => boolean;
  onCreateSession: (sessionData: {
    courseCode: string;
    courseName: string;
    timeSlot: string;
    passcode: string;
    academicYear: string;
  }) => void;
}

export default function AttendanceTab({
  currentUser,
  attendanceSessions,
  onCheckIn,
  onCreateSession
}: AttendanceTabProps) {
  const [passcode, setPasscode] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  // Create Session State (For Class Rep / Lecturer)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [timeSlot, setTimeSlot] = useState("08:00 - 10:00");
  const [sessionPasscode, setSessionPasscode] = useState("");
  const [sessionYear, setSessionYear] = useState("Year 2");

  // Filter sessions that are active and match student's year level
  const activeSessions = attendanceSessions.filter(
    (s) => s.isActive && (s.academicYear === currentUser.academicYear || currentUser.role !== "Student")
  );

  const handleStudentCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!selectedSessionId) {
      setErrorText("Please select a lecture session from the dropdown.");
      return;
    }

    if (!passcode.trim()) {
      setErrorText("Please enter the dynamic verification passcode.");
      return;
    }

    const isSuccess = onCheckIn(selectedSessionId, passcode, currentUser.name);

    if (isSuccess) {
      setSuccessText("Checked in successfully! GPS verified at INES-Ruhengeri Campus.");
      setPasscode("");
      setTimeout(() => setSuccessText(""), 5000);
    } else {
      setErrorText("Invalid verification passcode. Please request correct code from Class Rep or Lecturer.");
      setTimeout(() => setErrorText(""), 5000);
    }
  };

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName || !sessionPasscode) {
      alert("Please fill in all session details before creating.");
      return;
    }

    onCreateSession({
      courseCode: courseCode.toUpperCase(),
      courseName,
      timeSlot,
      passcode: sessionPasscode.toUpperCase(),
      academicYear: sessionYear
    });

    // Reset Form
    setCourseCode("");
    setCourseName("");
    setSessionPasscode("");
    setShowCreateForm(false);
    setSuccessText("New lecture attendance session published successfully!");
    setTimeout(() => setSuccessText(""), 4000);
  };

  const hasCheckedInTo = (session: AttendanceSession) => {
    return !!session.checkedInStudents[currentUser.studentId];
  };

  return (
    <div id="attendance-tab-section" className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* Alert Notices */}
      {successText && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-left shadow-lg">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
          <span className="text-xs font-mono font-bold">{successText}</span>
        </div>
      )}

      {errorText && (
        <div className="bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-left shadow-lg">
          <ShieldAlert className="w-5 h-5 text-[#EC407A] shrink-0" />
          <span className="text-xs font-mono font-bold">{errorText}</span>
        </div>
      )}

      {/* Main Grid: Student portal vs Rep Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Check-In Section */}
        <div className="bg-glass rounded-2xl border border-white/8 p-6 text-left flex flex-col justify-between shadow-md">
          <div>
            <div className="border-b border-white/8 pb-4 mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0284C7]/15 text-[#38BDF8] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>INES Student Check-In</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">Class check up for attendants • Validate attendance in active geofenced lectures</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>

            {/* Attendance Standing Visual Indicator */}
            <div className="p-4 bg-[#0E1626] border border-white/6 rounded-xl mb-5 flex items-center gap-4">
              <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1E232B]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#10B981]"
                    strokeDasharray="92, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-[#F8FAFC]">92%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Overall Attendance: Excellent</p>
                <p className="text-[10px] text-[#10B981] font-mono">Exam Qualification Secured (80% req)</p>
              </div>
            </div>

            {activeSessions.length > 0 ? (
              <form onSubmit={handleStudentCheckInSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">
                    Select Active Lecture
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] cursor-pointer"
                  >
                    <option value="">-- Choose Lecture Session --</option>
                    {activeSessions.map((s) => {
                      const alreadyChecked = hasCheckedInTo(s);
                      return (
                        <option key={s.id} value={s.id} disabled={alreadyChecked}>
                          {s.courseCode} - {s.courseName} {alreadyChecked ? "(Already Checked In)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">
                    Dynamic verification passcode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PHARM26"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0284C7] font-mono tracking-widest text-[#F8FAFC] uppercase"
                  />
                  <p className="text-[10px] text-[#64748B] mt-1">Get this passcode from the lecturer or class rep presenting.</p>
                </div>

                {/* Geofencing Verification details */}
                <div className="p-3 bg-[#0E1626] border border-white/6 rounded-xl flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#94A3B8] leading-relaxed">
                    <strong className="text-[#F8FAFC] uppercase font-mono tracking-wider text-[10px] block">
                      Campus Geofence Verified
                    </strong>
                    <p className="mt-0.5">Device coordinates verified inside INES Ruhengeri Pharmacy Faculty boundary.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white blue-gradient-btn shadow-md glow-blue-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <Clock className="w-4 h-4" />
                  <span>Confirm Campus Check-In</span>
                </button>
              </form>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0E1626] border border-white/8 flex items-center justify-center text-[#64748B] mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#F8FAFC]">No active lecture sessions</p>
                <p className="text-xs text-[#94A3B8] max-w-[220px] mx-auto">
                  There are currently no attendance sessions open for your academic level ({currentUser.academicYear}).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Stats & Log Viewer */}
        <div className="lg:col-span-2 bg-glass rounded-2xl border border-white/8 p-6 text-left shadow-md">
          <div className="border-b border-white/8 pb-4 mb-5 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 text-[#A78BFA] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <span>Attendance Logs & Roll Calls</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Class rolls and lecture registration registries</p>
            </div>

            {/* Check if user can create sessions */}
            {(currentUser.role === "Class Representative" || currentUser.role === "Lecturer" || currentUser.role === "Admin") && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white blue-gradient-btn flex items-center gap-1.5 shadow-sm glow-blue-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Open Roll Call</span>
              </button>
            )}
          </div>

          {/* Create Attendance Session drawer form */}
          {showCreateForm && (
            <div className="bg-[#0E1626] p-5 border border-[#0284C7]/30 rounded-2xl mb-5 space-y-4 animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <h4 className="font-bold text-sm text-[#F8FAFC]">Publish Automated Lecture Roll Call</h4>
              </div>
              <form onSubmit={handleCreateSessionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., PHA 211"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Pharmacology I"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  >
                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                    <option value="10:30 - 12:30">10:30 - 12:30</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Student Year Level</label>
                  <select
                    value={sessionYear}
                    onChange={(e) => setSessionYear(e.target.value)}
                    className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  >
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Dynamic Passcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., PHARM26"
                    value={sessionPasscode}
                    onChange={(e) => setSessionPasscode(e.target.value)}
                    className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] uppercase font-mono tracking-wider"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white hover:bg-[#1E232B] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 blue-gradient-btn text-white font-bold rounded-xl text-xs cursor-pointer shadow-md glow-blue-sm"
                  >
                    Launch Roll Call
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-4">
            {attendanceSessions.map((session) => {
              const checkedInCount = Object.keys(session.checkedInStudents).length;
              const hasCheckedIn = hasCheckedInTo(session);

              return (
                <div key={session.id} className="p-5 rounded-2xl border border-white/8 bg-[#0E1626] hover:border-[#0284C7]/30 transition-all duration-200 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2.5 py-0.5 rounded-lg font-mono">
                          {session.courseCode}
                        </span>
                        <span className="text-sm font-bold text-[#F8FAFC]">
                          {session.courseName}
                        </span>
                        <span className="text-[9px] font-bold text-[#94A3B8] bg-[#1E232B] px-2 py-0.5 border border-white/8 rounded-md font-mono">
                          {session.academicYear}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] font-mono flex items-center gap-2">
                        <span>Date: {session.date}</span>
                        <span>•</span>
                        <span>Hours: {session.timeSlot}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {session.approved === false ? (
                        <span className="bg-[#F59E0B]/15 text-[#F59E0B] font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-[#F59E0B]/30 animate-pulse font-mono">
                          Pending Lecturer Approval
                        </span>
                      ) : session.isActive ? (
                        <span className="bg-[#10B981]/15 text-[#10B981] font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-[#10B981]/30 animate-pulse font-mono">
                          Active Roll Call
                        </span>
                      ) : (
                        <span className="bg-[#1E232B] text-[#64748B] font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-white/8 font-mono">
                          Session Closed
                        </span>
                      )}

                      {hasCheckedIn && (
                        <span className="bg-[#10B981]/20 text-[#10B981] font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-[#10B981]/40 font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> Checked-In
                        </span>
                      )}
                    </div>
                  </div>

                  {/* List of registered students inside this session */}
                  <div className="bg-glass p-3.5 rounded-xl border border-white/6 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                      <span>Verified Attendees ({checkedInCount} checked-in)</span>
                      
                      {/* Passcode reveal for reps/lecturers */}
                      {(currentUser.role === "Class Representative" || currentUser.role === "Lecturer" || currentUser.role === "Admin") && (
                        <span className="font-bold text-[#38BDF8] flex items-center gap-1.5">
                          Passcode: <span className="bg-[#1E232B] px-2 py-0.5 rounded-lg border font-mono border-white/10 text-white">{session.passcode}</span>
                        </span>
                      )}
                    </div>

                    {checkedInCount > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(session.checkedInStudents).map(([stdId, detail]) => (
                          <div key={stdId} className="bg-[#0E1626] p-2.5 border border-white/6 rounded-lg text-[11px] flex items-center justify-between">
                            <div className="truncate min-w-0 pr-1">
                              <p className="font-bold text-[#F8FAFC] truncate">{detail.studentName}</p>
                              <p className="text-[9px] text-[#64748B] font-mono">{new Date(detail.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                            <span className="text-[9px] text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-1.5 py-0.5 rounded font-mono flex-shrink-0">GPS OK</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#64748B] italic py-2 text-center">No attendees verified yet for this session.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
