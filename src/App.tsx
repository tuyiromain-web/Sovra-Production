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
import AppWorkspace from "./pages/AppWorkspace";
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

  // Institutional Workspace View State
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");
  const [currentTenantId, setCurrentTenantId] = useState<string>("tenant-stjude");

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
            <p className="font-bold text-sm tracking-[-0.03em] uppercase text-white font-sans">SOVRA</p>
            <p className="text-xs text-[#94A3B8]">Connecting Academic Identity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "workspace") {
    return (
      <AppWorkspace
        initialTenantId={currentTenantId}
        onNavigateToLanding={() => setViewMode("landing")}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <LandingPage
        onAuthSuccess={(user) => {
          handleAuthSuccess(user);
          setViewMode("workspace");
        }}
        onEnterWorkspace={(tenantId) => {
          if (tenantId) setCurrentTenantId(tenantId);
          setViewMode("workspace");
        }}
      />
    );
  }

  return (
    <AppWorkspace
      initialTenantId={currentTenantId}
      onNavigateToLanding={() => setViewMode("landing")}
    />
  );
}
