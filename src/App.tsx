/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { 
  Home, BookOpen, MessageSquare, CheckSquare, GraduationCap, 
  User, Settings, Bell, Clock, Menu, X, Sparkles, MapPin, CheckCircle,
  ShieldCheck
} from "lucide-react";

// Types and Initial datasets
import { 
  UserProfile, StudyResource, Assignment, ForumPost, 
  AttendanceSession, AppNotification, ForumReply, UserRole 
} from "./types";
import { SCHEDULE_EVENTS } from "./data";
import * as api from "./services/supabaseApi";

// Sub-components
import HomeDashboard from "./components/HomeDashboard";
import ResourcesTab from "./components/ResourcesTab";
import AssignmentsTab from "./components/AssignmentsTab";
import ForumTab from "./components/ForumTab";
import AttendanceTab from "./components/AttendanceTab";
import LecturerCorner from "./components/LecturerCorner";
import ProfileTab from "./components/ProfileTab";
import SettingsTab from "./components/SettingsTab";
import PharmaAI from "./components/PharmaAI";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import AdminPortalTab from "./components/AdminPortalTab";
import { RenderAvatar } from "./components/AvatarHelper";
import { ThemeToggle } from "./components/ui/ThemeToggle";

const LOCAL_STORAGE_KEY_PREFIX = "sovra_";

export default function App() {
  // Mobile Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home Page");

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Core Persisted States (Multi-level profiles)
  const [profiles, setProfiles] = useState<Record<UserRole, UserProfile>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}profiles`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to defaults
      }
    }
    return {
      "Student": {
        id: "student-user",
        name: "Pascal Gasana",
        email: "pascal@ines.ac.rw",
        studentId: "std-1102",
        role: "Student",
        academicYear: "Year 2",
        joinedAt: new Date().toISOString()
      },
      "Class Representative": {
        id: "student-rep",
        name: "Jean de Dieu",
        email: "jeandedieu@ines.ac.rw",
        studentId: "student-rep",
        role: "Class Representative", // Start as Class Rep for rich features!
        academicYear: "Year 3",
        joinedAt: new Date().toISOString()
      },
      "Lecturer": {
        id: "lecturer-user",
        name: "Dr. Emmanuel Mutangana",
        email: "emutangana@ines.ac.rw",
        studentId: "LEC-405",
        role: "Lecturer",
        academicYear: "Year 4",
        joinedAt: new Date().toISOString()
      },
      "Admin": {
        id: "admin-user",
        name: "System Administrator",
        email: "admin@ines.ac.rw",
        studentId: "ADM-001",
        role: "Admin",
        academicYear: "All Years",
        joinedAt: new Date().toISOString()
      }
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}current_role`);
    if (saved && ["Student", "Class Representative", "Lecturer", "Admin"].includes(saved)) {
      return saved as UserRole;
    }
    return "Class Representative";
  });

  const currentUser = profiles[currentRole];

  // Supabase Backend Data States (No Mock/Seed Data)
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load real data from Supabase backend on mount and auth change
  useEffect(() => {
    async function loadBackendData() {
      try {
        setIsDataLoading(true);
        const [res, assigns, posts, att, notifs] = await Promise.all([
          api.fetchAllResources(),
          api.fetchAllAssignments(),
          api.fetchAllForumPosts(),
          api.fetchAllAttendanceSessions(),
          api.fetchAllNotifications(),
        ]);
        setResources(res);
        setAssignments(assigns);
        setForumPosts(posts);
        setAttendanceSessions(att);
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load initial Supabase data:", err);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadBackendData();
  }, [isLoggedIn]);

  // Synchronize user profile & role cache
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}profiles`, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_role`, currentRole);
  }, [currentRole]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Validate Token on Mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userObj: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "User",
          email: session.user.email || "",
          role: (session.user.user_metadata?.role as UserRole) || "Student",
          studentId: session.user.user_metadata?.studentId || "",
          academicYear: session.user.user_metadata?.academicYear || ""
        };
        handleAuthSuccess(userObj);
      }
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userObj: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "User",
          email: session.user.email || "",
          role: (session.user.user_metadata?.role as UserRole) || "Student",
          studentId: session.user.user_metadata?.studentId || "",
          academicYear: session.user.user_metadata?.academicYear || ""
        };
        handleAuthSuccess(userObj);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setProfiles((prev) => ({
      ...prev,
      [user.role]: user
    }));
    setCurrentRole(user.role);
    setIsLoggedIn(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setActiveTab("Home Page");
  };

  // Helper: Trigger custom notification
  const addNotification = (
    title: string, 
    message: string, 
    type: AppNotification["type"],
    targetLecturer?: string,
    targetModule?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      targetLecturer,
      targetModule
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Actions: Resources (Connected to Supabase)
  const handleAddResource = async (newResData: Omit<StudyResource, "id" | "downloadsCount" | "uploadedBy" | "uploadedById" | "uploadedAt">) => {
    const isLecturer = currentUser.role === "Lecturer" || currentUser.role === "Admin";
    try {
      const created = await api.createResource({
        ...newResData,
        uploadedBy: `${currentUser.name} (${currentUser.role})`,
        uploadedById: currentUser.id,
        uploadedAt: new Date().toISOString(),
        approved: isLecturer,
      });

      if (created) {
        setResources((prev) => [created, ...prev]);
        if (isLecturer) {
          addNotification(
            "New Study Resource Uploaded",
            `${currentUser.name} uploaded '${created.title}' in the ${created.courseCode} syllabus.`,
            "announcement"
          );
        } else {
          addNotification(
            "Resource Upload Pending Approval",
            `${currentUser.name} submitted '${created.title}' for lecturer approval.`,
            "announcement"
          );
        }
      }
    } catch (err) {
      console.error("Error creating resource in Supabase:", err);
    }
  };

  const handleIncrementDownload = async (id: string) => {
    setResources((prev) =>
      prev.map((r) => r.id === id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r)
    );
    try {
      await api.incrementResourceDownloadCount(id);
    } catch (err) {
      console.error("Failed to update download count in Supabase:", err);
    }
  };

  // Actions: Assignments (Connected to Supabase)
  const handleSubmitAssignment = async (assignmentId: string, submissionData: { fileName: string; fileUrl: string }) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.id === assignmentId) {
          return {
            ...assign,
            submissions: {
              ...assign.submissions,
              [currentUser.studentId]: {
                fileName: submissionData.fileName,
                fileUrl: submissionData.fileUrl,
                submittedAt: new Date().toISOString()
              }
            }
          };
        }
        return assign;
      })
    );

    try {
      await api.submitAssignmentFile(
        assignmentId,
        currentUser.id,
        currentUser.studentId,
        submissionData
      );
    } catch (err) {
      console.error("Failed to persist submission to Supabase:", err);
    }

    addNotification(
      "Assignment Submission Successful",
      `You successfully submitted '${submissionData.fileName}' for evaluation.`,
      "assignment"
    );
  };

  // Actions: Forum (Connected to Supabase)
  const handleAddPost = async (newPostData: Omit<ForumPost, "id" | "upvotes" | "replies" | "authorName" | "authorRole" | "authorId" | "createdAt">) => {
    try {
      const created = await api.createForumPost({
        ...newPostData,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
      });

      if (created) {
        setForumPosts((prev) => [created, ...prev]);
        addNotification(
          "New Forum Thread Started",
          `${currentUser.name} started a new discussion: '${created.title}'`,
          "forum"
        );
      }
    } catch (err) {
      console.error("Failed to create forum post in Supabase:", err);
    }
  };

  const handleAddReply = async (postId: string, content: string) => {
    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      content,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorId: currentUser.id,
      createdAt: new Date().toISOString()
    };

    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      })
    );

    try {
      await api.createForumReply(postId, {
        content,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
      });
    } catch (err) {
      console.error("Failed to create reply in Supabase:", err);
    }
  };

  const handleUpvotePost = async (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
    try {
      await api.upvotePost(postId);
    } catch (err) {
      console.error("Failed to persist upvote in Supabase:", err);
    }
  };

  // Actions: Attendance (Connected to Supabase)
  const handleCheckIn = (sessionId: string, passcode: string, studentName: string): boolean => {
    const session = attendanceSessions.find((s) => s.id === sessionId);
    if (!session || session.passcode.toUpperCase() !== passcode.toUpperCase()) {
      return false;
    }

    setAttendanceSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            checkedInStudents: {
              ...s.checkedInStudents,
              [currentUser.studentId]: {
                studentName,
                checkedInAt: new Date().toISOString(),
                locationMethod: "Simulated Geofence"
              }
            }
          };
        }
        return s;
      })
    );

    api.checkInStudentAttendance(
      sessionId,
      currentUser.id,
      studentName,
      currentUser.studentId
    ).catch((err) => {
      console.error("Failed to persist attendance check-in to Supabase:", err);
    });

    addNotification(
      "Automated Check-In Verified",
      `Lecture registration completed for ${session.courseCode}. Checked in successfully.`,
      "attendance"
    );

    return true;
  };

  const handleCreateSession = async (sessionData: {
    courseCode: string;
    courseName: string;
    timeSlot: string;
    passcode: string;
    academicYear: string;
  }) => {
    const isLecturer = currentUser.role === "Lecturer" || currentUser.role === "Admin";
    try {
      const created = await api.createAttendanceSessionRecord({
        ...sessionData,
        createdBy: currentUser.id,
        createdByName: currentUser.name,
        isActive: isLecturer,
        verifiedByLecturer: isLecturer,
      });

      if (created) {
        setAttendanceSessions((prev) => [created, ...prev]);

        if (isLecturer) {
          addNotification(
            `Attendance Check-In Open: ${created.courseCode}`,
            `Class check-in is now open for ${created.courseName}. Passcode: ${created.passcode}`,
            "attendance"
          );
        } else {
          addNotification(
            "Attendance Session Requested",
            `Class representative ${currentUser.name} has requested an attendance check-in session for ${created.courseName} (${created.courseCode}). Pending lecturer approval.`,
            "attendance"
          );
        }
      }
    } catch (err) {
      console.error("Failed to create attendance session in Supabase:", err);
    }
  };

  // Actions: Lecturer / Rep Corner
  const handleAddAnnouncement = (ann: { 
    title: string; 
    message: string; 
    type: "announcement" | "grade" | "assignment";
    targetLecturer?: string;
    targetModule?: string;
  }) => {
    addNotification(ann.title, ann.message, ann.type, ann.targetLecturer, ann.targetModule);
  };

  const handleGradeAssignment = async (assignmentId: string, studentId: string, grade: string, feedback: string) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.id === assignmentId) {
          const submission = assign.submissions[studentId];
          if (submission) {
            return {
              ...assign,
              submissions: {
                ...assign.submissions,
                [studentId]: {
                  ...submission,
                  grade,
                  feedback
                }
              }
            };
          }
        }
        return assign;
      })
    );

    try {
      await api.gradeStudentSubmission(assignmentId, studentId, grade, feedback);
    } catch (err) {
      console.error("Failed to grade assignment in Supabase:", err);
    }

    addNotification(
      "Module Assignment Graded",
      `New grade reported for ${studentId}: ${grade}`,
      "grade"
    );
  };

  const handleApproveResource = async (resourceId: string) => {
    setResources((prev) =>
      prev.map((res) => res.id === resourceId ? { ...res, approved: true } : res)
    );
    try {
      await api.approveResource(resourceId);
    } catch (err) {
      console.error("Failed to approve resource in Supabase:", err);
    }
    const approvedRes = resources.find((res) => res.id === resourceId);
    if (approvedRes) {
      addNotification(
        "Study Resource Approved",
        `Lecturer approved and published study resource '${approvedRes.title}' in the ${approvedRes.courseCode} course.`,
        "announcement"
      );
    }
  };

  const handleApproveAttendanceSession = async (sessionId: string) => {
    setAttendanceSessions((prev) =>
      prev.map((sess) =>
        sess.id === sessionId ? { ...sess, approved: true, isActive: true } : sess
      )
    );
    try {
      await api.approveAttendanceSession(sessionId);
    } catch (err) {
      console.error("Failed to approve attendance session in Supabase:", err);
    }
    const approvedSess = attendanceSessions.find((s) => s.id === sessionId);
    if (approvedSess) {
      addNotification(
        "Attendance Session Approved & Open",
        `Lecturer approved roll call for ${approvedSess.courseCode}. Check-in is now open. Passcode: ${approvedSess.passcode}`,
        "attendance"
      );
    }
  };

  // Action: Notifications marking
  const handleMarkNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
    try {
      await api.markNotificationAsReadInDb(id);
    } catch (err) {
      console.error("Failed to update notification in Supabase:", err);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.markAllNotificationsAsReadInDb();
    } catch (err) {
      console.error("Failed to mark all notifications as read in Supabase:", err);
    }
  };

  const [settingsSubTab, setSettingsSubTab] = useState<"profile" | "preferences">("profile");

  // Navigation Items list
  const navItems = [
    { label: "Home Page", icon: Home },
    { label: "Resources", icon: BookOpen },
    { label: "Discussion Forum", icon: MessageSquare },
    { label: "Automated Attendance", icon: Clock },
    { label: "Assignments", icon: CheckSquare },
    ...(currentRole === "Admin" ? [{ label: "Portal", icon: ShieldCheck, highlight: true, badge: "System" }] : []),
    { label: "Lecturer Corner", icon: GraduationCap },
    { label: "AI Copilot", icon: Sparkles, highlight: currentRole !== "Admin" },
    { label: "Settings", icon: Settings }
  ];

  const handleNavigateTo = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setSidebarOpen(false);
  };

  // Render current active panel
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Home Page":
        return (
          <HomeDashboard
            currentUser={currentUser}
            resources={resources}
            assignments={assignments}
            forumPosts={forumPosts}
            notifications={notifications}
            schedule={SCHEDULE_EVENTS}
            onNavigate={handleNavigateTo}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          />
        );
      case "Resources":
        return (
          <ResourcesTab
            currentUser={currentUser}
            resources={resources}
            onAddResource={handleAddResource}
            onIncrementDownload={handleIncrementDownload}
          />
        );
      case "Discussion Forum":
        return (
          <ForumTab
            currentUser={currentUser}
            forumPosts={forumPosts}
            onAddPost={handleAddPost}
            onAddReply={handleAddReply}
            onUpvotePost={handleUpvotePost}
          />
        );
      case "Automated Attendance":
        return (
          <AttendanceTab
            currentUser={currentUser}
            attendanceSessions={attendanceSessions}
            onCheckIn={handleCheckIn}
            onCreateSession={handleCreateSession}
          />
        );
      case "Assignments":
        return (
          <AssignmentsTab
            currentUser={currentUser}
            assignments={assignments}
            onSubmitAssignment={handleSubmitAssignment}
          />
        );
      case "Lecturer Corner":
        return (
          <LecturerCorner
            currentUser={currentUser}
            assignments={assignments}
            notifications={notifications}
            resources={resources}
            attendanceSessions={attendanceSessions}
            onAddAnnouncement={handleAddAnnouncement}
            onGradeAssignment={handleGradeAssignment}
            onAddResource={handleAddResource}
            onApproveResource={handleApproveResource}
            onApproveAttendanceSession={handleApproveAttendanceSession}
            onNavigate={handleNavigateTo}
            onRoleChange={setCurrentRole}
            onUpdateLecturerProfile={(updated) => {
              setProfiles((prev) => ({
                ...prev,
                Lecturer: updated
              }));
            }}
          />
        );
      case "Portal":
      case "Admin Portal":
        return (
          <AdminPortalTab
            currentUser={currentUser}
            resources={resources}
            setResources={setResources}
            assignments={assignments}
            setAssignments={setAssignments}
            forumPosts={forumPosts}
            setForumPosts={setForumPosts}
            attendanceSessions={attendanceSessions}
            setAttendanceSessions={setAttendanceSessions}
            onAddNotification={addNotification}
          />
        );
      case "AI Copilot":
      case "PharmaAI":
      case "PharmaAI Copilot":
        return <PharmaAI currentUser={currentUser} assignments={assignments} />;
      case "Settings":
      case "User Profile":
        return (
          <SettingsTab
            currentUser={currentUser}
            profiles={profiles}
            onChangeProfile={(updated) => {
              setProfiles((prev) => ({
                ...prev,
                [currentRole]: updated
              }));
            }}
            onRoleChange={setCurrentRole}
            activeSubTab={settingsSubTab}
            onSubTabChange={setSettingsSubTab}
          />
        );
      default:
        return <div className="text-center py-12 text-slate-400">Section coming soon...</div>;
    }
  };

  const unreadCountGlobal = notifications.filter((n) => !n.isRead).length;

  if (isAuthLoading) {
    return (
      <div className="flex h-screen bg-[#070B14] text-[#F8FAFC] items-center justify-center font-sans text-base">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-glass border border-sky-400/30 flex items-center justify-center shadow-2xl glow-blue animate-pulse">
              <img src="/sovra-logo.svg" alt="Sovra" className="w-10 h-10 object-contain drop-shadow" />
            </div>
            <div className="absolute inset-0 rounded-2xl border border-sky-400/40 animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-sm tracking-wider uppercase text-white font-mono">SOVRA</p>
            <p className="text-xs text-[#94A3B8]">Connecting Academic Identity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#070B14] text-[#F8FAFC] font-sans overflow-hidden">
      
      {/* 1. Sidebar desktop layout with glassmorphism */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-glass border-r border-white/8 text-[#94A3B8] flex-shrink-0 z-20 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/8 bg-[#0B132B]/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#38BDF8] p-1.5 flex items-center justify-center shadow-md glow-blue-sm flex-shrink-0">
              <img src="/sovra-logo.svg" alt="Sovra" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-wider text-[#F8FAFC]">SOVRA</h1>
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#94A3B8]/70 font-medium tracking-wide">Learn • Connect • Grow</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-2.5 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-mono">Navigation</p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigateTo(item.label)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-md glow-blue-sm font-bold"
                    : item.highlight
                    ? "text-[#38BDF8] hover:text-white bg-[#0284C7]/15 hover:bg-[#0284C7]/25 border border-[#38BDF8]/20"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131E35]/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-white scale-110" : item.highlight ? "text-[#38BDF8] animate-pulse" : "text-[#64748B]"}`} />
                  <span className={isActive ? "text-white font-bold" : ""}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-[#0E1626] border border-white/10 text-[#38BDF8] font-mono px-1.5 py-0.5 rounded-md uppercase font-bold">
                    {item.badge}
                  </span>
                )}
                {item.label === "Home Page" && unreadCountGlobal > 0 && (
                  <span className={`w-4 h-4 rounded-full font-bold font-mono flex items-center justify-center text-[9px] ${isActive ? "bg-white text-[#0284C7]" : "bg-[#0284C7] text-white"}`}>
                    {unreadCountGlobal}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User identification badge */}
        <div className="p-3.5 bg-[#0B132B]/70 border-t border-white/8 space-y-2.5">
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-[#131E35] transition-colors">
            <div 
              onClick={() => {
                setSettingsSubTab("profile");
                handleNavigateTo("Settings");
              }}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            >
              <RenderAvatar avatarUrl={currentUser.avatarUrl} name={currentUser.name} sizeClass="w-9 h-9" textClass="text-xs" />
              <div className="text-left truncate">
                <p className="text-xs font-bold text-[#F8FAFC] truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <p className="text-[10px] text-[#94A3B8] truncate font-mono uppercase font-semibold">{currentUser.role}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-[#131E35] rounded-lg text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
              title="Sign Out of Portal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Mobile navigation drawer with glassmorphic backing */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/75 backdrop-blur-md transition-opacity duration-300">
          <div className="w-72 bg-[#0E1626]/95 text-[#94A3B8] flex flex-col h-full animate-slide-in border-r border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="p-5 flex items-center justify-between border-b border-white/10 bg-[#0B132B]/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#38BDF8] p-1 flex items-center justify-center shadow-md">
                  <img src="/sovra-logo.svg" alt="Sovra" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-[#F8FAFC] tracking-wider">SOVRA</span>
                  <p className="text-[9px] text-[#94A3B8]">Academic Platform</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-1.5 hover:bg-[#131E35] rounded-lg text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigateTo(item.label)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold shadow-md"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131E35]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#64748B]"}`} />
                      <span className={isActive ? "font-bold text-white" : ""}>{item.label}</span>
                    </div>
                    {item.label === "Home Page" && unreadCountGlobal > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white font-bold font-mono flex items-center justify-center text-[9px]">
                        {unreadCountGlobal}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#0B132B]/80 flex items-center justify-between">
              <div 
                onClick={() => {
                  setSettingsSubTab("profile");
                  handleNavigateTo("Settings");
                }}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <RenderAvatar avatarUrl={currentUser.avatarUrl} name={currentUser.name} sizeClass="w-8 h-8" textClass="text-xs" />
                <div className="text-left truncate">
                  <p className="text-xs font-semibold text-[#F8FAFC] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-[#94A3B8] font-mono uppercase truncate">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-[#131E35] rounded-lg text-[#94A3B8] hover:text-white cursor-pointer"
                title="Sign Out of Portal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main content frame with responsive container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#070B14]">
        
        {/* Header toolbar with glassmorphism */}
        <header className="bg-glass border-b border-white/8 px-4 sm:px-8 py-3 flex items-center justify-between z-10 shrink-0 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#94A3B8] hover:text-white hover:bg-[#131E35] rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="lg:hidden w-7 h-7 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#38BDF8] p-1 flex items-center justify-center shadow-xs">
                <img src="/sovra-logo.svg" alt="Sovra" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-[#F8FAFC] tracking-tight flex items-center gap-2">
                {activeTab}
              </h2>
            </div>
          </div>

          {/* Dynamic timer, theme toggle & status badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-1.5 hidden sm:flex items-center gap-2 font-mono text-xs font-semibold text-[var(--ink-muted)]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
              <span className="text-[var(--ink)]">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
            
            <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[var(--ink)] font-mono flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-xs" />
              <span>{currentUser.role.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Tab Canvas Area - fully responsive with padding scaling */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 relative bg-[#070B14]">
          <div className="max-w-7xl mx-auto pb-12 w-full">
            {renderActiveTabContent()}
          </div>
        </div>

      </main>

    </div>
  );
}
