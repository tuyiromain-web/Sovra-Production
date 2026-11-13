/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { ResourceCategory, ResourceFileType } from "./workspaceTypes";

export const PublishDocumentModal: React.FC = () => {
  const {
    isPublishModalOpen,
    setIsPublishModalOpen,
    activeSchool,
    courses,
    publishDocument,
  } = useWorkspace();

  const [title, setTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("Syllabus");
  const [academicYear, setAcademicYear] = useState("Year 1");
  const [fileType, setFileType] = useState<ResourceFileType>("pdf");
  const [description, setDescription] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const hasInitializedCourse = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPublishModalOpen(false);
      }
    };
    if (isPublishModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPublishModalOpen, setIsPublishModalOpen]);

  useEffect(() => {
    if (isPublishModalOpen && courses.length > 0 && !hasInitializedCourse.current) {
      hasInitializedCourse.current = true;
      setSelectedCourseId(courses[0].id);
      setCourseCode(courses[0].code);
      setCourseName(courses[0].name);
      setAcademicYear(courses[0].academic_year);
    }
    if (!isPublishModalOpen) {
      hasInitializedCourse.current = false;
    }
  }, [isPublishModalOpen, courses]);

  if (!isPublishModalOpen) return null;

  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id);
    const found = courses.find((c) => c.id === id);
    if (found) {
      setCourseCode(found.code);
      setCourseName(found.name);
      setAcademicYear(found.academic_year);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !courseCode.trim() || !courseName.trim()) {
      setErrorMsg("Please fill in the document title, course code, and course name.");
      return;
    }

    if (fileType === "link" && !downloadUrl.trim()) {
      setErrorMsg("Please enter a valid resource URL.");
      return;
    }

    setSubmitting(true);
    try {
      await publishDocument({
        title: title.trim(),
        description: description.trim(),
        category,
        course_id: selectedCourseId || null,
        course_code: courseCode.trim().toUpperCase(),
        course_name: courseName.trim(),
        academic_year: academicYear,
        file_type: fileType,
        download_url: downloadUrl.trim(),
        file: selectedFile,
      });

      setTitle("");
      setDescription("");
      setDownloadUrl("");
      setSelectedFile(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to publish document. Please verify your permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-10 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] pb-4 mb-6">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)]">
              {activeSchool.name} &bull; Official Academic Library
            </span>
            <h2
              id="publish-modal-title"
              className="font-sans text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-[-0.03em]"
            >
              Publish Course Resource
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsPublishModalOpen(false)}
            aria-label="Close publish dialog"
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-2 text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 border border-red-600/40 bg-[var(--surface)] px-4 py-2.5 text-xs text-red-600 dark:text-red-400"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label htmlFor="doc-title" className="block font-semibold text-[var(--ink)] mb-1">
              Document Title
            </label>
            <input
              id="doc-title"
              type="text"
              required
              placeholder="e.g. Week 4 Clinical Pharmacology Lecture Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
            />
          </div>

          {courses.length > 0 && (
            <div>
              <label htmlFor="doc-course-select" className="block font-semibold text-[var(--ink)] mb-1">
                Linked University Course (Optional)
              </label>
              <select
                id="doc-course-select"
                value={selectedCourseId}
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                <option value="">Enter custom course details below</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.academic_year})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="doc-code" className="block font-semibold text-[var(--ink)] mb-1">
                Course Code
              </label>
              <input
                id="doc-code"
                type="text"
                required
                placeholder="e.g. PHA 211"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="doc-course-name" className="block font-semibold text-[var(--ink)] mb-1">
                Course Name
              </label>
              <input
                id="doc-course-name"
                type="text"
                required
                placeholder="e.g. Pharmacology I"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="doc-category" className="block font-semibold text-[var(--ink)] mb-1">
                Category
              </label>
              <select
                id="doc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                <option value="Syllabus">Syllabus</option>
                <option value="Notes">Lecture Notes</option>
                <option value="Past Paper">Past Paper</option>
                <option value="Reference Book">Reference Book</option>
                <option value="Lab Report">Lab Report</option>
              </select>
            </div>

            <div>
              <label htmlFor="doc-year" className="block font-semibold text-[var(--ink)] mb-1">
                Academic Year
              </label>
              <select
                id="doc-year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5">Year 5</option>
              </select>
            </div>

            <div>
              <label htmlFor="doc-filetype" className="block font-semibold text-[var(--ink)] mb-1">
                Format
              </label>
              <select
                id="doc-filetype"
                value={fileType}
                onChange={(e) => setFileType(e.target.value as ResourceFileType)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                <option value="pdf">PDF Document</option>
                <option value="pptx">Presentation Slides</option>
                <option value="docx">Word Document</option>
                <option value="link">External Link</option>
              </select>
            </div>
          </div>

          {fileType === "link" ? (
            <div>
              <label htmlFor="doc-url" className="block font-semibold text-[var(--ink)] mb-1">
                Resource URL
              </label>
              <input
                id="doc-url"
                type="url"
                required
                placeholder="https://..."
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="doc-file" className="block font-semibold text-[var(--ink)] mb-1">
                Upload File (PDF, DOCX, PPTX)
              </label>
              <input
                id="doc-file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2 text-xs"
              />
            </div>
          )}

          <div>
            <label htmlFor="doc-description" className="block font-semibold text-[var(--ink)] mb-1">
              Summary & Reading Notes
            </label>
            <textarea
              id="doc-description"
              rows={3}
              placeholder="Summarize key topics, chapters covered, or exam preparation notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)] resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-accent px-6 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Publish to Library"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
