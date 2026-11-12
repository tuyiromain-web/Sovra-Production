/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { StudyResource, AppNotification } from "../types";

/**
 * Utility to export a StudyResource (material) to PDF.
 */
export function exportResourceToPDF(resource: StudyResource) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin; // 170mm

  let y = 20;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate-900 / Navy
  doc.rect(margin, y, contentWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SOVRA ACADEMIC NETWORK", margin + 6, y + 9);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("INSTITUTIONAL REPOSITORY • ACADEMIC WORKSPACE SYSTEM", margin + 6, y + 15);
  
  y += 32;

  // Document Title
  doc.setTextColor(21, 20, 19); // Charcoal (#151413)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(resource.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 6) + 4;

  // Metadata Block Frame
  doc.setDrawColor(229, 226, 222); // light border
  doc.setFillColor(248, 247, 246); // warm off-white background
  doc.rect(margin, y, contentWidth, 34, "FD");

  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  
  doc.text("COURSE CODE:", margin + 5, y + 8);
  doc.text("COURSE NAME:", margin + 5, y + 14);
  doc.text("CATEGORY:", margin + 5, y + 20);
  doc.text("ACADEMIC YEAR:", margin + 5, y + 26);

  doc.text("UPLOADED BY:", margin + 90, y + 8);
  doc.text("UPLOADED ON:", margin + 90, y + 14);
  doc.text("FILE DETAILS:", margin + 90, y + 20);

  // Metadata Values
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  
  doc.text(resource.courseCode, margin + 35, y + 8);
  
  const courseLines = doc.splitTextToSize(resource.courseName, 50);
  doc.text(courseLines, margin + 35, y + 14);
  
  doc.text(resource.category, margin + 35, y + 20);
  doc.text(resource.academicYear, margin + 35, y + 26);

  doc.text(resource.uploadedBy || "System Admin", margin + 120, y + 8);
  doc.text(new Date(resource.uploadedAt).toLocaleString(), margin + 120, y + 14);
  doc.text(`${resource.fileType.toUpperCase()} File ${resource.fileSize ? `(${resource.fileSize})` : ""}`, margin + 120, y + 20);

  y += 42;

  // Section Header: Description
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(6, 95, 70);
  doc.text("1. DOCUMENT SPECIFICATION & DESCRIPTION", margin, y);
  y += 5;

  doc.setDrawColor(6, 95, 70);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Description Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const descLines = doc.splitTextToSize(resource.description || "No further description provided.", contentWidth);
  doc.text(descLines, margin, y);
  y += (descLines.length * 5.5) + 10;

  // Section Header: Guidelines
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(6, 95, 70);
  doc.text("2. CORE CLINICAL COMPETENCIES & CONVENTIONS", margin, y);
  y += 5;

  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Learning guidelines
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const coreGuidelines = [
    "• Clinical Safety Rules: Verify the pharmacology profile, including contraindications, side effects, absorption pathways, and therapeutic index.",
    "• Formulation Integrity: Observe active pharmaceutical ingredient dosage metrics, suspension ratios, excipient properties, and sterile preparation benchmarks.",
    "• Academic Honor Code: This document is distributed strictly for study assistance in compliance with the INES-Ruhengeri academic guidelines. Unauthorized replication or commercial distribution is prohibited."
  ];

  for (const line of coreGuidelines) {
    const wrappedLine = doc.splitTextToSize(line, contentWidth);
    doc.text(wrappedLine, margin, y);
    y += (wrappedLine.length * 5) + 2;
  }

  // Footer on current page
  doc.setDrawColor(229, 226, 222);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("Sovra Academic Platform © 2026 • Academic Resource Repository", margin, pageHeight - 10);
  doc.text("Page 1 of 1", pageWidth - margin - 20, pageHeight - 10);

  // Save File
  const sanitizedTitle = resource.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  doc.save(`SOVRA_${sanitizedTitle}.pdf`);
}

/**
 * Utility to export a lecture note / virtual file notesContent directly to PDF.
 */
export function exportNotesContentToPDF(fileName: string, notesContent: string, academicYear = "N/A", systemPath = "") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;
  let pageNum = 1;

  // Header Banner
  doc.setFillColor(21, 20, 19); // Ambient Dark Black/Brown
  doc.rect(margin, y, contentWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SOVRA SECURE WORKSPACE COMPILATION", margin + 6, y + 9);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`LOCAL REPOSITORY SYNCED NOTES • LEVEL: ${academicYear.toUpperCase()}`, margin + 6, y + 15);

  y += 32;

  // Title
  doc.setTextColor(21, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const cleanFileName = fileName.replace(/\.[^/.]+$/, "");
  const titleLines = doc.splitTextToSize(cleanFileName, contentWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 6) + 4;

  if (systemPath) {
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`Workstation Directory: ${systemPath}`, margin, y);
    y += 8;
  }

  // Draw dividing line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Write content
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);

  const rawLines = notesContent.split("\n");
  
  for (const rawLine of rawLines) {
    // If we have lines that contain formatting delimiters (like equals or hyphens), render them nicely
    const lineText = rawLine.trim() ? rawLine : " ";
    const wrappedLines = doc.splitTextToSize(lineText, contentWidth);

    for (const wrap of wrappedLines) {
      if (y > pageHeight - 25) {
        // Page footer before page break
        doc.setDrawColor(229, 226, 222);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text("Sovra Academic Workspace Sync Utility © 2026", margin, pageHeight - 10);
        doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);

        doc.addPage();
        pageNum++;
        y = 20;
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
      }
      doc.text(wrap, margin, y);
      y += 5;
    }
  }

  // Final page footer
  doc.setDrawColor(229, 226, 222);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("Sovra Academic Workspace Sync Utility © 2026", margin, pageHeight - 10);
  doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);

  doc.save(`SOVRA_COMPILATION_${cleanFileName}.pdf`);
}

/**
 * Utility to export an Announcement / lecture summary / priority notification to PDF.
 */
export function exportAnnouncementToPDF(notification: AppNotification) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // Header Banner
  doc.setFillColor(153, 27, 27); // Dark red (#991B1B) for academic priority notifications
  doc.rect(margin, y, contentWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("OFFICIAL LECTURE SUMMARY & ACADEMIC BROADCAST", margin + 6, y + 9);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`SOVRA ACADEMIC NETWORK • OFFICIAL WORKSPACE BROADCAST • ${notification.type.toUpperCase()}`, margin + 6, y + 15);

  y += 32;

  // Announcement Title
  doc.setTextColor(21, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(notification.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 6) + 4;

  // Info card box
  doc.setDrawColor(229, 226, 222);
  doc.setFillColor(248, 247, 246);
  doc.rect(margin, y, contentWidth, 18, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("BROADCAST CATEGORY:", margin + 5, y + 7);
  doc.text("PUBLISHED TIMESTAMP:", margin + 5, y + 12);
  doc.text("TARGET AUDIENCE:", margin + 90, y + 7);
  doc.text("AUTHENTICATION STATUS:", margin + 90, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(20, 20, 20);
  doc.text(notification.type.toUpperCase(), margin + 45, y + 7);
  doc.text(new Date(notification.createdAt).toLocaleString(), margin + 45, y + 12);
  doc.text(notification.targetRole || "All Students & Academic Staff", margin + 132, y + 7);
  
  doc.setTextColor(6, 95, 70); // green
  doc.text("OFFICIALLY SIGNED", margin + 132, y + 12);

  y += 28;

  // Body Section Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(153, 27, 27);
  doc.text("LECTURE STATEMENT & ACADEMIC DIRECTIVE SUMMARY", margin, y);
  y += 4;
  doc.setDrawColor(153, 27, 27);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Message Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const messageLines = doc.splitTextToSize(notification.message, contentWidth);
  
  for (const line of messageLines) {
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 5.5;
  }

  y += 12;

  // Note box
  if (y < pageHeight - 40) {
    doc.setDrawColor(153, 27, 27);
    doc.setFillColor(254, 242, 242); // light red
    doc.rect(margin, y, contentWidth, 18, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(153, 27, 27);
    doc.text("ADMINISTRATIVE NOTICE & ACADEMIC ACTION:", margin + 4, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(127, 29, 29);
    doc.text("This PDF functions as an official local record of the corresponding course lecture notice", margin + 4, y + 11);
    doc.text("or summary guidelines. For clarifications, please query using the Sovra AI research copilot.", margin + 4, y + 15);
  }

  // Footer
  doc.setDrawColor(229, 226, 222);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("Sovra Academic Network • Institutional Academic Administration Office", margin, pageHeight - 10);

  const sanitizedSubject = notification.title.substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  doc.save(`SOVRA_BROADCAST_${sanitizedSubject}.pdf`);
}
