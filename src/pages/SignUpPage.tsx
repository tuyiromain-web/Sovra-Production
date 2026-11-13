/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  DEFAULT_SCHOOL_ID,
  SchoolRow,
  createSchool,
  fetchSchools,
  getCurrentUserProfile,
  updateUserProfile,
} from "../services/supabaseApi";
import { UserProfile, UserRole } from "../types";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export interface SignUpPageProps {
  onAuthSuccess: (user: UserProfile, schoolId?: string | null) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

type SignUpMode = "join" | "register_school";

const FALLBACK_SCHOOLS: SchoolRow[] = [
  {
    id: DEFAULT_SCHOOL_ID,
    name: "INES-Ruhengeri",
    slug: "ines-ruhengeri",
    code: "INES",
    domain: "ines.ac.rw",
    logo_url: null,
    banner_url: null,
    country: "Rwanda",
    created_at: "",
    updated_at: "",
  },
];

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onAuthSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [mode, setMode] = useState<SignUpMode>("join");
  const [schools, setSchools] = useState<SchoolRow[]>(FALLBACK_SCHOOLS);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(DEFAULT_SCHOOL_ID);

  // Shared user fields (matching public.profiles)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Join existing university fields
  const [role, setRole] = useState<UserRole>("Student");
  const [academicYear, setAcademicYear] = useState("Year 1");
  const [studentIdInput, setStudentIdInput] = useState("");

  // Register new university fields (matching public.schools)
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolDomain, setSchoolDomain] = useState("");
  const [schoolCountry, setSchoolCountry] = useState("Rwanda");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [provisionedUserId, setProvisionedUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchSchools().then((rows) => {
      if (active && rows.length > 0) {
        setSchools(rows);
        setSelectedSchoolId(rows[0].id);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setConfirmationMessage("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || password.length < 8) {
      setErrorMessage("Please provide your full name, institutional email, and a password of at least 8 characters.");
      return;
    }

    if (mode === "register_school" && (!schoolName.trim() || !schoolCode.trim())) {
      setErrorMessage("Please enter your university name and short institution code.");
      return;
    }

    setLoading(true);
    try {
      const assignedRole: UserRole = mode === "register_school" ? "Admin" : role;
      const generatedId =
        studentIdInput.trim() ||
        (assignedRole === "Lecturer"
          ? `LEC-${Math.floor(100 + Math.random() * 900)}`
          : assignedRole === "Admin"
          ? `ADM-${Math.floor(100 + Math.random() * 900)}`
          : `STD-${Math.floor(1000 + Math.random() * 9000)}`);

      const assignedYear =
        assignedRole === "Student" || assignedRole === "Class Representative"
          ? academicYear
          : "All Years";

      let activeUserId = provisionedUserId;

      if (!activeUserId) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              name: cleanName,
              role: assignedRole,
              academicYear: assignedYear,
              studentId: generatedId,
              school_id: mode === "join" ? selectedSchoolId : undefined,
              new_school_name: mode === "register_school" ? schoolName.trim() : undefined,
              new_school_code: mode === "register_school" ? schoolCode.trim().toUpperCase() : undefined,
              new_school_domain: mode === "register_school" ? schoolDomain.trim() : undefined,
              new_school_country: mode === "register_school" ? schoolCountry.trim() : undefined,
            },
          },
        });

        if (error) throw error;

        if (!data.session || !data.user) {
          setConfirmationMessage(
            `Account created for ${cleanEmail}. Please check your university inbox to verify your email address before signing in.`
          );
          setLoading(false);
          return;
        }

        activeUserId = data.user.id;
      }

      let resolvedSchoolId = mode === "join" ? selectedSchoolId : "";

      // Ensure profile & newly registered school are synced cleanly if session is active
      if (mode === "register_school") {
        try {
          await updateUserProfile(activeUserId, { role: "Admin" });
          const createdSchool = await createSchool({
            name: schoolName.trim(),
            code: schoolCode.trim(),
            domain: schoolDomain.trim() || undefined,
            country: schoolCountry.trim() || "Rwanda",
          });
          await updateUserProfile(activeUserId, { school_id: createdSchool.id });
          resolvedSchoolId = createdSchool.id;
          setProvisionedUserId(null);
        } catch (schoolErr: any) {
          setProvisionedUserId(activeUserId);
          throw new Error(
            schoolErr?.message ||
              "Your account was created, but provisioning your university failed. Please retry."
          );
        }
      } else if (selectedSchoolId) {
        try {
          const existingProfile = await getCurrentUserProfile(activeUserId);
          if (existingProfile && existingProfile.school_id !== selectedSchoolId) {
            await updateUserProfile(activeUserId, { school_id: selectedSchoolId });
          }
        } catch (profileErr) {
          console.warn("Profile school sync warning:", profileErr);
        }
      }

      const profile = await getCurrentUserProfile(activeUserId);
      if (mode === "register_school" && !resolvedSchoolId) {
        setProvisionedUserId(activeUserId);
        throw new Error("Unable to verify your new university workspace. Please try again.");
      }

      const userObj: UserProfile = {
        id: activeUserId,
        name: profile?.name || cleanName,
        email: profile?.email || cleanEmail,
        role: (profile?.role || assignedRole) as UserRole,
        studentId: profile?.student_id || generatedId,
        academicYear: profile?.academic_year || assignedYear,
        avatarUrl: profile?.avatar_url || undefined,
        level: profile?.level,
        xp: profile?.xp,
        joinedAt: profile?.created_at,
      };

      onAuthSuccess(
        userObj,
        mode === "register_school" ? resolvedSchoolId : profile?.school_id || resolvedSchoolId || DEFAULT_SCHOOL_ID
      );
    } catch (err: any) {
      let msg = err?.message || "Unable to complete registration.";
      if (msg.includes("User already registered")) {
        msg = "An account with this email already exists. Please sign in instead.";
      } else if (msg.includes("For security purposes")) {
        msg = "Too many attempts. Please wait a moment before trying again.";
      }
      setErrorMessage(msg);
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
              onClick={onNavigateToLogin}
              className="min-h-[44px] px-2 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Onboarding Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-lg border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-10 space-y-8">
          <div className="space-y-2 border-b border-[var(--border)] pb-6">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl tracking-[-0.03em] text-[var(--ink)]">
              Join your university on Sovra
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
              Connect to your institution&apos;s private campus space or register a new university workspace for your faculty and students.
            </p>
          </div>

          {/* Explicit Onboarding Mode Selector */}
          <div
            role="tablist"
            aria-label="Onboarding option"
            className="grid grid-cols-2 border border-[var(--border)] bg-[var(--surface)] p-1 text-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "join"}
              onClick={() => {
                setMode("join");
                setErrorMessage("");
              }}
              className={`min-h-[44px] py-2.5 px-3 font-semibold transition-colors cursor-pointer ${
                mode === "join"
                  ? "bg-[var(--bg)] text-[var(--ink)] border border-[var(--border)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] border border-transparent"
              }`}
            >
              Join Existing University
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register_school"}
              onClick={() => {
                setMode("register_school");
                setErrorMessage("");
              }}
              className={`min-h-[44px] py-2.5 px-3 font-semibold transition-colors cursor-pointer ${
                mode === "register_school"
                  ? "bg-[var(--bg)] text-[var(--ink)] border border-[var(--border)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] border border-transparent"
              }`}
            >
              Register New University
            </button>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="border border-red-600/40 bg-[var(--surface)] px-4 py-3 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {errorMessage}
            </div>
          )}

          {confirmationMessage ? (
            <div className="border border-[var(--accent)] bg-[var(--surface)] p-6 space-y-4 text-xs leading-relaxed">
              <div className="font-semibold text-sm text-[var(--ink)]">
                Verify your institutional email
              </div>
              <p className="text-[var(--ink-muted)]">{confirmationMessage}</p>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-contrast)] px-5 py-2.5 font-semibold cursor-pointer"
              >
                Continue to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              {mode === "join" ? (
                <div>
                  <label htmlFor="signup-school" className="block text-[var(--ink)] font-semibold mb-1.5">
                    University / Institution
                  </label>
                  <select
                    id="signup-school"
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}{s.domain ? ` • ${s.domain}` : ""})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4 p-4 border border-[var(--border)] bg-[var(--surface)]">
                  <div className="font-semibold text-[var(--ink)]">
                    University Workspace Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="new-school-name" className="block text-[var(--ink-muted)] font-medium mb-1">
                        University Name
                      </label>
                      <input
                        id="new-school-name"
                        type="text"
                        required
                        placeholder="e.g. Kigali College of Science"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-school-code" className="block text-[var(--ink-muted)] font-medium mb-1">
                        Short Code
                      </label>
                      <input
                        id="new-school-code"
                        type="text"
                        required
                        placeholder="e.g. KCS"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 text-xs uppercase outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="new-school-domain" className="block text-[var(--ink-muted)] font-medium mb-1">
                        Campus Domain
                      </label>
                      <input
                        id="new-school-domain"
                        type="text"
                        placeholder="e.g. kcs.ac.rw"
                        value={schoolDomain}
                        onChange={(e) => setSchoolDomain(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-school-country" className="block text-[var(--ink-muted)] font-medium mb-1">
                        Country
                      </label>
                      <input
                        id="new-school-country"
                        type="text"
                        placeholder="Rwanda"
                        value={schoolCountry}
                        onChange={(e) => setSchoolCountry(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="signup-name" className="block text-[var(--ink)] font-semibold mb-1.5">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder={mode === "register_school" ? "Dr. Alice Mukamana" : "Jean Bosco Nshimiye"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-[var(--ink)] font-semibold mb-1.5">
                  Institutional Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@university.ac.rw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>

              {mode === "join" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="signup-role" className="block text-[var(--ink)] font-semibold mb-1.5">
                      Academic Role
                    </label>
                    <select
                      id="signup-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                    >
                      <option value="Student">Student</option>
                      <option value="Class Representative">Class Representative</option>
                      <option value="Lecturer">Lecturer</option>
                    </select>
                  </div>

                  {role === "Lecturer" ? (
                    <div>
                      <label htmlFor="signup-id" className="block text-[var(--ink)] font-semibold mb-1.5">
                        Staff ID (Optional)
                      </label>
                      <input
                        id="signup-id"
                        type="text"
                        placeholder="e.g. LEC-204"
                        value={studentIdInput}
                        onChange={(e) => setStudentIdInput(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="signup-year" className="block text-[var(--ink)] font-semibold mb-1.5">
                        Academic Year
                      </label>
                      <select
                        id="signup-year"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                      >
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                        <option value="Year 5">Year 5</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="signup-password" className="block text-[var(--ink)] font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3.5 py-2.5 pr-16 text-sm outline-none focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
                {loading
                  ? "Creating campus account..."
                  : mode === "register_school"
                  ? "Create University Workspace"
                  : "Create Campus Account"}
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--ink-muted)]">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              Sign in &rarr;
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

export default SignUpPage;
