/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, Calendar, Clock, MapPin, CheckCircle, AlertCircle, 
  Bell, FileText, MessageSquare, ChevronRight, Bookmark, ArrowUpRight,
  Sparkles, TrendingUp, Compass, ShieldCheck, Zap, Layers, Award,
  ArrowRight, Search, Check, Filter
} from "lucide-react";
import { UserProfile, StudyResource, Assignment, ForumPost, AppNotification, ScheduleEvent } from "../types";

interface HomeDashboardProps {
  currentUser: UserProfile;
  resources: StudyResource[];
  assignments: Assignment[];
  forumPosts: ForumPost[];
  notifications: AppNotification[];
  schedule: ScheduleEvent[];
  onNavigate: (tab: string) => void;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

export default function HomeDashboard({
  currentUser,
  resources,
  assignments,
  forumPosts,
  notifications,
  schedule,
  onNavigate,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}: HomeDashboardProps) {
  const [selectedDay, setSelectedDay] = useState<string>("All");

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 
    ? "Good morning" 
    : currentHour < 18 
    ? "Good afternoon" 
    : "Good evening";

  const pendingAssignmentsCount = assignments.filter(
    (a) => !a.submissions[currentUser.studentId]
  ).length;

  const totalNotesCount = resources.length;
  const activeDiscussionsCount = forumPosts.length;
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Active courses count (deduplicated or standard 8)
  const activeCoursesCount = 8;
  const attendanceRate = 92; // 92% standard university attendance indicator

  // Static representative announcements with color category mapping
  const classRepAnnouncements = [
    {
      id: "ann-1",
      title: "Transition to Digital Documentation System Complete!",
      message: "Academic workspaces and documentation repositories are now synchronized on Sovra. Access course materials, log automated attendance, and collaborate in real time.",
      author: "Jean de Dieu (Class Rep)",
      date: "Today, 08:30 AM",
      category: "Important", // Orange
      categoryColor: "orange",
      priority: "High"
    },
    {
      id: "ann-2",
      title: "Module Examination Revision Materials Uploaded",
      message: "2025 Biopharmaceutics and Clinical Pharmacology past papers are now available in the study hub for upcoming module review.",
      author: "Jean de Dieu (Class Rep)",
      date: "Yesterday, 14:10 PM",
      category: "Academic", // Purple
      categoryColor: "purple",
      priority: "Medium"
    },
    {
      id: "ann-3",
      title: "Medicinal Chemistry Lab Reports Deadline",
      message: "Reminder: All practical laboratory reports must be submitted digitally in the Assignments tab before Friday 17:00.",
      author: "Dr. Mutangana",
      date: "2 days ago",
      category: "Notification", // Pink
      categoryColor: "pink",
      priority: "Critical"
    },
    {
      id: "ann-4",
      title: "Biopharmaceutics Lab Safety Certification Completed",
      message: "All Year 2 & 3 pharmacy candidates have successfully registered for the INES laboratory protocol verification.",
      author: "Academic Registrar",
      date: "3 days ago",
      category: "Completed", // Green
      categoryColor: "green",
      priority: "Info"
    }
  ];

  const featureCards = [
    {
      id: "feat-attendance",
      title: "Smart Attendance",
      description: "Fast passcode check-in with verified campus network geofencing.",
      icon: Clock,
      color: "text-[#0284C7]",
      bg: "bg-[#0284C7]/10",
      border: "hover:border-[#0284C7]/50",
      action: "Mark Attendance",
      tab: "Automated Attendance"
    },
    {
      id: "feat-documents",
      title: "Access Documents",
      description: "Comprehensive notes, syllabi, and past exam questions repository.",
      icon: BookOpen,
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/10",
      border: "hover:border-[#8B5CF6]/50",
      action: "Browse Files",
      tab: "Resources"
    },
    {
      id: "feat-updates",
      title: "Stay Updated",
      description: "Direct notifications from class representatives & department lecturers.",
      icon: Bell,
      color: "text-[#EC407A]",
      bg: "bg-[#EC407A]/10",
      border: "hover:border-[#EC407A]/50",
      action: "View Notices",
      tab: "Home Page"
    },
    {
      id: "feat-progress",
      title: "Track Progress",
      description: "Submit coursework, review lecturer feedback, and monitor your score.",
      icon: TrendingUp,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      border: "hover:border-[#10B981]/50",
      action: "Check Tasks",
      tab: "Assignments"
    },
    {
      id: "feat-discuss",
      title: "Connect & Discuss",
      description: "Peer-to-peer pharmacy case studies and clinical question threads.",
      icon: MessageSquare,
      color: "text-[#38BDF8]",
      bg: "bg-[#38BDF8]/10",
      border: "hover:border-[#38BDF8]/50",
      action: "Join Threads",
      tab: "Discussion Forum"
    }
  ];

  const filteredSchedule = selectedDay === "All" 
    ? schedule 
    : schedule.filter((s) => s.dayOfWeek === selectedDay);

  return (
    <div id="home-dashboard-section" className="space-y-8 animate-fade-in text-[#F8FAFC]">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#111418] via-[#15191E] to-[#111418] border border-white/8 p-6 sm:p-8 overflow-hidden shadow-xl">
        {/* Subtle orange ambient glow backdrop */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3 text-left">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                {greeting}, {currentUser.name.split(" ")[0]}!
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] font-normal mt-1 max-w-2xl">
                Welcome back to <span className="text-[#38BDF8] font-semibold">Sovra</span>. Here is an overview of your active courses, upcoming lectures, and academic tasks for today.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate("Automated Attendance")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white blue-gradient-btn shadow-md glow-blue-sm cursor-pointer transition-all duration-200"
              >
                <Clock className="w-4 h-4" />
                <span>Mark Attendance →</span>
              </button>

              <button
                onClick={() => onNavigate("Resources")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-[#191D23] hover:bg-[#1E232B] border border-white/10 hover:border-[#0284C7]/40 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                <span>Explore Course Documents</span>
              </button>
            </div>
          </div>

          {/* Relocated Campus Network Active indicator with circle design & accompanying keywords */}
          <div className="self-start lg:self-end shrink-0 flex items-center gap-3.5 bg-glass/90 border border-emerald-500/25 px-4 py-2.5 rounded-full shadow-lg hover:border-emerald-500/40 transition-all duration-300">
            {/* Concentric Circle Radar Pulse */}
            <div className="relative w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="absolute w-full h-full rounded-full bg-emerald-400/20 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Accompanying Keywords */}
            <div className="text-left pr-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8FAFC]">
                  Campus Network Active
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full uppercase border border-emerald-500/30">
                  Online
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-[#94A3B8]">
                <span>GEOFENCE VERIFIED</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">CLOUD SYNCED</span>
                <span>•</span>
                <span>RUHENGERI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Modern 5-Column Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Stat 1: Courses */}
        <button
          onClick={() => onNavigate("Resources")}
          className="bg-glass hover:bg-[#0E1626] border border-white/8 hover:border-[#0284C7]/40 rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Courses</span>
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{activeCoursesCount}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Active modules</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center text-[11px] text-[#38BDF8] font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>View Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

        {/* Stat 2: Documents */}
        <button
          onClick={() => onNavigate("Resources")}
          className="bg-glass hover:bg-[#0E1626] border border-white/8 hover:border-[#0284C7]/40 rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Documents</span>
            <div className="w-8 h-8 rounded-xl bg-[#0284C7]/15 text-[#38BDF8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{totalNotesCount}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Available files</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center text-[11px] text-[#38BDF8] font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Browse Library</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

        {/* Stat 3: Announcements */}
        <button
          onClick={() => onNavigate("Home Page")}
          className="bg-glass hover:bg-[#0E1626] border border-white/8 hover:border-[#0284C7]/40 rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Notices</span>
            <div className="w-8 h-8 rounded-xl bg-[#EC407A]/15 text-[#EC407A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{notifications.length}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">New updates</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center text-[11px] text-[#EC407A] font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Latest News</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

        {/* Stat 4: Attendance */}
        <button
          onClick={() => onNavigate("Automated Attendance")}
          className="bg-glass hover:bg-[#0E1626] border border-white/8 hover:border-[#10B981]/40 rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#10B981] tracking-tight">{attendanceRate}%</p>
            <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded font-mono">Good</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center text-[11px] text-[#10B981] font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Check In Now</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

        {/* Stat 5: Tasks / Assignments */}
        <button
          onClick={() => onNavigate("Assignments")}
          className="col-span-2 sm:col-span-1 bg-glass hover:bg-[#0E1626] border border-white/8 hover:border-[#F59E0B]/40 rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{pendingAssignmentsCount}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Pending tasks</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center text-[11px] text-[#F59E0B] font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Submit Work</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

      </div>

      {/* 3. Feature Cards Carousel / Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
              Core Student Capabilities
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">Integrated Academic Workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.tab)}
                className={`bg-glass hover:bg-[#0E1626] border border-white/8 ${feat.border} rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-sm hover:-translate-y-0.5`}
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#38BDF8]">
                  <span>{feat.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Main 2-Column Section (Left: Announcements & Timetable, Right: Attendance Health & Notifications) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Timeline Announcements */}
          <div className="bg-glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-md">
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0284C7]/15 text-[#38BDF8] flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC]">Announcements & Official Notices</h3>
                  <p className="text-xs text-[#94A3B8]">Official academic broadcast channel</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold text-[#38BDF8] font-mono uppercase tracking-wider bg-[#0284C7]/10 border border-[#0284C7]/20 px-2.5 py-1 rounded-lg">
                Live Feed
              </span>
            </div>

            <div className="space-y-3.5">
              {classRepAnnouncements.map((ann) => {
                let badgeStyle = "bg-[#0284C7]/15 text-[#38BDF8] border-[#0284C7]/30";
                let dotStyle = "bg-[#0284C7]";
                if (ann.categoryColor === "pink") {
                  badgeStyle = "bg-[#EC407A]/15 text-[#EC407A] border-[#EC407A]/30";
                  dotStyle = "bg-[#EC407A]";
                } else if (ann.categoryColor === "purple") {
                  badgeStyle = "bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30";
                  dotStyle = "bg-[#8B5CF6]";
                } else if (ann.categoryColor === "green") {
                  badgeStyle = "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
                  dotStyle = "bg-[#10B981]";
                }

                return (
                  <div 
                    key={ann.id} 
                    className="p-4 rounded-xl bg-[#0E1626] border border-white/6 hover:border-[#0284C7]/30 transition-all duration-200 relative group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotStyle}`} />
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border uppercase tracking-wider ${badgeStyle}`}>
                          {ann.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono">{ann.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors mb-1.5">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {ann.message}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B] font-mono uppercase font-semibold">
                        Posted by <span className="text-[#F8FAFC]">{ann.author}</span>
                      </span>
                      <span className="text-[#38BDF8] font-semibold text-[10px] font-mono">Priority: {ann.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Classes / Lecture Timetable */}
          <div className="bg-glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-3.5 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#A78BFA] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC]">Lecture Schedule & Class Timetable</h3>
                  <p className="text-xs text-[#94A3B8]">Semester 1 • Academic Year 2026</p>
                </div>
              </div>

              {/* Day filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDay === day 
                        ? "bg-[#0284C7] text-white shadow-xs" 
                        : "bg-[#0E1626] text-[#94A3B8] hover:text-white border border-white/5"
                    }`}
                  >
                    {day === "All" ? "All Week" : day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSchedule.map((lecture) => (
                <div 
                  key={lecture.id}
                  className="bg-[#0E1626] border border-white/6 hover:border-[#8B5CF6]/40 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#38BDF8] border border-[#0284C7]/20">
                        {lecture.courseCode}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-mono bg-[#1E232B] px-1.5 py-0.5 rounded">
                        {lecture.dayOfWeek}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors line-clamp-2">
                      {lecture.courseName}
                    </h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      {lecture.lecturerName}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] font-mono">
                      <Clock className="w-3 h-3 text-[#38BDF8]" />
                      <span>{lecture.time}</span>
                    </div>
                    <span className="font-mono text-[#F8FAFC] bg-[#1E232B] px-2 py-0.5 rounded border border-white/5 text-[10px]">
                      {lecture.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column (Attendance Overview & Notification Center) */}
        <div className="space-y-6">
          
          {/* Attendance Health Card with Circular Indicator */}
          <div className="bg-glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">Attendance Overview</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
                Passing Tier
              </span>
            </div>

            <div className="flex items-center gap-5 p-4 rounded-xl bg-[#0E1626] border border-white/6">
              {/* Circular Metric */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
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
                    strokeDasharray={`${attendanceRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-extrabold text-[#F8FAFC]">{attendanceRate}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[#F8FAFC]">Excellent Standing</p>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  You qualify for final examination clearance (min. 80% required).
                </p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => onNavigate("Automated Attendance")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white blue-gradient-btn flex items-center justify-center gap-2 cursor-pointer shadow-sm glow-blue-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Launch Quick Check-In</span>
              </button>
            </div>
          </div>

          {/* Real-time Notifications Center */}
          <div className="bg-glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">Notifications</h3>
              </div>
              {unreadNotifCount > 0 && (
                <button
                  onClick={onMarkAllNotificationsAsRead}
                  className="text-xs text-[#38BDF8] hover:underline font-semibold cursor-pointer"
                >
                  Clear All ({unreadNotifCount})
                </button>
              )}
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-xl border transition-all text-left relative cursor-pointer group flex gap-3 ${
                      notif.isRead
                        ? "bg-[#0E1626] border-white/5 opacity-75 hover:opacity-100"
                        : "bg-[#191D23] border-[#0284C7]/40 shadow-xs"
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-3 right-3 w-2 h-2 bg-[#0284C7] rounded-full animate-ping" />
                    )}
                    <div className="w-8 h-8 rounded-lg bg-glass border border-white/8 flex items-center justify-center flex-shrink-0">
                      {notif.type === "assignment" ? (
                        <FileText className="w-4 h-4 text-[#F59E0B]" />
                      ) : notif.type === "attendance" ? (
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#38BDF8]" />
                      )}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] truncate">
                        {notif.title}
                      </h4>
                      <p className="text-[#94A3B8] text-[11px] leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[9px] text-[#64748B] font-mono block pt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E1626] border border-white/8 flex items-center justify-center text-[#64748B]">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#F8FAFC]">All caught up!</p>
                  <p className="text-[11px] text-[#94A3B8]">No unread system alerts.</p>
                </div>
              )}
            </div>

            {/* Quick Forum Link Card */}
            <div className="mt-4 pt-3 border-t border-white/8">
              <button 
                onClick={() => onNavigate("Discussion Forum")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
                  <span className="text-xs font-bold text-[#A78BFA]">Pharmacy Discussion Threads</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A78BFA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
