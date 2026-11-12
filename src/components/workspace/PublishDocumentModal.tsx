/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { DocCategory } from "./workspaceTypes";

export const PublishDocumentModal: React.FC = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, publishDocument, programs, activeTenant } = useWorkspace();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [programId, setProgramId] = useState("");
  const [category, setCategory] = useState<DocCategory>("Syllabus");
  const [version, setVersion] = useState("v1.0");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [creditHours, setCreditHours] = useState(3);
  const [summary, setSummary] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [accreditationAlignment, setAccreditationAlignment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (programs.length > 0 && !programId) {
      setProgramId(programs[0].id);
    }
  }, [programs, programId]);

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

  if (!isPublishModalOpen) return null;

  const handleAddObjective = () => {
    if (!objectiveInput.trim()) return;
    setObjectives([...objectives, objectiveInput.trim()]);
    setObjectiveInput("");
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || !author.trim() || !summary.trim()) return;

    setIsSubmitting(true);
    const selectedProg = programs.find(p => p.id === programId) || programs[0];

    setTimeout(() => {
      publishDocument({
        title: title.trim(),
        code: code.trim().toUpperCase(),
        programId: selectedProg ? selectedProg.id : "prog-general",
        programName: selectedProg ? selectedProg.name : "General Curricula",
        category,
        version: version.trim() || "v1.0",
        author: author.trim(),
        authorRole: authorRole.trim() || "Faculty Lecturer",
        status: "Verified",
        summary: summary.trim(),
        learningObjectives: objectives.length > 0 ? objectives : ["Demonstrate master-level proficiency in verified curricular competencies."],
        creditHours: Number(creditHours) || 3,
        prerequisites: ["Departmental Consent"],
        accreditationAlignment: accreditationAlignment.trim() || `${activeTenant.accreditationBody} Compliant`,
        fileSize: "3.2 MB"
      });
      setIsSubmitting(false);
    }, 400);
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
              {activeTenant.name} &bull; Official Syllabus Repository
            </span>
            <h2 id="publish-modal-title" className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">
              Publish Faculty Documentation
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

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="doc-title" className="block text-[var(--ink-muted)] font-medium">
                Document / Course Title
              </label>
              <input
                id="doc-title"
                type="text"
                required
                placeholder="e.g. Distributed Operating Systems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="doc-code" className="block text-[var(--ink-muted)] font-medium">
                Course / Module Code
              </label>
              <input
                id="doc-code"
                type="text"
                required
                placeholder="e.g. CS-401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)] uppercase tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="doc-program" className="block text-[var(--ink-muted)] font-medium">
                Academic Program
              </label>
              <select
                id="doc-program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="doc-category" className="block text-[var(--ink-muted)] font-medium">
                Documentation Category
              </label>
              <select
                id="doc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              >
                <option value="Syllabus">Syllabus</option>
                <option value="Accreditation Record">Accreditation Record</option>
                <option value="Curriculum Framework">Curriculum Framework</option>
                <option value="Lecture Packet">Lecture Packet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="doc-version" className="block text-[var(--ink-muted)] font-medium">
                Curricular Version
              </label>
              <input
                id="doc-version"
                type="text"
                placeholder="e.g. v1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)] tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="doc-author" className="block text-[var(--ink-muted)] font-medium">
                Faculty Author
              </label>
              <input
                id="doc-author"
                type="text"
                required
                placeholder="e.g. Dr. Jane Cooper"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="doc-author-role" className="block text-[var(--ink-muted)] font-medium">
                Academic Title / Role
              </label>
              <input
                id="doc-author-role"
                type="text"
                placeholder="e.g. Associate Professor"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="doc-credits" className="block text-[var(--ink-muted)] font-medium">
                Credit Hours
              </label>
              <input
                id="doc-credits"
                type="number"
                min="1"
                max="12"
                value={creditHours}
                onChange={(e) => setCreditHours(Number(e.target.value))}
                className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)] tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="doc-summary" className="block text-[var(--ink-muted)] font-medium">
              Curricular Summary & Scope
            </label>
            <textarea
              id="doc-summary"
              rows={3}
              required
              placeholder="Outline the course framework, laboratory requirements, and grading criteria..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] p-3 outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Objectives Adder */}
          <div className="space-y-2">
            <label htmlFor="objective-input" className="block text-[var(--ink-muted)] font-medium">
              Measurable Learning Objectives
            </label>
            <div className="flex gap-2">
              <input
                id="objective-input"
                type="text"
                placeholder="Add verified learning outcome..."
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddObjective(); }}}
                className="flex-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] text-[var(--ink)] cursor-pointer"
              >
                Add
              </button>
            </div>

            {objectives.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]">
                    <span className="truncate">{idx + 1}. {obj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      aria-label={`Remove objective ${idx + 1}`}
                      className="text-[var(--ink-muted)] hover:text-[var(--ink)] ml-2 cursor-pointer font-bold px-1"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="doc-accreditation" className="block text-[var(--ink-muted)] font-medium">
              Accreditation Benchmark Alignment
            </label>
            <input
              id="doc-accreditation"
              type="text"
              placeholder={`e.g. ${activeTenant.accreditationBody} Criterion 3`}
              value={accreditationAlignment}
              onChange={(e) => setAccreditationAlignment(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2.5 text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent px-6 py-2.5 text-xs font-semibold rounded-none cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Indexing Document..." : "Publish to Vault"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
