/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { getCurrentUserProfile } from "../services/supabaseApi";
import { UserProfile, UserRole } from "../types";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export interface LoginPageProps {
  onAuthSuccess: (user: UserProfile, schoolId?: string | null) => void;
  onNavigateToSignUp: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onAuthSuccess,
  onNavigateToSignUp,
  onNavigateToLanding,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password reset state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both your institutional email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) throw error;

      const profile = await getCurrentUserProfile(data.user.id);
      const userObj: UserProfile = {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || cleanEmail.split("@")[0],
        email: profile?.email || data.user.email || cleanEmail,
        role: (profile?.role || data.user.user_metadata?.role || "Student") as UserRole,
        studentId: profile?.student_id || data.user.user_metadata?.studentId || "",
        academicYear: profile?.academic_year || data.user.user_metadata?.academicYear || "Year 1",
        avatarUrl: profile?.avatar_url || undefined,
        level: profile?.level,
        xp: profile?.xp,
        joinedAt: profile?.created_at,
      };

      onAuthSuccess(userObj, profile?.school_id || null);
    } catch (err: any) {
      let msg = err?.message || "Unable to sign in. Please verify your credentials.";
      if (msg.includes("Invalid login credentials")) {
        msg = "Invalid institutional email or password.";
      } else if (msg.includes("Email not confirmed")) {
        msg = "Please confirm your email address from your university inbox before signing in.";
      } else if (msg.includes("For security purposes")) {
        msg = "Too many attempts. Please wait a moment and try again.";
      }
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setResetSent(false);

    const cleanEmail = resetEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your institutional email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans antialiased flex flex-col justify-between transition-colors duration-150">
      {/* Top Bar */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="min-h-[44px] font-sans font-bold text-2xl tracking-[-0.03em] text-[var(--ink)] hover:text-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            SOVRA
          </button>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="min-h-[44px] px-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              Join Your University
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Editorial Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-10 space-y-8">
          <div className="space-y-2 border-b border-[var(--border)] pb-6">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl tracking-[-0.03em] text-[var(--ink)]">
              {isResetMode ? "Reset your password" : "Sign in to your campus hub"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
              {isResetMode
                ? "Enter your institutional email address to receive a password recovery link."
                : "Enter your university credentials to access verified course syllabi, lecture notes, and department resources."}
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="border border-red-600/40 bg-[var(--surface)] px-4 py-3 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {errorMessage}
            </div>
          )}

          {resetSent && isResetMode && (
            <div
              role="status"
              className="border border-[var(--accent)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--ink)] leading-relaxed"
            >
              A password reset link has been sent to <strong className="font-semibold">{resetEmail}</strong>. Check your university inbox to continue.
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleSignIn} className="space-y-5 text-xs" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-[var(--ink)] font-semibold mb-1.5">
                  Institutional Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@university.ac.rw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-[var(--ink)] font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setErrorMessage("");
                      setResetEmail(email);
                    }}
                    className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 pr-16 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 text-[11px] font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-[var(--accent-contrast)] py-3 px-5 text-xs font-semibold tracking-tight transition-colors cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-5 text-xs" noValidate>
              <div>
                <label htmlFor="reset-email" className="block text-[var(--ink)] font-semibold mb-1.5">
                  Institutional Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@university.ac.rw"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setErrorMessage("");
                    setResetSent(false);
                  }}
                  className="flex-1 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] text-[var(--ink)] py-3 px-4 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-[var(--accent-contrast)] py-3 px-4 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--ink-muted)]">
            <span>New to Sovra?</span>
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              Join your university &rarr;
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-6 text-center text-[11px] text-[var(--ink-muted)]">
        &copy; {new Date().getFullYear()} Sovra Academic Network. Private university workspaces.
      </footer>
    </div>
  );
};

export default LoginPage;
