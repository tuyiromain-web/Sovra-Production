/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  FileText, Clock, FileCheck, CheckCircle2, AlertTriangle, Send, 
  Upload, CheckCircle, ExternalLink, ShieldCheck, Tag, Sparkles,
  Award, Check
} from "lucide-react";
import { UserProfile, Assignment } from "../types";

interface AssignmentsTabProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  onSubmitAssignment: (assignmentId: string, submission: { fileName: string; fileUrl: string }) => void;
}

export default function AssignmentsTab({
  currentUser,
  assignments,
  onSubmitAssignment
}: AssignmentsTabProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [onlineNote, setOnlineNote] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFileName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (e: React.FormEvent, assignId: string) => {
    e.preventDefault();
    if (!attachedFileName && !onlineNote) {
      alert("Please upload a file or write an online comment to submit.");
      return;
    }

    const nameOfSubmittedFile = attachedFileName || "online_submission_notes.txt";
    onSubmitAssignment(assignId, {
      fileName: nameOfSubmittedFile,
      fileUrl: "#"
    });

    setAttachedFileName("");
    setOnlineNote("");
    setSelectedAssignment(null);
    
    setSuccessMessage("Your assignment has been submitted successfully! Saved securely on digital storage.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const formatDueDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr).getTime() < new Date().getTime();
  };

  return (
    <div id="assignments-tab-section" className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* Success Notification */}
      {successMessage && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
          <span className="text-xs font-mono font-bold">{successMessage}</span>
        </div>
      )}

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: List of assignments */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-md">
            <h3 className="font-bold text-base text-[#F8FAFC] mb-5 flex items-center gap-2 border-b border-white/8 pb-4">
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span>Pharmacy Course Assignments & Lab Reports</span>
            </h3>

            <div className="space-y-3.5">
              {assignments.map((assign) => {
                const submission = assign.submissions[currentUser.studentId];
                const dueStatusOverdue = isOverdue(assign.dueDate);
                const isSelected = selectedAssignment?.id === assign.id;

                return (
                  <div
                    key={assign.id}
                    onClick={() => setSelectedAssignment(assign)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all text-left relative cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                      isSelected
                        ? "border-[#0284C7] bg-[#191D23] shadow-md ring-1 ring-[#0284C7]/40"
                        : "border-white/8 hover:border-[#0284C7]/40 bg-[#0E1626] hover:bg-[#191D23]"
                    }`}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2.5 py-0.5 rounded-md uppercase font-mono">
                          {assign.courseCode}
                        </span>
                        <span className="text-xs text-[#94A3B8] truncate">
                          {assign.courseName}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-[#F8FAFC] text-sm leading-snug truncate">
                        {assign.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#94A3B8] font-mono">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                          Due: {formatDueDate(assign.dueDate)}
                        </span>
                        <span className="bg-glass border border-white/8 text-[#CBD5E1] px-2 py-0.5 rounded-md font-semibold">
                          Max Points: {assign.points}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 self-start md:self-auto flex items-center gap-2">
                      {submission ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold px-3 py-1 rounded-full border border-[#10B981]/30 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            Submitted
                          </span>
                          {submission.grade ? (
                            <span className="text-[11px] font-bold text-[#10B981] font-mono">
                              Graded: {submission.grade}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#64748B] font-mono">
                              Under Review
                            </span>
                          )}
                        </div>
                      ) : dueStatusOverdue ? (
                        <span className="bg-[#EC407A]/15 text-[#EC407A] text-[10px] font-bold px-3 py-1 rounded-full border border-[#EC407A]/30 flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EC407A] animate-pulse" />
                          Overdue
                        </span>
                      ) : (
                        <span className="bg-[#F59E0B]/15 text-[#F59E0B] text-[10px] font-bold px-3 py-1 rounded-full border border-[#F59E0B]/30 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Selected Assignment Details / Submission Panel */}
        <div className="space-y-4">
          {selectedAssignment ? (
            <div className="bg-glass rounded-2xl border border-[#0284C7]/40 p-5 space-y-4 animate-fade-in text-left shadow-xl">
              <div className="border-b border-white/8 pb-3">
                <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase tracking-wider">{selectedAssignment.courseCode} • {selectedAssignment.courseName}</span>
                <h3 className="font-bold text-[#F8FAFC] text-base mt-1">{selectedAssignment.title}</h3>
                <p className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider mt-0.5">Instructor: {selectedAssignment.uploadedBy}</p>
              </div>

              <div className="space-y-3 text-xs text-[#CBD5E1]">
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Instructions:</h4>
                  <p className="leading-relaxed bg-[#0E1626] border border-white/6 rounded-xl p-3.5 mt-1.5 text-xs text-[#CBD5E1]">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-[#0E1626] p-2.5 rounded-xl border border-white/6 text-center">
                    <p className="text-[#64748B]">POINTS</p>
                    <p className="text-sm font-bold text-[#F8FAFC] mt-0.5">{selectedAssignment.points}</p>
                  </div>
                  <div className="bg-[#0E1626] p-2.5 rounded-xl border border-white/6 text-center">
                    <p className="text-[#64748B]">STATUS</p>
                    <p className={`text-xs font-bold mt-0.5 ${isOverdue(selectedAssignment.dueDate) ? "text-[#EC407A]" : "text-[#10B981]"}`}>
                      {isOverdue(selectedAssignment.dueDate) ? "Closed" : "Open"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Status or Submission Upload Form */}
              {selectedAssignment.submissions[currentUser.studentId] ? (
                // Already Submitted View
                <div className="bg-[#0E1626] border border-[#10B981]/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
                    <span className="text-xs font-bold text-[#10B981]">Your Submission is Logged</span>
                  </div>

                  <div className="text-[11px] text-[#94A3B8] space-y-1 font-mono">
                    <p><strong className="text-[#F8FAFC]">File:</strong> {selectedAssignment.submissions[currentUser.studentId].fileName}</p>
                    <p><strong className="text-[#F8FAFC]">Logged:</strong> {new Date(selectedAssignment.submissions[currentUser.studentId].submittedAt).toLocaleString()}</p>
                  </div>

                  {selectedAssignment.submissions[currentUser.studentId].grade ? (
                    // Graded View
                    <div className="bg-glass rounded-xl p-3.5 border border-[#10B981]/30 mt-2">
                      <p className="text-xs font-bold text-[#10B981] font-mono flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#10B981]" />
                        <span>Score: {selectedAssignment.submissions[currentUser.studentId].grade}</span>
                      </p>
                      <p className="text-xs text-[#CBD5E1] italic mt-1 leading-relaxed">
                        &ldquo;{selectedAssignment.submissions[currentUser.studentId].feedback}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="bg-glass border border-white/6 rounded-lg p-2.5 text-[10px] text-[#94A3B8] text-center font-mono">
                      Awaiting lecturer review. Score will post automatically.
                    </div>
                  )}
                </div>
              ) : isOverdue(selectedAssignment.dueDate) ? (
                <div className="bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-xl p-4 flex gap-2.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#EC407A] shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold text-[#EC407A]">Submission Closed</p>
                    <p className="text-[10px] text-[#F8FAFC] leading-relaxed mt-0.5">The deadline for this assignment has elapsed. Please consult your Lecturer for extension protocols.</p>
                  </div>
                </div>
              ) : (
                // Submit Form
                <form onSubmit={(e) => handleFormSubmit(e, selectedAssignment.id)} className="space-y-3.5 pt-3 border-t border-white/8">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Drag & Drop Homework File</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`border border-dashed rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center space-y-1 bg-[#0E1626] hover:border-[#0284C7] transition-all ${
                        dragActive ? "border-[#0284C7] bg-[#0284C7]/10" : "border-white/10"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,.xlsx,.zip"
                      />
                      <Upload className="w-5 h-5 text-[#38BDF8]" />
                      <p className="text-xs font-bold text-[#F8FAFC]">
                        {attachedFileName ? `Selected: ${attachedFileName}` : "Select or drag file here"}
                      </p>
                      <p className="text-[9px] text-[#64748B] font-mono">PDF, Word, or ZIP up to 10MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Online Comment / Calculation Notes</label>
                    <textarea
                      placeholder="Add any commentary, reference formulas, or explanations for the lecturer here..."
                      value={onlineNote}
                      onChange={(e) => setOnlineNote(e.target.value)}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full blue-gradient-btn text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md glow-blue-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Assignment</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-glass rounded-2xl border border-white/8 p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-3 bg-[#0E1626] border border-white/8 rounded-xl text-[#64748B]">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#F8FAFC]">Select an Assignment</h4>
              <p className="text-xs text-[#94A3B8] max-w-[200px]">Click any assignment on the left to view instructions and upload your coursework files.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
