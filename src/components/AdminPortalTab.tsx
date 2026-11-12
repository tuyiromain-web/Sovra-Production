/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, Clock, CheckSquare, MessageSquare, 
  Trash2, Check, X, Search, Filter, Plus, Calendar, 
  Eye, FileSpreadsheet, Lock, Unlock, ArrowRight, 
  GraduationCap, Sliders, ShieldCheck, UserCheck, AlertCircle,
  Pin, Sparkles, Send, FileText, CheckCircle2, UserPlus, ShieldAlert, RotateCcw
} from "lucide-react";
import { UserProfile, UserRole, StudyResource, Assignment, ForumPost, AttendanceSession } from "../types";

interface AdminPortalTabProps {
  currentUser: UserProfile;
  resources: StudyResource[];
  setResources: React.Dispatch<React.SetStateAction<StudyResource[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  attendanceSessions: AttendanceSession[];
  setAttendanceSessions: React.Dispatch<React.SetStateAction<AttendanceSession[]>>;
  onAddNotification: (title: string, message: string, type: any) => void;
}

interface LocalUserObj {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  academicYear: string;
  joinedAt: string;
}

export default function AdminPortalTab({
  currentUser,
  resources,
  setResources,
  assignments,
  setAssignments,
  forumPosts,
  setForumPosts,
  attendanceSessions,
  setAttendanceSessions,
  onAddNotification
}: AdminPortalTabProps) {
  
  // Verification check: Only authorized for admins
  const isAuthorized = currentUser.role === "Admin";

  // Sub-tabs in Admin Portal
  const [adminTab, setAdminTab] = useState<"metrics" | "users" | "resources" | "attendance" | "assignments" | "forums">("metrics");

  // User management states
  const [usersList, setUsersList] = useState<LocalUserObj[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("All");
  
  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("Student");
  const [newUserYear, setNewUserYear] = useState("Year 1");

  // Success/error alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Resource oversight search & filters
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceStatusFilter, setResourceStatusFilter] = useState<string>("All");

  // Attendance oversight search & filters
  const [attendanceSearch, setAttendanceSearch] = useState("");

  // Forums oversight search
  const [forumSearch, setForumSearch] = useState("");

  // Load registered users from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("sovra_local_users") || localStorage.getItem("pharmalink_local_users");
    let users: LocalUserObj[] = [];
    
    // Seed initial users list if empty to show a highly populated interface
    if (!saved || JSON.parse(saved).length === 0) {
      users = [
        {
          id: "student-user",
          name: "Pascal Gasana",
          email: "pascal@ines.ac.rw",
          studentId: "std-1102",
          role: "Student",
          academicYear: "Year 2",
          joinedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "student-rep",
          name: "Jean de Dieu",
          email: "jeandedieu@ines.ac.rw",
          studentId: "student-rep",
          role: "Class Representative",
          academicYear: "Year 3",
          joinedAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "lecturer-user",
          name: "Dr. Emmanuel Mutangana",
          email: "emutangana@ines.ac.rw",
          studentId: "LEC-405",
          role: "Lecturer",
          academicYear: "Year 4",
          joinedAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "usr-seed-1",
          name: "Marie-Claire Uwumukiza",
          email: "m.uwumukiza@ines.ac.rw",
          studentId: "LEC-881",
          role: "Lecturer",
          academicYear: "Year 4",
          joinedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: "usr-seed-2",
          name: "Olivier Nsengiyumva",
          email: "olivier.n@ines.ac.rw",
          studentId: "STD-9043",
          role: "Student",
          academicYear: "Year 1",
          joinedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
        }
      ];
      localStorage.setItem("sovra_local_users", JSON.stringify(users));
    } else {
      try {
        const decoded = JSON.parse(saved);
        users = decoded.map(({ password, ...u }: any) => u);
      } catch (e) {
        // ignore
      }
    }
    setUsersList(users);
  }, []);

  const triggerAlert = (success: string, error = "") => {
    if (success) {
      setSuccessMsg(success);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  // --- ACTIONS: USER MANAGEMENT ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newUserName.trim() || !newUserEmail.trim()) {
      triggerAlert("", "Full Name and Email Address are required.");
      return;
    }

    const emailLower = newUserEmail.trim().toLowerCase();
    const isExists = usersList.some((u) => u.email === emailLower);
    if (isExists) {
      triggerAlert("", "A user with this email address is already in our academic register.");
      return;
    }

    const newUser: LocalUserObj = {
      id: `usr-gen-${Date.now()}`,
      name: newUserName.trim(),
      email: emailLower,
      studentId: newUserRole === "Lecturer" ? `LEC-${Math.floor(100 + Math.random() * 900)}` : (newUserRole === "Admin" ? `ADM-${Math.floor(100 + Math.random() * 900)}` : `STD-${Math.floor(1000 + Math.random() * 9000)}`),
      role: newUserRole,
      academicYear: newUserRole === "Lecturer" ? "Year 4" : (newUserRole === "Admin" ? "All Years" : newUserYear),
      joinedAt: new Date().toISOString()
    };

    // Save to localStorage with default simulated password
    const saved = localStorage.getItem("sovra_local_users") || localStorage.getItem("pharmalink_local_users") || "[]";
    const currentLocals = JSON.parse(saved);
    currentLocals.push({ ...newUser, password: "password" });
    localStorage.setItem("sovra_local_users", JSON.stringify(currentLocals));

    // Update state list
    setUsersList((prev) => [newUser, ...prev]);
    setShowAddUserModal(false);
    
    // Reset forms
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Student");
    setNewUserYear("Year 1");

    triggerAlert(`Successfully registered ${newUser.name} as a secure ${newUser.role}!`);
    onAddNotification(
      "Admin Added User Account",
      `The System Administrator registered a new user account: ${newUser.name} (${newUser.role}) in the university ledger.`,
      "announcement"
    );
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (userId === "admin-user" || name === currentUser.name) {
      triggerAlert("", "Security restriction: You cannot delete your own active administrator profile.");
      return;
    }

    if (window.confirm(`Are you absolutely sure you want to revoke system privileges and delete the account for ${name}?`)) {
      const saved = localStorage.getItem("sovra_local_users") || localStorage.getItem("pharmalink_local_users") || "[]";
      const currentLocals = JSON.parse(saved);
      const filteredLocals = currentLocals.filter((u: any) => u.id !== userId);
      localStorage.setItem("sovra_local_users", JSON.stringify(filteredLocals));

      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      triggerAlert(`Revoked privileges and purged profile data for ${name}.`);
    }
  };

  const handleChangeRole = (userId: string, name: string, nextRole: UserRole) => {
    const saved = localStorage.getItem("sovra_local_users") || localStorage.getItem("pharmalink_local_users") || "[]";
    const currentLocals = JSON.parse(saved);
    const updatedLocals = currentLocals.map((u: any) => {
      if (u.id === userId) {
        return { 
          ...u, 
          role: nextRole, 
          academicYear: nextRole === "Lecturer" ? "Year 4" : (nextRole === "Admin" ? "All Years" : "Year 3")
        };
      }
      return u;
    });
    localStorage.setItem("sovra_local_users", JSON.stringify(updatedLocals));

    setUsersList((prev) => prev.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: nextRole,
          academicYear: nextRole === "Lecturer" ? "Year 4" : (nextRole === "Admin" ? "All Years" : "Year 3")
        };
      }
      return u;
    }));

    triggerAlert(`Promoted/Updated ${name} to role: ${nextRole}`);
  };

  // --- ACTIONS: RESOURCES OVERSIGHT ---
  const handleApproveResource = (id: string, title: string) => {
    setResources((prev) =>
      prev.map((r) => r.id === id ? { ...r, approved: true } : r)
    );
    triggerAlert(`Successfully approved and published '${title}' to library.`);
    onAddNotification(
      "Academic Resource Published",
      `System Admin approved and added '${title}' to INES-Ruhengeri Pharmacy Library directory.`,
      "announcement"
    );
  };

  const handleDeleteResource = (id: string, title: string) => {
    if (window.confirm(`Delete and permanently purge study resource '${title}'?`)) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      triggerAlert(`Purged study resource '${title}' from system registry.`);
    }
  };

  // --- ACTIONS: ROLL CALL OVERSIGHT ---
  const handleToggleAttendanceSession = (id: string, code: string, currentStatus: boolean) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => s.id === id ? { ...s, isActive: !currentStatus } : s)
    );
    triggerAlert(`Attendance roll call session ${code} is now ${!currentStatus ? "ACTIVE" : "INACTIVE"}.`);
  };

  const handleApproveAttendanceSession = (id: string, courseCode: string) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => s.id === id ? { ...s, approved: true, isActive: true } : s)
    );
    triggerAlert(`Approved and opened roll call activation code for ${courseCode}.`);
  };

  const handleDeleteAttendanceSession = (id: string, courseCode: string) => {
    if (window.confirm(`Delete the entire attendance register slot for ${courseCode}?`)) {
      setAttendanceSessions((prev) => prev.filter((s) => s.id !== id));
      triggerAlert(`Deleted attendance session register for ${courseCode}.`);
    }
  };

  // --- ACTIONS: ASSIGNMENTS DATABASE ---
  const handleDeleteAssignment = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete assignment '${title}' and purge all student submissions?`)) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      triggerAlert(`Deleted task '${title}' and purged submissions.`);
    }
  };

  const handleUpdateStudentGrade = (assignmentId: string, studentId: string, nextGrade: string, feedback: string) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.id === assignmentId) {
          const updatedSub = { ...assign.submissions[studentId], grade: nextGrade, feedback };
          return {
            ...assign,
            submissions: {
              ...assign.submissions,
              [studentId]: updatedSub
            }
          };
        }
        return assign;
      })
    );
    triggerAlert(`Saved grade correction '${nextGrade}' for student ${studentId}.`);
  };

  // --- ACTIONS: FORUMS MODERATION ---
  const handleTogglePinPost = (id: string, title: string, currentlyPinned: boolean) => {
    setForumPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, isPinned: !currentlyPinned } : p)
    );
    triggerAlert(currentlyPinned ? `Unpinned '${title}'` : `Pinned '${title}' to the top of discussion boards.`);
  };

  const handleDeleteForumPost = (id: string) => {
    if (window.confirm("Permanently delete this discussion thread and all associated replies?")) {
      setForumPosts((prev) => prev.filter((p) => p.id !== id));
      triggerAlert("Purged inappropriate or spam forum thread.");
    }
  };

  const handleDeleteForumReply = (postId: string, replyId: string) => {
    if (window.confirm("Permanently remove this specific reply?")) {
      setForumPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              replies: p.replies.filter((r) => r.id !== replyId)
            };
          }
          return p;
        })
      );
      triggerAlert("Purged forum reply from system.");
    }
  };

  // --- FILTERS & COMPUTATIONS ---
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.studentId.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                          r.courseCode.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                          r.uploadedBy.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchesStatus = resourceStatusFilter === "All" || 
                          (resourceStatusFilter === "Pending" && !r.approved) ||
                          (resourceStatusFilter === "Approved" && r.approved);
    return matchesSearch && matchesStatus;
  });

  const filteredAttendance = attendanceSessions.filter((s) => {
    return s.courseCode.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
           s.courseName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
           (s.requestedBy && s.requestedBy.toLowerCase().includes(attendanceSearch.toLowerCase()));
  });

  const filteredForums = forumPosts.filter((p) => {
    return p.title.toLowerCase().includes(forumSearch.toLowerCase()) ||
           p.content.toLowerCase().includes(forumSearch.toLowerCase()) ||
           p.authorName.toLowerCase().includes(forumSearch.toLowerCase());
  });

  // Calculate high level metrics
  const totalSubmissionsCount = assignments.reduce((acc, current) => {
    return acc + Object.keys(current.submissions || {}).length;
  }, 0);

  const pendingApprovalsCount = resources.filter((r) => !r.approved).length + 
                                 attendanceSessions.filter((s) => !s.approved).length;

  const handleResetResources = () => {
    if (window.confirm("Reset all academic resources back to default seeded state?")) {
      localStorage.removeItem("sovra_resources");
      localStorage.removeItem("pharmalink_resources");
      window.location.reload();
    }
  };

  const handleResetAttendance = () => {
    if (window.confirm("Reset entire Attendance registers back to seeds?")) {
      localStorage.removeItem("sovra_attendance");
      localStorage.removeItem("pharmalink_attendance");
      window.location.reload();
    }
  };

  const handleResetUsers = () => {
    if (window.confirm("Revoke all local user creations and reset user registry to seed values?")) {
      localStorage.removeItem("sovra_local_users");
      localStorage.removeItem("pharmalink_local_users");
      window.location.reload();
    }
  };

  useEffect(() => {
    (window as any).__resetResources = handleResetResources;
    (window as any).__resetAttendance = handleResetAttendance;
    (window as any).__resetUsers = handleResetUsers;
  }, []);

  // Render gate screen if user is NOT administrator
  if (!isAuthorized) {
    return (
      <div id="unauthorized-admin-gate" className="p-8 bg-glass rounded-2xl border border-white/8 text-center space-y-4 max-w-xl mx-auto my-12 shadow-xl text-[#F8FAFC]">
        <div className="inline-flex p-4 bg-[#EC407A]/15 text-[#EC407A] rounded-2xl border border-[#EC407A]/30">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h3 className="font-bold text-xl text-[#F8FAFC]">Security Access Restricted</h3>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          You are currently logged in as a <strong className="text-[#F8FAFC]">{currentUser.role}</strong>. The System Administration Bureau is restricted exclusively to authenticated INES-Ruhengeri Pharmacy Division Administrators.
        </p>
        <p className="text-[10px] font-mono text-[#EC407A] bg-[#0E1626] p-2.5 rounded-xl border border-[#EC407A]/30">
          SECURITY PROTOCOL ENFORCED • UNAUTHORIZED LOGS RECORDED
        </p>
      </div>
    );
  }

  return (
    <div id="admin-portal-dashboard" className="space-y-6 text-[#F8FAFC]">
      
      {/* Discreet control & status bar without words */}
      <div className="bg-glass border border-white/8 p-3 rounded-2xl flex items-center justify-between shadow-md animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0284C7]/20 text-[#38BDF8] rounded-xl border border-[#0284C7]/30">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetResources}
            className="p-2.5 bg-[#0E1626] hover:bg-white/10 border border-white/8 rounded-xl text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
            aria-label="Action 1"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetAttendance}
            className="p-2.5 bg-[#0E1626] hover:bg-white/10 border border-white/8 rounded-xl text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
            aria-label="Action 2"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetUsers}
            className="p-2.5 bg-[#0E1626] hover:bg-white/10 border border-white/8 rounded-xl text-[#94A3B8] hover:text-[#10B981] transition-colors cursor-pointer"
            aria-label="Action 3"
          >
            <Users className="w-4 h-4" />
          </button>
          <div className="flex items-center bg-[#0E1626] px-2.5 py-2.5 rounded-xl border border-white/8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Success / Error Toast Alerts */}
      {(successMsg || errorMsg) && (
        <div className="animate-fade-in text-left">
          {successMsg && (
            <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-xl text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] rounded-xl text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-[#EC407A] shrink-0" />
              <span className="font-bold">{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* 📊 System Metrics Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-glass border border-white/8 rounded-2xl text-left space-y-1.5 hover:border-[#0284C7]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Academic Roster</span>
            <Users className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC]">{usersList.length}</div>
          <p className="text-[9px] text-[#64748B] font-mono uppercase">Verified Accounts</p>
        </div>

        <div className="p-4 bg-glass border border-white/8 rounded-2xl text-left space-y-1.5 hover:border-[#0284C7]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Library Files</span>
            <BookOpen className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC]">{resources.length}</div>
          <p className="text-[9px] text-[#64748B] font-mono uppercase">Shared Documents</p>
        </div>

        <div className="p-4 bg-glass border border-white/8 rounded-2xl text-left space-y-1.5 hover:border-[#0284C7]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Attendance Logs</span>
            <Clock className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC]">{attendanceSessions.length}</div>
          <p className="text-[9px] text-[#64748B] font-mono uppercase">Lectures Tracked</p>
        </div>

        <div className="p-4 bg-glass border border-white/8 rounded-2xl text-left space-y-1.5 hover:border-[#0284C7]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Deliverables</span>
            <CheckSquare className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC]">{totalSubmissionsCount}</div>
          <p className="text-[9px] text-[#64748B] font-mono uppercase">Submissions</p>
        </div>

        <div className="p-4 bg-glass border border-[#F59E0B]/30 rounded-2xl col-span-2 lg:col-span-1 text-left space-y-1.5 bg-[#F59E0B]/10 shadow-sm">
          <div className="flex items-center justify-between text-[#F59E0B]">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Audit Queue</span>
            <Sliders className="w-4 h-4 text-[#F59E0B] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#F59E0B]">{pendingApprovalsCount}</div>
          <p className="text-[9px] text-[#F59E0B] font-mono uppercase font-bold">Actions Required</p>
        </div>
      </div>

      {/* Main Admin Tab bar */}
      <div className="flex border-b border-white/8 overflow-x-auto whitespace-nowrap scrollbar-none bg-glass rounded-2xl border p-1.5 gap-1.5">
        <button
          onClick={() => setAdminTab("metrics")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "metrics"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          📊 System Metrics
        </button>

        <button
          onClick={() => setAdminTab("users")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "users"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          👥 User Registry ({usersList.length})
        </button>

        <button
          onClick={() => setAdminTab("resources")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "resources"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          📚 Study Resources ({resources.length})
        </button>

        <button
          onClick={() => setAdminTab("attendance")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "attendance"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          ⏰ Attendance Registers
        </button>

        <button
          onClick={() => setAdminTab("assignments")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "assignments"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          📝 Assignments & Grades
        </button>

        <button
          onClick={() => setAdminTab("forums")}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            adminTab === "forums"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
          }`}
        >
          💬 Forum Oversight
        </button>
      </div>

      {/* Render selected admin view tab */}
      <div className="bg-glass border border-white/8 rounded-2xl p-6 text-left animate-fade-in min-h-[350px] shadow-md">
        
        {/* --- TAB 1: METRICS OVERVIEW & SETTINGS --- */}
        {adminTab === "metrics" && (
          <div className="space-y-6">
            <div className="border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">System Metrics & Compliance Ratios</h3>
              <p className="text-xs text-[#94A3B8]">Comprehensive statistics concerning student repository submission rates and verified accounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0E1626] border border-white/8 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#38BDF8] border-b border-white/8 pb-1.5">Academic Resource Ratio</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#94A3B8]">Approved & Published:</span>
                    <span className="font-bold text-[#10B981]">{resources.filter(r => r.approved).length}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#94A3B8]">Awaiting Approval:</span>
                    <span className="font-bold text-[#F59E0B]">{resources.filter(r => !r.approved).length}</span>
                  </div>
                  <div className="w-full bg-glass h-2 rounded-full overflow-hidden mt-2 border border-white/8">
                    <div 
                      className="bg-[#0284C7] h-full" 
                      style={{ width: `${resources.length ? (resources.filter(r => r.approved).length / resources.length) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#64748B] italic">Approval rate of student-submitted reference materials.</p>
                </div>
              </div>

              <div className="p-4 bg-[#0E1626] border border-white/8 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#38BDF8] border-b border-white/8 pb-1.5">Lectures Roll Call Security</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#94A3B8]">Active Live Code Slots:</span>
                    <span className="font-bold text-[#10B981]">{attendanceSessions.filter(s => s.isActive).length}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#94A3B8]">Total Registrations:</span>
                    <span className="font-bold text-[#F8FAFC]">{attendanceSessions.length}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#94A3B8]">Awaiting Rep Validation:</span>
                    <span className="font-bold text-[#F59E0B]">{attendanceSessions.filter(s => !s.approved).length}</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] italic mt-1.5">Checked-in logs are cross-referenced with simulated geofences.</p>
                </div>
              </div>

              <div className="p-4 bg-[#0E1626] border border-white/8 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#38BDF8] border-b border-white/8 pb-1.5">Division Policy Standard</h4>
                <div className="space-y-2 text-xs text-[#94A3B8]">
                  <p className="text-xs leading-relaxed text-[#CBD5E1]">
                    All student directories are audited continuously for academic standard compliance and integrity.
                  </p>
                  <div className="p-2.5 bg-glass text-[#CBD5E1] font-mono text-[10px] rounded-lg border border-white/8 flex items-center justify-between mt-2">
                    <span>SECURITY_ENCRYPTION</span>
                    <span className="text-[#10B981] font-bold">SHA-256</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: USER REGISTRY --- */}
        {adminTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <h3 className="font-bold text-base text-[#F8FAFC]">Verified User Accounts Ledger</h3>
                <p className="text-xs text-[#94A3B8]">Maintain security compliance by registering new faculty, assigning roles, or purging defunct accounts.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="blue-gradient-btn text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md glow-blue-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Faculty/Student</span>
              </button>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] w-4 h-4 my-auto" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name, email, or registry ID..."
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-[#0E1626] border border-white/10 rounded-xl p-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Class Representative">Class Rep</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto border border-white/8 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#0E1626] border-b border-white/8 font-bold text-[#94A3B8]">
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Registry ID</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Academic Role</th>
                    <th className="p-3">Roster Class</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#94A3B8] italic font-mono">
                        No user account profiles matched your active query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#0E1626] transition-colors">
                        <td className="p-3 font-bold text-[#F8FAFC] flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/30 flex items-center justify-center font-bold text-[#38BDF8] text-[10px] uppercase shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[150px]">{u.name}</span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-[#94A3B8]">{u.studentId}</td>
                        <td className="p-3 font-mono text-[10px] text-[#94A3B8]">{u.email}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase ${
                            u.role === "Admin" ? "bg-[#EC407A]/15 text-[#EC407A] border-[#EC407A]/30" :
                            u.role === "Lecturer" ? "bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30" :
                            u.role === "Class Representative" ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" :
                            "bg-white/5 text-[#CBD5E1] border-white/10"
                          }`}>
                            {u.role === "Class Representative" ? "Class Rep" : u.role}
                          </span>
                        </td>
                        <td className="p-3 text-[#94A3B8] font-medium text-[11px]">{u.academicYear}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="inline-flex gap-2">
                            {u.role !== "Admin" && (
                              <select
                                onChange={(e) => handleChangeRole(u.id, u.name, e.target.value as UserRole)}
                                className="bg-[#0E1626] border border-white/10 text-[9px] text-[#F8FAFC] px-1.5 py-0.5 rounded cursor-pointer"
                                defaultValue={u.role}
                                title="Change academic tier role"
                              >
                                <option value="Student">Student</option>
                                <option value="Class Representative">Class Rep</option>
                                <option value="Lecturer">Lecturer</option>
                                <option value="Admin">Admin</option>
                              </select>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1 text-[#EC407A] hover:bg-[#EC407A]/15 border border-transparent hover:border-[#EC407A]/30 rounded-lg cursor-pointer transition-colors"
                              title="Purge profile data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ADD USER MODAL */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-glass rounded-2xl border border-white/10 max-w-md w-full shadow-2xl overflow-hidden text-left animate-slide-in">
                  <div className="bg-[#0E1626] p-4 text-[#F8FAFC] flex items-center justify-between border-b border-white/8">
                    <h3 className="font-bold text-sm">Register Faculty/Student Profile</h3>
                    <button onClick={() => setShowAddUserModal(false)} className="text-[#94A3B8] hover:text-white cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddUser} className="p-6 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-[#94A3B8] uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="e.g. Marie-Louise Uwimana"
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-[#94A3B8] uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="e.g. ml.uwimana@ines.ac.rw"
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-[#94A3B8] uppercase">Academic Role</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => {
                            const r = e.target.value as UserRole;
                            setNewUserRole(r);
                            if (r === "Lecturer") setNewUserYear("Year 4");
                            else if (r === "Admin") setNewUserYear("All Years");
                          }}
                          className="w-full bg-[#0E1626] border border-white/10 rounded-xl p-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] cursor-pointer"
                        >
                          <option value="Student">Student</option>
                          <option value="Class Representative">Class Rep</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-[#94A3B8] uppercase">Academic Year</label>
                        <select
                          value={newUserYear}
                          disabled={newUserRole === "Lecturer" || newUserRole === "Admin"}
                          onChange={(e) => setNewUserYear(e.target.value)}
                          className="w-full bg-[#0E1626] border border-white/10 rounded-xl p-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] cursor-pointer disabled:opacity-50"
                        >
                          <option value="Year 1">Year 1</option>
                          <option value="Year 2">Year 2</option>
                          <option value="Year 3">Year 3</option>
                          <option value="Year 4">Year 4</option>
                          <option value="Year 5">Year 5</option>
                          <option value="All Years">All Years</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0E1626] border border-white/8 text-[#94A3B8] text-[10px] rounded-xl leading-normal">
                      ⚠️ Registered users access the portal with default testing password <strong className="font-mono text-[#38BDF8]">password</strong>.
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-white/8">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="border border-white/10 hover:bg-[#0E1626] text-[#94A3B8] text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="blue-gradient-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md glow-blue-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm Register</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: STUDY RESOURCES --- */}
        {adminTab === "resources" && (
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">Study Resources Repository Oversight</h3>
              <p className="text-xs text-[#94A3B8]">Review, approve, or remove students' uploaded files, slide notes, reference textbooks, and journals.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] w-4 h-4 my-auto" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search materials by title, course code, or uploader..."
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>

              <select
                value={resourceStatusFilter}
                onChange={(e) => setResourceStatusFilter(e.target.value)}
                className="bg-[#0E1626] border border-white/10 rounded-xl p-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Awaiting Lecturer Approval</option>
                <option value="Approved">Approved & Published</option>
              </select>
            </div>

            {/* Resources list */}
            <div className="space-y-3">
              {filteredResources.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-[#0E1626]">
                  <p className="text-xs text-[#94A3B8] italic font-mono">No study resources found matching your filters.</p>
                </div>
              ) : (
                filteredResources.map((res) => (
                  <div key={res.id} className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left hover:border-[#0284C7]/40 transition-all ${
                    !res.approved ? "bg-[#0E1626] border-[#F59E0B]/30" : "bg-[#0E1626] border-white/8"
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono uppercase">
                          {res.courseCode}
                        </span>
                        <h4 className="font-bold text-sm text-[#F8FAFC]">{res.title}</h4>
                        <span className="text-[9px] font-bold text-[#94A3B8] bg-glass border border-white/8 px-2 py-0.5 rounded font-mono uppercase">
                          {res.category}
                        </span>
                        {!res.approved && (
                          <span className="text-[8px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-mono px-2 py-0.5 rounded-full uppercase animate-pulse">
                            Awaiting Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {res.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-[#64748B] font-mono flex-wrap">
                        <span>Format: <strong className="uppercase text-[#CBD5E1]">{res.fileType}</strong></span>
                        {res.fileSize && <span>Size: <strong className="text-[#CBD5E1]">{res.fileSize}</strong></span>}
                        <span>By: <strong className="text-[#CBD5E1]">{res.uploadedBy}</strong></span>
                        <span>Date: {new Date(res.uploadedAt).toLocaleDateString()}</span>
                        <span>Downloads: <strong className="text-[#CBD5E1]">{res.downloadsCount || 0}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {!res.approved && (
                        <button
                          onClick={() => handleApproveResource(res.id, res.title)}
                          className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="p-1.5 text-[#EC407A] hover:bg-[#EC407A]/15 border border-white/10 rounded-lg cursor-pointer transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TAB 4: ATTENDANCE REGISTERS --- */}
        {adminTab === "attendance" && (
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">Attendance Registers Control</h3>
              <p className="text-xs text-[#94A3B8]">Review lecture roll calls, check active passcode validations, audit check-in rosters.</p>
            </div>

            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] w-4 h-4 my-auto" />
              <input
                type="text"
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                placeholder="Search roll call by course code, lecture name, or representative requester..."
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] transition-all"
              />
            </div>

            <div className="space-y-4">
              {filteredAttendance.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-[#0E1626]">
                  <p className="text-xs text-[#94A3B8] italic font-mono">No academic attendance registers found.</p>
                </div>
              ) : (
                filteredAttendance.map((sess) => {
                  const checkIns = Object.entries(sess.checkedInStudents || {});
                  
                  return (
                    <div key={sess.id} className="border border-white/8 rounded-xl bg-[#0E1626] overflow-hidden text-left hover:border-[#0284C7]/40 transition-all">
                      <div className="p-4 bg-glass border-b border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono">
                              {sess.courseCode}
                            </span>
                            <h4 className="font-bold text-sm text-[#F8FAFC]">{sess.courseName}</h4>
                            <span className="text-[9px] font-bold bg-[#0E1626] border border-white/8 text-[#94A3B8] px-2 py-0.5 rounded font-mono">
                              {sess.academicYear}
                            </span>
                            {!sess.approved && (
                              <span className="text-[8px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded font-mono animate-pulse uppercase">
                                Pending Approval
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94A3B8]">
                            Lecture slot: <strong className="text-[#CBD5E1]">{sess.timeSlot}</strong> • Date: {new Date(sess.date).toLocaleDateString()}
                            {sess.requestedBy && <span> • Rep: <strong className="text-[#CBD5E1]">{sess.requestedBy}</strong></span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <div className="bg-[#0E1626] border border-white/10 px-2.5 py-1 rounded-lg font-mono text-[10px] text-[#F8FAFC] flex items-center gap-1.5">
                            <span className="text-[#94A3B8]">CODE:</span>
                            <span className="font-bold text-[#38BDF8]">{sess.passcode}</span>
                          </div>

                          {!sess.approved && (
                            <button
                              onClick={() => handleApproveAttendanceSession(sess.id, sess.courseCode)}
                              className="blue-gradient-btn text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {sess.approved && (
                            <button
                              onClick={() => handleToggleAttendanceSession(sess.id, sess.passcode, sess.isActive)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                                sess.isActive 
                                  ? "bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30" 
                                  : "bg-white/5 hover:bg-white/10 text-[#94A3B8] border border-white/10"
                              }`}
                            >
                              {sess.isActive ? <Lock className="w-3 h-3 text-[#10B981]" /> : <Unlock className="w-3 h-3 text-[#94A3B8]" />}
                              <span>{sess.isActive ? "Active (Lock)" : "Inactive (Open)"}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAttendanceSession(sess.id, sess.courseCode)}
                            className="p-1.5 text-[#EC407A] hover:bg-[#EC407A]/15 border border-white/10 rounded-lg cursor-pointer"
                            title="Delete register slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Checked in students details registry list */}
                      <div className="p-4 bg-[#0E1626] space-y-3">
                        <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                          <span className="font-bold text-[#CBD5E1]">Students Checked-in List ({checkIns.length})</span>
                          <span className="font-mono text-[10px] text-[#64748B]">INES CHECKPOINT</span>
                        </div>

                        {checkIns.length === 0 ? (
                          <p className="text-xs text-[#94A3B8] italic py-3">No students have signed in or checked into this roll call session yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {checkIns.map(([studentId, data]: [string, any]) => (
                              <div key={studentId} className="p-2.5 rounded-xl border border-white/8 bg-glass flex items-center justify-between text-xs gap-2">
                                <div className="text-left space-y-0.5">
                                  <div className="font-bold text-[#F8FAFC] truncate">{data.studentName}</div>
                                  <div className="text-[10px] text-[#64748B] font-mono">{studentId} • {new Date(data.checkedInAt).toLocaleTimeString()}</div>
                                </div>
                                <div className="shrink-0 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[9px] font-mono font-semibold px-2 py-0.5 rounded">
                                  {data.locationMethod}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TAB 5: ASSIGNMENTS & SUBMISSIONS --- */}
        {adminTab === "assignments" && (
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">Assigned Lab Tasks & Deliverables Database</h3>
              <p className="text-xs text-[#94A3B8]">Review assigned laboratory tasks, verify submitted work, and manage student grades.</p>
            </div>

            <div className="space-y-4">
              {assignments.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-[#0E1626]">
                  <p className="text-xs text-[#94A3B8] italic font-mono">No assigned lab tasks exist in the database.</p>
                </div>
              ) : (
                assignments.map((assign) => {
                  const subs = Object.entries(assign.submissions || {});
                  
                  return (
                    <div key={assign.id} className="border border-white/8 rounded-xl bg-[#0E1626] overflow-hidden text-left hover:border-[#0284C7]/40 transition-all">
                      <div className="p-4 bg-glass border-b border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono">
                              {assign.courseCode}
                            </span>
                            <h4 className="font-bold text-sm text-[#F8FAFC]">{assign.title}</h4>
                            <span className="text-[9px] font-mono text-[#94A3B8] border border-white/8 bg-[#0E1626] px-2 py-0.5 rounded">
                              Max: {assign.points} pts
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8]">
                            Course: <strong className="text-[#CBD5E1]">{assign.courseName}</strong> • Due: {new Date(assign.dueDate).toLocaleString()} • Assigned By: <strong className="text-[#CBD5E1]">{assign.uploadedBy}</strong>
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className="bg-[#0E1626] border border-white/10 text-[#F8FAFC] font-mono text-[10px] px-2.5 py-1 rounded-lg font-bold">
                            SUBMISSIONS: {subs.length}
                          </span>
                          <button
                            onClick={() => handleDeleteAssignment(assign.id, assign.title)}
                            className="p-1.5 text-[#EC407A] hover:bg-[#EC407A]/15 border border-white/10 rounded-lg cursor-pointer"
                            title="Delete assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Submissions list with inline overwrite option */}
                      <div className="p-4 space-y-3">
                        <div className="text-xs font-bold text-[#CBD5E1]">Student Submission Records</div>
                        
                        {subs.length === 0 ? (
                          <p className="text-xs text-[#94A3B8] italic py-2">No students have uploaded answers for this coursework yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {subs.map(([studentId, data]: [string, any]) => (
                              <div key={studentId} className="p-3.5 rounded-xl border border-white/8 bg-glass space-y-3 text-left">
                                <div className="flex items-start justify-between flex-wrap gap-2 text-xs">
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-[#F8FAFC]">
                                      {studentId === "std-1102" ? "Pascal Gasana" : (studentId === "student-rep" ? "Jean de Dieu" : "INES Student")}
                                      <span className="text-[#94A3B8] font-normal font-mono text-[10px] ml-2">({studentId})</span>
                                    </div>
                                    <div className="text-[10px] text-[#38BDF8] font-mono flex items-center gap-1 underline">
                                      <FileText className="w-3.5 h-3.5 shrink-0" />
                                      <span>{data.fileName}</span>
                                    </div>
                                    <div className="text-[9px] text-[#64748B] font-mono">Received: {new Date(data.submittedAt).toLocaleString()}</div>
                                  </div>

                                  <div className="text-right">
                                    {data.grade ? (
                                      <div className="space-y-1">
                                        <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                          Graded: {data.grade}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase animate-pulse">
                                        Pending Grade
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Overwrite Grading Form */}
                                <div className="bg-[#0E1626] p-3 rounded-xl border border-white/8 space-y-2">
                                  <div className="text-[9px] font-bold font-mono uppercase text-[#94A3B8]">Admin Grade Correction / Audit Override</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div className="sm:col-span-1">
                                      <input
                                        type="text"
                                        placeholder="Grade e.g. A (45/50)"
                                        defaultValue={data.grade || ""}
                                        id={`grade-inp-${assign.id}-${studentId}`}
                                        className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#F8FAFC] font-semibold"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        placeholder="Write feedback/compliance audit comments..."
                                        defaultValue={data.feedback || ""}
                                        id={`feedback-inp-${assign.id}-${studentId}`}
                                        className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#F8FAFC]"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const gradeVal = (document.getElementById(`grade-inp-${assign.id}-${studentId}`) as HTMLInputElement)?.value;
                                        const feedbackVal = (document.getElementById(`feedback-inp-${assign.id}-${studentId}`) as HTMLInputElement)?.value;
                                        handleUpdateStudentGrade(assign.id, studentId, gradeVal, feedbackVal);
                                      }}
                                      className="blue-gradient-btn text-white text-[9px] font-mono font-bold px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-xs"
                                    >
                                      Save Audit Grade Change
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TAB 6: FORUMS OVERVIEW --- */}
        {adminTab === "forums" && (
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-[#F8FAFC]">Discussions Moderation Desk</h3>
              <p className="text-xs text-[#94A3B8]">Audit discussion forums, pin major policy announcements, and moderate student posts.</p>
            </div>

            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] w-4 h-4 my-auto" />
              <input
                type="text"
                value={forumSearch}
                onChange={(e) => setForumSearch(e.target.value)}
                placeholder="Search forum titles, content snippets, or author names..."
                className="w-full bg-[#0E1626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] transition-all"
              />
            </div>

            {/* Forums oversight boards */}
            <div className="space-y-4">
              {filteredForums.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl bg-[#0E1626]">
                  <p className="text-xs text-[#94A3B8] italic font-mono">No academic discussion posts found matching search.</p>
                </div>
              ) : (
                filteredForums.map((post) => (
                  <div key={post.id} className="p-4 border border-white/8 rounded-xl bg-[#0E1626] text-left space-y-3 hover:border-[#0284C7]/40 transition-all">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded font-mono">
                            {post.category}
                          </span>
                          <h4 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-1.5">
                            {post.isPinned && <Pin className="w-3.5 h-3.5 text-[#38BDF8] fill-[#38BDF8] shrink-0 rotate-45" />}
                            <span>{post.title}</span>
                          </h4>
                        </div>
                        <p className="text-xs text-[#CBD5E1] leading-relaxed">{post.content}</p>
                        <p className="text-[10px] text-[#64748B] font-mono">
                          By: <strong className="text-[#F8FAFC]">{post.authorName}</strong> ({post.authorRole}) • {new Date(post.createdAt).toLocaleString()} • Upvotes: {post.upvotes}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleTogglePinPost(post.id, post.title, post.isPinned || false)}
                          className={`text-[9px] font-mono font-bold px-2.5 py-1 border rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                            post.isPinned
                              ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                              : "bg-glass text-[#94A3B8] border-white/10 hover:text-white"
                          }`}
                        >
                          <Pin className="w-3 h-3 rotate-45" />
                          <span>{post.isPinned ? "PINNED" : "PIN TO TOP"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteForumPost(post.id)}
                          className="p-1.5 text-[#EC407A] hover:bg-[#EC407A]/15 border border-white/10 rounded-lg cursor-pointer"
                          title="Purge post & replies"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Replies list inside post */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="border-t border-white/8 pt-3 mt-2 pl-4 space-y-2.5">
                        <div className="text-[10px] font-bold font-mono text-[#94A3B8] uppercase">Replies ({post.replies.length})</div>
                        <div className="divide-y divide-white/8 space-y-2">
                          {post.replies.map((rep) => (
                            <div key={rep.id} className="pt-2 text-xs flex items-start justify-between gap-3 text-left">
                              <div className="space-y-0.5 flex-1">
                                <p className="text-[#CBD5E1] font-medium leading-relaxed">{rep.content}</p>
                                <p className="text-[9px] text-[#64748B] font-mono">
                                  By: <strong className="text-[#F8FAFC]">{rep.authorName}</strong> ({rep.authorRole}) • {new Date(rep.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteForumReply(post.id, rep.id)}
                                className="p-1 text-[#EC407A] hover:bg-[#EC407A]/15 rounded cursor-pointer transition-colors shrink-0"
                                title="Remove reply"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
