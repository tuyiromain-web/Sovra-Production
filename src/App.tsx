/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient";
import { DEFAULT_SCHOOL_ID, getCurrentUserProfile } from "./services/supabaseApi";
import type { UserProfile, UserRole } from "./types";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AppWorkspace from "./pages/AppWorkspace";

type AppRoute = "/" | "/login" | "/signup" | "/workspace";

function parseRoute(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/login") return "/login";
  if (clean === "/signup") return "/signup";
  if (clean === "/workspace") return "/workspace";
  return "/";
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname)
  );
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(DEFAULT_SCHOOL_ID);
  const sessionGenRef = useRef(0);

  const navigateTo = useCallback((nextRoute: AppRoute) => {
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, "", nextRoute);
    }
    setRoute(nextRoute);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const hydrateUserSession = useCallback(async (userId: string, email: string, meta: Record<string, any>) => {
    const gen = ++sessionGenRef.current;
    const profile = await getCurrentUserProfile(userId);
    if (gen !== sessionGenRef.current) return;
    const hydrated: UserProfile = {
      id: userId,
      name: profile?.name || meta?.name || email.split("@")[0] || "Member",
      email: profile?.email || email,
      role: ((profile?.role || meta?.role || "Student") as UserRole),
      studentId: profile?.student_id || meta?.studentId || "",
      academicYear: profile?.academic_year || meta?.academicYear || "Year 1",
      avatarUrl: profile?.avatar_url || undefined,
      level: profile?.level,
      xp: profile?.xp,
      joinedAt: profile?.created_at,
    };
    setCurrentUser(hydrated);
    setCurrentSchoolId(profile?.school_id || DEFAULT_SCHOOL_ID);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        await hydrateUserSession(
          session.user.id,
          session.user.email || "",
          session.user.user_metadata || {}
        );
      } else {
        sessionGenRef.current++;
        setCurrentUser(null);
      }
      if (active) setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        setTimeout(() => {
          if (!active) return;
          void hydrateUserSession(id, email || "", user_metadata || {});
        }, 0);
      } else {
        sessionGenRef.current++;
        setCurrentUser(null);
      }
    });

    return () => {
      active = false;
      sessionGenRef.current++;
      subscription.unsubscribe();
    };
  }, [hydrateUserSession]);

  const handleAuthSuccess = (user: UserProfile, schoolId?: string | null) => {
    sessionGenRef.current++;
    setCurrentUser(user);
    if (schoolId) {
      setCurrentSchoolId(schoolId);
    }
    navigateTo("/workspace");
  };

  const handleSignOut = async () => {
    sessionGenRef.current++;
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigateTo("/");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="font-sans font-bold text-2xl tracking-[-0.03em] text-[var(--ink)]">
            SOVRA
          </div>
          <p className="text-xs text-[var(--ink-muted)]">
            Loading your university hub...
          </p>
        </div>
      </div>
    );
  }

  if (route === "/login") {
    if (currentUser) {
      return (
        <AppWorkspace
          initialSchoolId={currentSchoolId}
          currentUser={currentUser}
          onNavigateToLanding={() => navigateTo("/")}
          onSignOut={handleSignOut}
        />
      );
    }
    return (
      <LoginPage
        onAuthSuccess={handleAuthSuccess}
        onNavigateToSignUp={() => navigateTo("/signup")}
        onNavigateToLanding={() => navigateTo("/")}
      />
    );
  }

  if (route === "/signup") {
    if (currentUser) {
      return (
        <AppWorkspace
          initialSchoolId={currentSchoolId}
          currentUser={currentUser}
          onNavigateToLanding={() => navigateTo("/")}
          onSignOut={handleSignOut}
        />
      );
    }
    return (
      <SignUpPage
        onAuthSuccess={handleAuthSuccess}
        onNavigateToLogin={() => navigateTo("/login")}
        onNavigateToLanding={() => navigateTo("/")}
      />
    );
  }

  if (route === "/workspace") {
    if (!currentUser) {
      return (
        <LoginPage
          onAuthSuccess={handleAuthSuccess}
          onNavigateToSignUp={() => navigateTo("/signup")}
          onNavigateToLanding={() => navigateTo("/")}
        />
      );
    }
    return (
      <AppWorkspace
        initialSchoolId={currentSchoolId}
        currentUser={currentUser}
        onNavigateToLanding={() => navigateTo("/")}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <LandingPage
      onNavigateToLogin={() => navigateTo("/login")}
      onNavigateToSignUp={() => navigateTo("/signup")}
      onEnterWorkspace={(schoolId) => {
        if (currentUser) {
          if (schoolId) setCurrentSchoolId(schoolId);
          navigateTo("/workspace");
        } else {
          navigateTo("/login");
        }
      }}
    />
  );
}
