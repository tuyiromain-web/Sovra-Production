/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const ProgramsMatrixView: React.FC = () => {
  const {
    courses,
    activeSchool,
    currentUser,
    addCourse,
    setActiveTab,
    setSearchQuery,
  } = useWorkspace();

  const canManageCourses =
    currentUser?.role === "Lecturer" || currentUser?.role === "Admin";

  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [academicYear, setAcademicYear] = useState("Year 1");
  const [credits, setCredits] = useState("10");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!code.trim() || !name.trim()) {
      setErrorMsg("Course code and course name are required.");
      return;
    }

    setSubmitting(true);
    try {
      await addCourse({
        code: code.trim(),
        name: name.trim(),
        academic_year: academicYear,
        credits: Number(credits) || 10,
        description: description.trim() || undefined,
      });
      setCode("");
      setName("");
      setDescription("");
      setCredits("10");
      setShowAddForm(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Unable to create course. Ensure you have Lecturer or Admin permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Academic Curriculum &bull; {activeSchool.code}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-[-0.03em]">
            Courses & Study Programs
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Official courses, credit hours, and connected study resources offered at {activeSchool.name}.
          </p>
        </div>

        {canManageCourses && (
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer self-start sm:self-auto shrink-0"
          >
            {showAddForm ? "Close Form" : "+ Add Course"}
          </button>
        )}
      </div>

      {/* Add Course Inline Form (Lecturers & Admins) */}
      {showAddForm && canManageCourses && (
        <form
          onSubmit={handleAddCourse}
          className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 text-xs"
        >
          <div className="font-sans text-base font-semibold text-[var(--ink)]">
            Register New University Course
          </div>

          {errorMsg && (
            <div role="alert" className="border border-red-600/40 bg-[var(--bg)] px-3 py-2 text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="course-code" className="block text-[var(--ink-muted)] font-medium mb-1">
                Course Code
              </label>
              <input
                id="course-code"
                type="text"
                required
                placeholder="e.g. PHA 211"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="course-name" className="block text-[var(--ink-muted)] font-medium mb-1">
                Course Name
              </label>
              <input
                id="course-name"
                type="text"
                required
                placeholder="e.g. Pharmacology I"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="course-credits" className="block text-[var(--ink-muted)] font-medium mb-1">
                Credits
              </label>
              <input
                id="course-credits"
                type="number"
                min={1}
                max={60}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 tabular-nums outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="course-year" className="block text-[var(--ink-muted)] font-medium mb-1">
                Academic Year
              </label>
              <select
                id="course-year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5">Year 5</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="course-desc" className="block text-[var(--ink-muted)] font-medium mb-1">
                Course Description
              </label>
              <input
                id="course-desc"
                type="text"
                placeholder="Core topics, lab sessions, and learning goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-accent px-5 py-2 font-semibold cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      )}

      {/* Summary Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-3 border border-[var(--border)] bg-[var(--surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Total Courses
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {courses.length}
          </div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Total Credit Weight
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {courses.reduce((acc, c) => acc + (c.credits || 0), 0)}
          </div>
        </div>

        <div className="p-5 col-span-2 lg:col-span-1">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Linked Resources
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {courses.reduce((acc, c) => acc + c.resourceCount, 0)}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center space-y-3">
          <div className="font-sans text-lg font-semibold text-[var(--ink)]">
            No courses registered yet
          </div>
          <p className="text-xs text-[var(--ink-muted)] max-w-md mx-auto">
            {canManageCourses
              ? "Click '+ Add Course' above to add your university's first course to the curriculum."
              : "Your faculty or university administrator has not added courses to this workspace yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-8 space-y-5 flex flex-col justify-between hover:border-[var(--ink-muted)] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-1">
                      <span className="font-semibold text-[var(--ink)] tabular-nums">{course.code}</span>
                      <span>&bull;</span>
                      <span>{course.academic_year}</span>
                    </div>
                    <h2 className="font-sans text-2xl font-semibold text-[var(--ink)] tracking-tight">
                      {course.name}
                    </h2>
                  </div>

                  <span className="border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] tabular-nums shrink-0">
                    {course.credits} Credits
                  </span>
                </div>

                {course.description && (
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    {course.description}
                  </p>
                )}

                <div className="text-xs text-[var(--ink-muted)] flex items-center justify-between pt-1">
                  <span>Published Materials</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">
                    {course.resourceCount} Documents
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(course.code);
                    setActiveTab("documents");
                  }}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                >
                  Open Course Documents &rarr;
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("vault")}
                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  Resource Vault
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
