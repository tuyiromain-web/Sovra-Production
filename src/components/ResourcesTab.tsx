/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Search, Filter, BookOpen, Download, UploadCloud, Plus, FileText, 
  ExternalLink, CheckCircle, Tag, AlertCircle, FileSpreadsheet, Layers,
  Folder, FolderPlus, Trash2, Copy, Eye, X, ChevronRight, Check, FileCheck,
  FileDown, Sparkles, Zap, HardDrive, Share2
} from "lucide-react";
import { UserProfile, StudyResource } from "../types";
import { exportResourceToPDF, exportNotesContentToPDF } from "../utils/pdfGenerator";

// Structure of a downloaded file inside our Virtual File Explorer
export interface VirtualFile {
  id: string;
  name: string;
  size: string;
  type: string;
  virtualPath: string; // e.g. "/INES-Ruhengeri/Pharmacy/Year 2"
  systemPath: string;  // e.g. "C:\INES-Ruhengeri\Pharmacy\Year 2\Pharmacology I\Pharmacokinetics.pdf"
  downloadedAt: string;
  resourceId: string;
  notesContent: string; // Detailed mock clinical content generated for download
}

interface ResourcesTabProps {
  currentUser: UserProfile;
  resources: StudyResource[];
  onAddResource: (newResource: Omit<StudyResource, "id" | "downloadsCount" | "uploadedBy" | "uploadedById" | "uploadedAt">) => void;
  onIncrementDownload: (id: string) => void;
}

// Generates high-fidelity academic clinical guidelines/notes for real downloading
const generateAcademicFileContent = (res: StudyResource) => {
  return `================================================================================
SOVRA ACADEMIC NETWORK • MULTI-INSTITUTION WORKSPACE
FACULTY & DEPARTMENTAL DOCUMENTATION REPOSITORY
================================================================================
CLASS REGISTRATION: ${res.academicYear}

MODULE CODE       : ${res.courseCode}
MODULE TITLE      : ${res.courseName}
MATERIAL CATEGORY : ${res.category.toUpperCase()}
DOCUMENT TITLE    : ${res.title}

ORIGINAL AUTHOR   : ${res.uploadedBy}
DIGITALIZED DATE  : ${new Date(res.uploadedAt).toLocaleString()}
--------------------------------------------------------------------------------

1. DOCUMENT DESCRIPTION & SCOPE
--------------------------------------------------------------------------------
${res.description}

2. ESSENTIAL CLINICAL PHARMACOLOGY / COMPENDIAL GUIDES
--------------------------------------------------------------------------------
This educational resource was compiled, validated, and uploaded to the 
Sovra Digital Portal to assist students in acquiring validated academic knowledge
comprehensive academic and clinical competencies.

Standard Operating Principles & High-Yield Learning Objectives:
• Pharmacology (ADME & Mechanisms of Action): Detail absorption routes, protein-
  binding profiles, major metabolic pathways (specifically CYP450 enzymes), and 
  final renal or biliary excretion metrics.
• Pharmaceutics & Formulation: Understand dosage calculation ratios, compound 
  densities, suspension viscosity, standard excipient dynamics, and 
  sterilization standards.
• Chemistry & Synthesis Protocols: Outline reaction reagents, stoichiometric 
  yields, filtration steps, melting point analysis, and recrystallization purifications.

3. INSTITUTIONAL ACADEMIC INTEGRITY CODE (INES-Ruhengeri)
--------------------------------------------------------------------------------
In accordance with the Faculty of Applied Sciences standards, all materials 
downloaded are protected under local university honor codes. Students are strictly
forbidden from replicating or selling these guides for commercial gains. 

This file was successfully saved locally on your workstation file explorer.
================================================================================`;
};

// Map resources to their correct Lecturer Folder and Module Tab (using target fields or course code fallback)
export const getLecturerForResource = (res: StudyResource): { lecturer: string; module: string } => {
  if (res.targetLecturer && res.targetModule) {
    return { lecturer: res.targetLecturer, module: res.targetModule };
  }

  const code = res.courseCode ? res.courseCode.toUpperCase() : "";
  const name = res.courseName ? res.courseName.toLowerCase() : "";

  if (name.includes("therapeutics") || name.includes("regulation") || code.includes("PHA 401") || code.includes("PHA 405")) {
    return {
      lecturer: "Dr. Emmanuel Mutangana",
      module: name.includes("regulation") ? "Pharma Regulation" : "Advanced Clinical Therapeutics"
    };
  } else if (name.includes("clinical") || name.includes("pharmacology") || name.includes("chemistry") || name.includes("pharmacognosy") || code.includes("PHA 211") || code.includes("PHA 301") || code.includes("PHA 311")) {
    let mod = "Clinical Pharmacy";
    if (name.includes("pharmacology")) mod = "Pharmacology I";
    else if (name.includes("chemistry")) mod = "Medicinal Chemistry II";
    else if (name.includes("pharmacognosy")) mod = "Pharmacognosy I";
    return { lecturer: "Dr. Marie Claire", module: mod };
  } else if (name.includes("pharmaceutics") || name.includes("biopharmaceutics") || code.includes("PHA 212") || code.includes("PHA 304")) {
    let mod = "Pharmaceutics I";
    if (name.includes("ii")) mod = "Pharmaceutics II";
    else if (name.includes("biopharmaceutics")) mod = "Biopharmaceutics";
    return { lecturer: "Prof. Nkurunziza", module: mod };
  }

  return {
    lecturer: "Dr. Emmanuel Mutangana",
    module: "Advanced Clinical Therapeutics"
  };
};

// Triggers native browser download using Virtual Blobs
const triggerFileDownload = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ResourcesTab({
  currentUser,
  resources,
  onAddResource,
  onIncrementDownload
}: ResourcesTabProps) {
  // Navigation / Tab states
  const [activeSubTab, setActiveSubTab] = useState<"library" | "explorer">("library");

  // Local Study Library States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Lecturer Folders & Module Tabs State
  const [libraryMode, setLibraryMode] = useState<"folders" | "all">("folders");
  const [activeLecturerFolder, setActiveLecturerFolder] = useState<string>("Dr. Emmanuel Mutangana");
  const [activeModuleTab, setActiveModuleTab] = useState<string>("Advanced Clinical Therapeutics");

  // Upload targeting states (folders and module tabs)
  const [uploadTargetLecturer, setUploadTargetLecturer] = useState<string>("Dr. Emmanuel Mutangana");
  const [uploadTargetModule, setUploadTargetModule] = useState<string>("Advanced Clinical Therapeutics");

  // Upload Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState<StudyResource["category"]>("Notes");
  const [year, setYear] = useState(currentUser.academicYear);
  const [fileType, setFileType] = useState<StudyResource["fileType"]>("pdf");
  const [fileSize, setFileSize] = useState("1.5 MB");
  const [downloadUrl, setDownloadUrl] = useState("");
  
  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LECTURER_MODULES: Record<string, string[]> = {
    "Dr. Emmanuel Mutangana": ["Advanced Clinical Therapeutics", "Pharma Regulation"],
    "Dr. Marie Claire": ["Clinical Pharmacy", "Pharmacology I", "Medicinal Chemistry II", "Pharmacognosy I"],
    "Prof. Nkurunziza": ["Pharmaceutics I", "Pharmaceutics II", "Biopharmaceutics"]
  };

  // Sync activeModuleTab when activeLecturerFolder changes
  React.useEffect(() => {
    const modules = LECTURER_MODULES[activeLecturerFolder] || [];
    if (modules.length > 0) {
      setActiveModuleTab(modules[0]);
    }
  }, [activeLecturerFolder]);

  // Sync uploadTargetModule when uploadTargetLecturer changes
  React.useEffect(() => {
    const modules = LECTURER_MODULES[uploadTargetLecturer] || [];
    if (modules.length > 0) {
      setUploadTargetModule(modules[0]);
    }
  }, [uploadTargetLecturer]);

  // --- VIRTUAL ACADEMIC FILE EXPLORER STATE ---
  const [downloadedFiles, setDownloadedFiles] = useState<VirtualFile[]>(() => {
    const saved = localStorage.getItem("sovra_downloaded_files") || localStorage.getItem("pharmalink_downloaded_files");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "df-1",
        name: "Pharmacokinetics_Pharmacodynamics_Summary.pdf",
        size: "2.4 MB",
        type: "pdf",
        virtualPath: "/INES-Ruhengeri/Pharmacy/Year 2",
        systemPath: "C:\\INES-Ruhengeri\\Pharmacy\\Year 2\\Pharmacology I\\Pharmacokinetics_Pharmacodynamics_Summary.pdf",
        downloadedAt: "2026-06-25T11:00:00Z",
        resourceId: "res-1",
        notesContent: "================================================================================\nSOVRA ACADEMIC RESEARCH SUMMARY\n================================================================================\nCore analytical overview..."
      }
    ];
  });

  const [virtualFolders, setVirtualFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem("sovra_virtual_folders") || localStorage.getItem("pharmalink_virtual_folders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      "/INES-Ruhengeri/Pharmacy/Year 1",
      "/INES-Ruhengeri/Pharmacy/Year 2",
      "/INES-Ruhengeri/Pharmacy/Year 3",
      "/INES-Ruhengeri/Pharmacy/Year 4",
      "/INES-Ruhengeri/Pharmacy/Year 5",
      "/Downloads"
    ];
  });

  const [selectedExplorerFolder, setSelectedExplorerFolder] = useState<string>("/INES-Ruhengeri/Pharmacy/Year 2");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [viewingFile, setViewingFile] = useState<VirtualFile | null>(null);
  const [copiedPathId, setCopiedPathId] = useState<string | null>(null);

  // --- ACTIVE DOWNLOAD MODAL / SAVING PICKER STATE ---
  const [activeDownloadResource, setActiveDownloadResource] = useState<StudyResource | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  const [selectedVirtualFolder, setSelectedVirtualFolder] = useState("");
  const [customSystemPath, setCustomSystemPath] = useState("");

  // Synchronize File Explorer storage
  React.useEffect(() => {
    localStorage.setItem("sovra_downloaded_files", JSON.stringify(downloadedFiles));
  }, [downloadedFiles]);

  React.useEffect(() => {
    localStorage.setItem("sovra_virtual_folders", JSON.stringify(virtualFolders));
  }, [virtualFolders]);

  // Handle click on card "Download" button to open "Save As..." picker dialog
  const handleDownloadClick = (res: StudyResource) => {
    setActiveDownloadResource(res);
    const cleanTitle = res.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
    setCustomFileName(`${cleanTitle}.${res.fileType === "link" ? "txt" : res.fileType}`);
    
    const matchedFolder = `/INES-Ruhengeri/Pharmacy/${res.academicYear}`;
    setSelectedVirtualFolder(virtualFolders.includes(matchedFolder) ? matchedFolder : "/Downloads");
    setCustomSystemPath(`C:\\INES-Ruhengeri\\Pharmacy\\${res.academicYear}\\${res.courseName.replace(/[^a-zA-Z0-9 ]/g, "")}\\`);
  };

  // Triggers real file download and registers inside our Virtual File Explorer DB
  const handleConfirmDownload = () => {
    if (!activeDownloadResource) return;
    
    const res = activeDownloadResource;
    onIncrementDownload(res.id);

    const fileContent = generateAcademicFileContent(res);
    triggerFileDownload(customFileName, fileContent);

    const newFile: VirtualFile = {
      id: `df-${Date.now()}`,
      name: customFileName,
      size: res.fileSize || "1.5 MB",
      type: res.fileType,
      virtualPath: selectedVirtualFolder,
      systemPath: `${customSystemPath}${customFileName}`,
      downloadedAt: new Date().toISOString(),
      resourceId: res.id,
      notesContent: fileContent
    };

    setDownloadedFiles((prev) => [newFile, ...prev]);
    setSuccessMessage(`Document downloaded! Saved as '${customFileName}' in Local Directory: ${selectedVirtualFolder}`);
    setTimeout(() => setSuccessMessage(""), 5000);
    setActiveDownloadResource(null);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    let pathName = newFolderName.trim();
    if (!pathName.startsWith("/")) {
      pathName = "/" + pathName;
    }

    if (virtualFolders.includes(pathName)) {
      alert("Directory already exists!");
      return;
    }

    setVirtualFolders((prev) => [...prev, pathName]);
    setSelectedExplorerFolder(pathName);
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  const handleDeleteFile = (id: string) => {
    setDownloadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCopyPath = (id: string, pathText: string) => {
    navigator.clipboard.writeText(pathText);
    setCopiedPathId(id);
    setTimeout(() => setCopiedPathId(null), 2000);
  };

  const filteredResources = resources.filter((res) => {
    const isLecturer = currentUser.role === "Lecturer";
    const isOwner = res.uploadedById === currentUser.id;
    if (!isLecturer && res.approved === false && !isOwner) {
      return false;
    }

    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear = selectedYear === "All" || res.academicYear === selectedYear;
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;

    if (libraryMode === "folders") {
      const mapping = getLecturerForResource(res);
      const matchesLecturer = mapping.lecturer === activeLecturerFolder;
      const matchesModule = mapping.module === activeModuleTab;
      return matchesSearch && matchesYear && matchesCategory && matchesLecturer && matchesModule;
    }

    return matchesSearch && matchesYear && matchesCategory;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMB} MB`);
      
      if (file.name.endsWith(".pdf")) setFileType("pdf");
      else if (file.name.endsWith(".pptx") || file.name.endsWith(".ppt")) setFileType("pptx");
      else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) setFileType("docx");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMB} MB`);
      
      if (file.name.endsWith(".pdf")) setFileType("pdf");
      else if (file.name.endsWith(".pptx")) setFileType("pptx");
      else if (file.name.endsWith(".docx")) setFileType("docx");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseCode || !courseName) {
      alert("Please fill in the required fields: Title, Course Code, and Course Name.");
      return;
    }

    onAddResource({
      title,
      description: description || "No description provided.",
      category,
      courseCode: courseCode.toUpperCase(),
      courseName,
      academicYear: year,
      fileType,
      fileSize: fileType === "link" ? undefined : fileSize,
      downloadUrl: downloadUrl || "#",
      targetLecturer: uploadTargetLecturer,
      targetModule: uploadTargetModule
    });

    setTitle("");
    setDescription("");
    setCourseCode("");
    setCourseName("");
    setUploadedFileName("");
    setDownloadUrl("");
    setShowUploadForm(false);
    
    setSuccessMessage("Resource shared successfully! It is now digitalized.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const filesInActiveFolder = downloadedFiles.filter(
    (file) => file.virtualPath === selectedExplorerFolder
  );

  return (
    <div id="resources-tab-section" className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* Sub-Tab Navigation Header */}
      <div className="flex border-b border-white/8 gap-6 text-sm">
        <button
          onClick={() => setActiveSubTab("library")}
          className={`pb-3.5 font-bold cursor-pointer relative transition-all flex items-center gap-2 ${
            activeSubTab === "library"
              ? "text-[#38BDF8]"
              : "text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Shared Study Library</span>
          {activeSubTab === "library" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284C7] shadow-xs" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("explorer")}
          className={`pb-3.5 font-bold cursor-pointer relative transition-all flex items-center gap-2 ${
            activeSubTab === "explorer"
              ? "text-[#38BDF8]"
              : "text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Local Academic File Explorer</span>
          <span className="text-[10px] bg-[#1E232B] border border-white/8 px-2 py-0.5 rounded-full font-mono font-bold text-[#38BDF8]">
            {downloadedFiles.length} Saved
          </span>
          {activeSubTab === "explorer" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284C7] shadow-xs" />
          )}
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-left shadow-lg">
          <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
          <span className="text-xs font-mono font-bold">{successMessage}</span>
        </div>
      )}

      {/* RENDER VIEW 1: GENERAL STUDY LIBRARY */}
      {activeSubTab === "library" && (
        <>
          {/* Library Navigation & Mode Selection */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-glass p-4 rounded-2xl border border-white/8 text-left shadow-md">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Pharmacy Document Repository</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Browse lecture notes, past exam papers, and practical guides</p>
            </div>
            
            <div className="flex bg-[#0E1626] rounded-xl p-1 text-xs border border-white/8 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setLibraryMode("folders")}
                className={`px-3.5 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                  libraryMode === "folders"
                    ? "bg-[#0284C7] text-white shadow-xs"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Lecturer Folders</span>
              </button>
              <button
                type="button"
                onClick={() => setLibraryMode("all")}
                className={`px-3.5 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                  libraryMode === "all"
                    ? "bg-[#0284C7] text-white shadow-xs"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>All Documents</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Header */}
          <div className="bg-glass rounded-2xl border border-white/8 p-5 space-y-4 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={
                    libraryMode === "folders"
                      ? `Search within ${activeLecturerFolder}'s folder / ${activeModuleTab}...`
                      : "Search by note title, course code (e.g. PHA 211), or keywords..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0E1626] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] placeholder:text-[#64748B] transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="blue-gradient-btn text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-xs shadow-md glow-blue-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Document</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/8">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] mr-2 uppercase tracking-wider font-mono">
                <Filter className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Filters:</span>
              </div>

              {/* Academic Year filter */}
              <div className="flex bg-[#0E1626] rounded-xl p-1 text-xs border border-white/8 overflow-x-auto">
                {["All", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      selectedYear === yr
                        ? "bg-[#0284C7] text-white shadow-xs"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              {/* Category filter */}
              <div className="flex bg-[#0E1626] rounded-xl p-1 text-xs border border-white/8 overflow-x-auto">
                {["All", "Notes", "Past Paper", "Reference Book", "Lab Report", "Syllabus"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-[#0284C7] text-white shadow-xs"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Upload Form Drawer */}
          {showUploadForm && (
            <div className="bg-glass rounded-2xl border border-[#0284C7]/40 p-6 shadow-xl space-y-5 animate-fade-in">
              <div className="border-b border-white/8 pb-3 flex items-center justify-between text-left">
                <div>
                  <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#38BDF8]" />
                    <span>Digitalize Academic Document</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Share study materials with your colleagues at INES-Ruhengeri</p>
                </div>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-xs text-[#94A3B8] hover:text-white font-bold cursor-pointer font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Left side: Metadata inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Document Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mechanism of Action of Penicillins"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Description</label>
                    <textarea
                      placeholder="Summarize what this study file covers (chapters, concepts, practical guidance)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Course Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., PHA 211"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Course Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Pharmacology I"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Academic Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      >
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                        <option value="Year 5">Year 5</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      >
                        <option value="Notes">Lecture Notes</option>
                        <option value="Past Paper">Past Exam Paper</option>
                        <option value="Reference Book">Reference Textbook</option>
                        <option value="Lab Report">Lab Manual / Report</option>
                        <option value="Syllabus">Syllabus / Guide</option>
                      </select>
                    </div>
                  </div>

                  {/* Lecturer Folder & Module Tab targeting */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#0E1626] border border-white/8 rounded-xl">
                    <div>
                      <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Upload to Folder</label>
                      <select
                        value={uploadTargetLecturer}
                        onChange={(e) => setUploadTargetLecturer(e.target.value)}
                        className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      >
                        {Object.keys(LECTURER_MODULES).map((lec) => (
                          <option key={lec} value={lec}>
                            {lec}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#94A3B8] mb-1 uppercase tracking-wider font-mono">Module Folder Tab</label>
                      <select
                        value={uploadTargetModule}
                        onChange={(e) => setUploadTargetModule(e.target.value)}
                        className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      >
                        {(LECTURER_MODULES[uploadTargetLecturer] || []).map((mod) => (
                          <option key={mod} value={mod}>
                            {mod}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right side: File upload/linking */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Sharing Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFileType("pdf")}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          fileType === "pdf" ? "bg-[#0284C7]/15 border-[#0284C7] text-[#38BDF8]" : "bg-[#0E1626] border-white/8 text-[#94A3B8]"
                        }`}
                      >
                        PDF Document
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileType("pptx")}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          fileType === "pptx" ? "bg-[#0284C7]/15 border-[#0284C7] text-[#38BDF8]" : "bg-[#0E1626] border-white/8 text-[#94A3B8]"
                        }`}
                      >
                        PowerPoint (PPTX)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileType("docx")}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          fileType === "docx" ? "bg-[#0284C7]/15 border-[#0284C7] text-[#38BDF8]" : "bg-[#0E1626] border-white/8 text-[#94A3B8]"
                        }`}
                      >
                        Word Document
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileType("link")}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          fileType === "link" ? "bg-[#0284C7]/15 border-[#0284C7] text-[#38BDF8]" : "bg-[#0E1626] border-white/8 text-[#94A3B8]"
                        }`}
                      >
                        Web Hyperlink
                      </button>
                    </div>
                  </div>

                  {fileType === "link" ? (
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Web Link URL *</label>
                      <input
                        type="url"
                        required={fileType === "link"}
                        placeholder="https://drive.google.com/..."
                        value={downloadUrl}
                        onChange={(e) => setDownloadUrl(e.target.value)}
                        className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                      />
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center space-y-2 transition-colors ${
                        isDragging ? "border-[#0284C7] bg-[#0284C7]/10" : "border-white/15 hover:border-[#0284C7]/50 bg-[#0E1626]"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.pptx,.ppt,.docx,.doc"
                      />
                      <UploadCloud className="w-8 h-8 text-[#38BDF8]" />
                      <p className="text-xs font-bold text-[#F8FAFC]">
                        {uploadedFileName ? `Attached: ${uploadedFileName}` : "Drag & drop study file here"}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] font-mono">Supports PDF, PPTX, DOCX up to 15MB • Or click to browse</p>
                    </div>
                  )}

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/8">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl blue-gradient-btn text-white text-xs font-bold shadow-md glow-blue-sm cursor-pointer"
                    >
                      Confirm Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* LECTURER FOLDERS AND MODULE TABS VIEW */}
          {libraryMode === "folders" && (
            <div id="lecturer-folders-explorer" className="space-y-4 animate-fade-in text-left my-4">
              <div>
                <h4 className="text-[10px] font-bold text-[#94A3B8] mb-2.5 uppercase tracking-wider font-mono">
                  📂 Faculty Document Folders
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    {
                      name: "Dr. Emmanuel Mutangana",
                      subtitle: "Head of Department",
                      description: "Advanced Therapeutics & Regulation",
                      color: "border-[#0284C7]/40 bg-[#0284C7]/10"
                    },
                    {
                      name: "Dr. Marie Claire",
                      subtitle: "MoA Specialist",
                      description: "Clinical Pharmacy & Pharmacology I",
                      color: "border-[#8B5CF6]/40 bg-[#8B5CF6]/10"
                    },
                    {
                      name: "Prof. Nkurunziza",
                      subtitle: "Senior Advisor",
                      description: "Compounding Labs & Biopharmaceutics",
                      color: "border-[#10B981]/40 bg-[#10B981]/10"
                    }
                  ].map((lec) => {
                    const isActive = activeLecturerFolder === lec.name;
                    return (
                      <button
                        key={lec.name}
                        type="button"
                        onClick={() => setActiveLecturerFolder(lec.name)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 relative ${
                          isActive
                            ? "border-[#0284C7] bg-[#191D23] shadow-md ring-1 ring-[#0284C7]/50"
                            : "bg-glass border-white/8 hover:bg-[#0E1626] hover:border-white/15"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isActive ? "bg-[#0284C7]/20 text-[#38BDF8]" : "bg-[#0E1626] text-[#94A3B8]"}`}>
                          <Folder className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-[#F8FAFC] truncate">{lec.name}</h5>
                          <p className="text-[10px] font-mono font-semibold text-[#38BDF8] uppercase truncate">{lec.subtitle}</p>
                          <p className="text-[11px] text-[#94A3B8] leading-tight mt-1 line-clamp-2">{lec.description}</p>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse absolute top-3 right-3 shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Module Sub-tabs list */}
              <div className="bg-glass border border-white/8 rounded-xl p-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#94A3B8] px-2 py-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Module Tabs:</span>
                </span>
                
                {(LECTURER_MODULES[activeLecturerFolder] || []).map((mod) => {
                  const isModActive = activeModuleTab === mod;
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setActiveModuleTab(mod)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isModActive
                          ? "bg-[#0284C7] text-white shadow-xs"
                          : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]"
                      }`}
                    >
                      {mod}
                    </button>
                  );
                })}
              </div>

              {/* Current directory breadcrumb */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-[#94A3B8] bg-glass border border-white/8 px-3.5 py-2 rounded-xl">
                <span className="font-bold text-[#F8FAFC]">INES-Ruhengeri</span>
                <ChevronRight className="w-3 h-3 text-[#64748B]" />
                <span className="text-[#38BDF8]">Pharmacy Library</span>
                <ChevronRight className="w-3 h-3 text-[#64748B]" />
                <span className="text-[#F8FAFC] font-semibold">{activeLecturerFolder}</span>
                <ChevronRight className="w-3 h-3 text-[#64748B]" />
                <span className="text-[#A78BFA] font-bold">{activeModuleTab}</span>
              </div>
            </div>
          )}

          {/* Study Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => {
                return (
                  <div 
                    key={res.id} 
                    className="bg-glass rounded-2xl border border-white/8 p-5 hover:border-[#0284C7]/50 hover:bg-[#0E1626] transition-all duration-200 flex flex-col justify-between text-left shadow-sm group"
                  >
                    <div>
                      {/* Category badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#0284C7]/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">
                          {res.category}
                        </span>
                        {res.approved === false ? (
                          <span className="text-[9px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-2 py-0.5 rounded-full uppercase font-mono animate-pulse">
                            Pending Approval
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#94A3B8] font-mono bg-[#1E232B] px-2 py-0.5 rounded border border-white/5">
                            {res.academicYear}
                          </span>
                        )}
                      </div>

                      {/* Title and Course Details */}
                      <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] leading-snug mb-1.5 line-clamp-2 h-10 transition-colors">
                        {res.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-3">
                        <span className="text-[#38BDF8] font-bold bg-[#1E232B] border border-white/8 px-2 py-0.5 rounded-md font-mono text-[10px]">
                          {res.courseCode}
                        </span>
                        <span className="text-[#94A3B8] text-[11px] truncate max-w-[170px]">
                          {res.courseName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4 line-clamp-3 h-14">
                        {res.description}
                      </p>

                      {/* Targeting indicator badge */}
                      <div className="mb-3.5 p-2 bg-[#0E1626] border border-white/6 rounded-xl flex items-center gap-1.5 text-[10px] font-mono text-[#94A3B8]">
                        <Folder className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span className="font-semibold text-[#F8FAFC] truncate max-w-[110px]">{getLecturerForResource(res).lecturer}</span>
                        <ChevronRight className="w-3 h-3 text-[#64748B] shrink-0" />
                        <span className="font-semibold text-[#A78BFA] truncate max-w-[130px]">{getLecturerForResource(res).module}</span>
                      </div>
                    </div>

                    {/* Footer and Downloads count */}
                    <div className="border-t border-white/8 pt-3.5 mt-auto">
                      <div className="flex items-center justify-between mb-3 text-[10px] text-[#64748B] font-mono">
                        <span className="truncate max-w-[120px]">By: {res.uploadedBy}</span>
                        <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#94A3B8] flex items-center gap-1 font-mono">
                          <Layers className="w-3 h-3 text-[#64748B]" />
                          {res.downloadsCount} dl {res.fileSize ? `• ${res.fileSize}` : ""}
                        </span>

                        {res.fileType === "link" ? (
                          <div className="flex gap-1.5">
                            <a
                              href={res.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => onIncrementDownload(res.id)}
                              className="bg-[#0E1626] border border-white/10 hover:border-[#38BDF8] text-[#F8FAFC] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open</span>
                            </a>
                            <button
                              onClick={() => {
                                exportResourceToPDF(res);
                                setSuccessMessage(`Document "${res.title}" exported successfully to PDF!`);
                                setTimeout(() => setSuccessMessage(""), 4000);
                              }}
                              className="bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] hover:bg-[#EC407A] hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Export details as PDF"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDownloadClick(res)}
                              className="blue-gradient-btn text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs glow-blue-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Save As</span>
                            </button>
                            <button
                              onClick={() => {
                                exportResourceToPDF(res);
                                setSuccessMessage(`Document "${res.title}" exported successfully to PDF!`);
                                setTimeout(() => setSuccessMessage(""), 4000);
                              }}
                              className="bg-[#EC407A]/15 border border-[#EC407A]/30 text-[#EC407A] hover:bg-[#EC407A] hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Export full details as A4 PDF"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-glass rounded-2xl border border-white/8 p-12 text-center space-y-3">
                <div className="p-4 bg-[#0E1626] rounded-2xl border border-white/8 text-[#64748B] inline-block">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-[#F8FAFC]">No resources found matching filters</h4>
                <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">Try refining your search terms or selecting a different academic year or file category above.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* RENDER VIEW 2: LOCAL ACADEMIC FILE EXPLORER */}
      {activeSubTab === "explorer" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {/* Left Column: Virtual Folder Directory Tree */}
          <div className="md:col-span-1 bg-glass rounded-2xl border border-white/8 p-5 space-y-4 h-[calc(100vh-220px)] overflow-y-auto shadow-md">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <span className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#38BDF8]" />
                <span>Directories</span>
              </span>
              <button
                onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                className="text-[10px] font-bold text-[#38BDF8] uppercase font-mono tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {showNewFolderInput && (
              <form onSubmit={handleCreateFolder} className="space-y-2 bg-[#0E1626] p-3 rounded-xl border border-white/10 animate-fade-in">
                <label className="block text-[8px] font-bold font-mono text-[#94A3B8] uppercase">Folder Path (start with /)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /MyNotes/Pharmacology"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-glass border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7] font-mono"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowNewFolderInput(false)}
                    className="px-2 py-1 text-[9px] font-bold text-[#94A3B8] uppercase font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284C7] text-white px-2.5 py-1 rounded-md text-[9px] font-bold uppercase font-mono cursor-pointer shadow-xs"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Folder list */}
            <div className="space-y-1">
              {virtualFolders.map((folder) => {
                const isActive = selectedExplorerFolder === folder;
                const fileCountInThisFolder = downloadedFiles.filter((f) => f.virtualPath === folder).length;

                return (
                  <button
                    key={folder}
                    onClick={() => setSelectedExplorerFolder(folder)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      isActive
                        ? "bg-[#0284C7]/15 border border-[#0284C7]/40 text-[#38BDF8] font-bold"
                        : "text-[#94A3B8] hover:bg-[#0E1626] hover:text-[#F8FAFC] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#38BDF8]" : "text-[#64748B]"}`} />
                      <span className="truncate font-mono text-[11px]">{folder}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-mono bg-[#1E232B] px-1.5 py-0.5 rounded-md border border-white/5">
                      {fileCountInThisFolder}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Files catalogued in active directory */}
          <div className="md:col-span-3 bg-glass rounded-2xl border border-white/8 p-6 h-[calc(100vh-220px)] overflow-y-auto flex flex-col justify-between shadow-md">
            <div>
              <div className="border-b border-white/8 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                    <Folder className="w-4 h-4 text-[#38BDF8]" />
                    <span>Directory: <span className="font-mono text-xs text-[#38BDF8]">{selectedExplorerFolder}</span></span>
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">This directory compiles all downloads mapped to this location.</p>
                </div>
              </div>

              {filesInActiveFolder.length > 0 ? (
                <div className="space-y-3">
                  {filesInActiveFolder.map((file) => {
                    const isCopied = copiedPathId === file.id;

                    return (
                      <div 
                        key={file.id} 
                        className="p-4 bg-[#0E1626] border border-white/6 rounded-2xl hover:border-[#0284C7]/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 truncate">
                          <div className="p-2.5 bg-glass rounded-xl border border-white/8 text-[#38BDF8] shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="truncate text-left min-w-0">
                            <h4 className="font-bold text-xs text-[#F8FAFC] truncate" title={file.name}>
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-[#64748B] font-mono truncate max-w-sm" title={file.systemPath}>
                                {file.systemPath}
                              </span>
                              <button
                                onClick={() => handleCopyPath(file.id, file.systemPath)}
                                title="Copy full system path"
                                className="p-1 text-[#64748B] hover:text-[#38BDF8] rounded transition-colors cursor-pointer"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
                              Size: {file.size} • Downloaded on {new Date(file.downloadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => setViewingFile(file)}
                            className="p-2 bg-[#1E232B] hover:bg-[#252B35] text-[#F8FAFC] border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Read document summary directly"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                            <span>Read</span>
                          </button>
                          <button
                            onClick={() => {
                              exportNotesContentToPDF(
                                file.name,
                                file.notesContent,
                                file.virtualPath.split("/").pop() || "General",
                                file.systemPath
                              );
                              setSuccessMessage(`Local note "${file.name}" successfully generated as high-fidelity PDF!`);
                              setTimeout(() => setSuccessMessage(""), 4000);
                            }}
                            className="p-2 bg-[#EC407A]/15 hover:bg-[#EC407A] text-[#EC407A] hover:text-white border border-[#EC407A]/30 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Export compiled notes content to local PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-2 bg-[#EC407A]/10 hover:bg-[#EC407A] text-[#EC407A] hover:text-white border border-transparent rounded-xl transition-all cursor-pointer"
                            title="Remove from Local Explorer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="p-4 bg-[#0E1626] border border-white/8 text-[#64748B] inline-block rounded-2xl">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-xs text-[#F8FAFC]">No documents in this folder</h4>
                  <p className="text-[11px] text-[#94A3B8] max-w-xs mx-auto">
                    To save files here, switch to the <strong>Shared Study Library</strong>, click <strong>Save As</strong> on any resource, and select <strong className="font-mono text-[#38BDF8]">{selectedExplorerFolder}</strong>!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: SAVE AS & DIRECT DESTINATION PATH PICKER --- */}
      {activeDownloadResource && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-glass rounded-2xl border border-[#0284C7]/40 w-full max-w-xl shadow-2xl overflow-hidden animate-slide-in text-left">
            {/* Header */}
            <div className="bg-[#0E1626] p-5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#F8FAFC]">Save Academic Document As...</h3>
                  <p className="text-[10px] text-[#94A3B8] font-mono">Select path and configure save file settings</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDownloadResource(null)}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              <div className="bg-[#0E1626] border border-white/8 rounded-xl p-3 flex gap-2.5 text-xs text-[#94A3B8]">
                <AlertCircle className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F8FAFC]">Active Resource:</strong> {activeDownloadResource.title} ({activeDownloadResource.courseCode})
                  <p className="text-[10px] text-[#64748B] font-mono mt-1">Downloading compiles full scientific summaries & clinical protocols into a standard file.</p>
                </div>
              </div>

              {/* 1. Filename field */}
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">File Name on Workstation *</label>
                <input
                  type="text"
                  required
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] font-mono text-[#F8FAFC]"
                />
              </div>

              {/* 2. Virtual Folder picker */}
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Choose Destination Folder in App Explorer *</label>
                <select
                  value={selectedVirtualFolder}
                  onChange={(e) => {
                    setSelectedVirtualFolder(e.target.value);
                    const cleanFolder = e.target.value.replace(/\//g, "\\");
                    setCustomSystemPath(`C:${cleanFolder}\\${activeDownloadResource.courseName.replace(/[^a-zA-Z0-9 ]/g, "")}\\`);
                  }}
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] font-mono"
                >
                  {virtualFolders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. OS System Path direction */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Workstation OS Target Path</label>
                  <span className="text-[9px] text-[#38BDF8] bg-[#0284C7]/10 px-1.5 py-0.5 rounded font-mono font-bold">Simulated Local Path</span>
                </div>
                <input
                  type="text"
                  required
                  value={customSystemPath}
                  onChange={(e) => setCustomSystemPath(e.target.value)}
                  className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] font-mono text-[#F8FAFC]"
                />
                <p className="text-[10px] text-[#64748B] font-mono mt-1">
                  Once downloaded, registered path: <span className="text-[#38BDF8] underline">{customSystemPath}{customFileName}</span>
                </p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-[#0E1626] p-4 border-t border-white/8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveDownloadResource(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-[#94A3B8] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDownload}
                className="blue-gradient-btn text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md glow-blue-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save & Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INTERACTIVE NOTES READER / PREVIEWER --- */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-glass rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-in text-left">
            {/* Header */}
            <div className="bg-[#0E1626] p-5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 text-[#A78BFA] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#F8FAFC]">{viewingFile.name}</h3>
                  <p className="text-[10px] text-[#94A3B8] font-mono truncate max-w-md">Path: {viewingFile.systemPath}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingFile(null)}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notes content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-[#0B132B] border-b border-white/8 font-mono text-xs leading-relaxed text-[#CBD5E1] whitespace-pre-wrap">
              {viewingFile.notesContent}
            </div>

            {/* Footer */}
            <div className="bg-[#0E1626] p-4 flex items-center justify-between">
              <span className="text-[10px] text-[#64748B] font-mono">
                Size: {viewingFile.size} • Registered in app storage
              </span>
              <button
                onClick={() => setViewingFile(null)}
                className="bg-[#1E232B] hover:bg-[#252B35] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer border border-white/10"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
