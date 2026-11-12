/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyResource, Assignment, ForumPost, AttendanceSession, AppNotification, ScheduleEvent } from "./types";

export const INITIAL_RESOURCES: StudyResource[] = [
  {
    id: "res-1",
    title: "Pharmacokinetics & Pharmacodynamics Summary",
    description: "Comprehensive summary sheet detailing drug absorption, distribution, metabolism, elimination (ADME), and receptor-binding dynamics.",
    category: "Notes",
    courseCode: "PHA 211",
    courseName: "Pharmacology I",
    academicYear: "Year 2",
    fileType: "pdf",
    fileSize: "2.4 MB",
    downloadUrl: "https://example.com/notes/pharmacokinetics.pdf",
    uploadedBy: "Jean de Dieu (Class Rep)",
    uploadedById: "student-rep",
    uploadedAt: "2026-06-15T10:30:00Z",
    downloadsCount: 45,
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Pharmacology I"
  },
  {
    id: "res-2",
    title: "Medicinal Chemistry - Synthesis of Aspirin & Paracetamol",
    description: "Laboratory synthesis procedures, reaction mechanisms, and recrystallization purification protocols for NSAIDs.",
    category: "Lab Report",
    courseCode: "PHA 312",
    courseName: "Medicinal Chemistry II",
    academicYear: "Year 3",
    fileType: "pdf",
    fileSize: "1.8 MB",
    downloadUrl: "https://example.com/notes/aspirin-synthesis.pdf",
    uploadedBy: "Dr. Marie Claire",
    uploadedById: "lecturer-1",
    uploadedAt: "2026-06-18T14:15:00Z",
    downloadsCount: 32,
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Medicinal Chemistry II"
  },
  {
    id: "res-3",
    title: "Biopharmaceutics Past Exam Paper - 2025",
    description: "INES-Ruhengeri official end-of-semester exam paper for Biopharmaceutics. Highly recommended for practice.",
    category: "Past Paper",
    courseCode: "PHA 321",
    courseName: "Biopharmaceutics",
    academicYear: "Year 3",
    fileType: "docx",
    fileSize: "410 KB",
    downloadUrl: "https://example.com/notes/past-paper-2025.docx",
    uploadedBy: "Jean de Dieu (Class Rep)",
    uploadedById: "student-rep",
    uploadedAt: "2026-06-20T09:00:00Z",
    downloadsCount: 58,
    targetLecturer: "Prof. Nkurunziza",
    targetModule: "Biopharmaceutics"
  },
  {
    id: "res-4",
    title: "Introduction to Dosage Forms & Compounding",
    description: "Vite-ready presentation slides detailing tablets, capsules, syrups, suspensions, and basic pharmaceutical calculations.",
    category: "Notes",
    courseCode: "PHA 111",
    courseName: "Pharmaceutics I",
    academicYear: "Year 1",
    fileType: "pptx",
    fileSize: "5.6 MB",
    downloadUrl: "https://example.com/notes/dosage-forms.pptx",
    uploadedBy: "Prof. Nkurunziza",
    uploadedById: "lecturer-2",
    uploadedAt: "2026-06-10T11:00:00Z",
    downloadsCount: 88,
    targetLecturer: "Prof. Nkurunziza",
    targetModule: "Pharmaceutics I"
  },
  {
    id: "res-5",
    title: "Pharmacognosy - Extraction of Alkaloids from Plants",
    description: "Step-by-step extraction guide from Cinchona bark and tea leaves, thin-layer chromatography (TLC) identification tests.",
    category: "Notes",
    courseCode: "PHA 222",
    courseName: "Pharmacognosy I",
    academicYear: "Year 2",
    fileType: "pdf",
    fileSize: "3.1 MB",
    downloadUrl: "https://example.com/notes/pharmacognosy-alkaloids.pdf",
    uploadedBy: "Dr. Marie Claire",
    uploadedById: "lecturer-1",
    uploadedAt: "2026-06-22T16:45:00Z",
    downloadsCount: 29,
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Pharmacognosy I"
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    title: "Clinical Drug Case Study Analysis",
    description: "Analyze the provided patient case file (polypharmacy interaction, contraindications in renal failure). Recommend an optimized therapeutic regimen with alternatives.",
    courseCode: "PHA 411",
    courseName: "Clinical Pharmacy",
    dueDate: "2026-07-05T23:59:59Z",
    points: 100,
    uploadedBy: "Dr. Marie Claire",
    academicYear: "Year 4",
    submissions: {}
  },
  {
    id: "assign-2",
    title: "Compounding Calculations & Formulations Lab Report",
    description: "Submit your formulation calculations for preparing 200ml of a 10% Pediatric Paracetamol Suspension, including active ingredient density correction.",
    courseCode: "PHA 212",
    courseName: "Pharmaceutics II",
    dueDate: "2026-07-02T23:59:59Z",
    points: 50,
    uploadedBy: "Prof. Nkurunziza",
    academicYear: "Year 2",
    submissions: {
      "std-1102": {
        fileName: "Paracetamol_Suspension_Formulation.pdf",
        fileUrl: "#",
        submittedAt: "2026-06-25T11:20:00Z",
        grade: "A (47/50)",
        feedback: "Excellent calculation accuracy and step explanation. Make sure to double-check storage temperature recommendations next time."
      }
    }
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "Understanding Cytochrome P450 Drug Interactions",
    content: "Hi everyone! I'm struggling with remembering which drugs act as CYP3A4 inhibitors vs. inducers. Can someone share an easy mnemonic or summary sheet to distinguish them? It's highly likely to appear in the end of module exams.",
    category: "Pharmacology",
    authorName: "Aliane Umutoni",
    authorRole: "Student",
    authorId: "std-9981",
    createdAt: "2026-06-24T08:30:00Z",
    upvotes: 14,
    replies: [
      {
        id: "rep-1",
        content: "Hey Aliane! An easy mnemonic for CYP inhibitors is G-PACMAN (Grapefruit juice, Protease inhibitors, Azole antifungals, Cimetidine, Macrolides, Amiodarone, Non-DHP CCBs). For inducers, use Bullshit Crap GPS (Barbiturates, Carbamazepine, Griseofulvin, Phenytoin, Sulfonylureas, St. John's Wort). Hope this helps!",
        authorName: "Jean de Dieu (Class Rep)",
        authorRole: "Class Representative",
        authorId: "student-rep",
        createdAt: "2026-06-24T09:12:00Z"
      },
      {
        id: "rep-2",
        content: "Excellent mnemonics, Jean de Dieu! Students, remember that Grapefruit juice is a irreversible mechanism-based inhibitor, which affects presystemic extraction in the gut wall.",
        authorName: "Dr. Marie Claire",
        authorRole: "Lecturer",
        authorId: "lecturer-1",
        createdAt: "2026-06-24T12:05:00Z"
      }
    ],
    isPinned: true
  },
  {
    id: "post-2",
    title: "HLB Values for Surfactants in Emulsions",
    content: "When formulating an O/W emulsion vs. W/O emulsion, how do we choose the optimal HLB (Hydrophilic-Lipophilic Balance) values of surfactants? Let's discuss.",
    category: "Pharmaceutics",
    authorName: "Pascal Gasana",
    authorRole: "Student",
    authorId: "std-1102",
    createdAt: "2026-06-25T15:00:00Z",
    upvotes: 8,
    replies: [
      {
        id: "rep-3",
        content: "Generally, HLB values of 3 to 6 favor W/O emulsions (more lipophilic), while HLB values of 8 to 16 favor O/W emulsions (more hydrophilic). If you are preparing an ointment, you use lower HLB surfactants.",
        authorName: "Aliane Umutoni",
        authorRole: "Student",
        authorId: "std-9981",
        createdAt: "2026-06-25T16:30:00Z"
      }
    ]
  },
  {
    id: "post-3",
    title: "Structure-Activity Relationship (SAR) of Penicillins",
    content: "Why is the beta-lactam ring essential for penicillin activity, and what is the function of the acyl side chain in modifying its antibacterial spectrum?",
    category: "Medicinal Chemistry",
    authorName: "Dr. Marie Claire",
    authorRole: "Lecturer",
    authorId: "lecturer-1",
    createdAt: "2026-06-23T11:20:00Z",
    upvotes: 18,
    replies: [
      {
        id: "rep-4",
        content: "The beta-lactam ring is a structural analog of D-Ala-D-Ala. It binds covalently to Transpeptidase (PBP) and prevents cell wall synthesis. The acyl side chain changes acid stability (making it oral) or makes it resistant to beta-lactamases (like Cloxacillin).",
        authorName: "Jean de Dieu (Class Rep)",
        authorRole: "Class Representative",
        authorId: "student-rep",
        createdAt: "2026-06-23T13:40:00Z"
      }
    ],
    isPinned: false
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: "att-1",
    courseCode: "PHA 211",
    courseName: "Pharmacology I",
    date: "2026-06-26",
    timeSlot: "08:00 - 10:00",
    passcode: "PHARM26",
    isActive: true,
    academicYear: "Year 2",
    checkedInStudents: {
      "std-1102": {
        studentName: "Pascal Gasana",
        checkedInAt: "2026-06-26T08:05:22Z",
        locationMethod: "Simulated Geofence"
      },
      "std-9981": {
        studentName: "Aliane Umutoni",
        checkedInAt: "2026-06-26T08:12:44Z",
        locationMethod: "On-Campus Wi-Fi"
      }
    }
  },
  {
    id: "att-2",
    courseCode: "PHA 312",
    courseName: "Medicinal Chemistry II",
    date: "2026-06-25",
    timeSlot: "10:30 - 12:30",
    passcode: "MEDCHEM5",
    isActive: false,
    academicYear: "Year 3",
    checkedInStudents: {
      "std-1102": {
        studentName: "Pascal Gasana",
        checkedInAt: "2026-06-25T10:40:11Z",
        locationMethod: "Simulated Geofence"
      },
      "student-rep": {
        studentName: "Jean de Dieu",
        checkedInAt: "2026-06-25T10:33:05Z",
        locationMethod: "Simulated Geofence"
      }
    }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "New Study Guide Uploaded",
    message: "Dr. Marie Claire uploaded 'Pharmacognosy - Extraction of Alkaloids' to the Resources tab.",
    type: "announcement",
    isRead: false,
    createdAt: "2026-06-26T14:45:00Z",
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Pharmacognosy I"
  },
  {
    id: "notif-2",
    title: "Pharmacology I Lecture Check-In Open",
    message: "The automated attendance portal is open for today's lecture. Code: PHARM26.",
    type: "attendance",
    isRead: false,
    createdAt: "2026-06-26T08:00:00Z",
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Pharmacology I"
  },
  {
    id: "notif-3",
    title: "New Assignment: Clinical Drug Case Study",
    message: "Due on July 5. Points: 100. Submit via the Assignments section.",
    type: "assignment",
    isRead: true,
    createdAt: "2026-06-25T11:00:00Z",
    targetLecturer: "Dr. Marie Claire",
    targetModule: "Clinical Pharmacy"
  }
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "sch-1",
    courseCode: "PHA 211",
    courseName: "Pharmacology I",
    lecturerName: "Dr. Marie Claire",
    dayOfWeek: "Monday",
    time: "08:00 - 10:00",
    room: "Auditorium 2"
  },
  {
    id: "sch-2",
    courseCode: "PHA 212",
    courseName: "Pharmaceutics II",
    lecturerName: "Prof. Nkurunziza",
    dayOfWeek: "Tuesday",
    time: "10:30 - 12:30",
    room: "Pharmaceutics Lab"
  },
  {
    id: "sch-3",
    courseCode: "PHA 312",
    courseName: "Medicinal Chemistry II",
    lecturerName: "Dr. Marie Claire",
    dayOfWeek: "Wednesday",
    time: "14:00 - 16:00",
    room: "Analytical Lab"
  },
  {
    id: "sch-4",
    courseCode: "PHA 321",
    courseName: "Biopharmaceutics",
    lecturerName: "Prof. Nkurunziza",
    dayOfWeek: "Thursday",
    time: "08:00 - 10:00",
    room: "Room 104"
  },
  {
    id: "sch-5",
    courseCode: "PHA 411",
    courseName: "Clinical Pharmacy",
    lecturerName: "Dr. Marie Claire",
    dayOfWeek: "Friday",
    time: "10:30 - 12:30",
    room: "Auditorium 2"
  }
];
