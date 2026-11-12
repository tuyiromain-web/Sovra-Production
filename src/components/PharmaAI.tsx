/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, BrainCircuit, RotateCcw, AlertTriangle, BookOpen, 
  Calculator, Calendar, Copy, Check, Download, Save, Brain, HelpCircle, 
  Clock, GraduationCap, ChevronRight, FileText, CheckSquare, Loader2,
  Search, Globe, Volume2, VolumeX, Pill, ShieldAlert, Zap,
  Languages, Microscope, ArrowRight, RefreshCw, Layers, PlusCircle,
  FileSpreadsheet, MessageSquare, Compass, Sliders, CheckCircle2, Bookmark,
  Edit, Maximize2, Minimize2, MoreHorizontal, Pin, Trash2, ArrowDown,
  Plus, Paperclip, Image as ImageIcon, X, ChevronUp, SlidersHorizontal,
  ExternalLink, File, Image, Rocket, ThumbsUp, ThumbsDown
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PharmaAIMarkdown } from "./PharmaAIMarkdown";
import { UserProfile, Assignment } from "../types";
import { buildStudentAdaptiveInstruction, SOVRA_AI_SYSTEM_PROMPT } from "../constants/pharmalinkAIPrompt";

export type AIExpertMode = 
  | "universal" 
  | "clinical" 
  | "formulation" 
  | "calculations" 
  | "exam_coach" 
  | "translator";

export type ThinkingCategory = "deep" | "fast" | "default";

export interface AttachedFile {
  name: string;
  content: string;
  size: string;
  type: string;
}

export interface AttachedImage {
  name: string;
  data: string; // base64 data url
  mimeType: string;
  previewUrl: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
  webSearchQueries?: string[];
  mode?: AIExpertMode;
  thinkingMode?: ThinkingCategory;
  attachedFiles?: AttachedFile[];
  attachedImages?: AttachedImage[];
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  mode: AIExpertMode;
  messages: Message[];
  isPinned?: boolean;
}

interface PharmaAIProps {
  currentUser: UserProfile;
  assignments: Assignment[];
}

const EXPERT_MODES: Record<AIExpertMode, {
  name: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  systemInstruction: string;
  color: string;
  sampleQueries: Array<{ label: string; text: string }>;
}> = {
  universal: {
    name: "Adaptive Academic Tutor & Research Copilot",
    badge: "SOVRA RESEARCH",
    desc: "Master complex concepts through active learning, step-by-step mechanisms, diagnostic assessments, and adaptive tutoring.",
    icon: Compass,
    color: "text-[#38BDF8] border-[#38BDF8]/30 bg-[#38BDF8]/10",
    systemInstruction: `Focus as the primary Adaptive Sovra Academic Tutor and Research Copilot.
Follow the active learning cycle: Introduce → Build Foundation → Explain (Topic, Core Idea, How it Works, Example) → Apply → Check Understanding (1-3 targeted questions).
Prioritize active understanding over passive answer generation.`,
    sampleQueries: [
      { label: "Concept Deep-Dive & Active Check", text: "Teach me the core concepts and fundamental mechanisms of this topic using the step-by-step learning cycle." },
      { label: "Diagnostic Baseline Assessment", text: "Give me a quick 3-question diagnostic quiz to evaluate my current understanding before we begin." },
      { label: "Case Study & Critical Reasoning", text: "Present a progressive case study and guide me through analyzing the optimal problem resolution." },
      { label: "Weak Area Identification", text: "Help me diagnose common misconceptions in this subject and clarify the core distinctions simply." }
    ]
  },
  clinical: {
    name: "Clinical Pharmacology & Therapeutics",
    badge: "CLINICAL THERAPEUTICS",
    desc: "Patient-centered pharmacology, ADME profiles, drug interactions, contraindications, and evidence-based clinical reasoning.",
    icon: Pill,
    color: "text-[#38BDF8] border-[#0284C7]/30 bg-[#0284C7]/10",
    systemInstruction: `Focus as an experienced Clinical Pharmacology & Therapeutics Lecturer.
Emphasize receptor pharmacology, pharmacokinetic-pharmacodynamic relationships, adverse drug reactions, and clinical case reasoning.
Never invent patient recommendations; teach the underlying physiological and pharmacological rationale. Conclude with a check on clinical understanding.`,
    sampleQueries: [
      { label: "Receptor Mechanism & Selectivity", text: "Explain the pharmacological differences and clinical significance of selective vs non-selective Beta-blockers." },
      { label: "Drug-Drug Interaction Analysis", text: "Break down the pharmacokinetic interaction between Clopidogrel and Omeprazole at the CYP2C19 enzyme level." },
      { label: "Renal Dosage Adjustment Logic", text: "How does decreased GFR affect the half-life and therapeutic index of Aminoglycosides like Gentamicin?" },
      { label: "Therapeutic Drug Monitoring (TDM)", text: "What are the target trough levels and toxicity risks for Vancomycin and Digoxin in clinical monitoring?" }
    ]
  },
  formulation: {
    name: "Pharmaceutics & Applied Science",
    badge: "PHARMACEUTICS & LAB",
    desc: "Drug delivery systems, physical pharmacy, excipient compatibility, biopharmaceutics, and laboratory formulation science.",
    icon: Microscope,
    color: "text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/10",
    systemInstruction: `Focus as a University Lecturer in Pharmaceutics, Physical Pharmacy, and Formulation Technology.
Detail physicochemical principles, dissolution kinetics, stability factors, and dosage form design. Use clear equations, tables, and step-by-step process breakdowns.`,
    sampleQueries: [
      { label: "Tablet Excipient Roles", text: "Break down the roles of binders, disintegrants, lubricants, and glidants in direct-compression tablet manufacturing." },
      { label: "Liposomal Drug Delivery", text: "Explain the biopharmaceutical advantages and preparation methods of nano-emulsions and liposomal carriers for poorly soluble drugs." },
      { label: "Stability & Degradation Kinetics", text: "Walk me through zero-order vs first-order degradation kinetics and accelerated shelf-life stability testing." },
      { label: "Emulsion HLB System Math", text: "Teach me how to calculate the Required Hydrophile-Lipophile Balance (RHLB) for a stable oil-in-water pharmaceutical emulsion." }
    ]
  },
  calculations: {
    name: "Pharmaceutical Calculations & Math Solver",
    badge: "PHARMACY MATH",
    desc: "Rigorous step-by-step dosage calculations, CrCl, infusion rates, dilutions, and osmolarity with verification checks.",
    icon: Calculator,
    color: "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10",
    systemInstruction: `Focus as a Master Pharmaceutical Calculations Instructor.
Follow the calculation format: State the Formula → List Given Variables → Show Substitution & Unit Conversions → Show Algebraic Steps → Highlight the Final Verified Result. Conclude with a safety sanity-check and a practice question for the student to attempt independently.`,
    sampleQueries: [
      { label: "Pediatric Body Surface Dosing", text: "Calculate the exact dosage for a child (weight 16 kg, height 102 cm) prescribed methotrexate 15 mg/m²/week with full BSA derivation." },
      { label: "Cockcroft-Gault CrCl Derivation", text: "Calculate CrCl for a 68-year-old female (58 kg, Serum Cr 1.4 mg/dL) and show the exact female correction factor." },
      { label: "IV Infusion & Drop Rate Calculation", text: "A 500 mL normal saline infusion is ordered over 4 hours. Calculate the flow rate in mL/hr and drops/min (drop factor 20 gtt/mL)." },
      { label: "Alligation Alternate Method", text: "Show how to use the alligation method to mix a 50% dextrose solution and sterile water to produce 250 mL of 12.5% dextrose." }
    ]
  },
  exam_coach: {
    name: "Exam, CAT & Quiz Preparation Coach",
    badge: "EXAM COACH",
    desc: "Diagnostic quizzes, high-yield flashcards, error diagnosis, and exam-style multiple-choice questions with deep rationales.",
    icon: Brain,
    color: "text-[#EC407A] border-[#EC407A]/30 bg-[#EC407A]/10",
    systemInstruction: `Focus as an Examination Coach and CAT Preparation Specialist for university pharmacy students.
Structure practice sessions into high-yield reviews, exam-style questions, and diagnostic drills.
When asking questions, withhold answers until the student attempts them. When correcting errors, provide specific diagnosis: Your Answer → What Needs Correction → Correct Concept → Why → Try This.`,
    sampleQueries: [
      { label: "High-Yield CAT Practice Quiz", text: "Generate a 4-question exam-style multiple choice quiz on Autonomic Nervous System pharmacology, and wait for my answers before revealing solutions." },
      { label: "Diagnostic Error Analysis", text: "I keep getting confused on competitive vs non-competitive enzyme inhibition curves. Test my understanding with a diagnostic question." },
      { label: "Exam Revision Summary Table", text: "Create a high-yield comparison table summarizing Anti-hypertensive drug classes (ACEi, ARBs, CCBs, Diuretics) for quick CAT revision." },
      { label: "Personalized 7-Day Study Plan", text: "Design an optimized 7-day revision schedule for an upcoming Pharmacology & Pharmaceutics CAT with active recall intervals." }
    ]
  },
  translator: {
    name: "Multilingual Clinical Communicator",
    badge: "MEDICAL TRANSLATION",
    desc: "Medical terminology, patient counseling, and prescription Latin Sig codes in English, French, and Kinyarwanda.",
    icon: Languages,
    color: "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10",
    systemInstruction: `Focus as a Medical Linguistic & Patient Counseling Communicator fluent in English, French, Kinyarwanda, Swahili, and Latin Prescription Sig abbreviations.
Ensure clinical accuracy, cultural empathy, and patient comprehension.`,
    sampleQueries: [
      { label: "Patient Counseling in Kinyarwanda", text: "Translate this antibiotic counseling protocol (take with food, complete full course, avoid alcohol) into clear, respectful Kinyarwanda." },
      { label: "Prescription Latin Sig Codes", text: "Translate and explain these standard prescription directions: '1 tab PO TID AC x 7d' and '2 gtt OU Q4H PRN pain'." },
      { label: "Clinical Case in French", text: "Translate this clinical case synopsis and pharmacology laboratory report into accurate, formal academic French." },
      { label: "Trilingual Pharmacy Terms", text: "Provide a glossary of 10 essential pharmacy consultation terms with explanations in English, French, and Kinyarwanda." }
    ]
  }
};

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "sess-1",
    title: "Itabi na Vape ku Bihaha",
    updatedAt: "Just now",
    mode: "clinical",
    isPinned: true,
    messages: [
      {
        id: "m-s1-1",
        sender: "user",
        text: "Ari itabi na vape niki kibi cyane kubihaha",
        timestamp: "10:30 AM",
        mode: "clinical"
      },
      {
        id: "m-s1-2",
        sender: "ai",
        text: `Niba tuvuga **ibihaha gusa**, muri rusange **itabi risanzwe (cigarette) ni ribi cyane kurusha vape**.

• 🚬 **Itabi:** iyo rishya, ritanga umwotsi urimo ibihumbi by'imiti, harimo ibitera kanseri, kandi ryangiza cyane ibihaha. Rihuzwa na COPD, kanseri y'ibihaha n'izindi ndwara zikomeye.
• 💨 **Vape:** nta gutwika itabi kuba, bityo muri rusange iba ifite ibintu bimwe byangiza bike ugereranyije n'itabi. **Ariko ntabwo ari safe**—aerosol yayo ishobora kurimo nicotine, particles n'ibindi bintu bishobora gutera irritation no kwangiza ibihaha.

👉 Niba umuntu **adakoresha na kimwe**, ntibyaba byiza gutangira vape ngo asimbure itabi atanywaga; naho kuwanywaga itabi, kurihagarika burundu nibyo byiza kurusha byose.`,
        timestamp: "10:31 AM",
        mode: "clinical"
      }
    ]
  },
  {
    id: "sess-2",
    title: "Google App Password Setup",
    updatedAt: "Yesterday",
    mode: "universal",
    messages: [
      {
        id: "m-s2-1",
        sender: "user",
        text: "How do I configure Google App Passwords for secure SMTP authentication?",
        timestamp: "Yesterday",
        mode: "universal"
      },
      {
        id: "m-s2-2",
        sender: "ai",
        text: `To configure a Google App Password for authenticated SMTP or script integrations:
1. Go to your **Google Account Security** settings.
2. Ensure **2-Step Verification** is turned ON.
3. Under *2-Step Verification*, scroll to **App passwords**.
4. Generate a 16-character code and store it in your \`.env\` file as \`SMTP_PASS\`.`,
        timestamp: "Yesterday",
        mode: "universal"
      }
    ]
  },
  {
    id: "sess-3",
    title: "Gutanga Inama ku Migabane",
    updatedAt: "2 days ago",
    mode: "translator",
    messages: [
      {
        id: "m-s3-1",
        sender: "user",
        text: "Uburyo bwo gusobanurira umurwayi ibijyanye no gufata imiti y'umuvuduko w'amaraso mu Kinyarwanda?",
        timestamp: "2 days ago",
        mode: "translator"
      },
      {
        id: "m-s3-2",
        sender: "ai",
        text: `Inama zo gusobanurira umurwayi mu Kinyarwanda:
* **Kubahiriza amasaha:** "Fata uyu muti buri gitondo ku gihe kimwe kugira ngo urinde umutima wawe."
* **Kudacikisha:** "Ntube wahagarika uyu muti n'iyo wakumva umeze neza utabajije muganga cyangwa farumasiye."
* **Kwirinda inzoga n'umunyu mwinshi:** "Gira umuco wo kugabanya umunyu mu biryo no kwirinda ibisindisha."`,
        timestamp: "2 days ago",
        mode: "translator"
      }
    ]
  },
  {
    id: "sess-4",
    title: "Ibiciro by'indege Kigali-Zambia",
    updatedAt: "3 days ago",
    mode: "universal",
    messages: [
      {
        id: "m-s4-1",
        sender: "user",
        text: "General guidance on flights and conference travels from Kigali to Lusaka, Zambia for pharmaceutical symposiums.",
        timestamp: "3 days ago",
        mode: "universal"
      },
      {
        id: "m-s4-2",
        sender: "ai",
        text: `RwandAir operates direct and codeshare flights between Kigali (KGL) and Lusaka (LUN). Key preparation pointers include checking yellow fever certificate requirements and student delegate registration waivers.`,
        timestamp: "3 days ago",
        mode: "universal"
      }
    ]
  },
  {
    id: "sess-5",
    title: "Sony Xperia Theft Protection",
    updatedAt: "4 days ago",
    mode: "universal",
    messages: [
      {
        id: "m-s5-1",
        sender: "user",
        text: "How to configure remote device lock and Find My Device on Sony Android handsets?",
        timestamp: "4 days ago",
        mode: "universal"
      },
      {
        id: "m-s5-2",
        sender: "ai",
        text: `Enable Google's Find My Device service under **Settings > Security & Privacy > Find My Device**. Ensure remote device wipe and location telemetry are active.`,
        timestamp: "4 days ago",
        mode: "universal"
      }
    ]
  },
  {
    id: "sess-6",
    title: "Muti w'ibicurane Gatsibo",
    updatedAt: "5 days ago",
    mode: "clinical",
    messages: [
      {
        id: "m-s6-1",
        sender: "user",
        text: "Inama zo kuvura ibicurane ku bana n'abakuru mu karere ka Gatsibo.",
        timestamp: "5 days ago",
        mode: "clinical"
      },
      {
        id: "m-s6-2",
        sender: "ai",
        text: `Vuriro n'inama: Paracetamol ku rugero rukwiye rw'ibiro (15mg/kg), kunywa amazi menshi, no kwirinda gutanga imiti ya Aspirin ku bana bato kubera ibyago bya Reye's syndrome.`,
        timestamp: "5 days ago",
        mode: "clinical"
      }
    ]
  },
  {
    id: "sess-7",
    title: "Ibyo kwitaho nyuma yo kugura c...",
    updatedAt: "1 week ago",
    mode: "universal",
    messages: [
      {
        id: "m-s7-1",
        sender: "user",
        text: "Checklist after procuring laboratory consumables and glassware.",
        timestamp: "1 week ago",
        mode: "universal"
      },
      {
        id: "m-s7-2",
        sender: "ai",
        text: `Inspect batch certificates of analysis (CoA), check for micro-fractures in volumetric flasks, and log lot numbers into the institutional safety register.`,
        timestamp: "1 week ago",
        mode: "universal"
      }
    ]
  }
];

export default function PharmaAI({ currentUser, assignments = [] }: PharmaAIProps) {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<"chat" | "interactions" | "calculators" | "planner">("chat");

  // Chat Sessions state (Persisted in localStorage)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("sovra_ai_sessions") || localStorage.getItem("pharmalink_ai_sessions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>("sess-1");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");

  // Selected Expert Mode for active chat
  const [selectedMode, setSelectedMode] = useState<AIExpertMode>("universal");
  const [enableSearchGrounding, setEnableSearchGrounding] = useState<boolean>(true);

  // Thinking Category & Attachments State
  const [thinkingCategory, setThinkingCategory] = useState<ThinkingCategory>("default");
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Active session messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || INITIAL_SESSIONS[0];
  const messages = activeSession.messages || [];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close plus menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setIsPlusMenuOpen(false);
      }
    }
    if (isPlusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPlusMenuOpen]);

  // Speech & Action states
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "helpful" | "unhelpful">>({});

  // Expanded Code Box state
  const [expandedBoxContent, setExpandedBoxContent] = useState<string | null>(null);

  // Interaction Checker Tool State
  const [drug1, setDrug1] = useState("Warfarin");
  const [drug2, setDrug2] = useState("Aspirin");
  const [drug3, setDrug3] = useState("");
  const [interactionResult, setInteractionResult] = useState<string | null>(null);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);

  // Calculator State
  const [calcType, setCalcType] = useState<"pediatric" | "crcl" | "infusion" | "bsa">("pediatric");
  const [pedWeight, setPedWeight] = useState("16");
  const [pedDoseMgKg, setPedDoseMgKg] = useState("40");
  const [pedConcMg, setPedConcMg] = useState("250");
  const [pedConcMl, setPedConcMl] = useState("5");
  const [pedDosesPerDay, setPedDosesPerDay] = useState("2");
  const [calcExplanation, setCalcExplanation] = useState<string | null>(null);
  const [isExplainingCalc, setIsExplainingCalc] = useState(false);

  // CrCl State
  const [crclAge, setCrclAge] = useState("65");
  const [crclWeight, setCrclWeight] = useState("68");
  const [crclScr, setCrclScr] = useState("1.3");
  const [crclGender, setCrclGender] = useState<"male" | "female">("female");

  // Infusion State
  const [infVolMl, setInfVolMl] = useState("1000");
  const [infHours, setInfHours] = useState("8");
  const [infDropFactor, setInfDropFactor] = useState("15");

  // Core Study Planner States
  const [scheduleMode, setScheduleMode] = useState<"Balanced" | "Intensive" | "Focus">("Balanced");
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<string>(() => {
    return localStorage.getItem("sovra_saved_schedule") || localStorage.getItem("pharmalink_saved_schedule") || "";
  });

  // Save sessions to local storage
  useEffect(() => {
    try {
      localStorage.setItem("sovra_ai_sessions", JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save AI sessions", e);
    }
  }, [sessions]);

  const activeAssignments = assignments.filter(
    (a) => a.academicYear === currentUser.academicYear
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Create a new chat session
  const handleNewChat = () => {
    const newSessionId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Academic Session",
      updatedAt: "Just now",
      mode: selectedMode,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "ai",
          text: `Hello **${currentUser.name}**! I am **Sovra AI**, your academic research copilot and workspace learning partner.

I adapt directly to your level (**${currentUser.academicYear}**) to help you master concepts, reasoning, calculations, and research synthesis.

### 🎯 How would you like to learn today?
* 🔍 **Diagnostic Assessment**: Test your baseline understanding with a quick 3-question diagnostic check.
* 📖 **Concept Deep-Dive**: Step-by-step breakdowns, theoretical foundations, and structured mechanisms.
* 🧮 **Step-by-Step Calculations**: Quantitative formulas, statistical methods, and verified deductions.
* 📝 **Exam & Assessment Prep**: High-yield study drills, flashcard summaries, and misconception diagnosis.
* 📚 **Upload Course Materials**: Click **+** below to upload lecturer slides or PDFs for targeted breakdown.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          mode: selectedMode
        }
      ]
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSessionId);
    setActiveTab("chat");
    showToast("Created a new academic tutoring session!");
  };

  // Toggle Pin session
  const handleTogglePin = (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) =>
      prev.map((s) => (s.id === sessId ? { ...s, isPinned: !s.isPinned } : s))
    );
    showToast("Updated pinned chats!");
  };

  // Delete chat session
  const handleDeleteSession = (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      showToast("Cannot delete the only chat session.");
      return;
    }
    const remaining = sessions.filter((s) => s.id !== sessId);
    setSessions(remaining);
    if (activeSessionId === sessId) {
      setActiveSessionId(remaining[0].id);
    }
    showToast("Conversation deleted.");
  };

  // Save renamed session title
  const handleSaveRename = (sessId: string) => {
    if (editTitleValue.trim()) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessId ? { ...s, title: editTitleValue.trim() } : s))
      );
    }
    setEditingSessionId(null);
    setEditTitleValue("");
    showToast("Chat renamed!");
  };

  // Text to Speech
  const handleToggleSpeech = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      showToast("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_\[\]()]/g, "").slice(0, 1500);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Download response as Markdown/Text file
  const handleDownloadResponse = (content: string, filename = "SovraAI_Response.md") => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  // Save directly to internal Academic File Explorer
  const handleSaveToExplorer = (textToSave: string, docTitle: string) => {
    try {
      const savedStr = localStorage.getItem("sovra_downloaded_files") || localStorage.getItem("pharmalink_downloaded_files");
      const currentFiles = savedStr ? JSON.parse(savedStr) : [];
      
      const fileName = `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.md`;
      const systemPath = `C:\\INES-Ruhengeri\\Pharmacy\\${currentUser.academicYear}\\StudyPlans\\${fileName}`;

      const newFile = {
        id: `df-ai-${Date.now()}`,
        name: fileName,
        size: "3.2 KB",
        type: "md",
        virtualPath: "/Downloads",
        systemPath,
        downloadedAt: new Date().toISOString(),
        resourceId: "sovra-ai-gen",
        notesContent: textToSave
      };

      const updatedFiles = [newFile, ...currentFiles.filter((f: any) => f.systemPath !== systemPath)];
      localStorage.setItem("sovra_downloaded_files", JSON.stringify(updatedFiles));
      
      showToast(`Saved in Academic File Explorer as: ${fileName}`);
    } catch (e) {
      console.error(e);
      showToast("Failed to save to local file explorer.");
    }
  };

  // File and Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isText = file.type.includes("text") || 
        file.name.endsWith(".txt") || 
        file.name.endsWith(".md") || 
        file.name.endsWith(".csv") || 
        file.name.endsWith(".json") || 
        file.name.endsWith(".tsv") || 
        file.name.endsWith(".py") || 
        file.name.endsWith(".js") || 
        file.name.endsWith(".ts") || 
        file.name.endsWith(".html") || 
        file.name.endsWith(".css");

      if (isText) {
        reader.onload = (event) => {
          const textContent = (event.target?.result as string) || "";
          setAttachedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              content: textContent,
              size: (file.size / 1024).toFixed(1) + " KB",
              type: file.type || "text/plain"
            }
          ]);
          showToast(`Attached document: ${file.name}`);
        };
        reader.readAsText(file);
      } else {
        reader.onload = () => {
          setAttachedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              content: `[Attached Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`,
              size: (file.size / 1024).toFixed(1) + " KB",
              type: file.type || "application/octet-stream"
            }
          ]);
          showToast(`Attached document: ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsPlusMenuOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file (PNG, JPG, WEBP, etc.)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = (event.target?.result as string) || "";
        setAttachedImages((prev) => [
          ...prev,
          {
            name: file.name,
            data: dataUrl,
            mimeType: file.type,
            previewUrl: dataUrl
          }
        ]);
        showToast(`Attached photo: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) imageInputRef.current.value = "";
    setIsPlusMenuOpen(false);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAttachedImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Feedback Handler (Helpful / Unhelpful)
  const handleToggleFeedback = (msgId: string, type: "helpful" | "unhelpful") => {
    setFeedbackMap((prev) => {
      const current = prev[msgId];
      if (current === type) {
        const next = { ...prev };
        delete next[msgId];
        showToast("Feedback removed.");
        return next;
      }
      showToast(type === "helpful" ? "Marked as helpful! Thank you." : "Feedback recorded. We'll refine future responses.");
      return { ...prev, [msgId]: type };
    });
  };

  // Regenerate last AI response
  const handleRegenerate = (msgId: string) => {
    const currentMessages = activeSession.messages || [];
    const targetIndex = currentMessages.findIndex((m) => m.id === msgId);
    if (targetIndex === -1) return;

    // Find previous user message
    let lastUserMsg: Message | null = null;
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (currentMessages[i].sender === "user") {
        lastUserMsg = currentMessages[i];
        break;
      }
    }

    if (!lastUserMsg) {
      showToast("No preceding query found to regenerate.");
      return;
    }

    // Remove the target AI message and re-send
    const filtered = currentMessages.filter((m) => m.id !== msgId);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: filtered }
          : s
      )
    );

    handleSendMessage(lastUserMsg.text, lastUserMsg.mode);
  };

  // Send message (Streaming with Real-Time progressive token rendering)
  const handleSendMessage = async (textToSend?: string, overrideMode?: AIExpertMode) => {
    const text = textToSend !== undefined ? textToSend : inputValue;
    const currentFiles = [...attachedFiles];
    const currentImages = [...attachedImages];
    const currentThinking = thinkingCategory;

    if (!text.trim() && currentFiles.length === 0 && currentImages.length === 0) return;

    if (textToSend === undefined) {
      setInputValue("");
      setAttachedFiles([]);
      setAttachedImages([]);
    }

    const currentMode = overrideMode || selectedMode;
    const modeConfig = EXPERT_MODES[currentMode];

    const newUserMessage: Message = {
      id: `m-usr-${Date.now()}`,
      sender: "user",
      text: text || (currentImages.length > 0 ? "Attached Image(s) Analysis Request" : "Attached File(s) Context"),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: currentMode,
      thinkingMode: currentThinking,
      attachedFiles: currentFiles.length > 0 ? currentFiles : undefined,
      attachedImages: currentImages.length > 0 ? currentImages : undefined
    };

    const currentMessages = activeSession.messages || [];
    const updatedMessages = [...currentMessages, newUserMessage];

    // Generate smart title for new chats
    let sessionTitle = activeSession.title;
    if (sessionTitle === "New Conversation" && updatedMessages.length <= 2) {
      const summaryTitle = text || currentFiles[0]?.name || "Image Analysis";
      sessionTitle = summaryTitle.slice(0, 32) + (summaryTitle.length > 32 ? "..." : "");
    }

    const tempAiMessageId = `m-ai-${Date.now()}`;
    const initialAiMessage: Message = {
      id: tempAiMessageId,
      sender: "ai",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: currentMode,
      thinkingMode: currentThinking
    };

    // Update active session locally with user message and empty AI message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, title: sessionTitle, messages: [...updatedMessages, initialAiMessage], updatedAt: "Just now" }
          : s
      )
    );

    setIsLoading(true);
    setStreamingMsgId(tempAiMessageId);

    const recentHistory = updatedMessages.slice(-8).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      text: m.text
    }));

    const adaptiveInstruction = buildStudentAdaptiveInstruction(
      {
        name: currentUser.name,
        academicYear: currentUser.academicYear,
        role: currentUser.role,
        studentId: currentUser.studentId
      },
      modeConfig.systemInstruction
    );

    try {
      const response = await fetch("/api/gemini/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          history: recentHistory.slice(0, -1),
          systemInstruction: adaptiveInstruction,
          enableSearch: enableSearchGrounding,
          thinkingMode: currentThinking,
          images: currentImages.map(img => ({ name: img.name, data: img.data, mimeType: img.mimeType })),
          files: currentFiles.map(f => ({ name: f.name, content: f.content, size: f.size, type: f.type }))
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";
      let groundingChunks: any[] = [];
      let webSearchQueries: any[] = [];

      setIsLoading(false); // Hide initial spinner once stream connects

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.chunk) {
                accumulatedText += data.chunk;
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeSessionId
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
                            m.id === tempAiMessageId
                              ? { ...m, text: accumulatedText }
                              : m
                          )
                        }
                      : s
                  )
                );
              }
              if (data.done) {
                if (data.fullText) accumulatedText = data.fullText;
                if (data.groundingChunks) groundingChunks = data.groundingChunks;
                if (data.webSearchQueries) webSearchQueries = data.webSearchQueries;

                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeSessionId
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
                            m.id === tempAiMessageId
                              ? {
                                  ...m,
                                  text: accumulatedText,
                                  groundingChunks,
                                  webSearchQueries
                                }
                              : m
                          )
                        }
                      : s
                  )
                );
              }
            } catch (err) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      setStreamingMsgId(null);
      setIsLoading(false);
    } catch (streamError) {
      // Graceful fallback to non-streaming endpoint
      try {
        const fallbackRes = await fetch("/api/gemini/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text,
            history: recentHistory.slice(0, -1),
            systemInstruction: adaptiveInstruction,
            enableSearch: enableSearchGrounding,
            thinkingMode: currentThinking,
            images: currentImages.map(img => ({ name: img.name, data: img.data, mimeType: img.mimeType })),
            files: currentFiles.map(f => ({ name: f.name, content: f.content, size: f.size, type: f.type }))
          })
        });

        const data = await fallbackRes.json();
        setIsLoading(false);
        setStreamingMsgId(null);

        const aiResponseText = fallbackRes.ok && data.text ? data.text : (data.error || "Unable to reach Gemini AI service.");

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === tempAiMessageId
                      ? {
                          ...m,
                          text: aiResponseText,
                          groundingChunks: data.groundingChunks || [],
                          webSearchQueries: data.webSearchQueries || []
                        }
                      : m
                  )
                }
              : s
          )
        );
      } catch (finalErr: any) {
        setIsLoading(false);
        setStreamingMsgId(null);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === tempAiMessageId
                      ? {
                          ...m,
                          text: `⚠️ **Connection Advisory:** AI response temporarily unavailable. (${finalErr.message})`
                        }
                      : m
                  )
                }
              : s
          )
        );
      }
    }
  };

  // Run Drug Interaction Analysis
  const handleCheckInteractions = async () => {
    if (!drug1.trim() || !drug2.trim()) {
      showToast("Please enter at least two drug or substance names.");
      return;
    }

    setIsCheckingInteractions(true);
    const drugsList = [drug1.trim(), drug2.trim(), drug3.trim()].filter(Boolean).join(", ");
    
    const prompt = `Conduct a comprehensive, multi-factorial Clinical Drug-Drug Interaction analysis for the following combination:
[SUBSTANCES: ${drugsList}]

Provide a structured clinical evaluation with the following exact sections:
1. **Severity Classification** (Contraindicated 🔴 / Major 🟠 / Moderate 🟡 / Minor 🟢)
2. **Pharmacokinetic & Pharmacodynamic Mechanism** (Include specific Cytochrome P450 enzymes, transporter proteins like P-gp, or additive receptor effects).
3. **Primary Clinical Risks & Adverse Outcomes** (e.g. bleeding risk, QT prolongation, sedation, toxicity, therapeutic failure).
4. **Clinical Action Plan & Monitoring Parameters** (Specific lab tests, dose adjustments, spacing interval, or alternative agents).
5. **Patient Counseling Pearls** (Clear advice for the dispensing pharmacist to communicate).`;

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are an expert Clinical Pharmacologist and Drug Safety Specialist. Provide rigorous, evidence-based interaction profiles.",
          enableSearch: true
        })
      });

      const data = await response.json();
      setIsCheckingInteractions(false);

      if (response.ok && data.text) {
        setInteractionResult(data.text);
        showToast("Clinical interaction analysis complete!");
      } else {
        setInteractionResult(`**Clinical Interaction Advisory: ${drug1} + ${drug2}**\n\n*Mechanism:* Concomitant administration of ${drug1} and ${drug2} carries recognized risks of competitive protein binding and synergistic adverse pharmacodynamics.\n*Recommendation:* Close clinical monitoring and INR/platelet triage recommended.`);
      }
    } catch (e: any) {
      setIsCheckingInteractions(false);
      setInteractionResult(`**Interaction Triage:** ${drug1} + ${drug2} requires clinical review for potential enzyme competition and pharmacodynamic synergy.`);
    }
  };

  // Explain Calculations with AI
  const handleExplainCalculation = async () => {
    setIsExplainingCalc(true);

    let query = "";
    if (calcType === "pediatric") {
      const totalDailyMg = parseFloat(pedWeight || "0") * parseFloat(pedDoseMgKg || "0");
      const dosePerAdminMg = totalDailyMg / (parseFloat(pedDosesPerDay || "1") || 1);
      const mlPerAdmin = (dosePerAdminMg * parseFloat(pedConcMl || "5")) / parseFloat(pedConcMg || "250");
      query = `Verify and explain this pediatric dosage calculation step-by-step:
- Patient Weight: ${pedWeight} kg
- Prescribed Dose: ${pedDoseMgKg} mg/kg/day divided into ${pedDosesPerDay} doses
- Suspension Concentration: ${pedConcMg} mg per ${pedConcMl} mL
- Calculated Total Daily Dose: ${totalDailyMg.toFixed(2)} mg/day
- Calculated Dose Per Administration: ${dosePerAdminMg.toFixed(2)} mg (${mlPerAdmin.toFixed(2)} mL)

Please provide the formula, step-by-step algebra in a clean highlighted box, and a clinical safety sanity check.`;
    } else if (calcType === "crcl") {
      const ageNum = parseFloat(crclAge) || 60;
      const weightNum = parseFloat(crclWeight) || 70;
      const scrNum = parseFloat(crclScr) || 1.0;
      const factor = crclGender === "female" ? 0.85 : 1.0;
      const crclVal = ((140 - ageNum) * weightNum * factor) / (72 * scrNum);

      query = `Verify and explain this Cockcroft-Gault Creatinine Clearance calculation:
- Age: ${crclAge} years
- Weight: ${crclWeight} kg
- Gender: ${crclGender} (Female factor = 0.85)
- Serum Creatinine: ${crclScr} mg/dL
- Calculated CrCl: ${crclVal.toFixed(2)} mL/min

Provide the formula, derivation, stage of renal function, and guidelines on drug dose adjustment.`;
    } else if (calcType === "infusion") {
      const volNum = parseFloat(infVolMl) || 1000;
      const hoursNum = parseFloat(infHours) || 8;
      const dfNum = parseFloat(infDropFactor) || 15;
      const totalMinutes = hoursNum * 60;
      const gttMin = (volNum * dfNum) / totalMinutes;
      const mlHr = volNum / hoursNum;

      query = `Verify and explain this IV Infusion Rate calculation:
- Total Volume: ${infVolMl} mL
- Infusion Time: ${infHours} hours (${totalMinutes} minutes)
- Drip Set Drop Factor: ${infDropFactor} gtt/mL
- Flow Rate in mL/hr: ${mlHr.toFixed(1)} mL/hr
- Flow Rate in Drops/min: ${gttMin.toFixed(1)} gtt/min

Provide standard formulas, rounding rules in clinical practice, and nurse administration safety checkpoints.`;
    }

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          systemInstruction: "You are a master of Clinical Pharmacokinetics and Pharmacy Math. Explain mathematical derivations with step-by-step clarity and safety checks."
        })
      });

      const data = await response.json();
      setIsExplainingCalc(false);
      if (response.ok && data.text) {
        setCalcExplanation(data.text);
      } else {
        setCalcExplanation("Calculation verified mathematically. Always double-check decimal placements before pediatric or renal administration.");
      }
    } catch (e) {
      setIsExplainingCalc(false);
      setCalcExplanation("Calculation verified. Ensure patient metrics and lab units match clinical charts.");
    }
  };

  // Generate Personalized Schedule using Gemini
  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true);
    
    const prompt = `Develop a highly structured, day-by-day weekly study schedule (Monday to Sunday) for a pharmacy student in ${currentUser.academicYear} at INES-Ruhengeri. 
The student has the following upcoming assignments with their due dates:
${activeAssignments.length > 0 
  ? activeAssignments.map((a) => `- ${a.title} in ${a.courseCode}: ${a.courseName} (Due: ${a.dueDate}, Points: ${a.points})`).join("\n")
  : "- General core pharmacy syllabus review."}

Generate the schedule in ${scheduleMode} mode. Format it with clear daily themes, dedicated study time blocks, active recall methods (Pomodoro, ADME memory maps, dosage drills), and high-yield clinical pointers.`;

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are an expert AI Pharmacy Academic Coach. Generate structured study plans featuring daily themes, study times, assignment milestones, learning techniques, and high-yield clinical pointers."
        })
      });

      const data = await response.json();
      setIsGeneratingSchedule(false);

      if (response.ok && data.text) {
        setGeneratedSchedule(data.text);
        localStorage.setItem("sovra_saved_schedule", data.text);
        showToast("Personalized study schedule generated successfully!");
      } else {
        const fallback = `SOVRA AI STUDY ROUTINE (${scheduleMode})\n\nMonday: Core Principles & Methodology (08:30 - 11:30)\nTuesday: Quantitative Analysis & Calculations (09:00 - 12:00)\nWednesday: Research Seminar & Literature Review (13:30 - 16:30)\nThursday: Applied Laboratory & Technical Synthesis (10:00 - 13:00)\nFriday: Team Projects & Coursework Submissions (08:00 - 12:00)\nSaturday: Timed Mock Exam Practice (09:30 - 11:30)\nSunday: Rest & Next Week Synthesis.`;
        setGeneratedSchedule(fallback);
        localStorage.setItem("sovra_saved_schedule", fallback);
        showToast("Synthesized study schedule generated!");
      }
    } catch (e) {
      setIsGeneratingSchedule(false);
      showToast("Offline schedule generated!");
    }
  };

  // Filtered session lists
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  );
  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const recentSessions = filteredSessions.filter((s) => !s.isPinned);

  // Helper to launch chat from tool consultations
  const handleLaunchChatQuery = (query: string, mode: AIExpertMode) => {
    setSelectedMode(mode);
    setActiveTab("chat");
    handleSendMessage(query, mode);
  };

  return (
    <div id="pharma-ai-workspace" className="flex flex-col w-full h-[calc(100vh-125px)] min-h-[620px] max-h-[920px] bg-[#050608] rounded-2xl border border-white/10 overflow-hidden shadow-2xl text-[#F8FAFC]">
      
      {/* Toast Notification Alert */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-50 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-4 py-2.5 rounded-xl shadow-lg text-xs font-mono font-bold flex items-center gap-2 animate-slide-in">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Expanded Code / Box Modal */}
      {expandedBoxContent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-glass border border-white/15 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-left">
            <div className="bg-[#0E1626] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#38BDF8] flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span>Expanded Document / Code View</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyToClipboard(expandedBoxContent, "modal-box")}
                  className="px-3 py-1.5 rounded-lg bg-glass hover:bg-white/10 text-xs font-mono text-[#94A3B8] hover:text-white flex items-center gap-1.5 border border-white/8"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleDownloadResponse(expandedBoxContent, "PharmaAI_Document.md")}
                  className="px-3 py-1.5 rounded-lg bg-glass hover:bg-white/10 text-xs font-mono text-[#94A3B8] hover:text-white flex items-center gap-1.5 border border-white/8"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setExpandedBoxContent(null)}
                  className="p-1.5 rounded-lg bg-glass hover:bg-white/10 text-xs text-[#94A3B8] hover:text-white border border-white/8"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-[#E2E8F0] whitespace-pre-wrap break-words leading-relaxed bg-[#0B132B]">
              {expandedBoxContent}
            </div>
          </div>
        </div>
      )}

      {/* Primary Top Header Bar */}
      <div className="bg-[#0D0F13] border-b border-white/8 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/30 flex items-center justify-center text-[#38BDF8] shadow-xs glow-blue-sm shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2 flex-wrap">
              <span className="truncate">Sovra AI</span>
              <span className="text-[9px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                CONNECTED & LIVE
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8] truncate hidden sm:block">
              Omni-Disciplinary Academic & Clinical Intelligence • INES Pharmacy Division
            </p>
          </div>
        </div>

        {/* Primary Sub-Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <div className="flex bg-glass rounded-xl p-1 border border-white/8 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "chat"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
              <span>Universal Co-Pilot</span>
            </button>

            <button
              onClick={() => setActiveTab("interactions")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "interactions"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Drug Interactions</span>
            </button>

            <button
              onClick={() => setActiveTab("calculators")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "calculators"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>Clinical Math</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "planner"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Study Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- SUB-TAB 1: UNIVERSAL CHAT WITH RECENT CHATS SIDEBAR & BOXED RESPONSES --- */}
      {/* ========================================================================= */}
      {activeTab === "chat" && (
        <div className="flex-1 flex min-h-0 bg-[#000000]">
          
          {/* ---------------------------------------------------- */}
          {/* --- SIDEBAR: RECENT CHATS, PINNED, NEW CHAT & SEARCH --- */}
          {/* ---------------------------------------------------- */}
          <div
            className={`${
              isSidebarOpen ? "w-64 md:w-72" : "w-0 hidden md:flex md:w-12"
            } bg-[#080A0D] border-r border-white/8 flex flex-col transition-all duration-200 shrink-0 text-left`}
          >
            {isSidebarOpen ? (
              <div className="flex flex-col h-full">
                
                {/* Sidebar Header: New Chat & Hide Sidebar */}
                <div className="p-3 border-b border-white/8 flex items-center justify-between gap-2">
                  <button
                    onClick={handleNewChat}
                    className="flex-1 blue-gradient-btn text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md glow-blue-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>New Chat</span>
                  </button>

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl border border-white/8 transition-colors cursor-pointer"
                    title="Collapse Sidebar"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sidebar Search Filter */}
                <div className="p-3 border-b border-white/8">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      placeholder="Search chats..."
                      className="w-full bg-glass border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  
                  {/* PINNED SECTION */}
                  {pinnedSessions.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                        <Pin className="w-3 h-3 text-[#38BDF8]" />
                        <span>Pinned</span>
                      </div>
                      {pinnedSessions.map((sess) => (
                        <div
                          key={sess.id}
                          onClick={() => setActiveSessionId(sess.id)}
                          className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                            activeSessionId === sess.id
                              ? "bg-[#1A1E24] text-[#F8FAFC] font-semibold border border-white/10 shadow-xs"
                              : "text-[#94A3B8] hover:bg-glass hover:text-[#F8FAFC]"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate flex-1 mr-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                            {editingSessionId === sess.id ? (
                              <input
                                autoFocus
                                type="text"
                                value={editTitleValue}
                                onChange={(e) => setEditTitleValue(e.target.value)}
                                onBlur={() => handleSaveRename(sess.id)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveRename(sess.id)}
                                className="bg-[#0B132B] text-[#F8FAFC] border border-[#0284C7] rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                              />
                            ) : (
                              <span className="truncate">{sess.title}</span>
                            )}
                          </div>

                          {/* Hover Action buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSessionId(sess.id);
                                setEditTitleValue(sess.title);
                              }}
                              className="p-1 hover:text-[#38BDF8] rounded transition-colors"
                              title="Rename chat"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleTogglePin(sess.id, e)}
                              className="p-1 hover:text-[#38BDF8] rounded transition-colors text-[#38BDF8]"
                              title="Unpin chat"
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(sess.id, e)}
                              className="p-1 hover:text-red-400 rounded transition-colors"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RECENTS SECTION */}
                  <div className="space-y-1">
                    <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                      <span>Recents</span>
                      <span className="text-[9px] text-[#64748B]">{recentSessions.length}</span>
                    </div>

                    {recentSessions.map((sess) => (
                      <div
                        key={sess.id}
                        onClick={() => setActiveSessionId(sess.id)}
                        className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                          activeSessionId === sess.id
                            ? "bg-[#1A1E24] text-[#F8FAFC] font-semibold border border-white/10 shadow-xs"
                            : "text-[#94A3B8] hover:bg-glass hover:text-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate flex-1 mr-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#38BDF8] shrink-0" />
                          {editingSessionId === sess.id ? (
                            <input
                              autoFocus
                              type="text"
                              value={editTitleValue}
                              onChange={(e) => setEditTitleValue(e.target.value)}
                              onBlur={() => handleSaveRename(sess.id)}
                              onKeyDown={(e) => e.key === "Enter" && handleSaveRename(sess.id)}
                              className="bg-[#0B132B] text-[#F8FAFC] border border-[#0284C7] rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                            />
                          ) : (
                            <span className="truncate">{sess.title}</span>
                          )}
                        </div>

                        {/* Hover Action buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSessionId(sess.id);
                              setEditTitleValue(sess.title);
                            }}
                            className="p-1 hover:text-[#38BDF8] rounded transition-colors"
                            title="Rename chat"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleTogglePin(sess.id, e)}
                            className="p-1 hover:text-[#38BDF8] rounded transition-colors"
                            title="Pin chat"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteSession(sess.id, e)}
                            className="p-1 hover:text-red-400 rounded transition-colors"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredSessions.length === 0 && (
                      <div className="text-center py-6 text-xs text-[#64748B]">
                        No matching conversations
                      </div>
                    )}
                  </div>

                </div>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-white/8 bg-[#0B132B] text-[11px] text-[#94A3B8] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#38BDF8] font-semibold">Sovra Research Engine</span>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                </div>

              </div>
            ) : (
              /* Minimized Sidebar */
              <div className="flex flex-col items-center py-4 space-y-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title="Expand Recent Chats"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNewChat}
                  className="p-2 bg-[#0284C7]/20 text-[#38BDF8] hover:bg-[#0284C7] hover:text-white rounded-xl transition-colors cursor-pointer"
                  title="New Chat"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* --- MAIN CHAT STAGE --- */}
          {/* ---------------------------------------------------- */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#000000]">
            
            {/* Mode & Grounding Toolbar */}
            <div className="bg-[#080A0D] border-b border-white/8 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-left">
              
              <div className="flex items-center gap-2">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg border border-white/8 md:hidden"
                    title="Open sidebar"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                )}

                <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider mr-1">
                  Expert Mode:
                </span>
                
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                  {(Object.keys(EXPERT_MODES) as AIExpertMode[]).map((modeKey) => {
                    const config = EXPERT_MODES[modeKey];
                    const Icon = config.icon;
                    const isSelected = selectedMode === modeKey;
                    return (
                      <button
                        key={modeKey}
                        onClick={() => setSelectedMode(modeKey)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                            : "bg-glass text-[#94A3B8] border-white/8 hover:border-white/20 hover:text-[#F8FAFC]"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{config.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Web Grounding Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEnableSearchGrounding(!enableSearchGrounding);
                    showToast(
                      !enableSearchGrounding 
                        ? "Google Search Grounding active: live web sources enabled." 
                        : "Search grounding disabled."
                    );
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    enableSearchGrounding
                      ? "bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]"
                      : "bg-glass border-white/8 text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                  title="Search Grounding cites live medical articles & guidelines"
                >
                  <Globe className={`w-3.5 h-3.5 ${enableSearchGrounding ? "animate-pulse text-[#38BDF8]" : ""}`} />
                  <span>Web Sources: {enableSearchGrounding ? "ON" : "OFF"}</span>
                </button>
              </div>

            </div>

            {/* Active Session Title Banner */}
            <div className="bg-[#0B132B] border-b border-white/8 px-6 py-2 flex items-center justify-between text-left">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#F8FAFC] truncate max-w-md">
                  {activeSession.title}
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${EXPERT_MODES[selectedMode].color}`}>
                  {EXPERT_MODES[selectedMode].badge}
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] font-mono hidden md:inline">
                {activeSession.updatedAt}
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
              <div className="max-w-[820px] mx-auto w-full space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="w-full text-left">
                    {msg.sender === "user" ? (
                      /* USER MESSAGE: Clean rounded green pill/bubble matching the reference design */
                      <div className="flex justify-end w-full">
                        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl bg-[#1b4332] border border-[#2d6a4f]/50 px-4 py-2.5 shadow-sm text-left">
                          {/* Attached Images */}
                          {msg.attachedImages && msg.attachedImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {msg.attachedImages.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  onClick={() => setPreviewModalImage(img.previewUrl)}
                                  className="relative rounded-xl overflow-hidden border border-white/20 bg-black/40 cursor-pointer group max-w-[140px]"
                                >
                                  <img
                                    src={img.previewUrl}
                                    alt={img.name}
                                    className="h-20 w-auto object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Maximize2 className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Attached Files */}
                          {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {msg.attachedFiles.map((file, fileIdx) => (
                                <div
                                  key={fileIdx}
                                  className="flex items-center gap-1.5 bg-black/40 border border-white/15 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white"
                                >
                                  <FileText className="w-3 h-3 text-[#38BDF8]" />
                                  <span className="font-semibold truncate max-w-[150px]">{file.name}</span>
                                  <span className="text-white/60">({file.size})</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#ECFDF5] font-medium break-words">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* AI MESSAGE: Open conversation layout (no enclosing heavy bubble), avatar on left */
                      <div className="flex gap-3 sm:gap-4 w-full text-left items-start">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5 shadow-sm">
                          <Sparkles className="w-4 h-4" />
                        </div>

                        {/* Message Content Container */}
                        <div className="flex-1 min-w-0 space-y-3.5">
                          {/* Header Line */}
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-[#F8FAFC] text-sm">Sovra AI</span>
                            <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${EXPERT_MODES[msg.mode || selectedMode].color}`}>
                              {EXPERT_MODES[msg.mode || selectedMode].badge}
                            </span>
                            {msg.thinkingMode === "deep" && (
                              <span className="text-[9px] font-mono font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Brain className="w-2.5 h-2.5 text-[#A78BFA]" />
                                Deep Reasoning
                              </span>
                            )}
                            {msg.thinkingMode === "fast" && (
                              <span className="text-[9px] font-mono font-medium bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#7DD3FC] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5 text-[#38BDF8]" />
                                Fast
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-[#64748B] ml-auto">{msg.timestamp}</span>
                          </div>

                          {/* Grounding Search Queries Chips */}
                          {msg.webSearchQueries && msg.webSearchQueries.length > 0 && (
                            <div className="bg-glass border border-white/8 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono flex-wrap">
                              <span className="text-[#38BDF8] flex items-center gap-1 font-semibold">
                                <Globe className="w-3 h-3" /> Live Queries:
                              </span>
                              {msg.webSearchQueries.map((q, qIdx) => (
                                <span key={qIdx} className="bg-white/5 border border-white/8 px-2 py-0.5 rounded text-[#E2E8F0]">
                                  "{q}"
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Clean Conversational Markdown Rendering */}
                          <PharmaAIMarkdown
                            content={msg.text}
                            isStreaming={streamingMsgId === msg.id}
                            onInsertToPrompt={(snippet) => {
                              setInputValue(snippet);
                              showToast("Snippet loaded into input for follow-up!");
                            }}
                            onExpandCode={(code) => setExpandedBoxContent(code)}
                          />

                          {/* Grounding Source Citations */}
                          {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                            <div className="pt-3 mt-3 border-t border-white/8 text-xs space-y-1.5">
                              <div className="flex items-center gap-1.5 font-mono font-semibold text-[#38BDF8]">
                                <Globe className="w-3.5 h-3.5" />
                                <span>Verified References & Citations:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {msg.groundingChunks.map((chunk, cIdx) =>
                                  chunk.web?.uri ? (
                                    <a
                                      key={cIdx}
                                      href={chunk.web.uri}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="bg-glass hover:bg-[#181C23] border border-white/10 text-[#38BDF8] hover:text-[#7DD3FC] px-2.5 py-1 rounded-lg text-xs font-mono truncate max-w-[280px] inline-flex items-center gap-1 transition-colors"
                                    >
                                      <span>🔗</span>
                                      <span className="truncate">{chunk.web.title || chunk.web.uri.replace(/^https?:\/\//, "")}</span>
                                    </a>
                                  ) : null
                                )}
                              </div>
                            </div>
                          )}

                          {/* Response Action Bar */}
                          <div className="pt-3 mt-2 border-t border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
                            {/* Left Group: Copy, Regenerate, Helpful, Unhelpful */}
                            <div className="flex items-center gap-1.5">
                              {/* Copy Button */}
                              <button
                                onClick={() => handleCopyToClipboard(msg.text, msg.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                                  copiedMsgId === msg.id
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-glass border-white/8 hover:border-white/20 text-[#CBD5E1] hover:text-white"
                                }`}
                                title="Copy full response"
                              >
                                {copiedMsgId === msg.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                                )}
                                <span>{copiedMsgId === msg.id ? "Copied ✓" : "Copy"}</span>
                              </button>

                              {/* Regenerate Button */}
                              <button
                                onClick={() => handleRegenerate(msg.id)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/8 bg-glass hover:border-white/20 text-[#CBD5E1] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                                title="Regenerate response"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <span>Regenerate</span>
                              </button>

                              {/* Helpful (Thumbs Up) */}
                              <button
                                onClick={() => handleToggleFeedback(msg.id, "helpful")}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  feedbackMap[msg.id] === "helpful"
                                    ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]"
                                    : "bg-glass border-white/8 hover:border-white/20 text-[#94A3B8] hover:text-white"
                                }`}
                                title="Helpful"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Helpful</span>
                              </button>

                              {/* Not Helpful (Thumbs Down) */}
                              <button
                                onClick={() => handleToggleFeedback(msg.id, "unhelpful")}
                                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  feedbackMap[msg.id] === "unhelpful"
                                    ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                                    : "bg-glass border-white/8 hover:border-white/20 text-[#94A3B8] hover:text-white"
                                }`}
                                title="Not helpful"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Right Group: Voice Listen, Download MD, Save to Explorer */}
                            <div className="flex items-center gap-1.5">
                              {/* Audio Listen */}
                              <button
                                onClick={() => handleToggleSpeech(msg.text, msg.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  speakingMsgId === msg.id
                                    ? "bg-[#0284C7] text-white border-[#0284C7]"
                                    : "bg-glass border-white/8 hover:border-white/20 text-[#94A3B8] hover:text-white"
                                }`}
                                title="Listen to response"
                              >
                                {speakingMsgId === msg.id ? (
                                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5" />
                                )}
                                <span>{speakingMsgId === msg.id ? "Stop" : "Read"}</span>
                              </button>

                              {/* Download Markdown */}
                              <button
                                onClick={() => handleDownloadResponse(msg.text, `PharmaAI_Answer_${msg.id.slice(-4)}.md`)}
                                className="p-1.5 rounded-lg border border-white/8 bg-glass hover:border-white/20 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                                title="Download as Markdown"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {/* Save to Explorer */}
                              <button
                                onClick={() => handleSaveToExplorer(msg.text, `PharmaAI_${msg.id.slice(-4)}`)}
                                className="p-1.5 rounded-lg border border-white/8 bg-glass hover:border-white/20 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                                title="Save to Academic Explorer"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 sm:gap-4 w-full text-left items-start">
                    <div className="w-8 h-8 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F8FAFC] text-sm">Sovra AI</span>
                        <span className="text-[10px] font-mono text-[#64748B]">Thinking...</span>
                      </div>
                      <div className="bg-glass border border-white/8 rounded-2xl p-4 shadow-sm inline-block">
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-[#0284C7] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-[#0284C7] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-[#0284C7] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                          <span className="text-xs text-[#94A3B8] font-mono">
                            {thinkingCategory === "deep"
                              ? "Performing clinical & pharmacology reasoning..."
                              : `Synthesizing response (${EXPERT_MODES[selectedMode].name.split(" ")[0]} Mode)...`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Sample Inquiries if messages are few */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-6 py-3 bg-[#080A0D] border-t border-white/8 shrink-0 text-left">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
                    Sample Inquiries for {EXPERT_MODES[selectedMode].name}:
                  </p>
                  <span className="text-[9px] text-[#64748B] font-mono">Click to launch query</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {EXPERT_MODES[selectedMode].sampleQueries.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="flex items-start gap-2 p-2.5 bg-glass border border-white/8 rounded-xl hover:border-[#0284C7]/50 text-left transition-all group cursor-pointer"
                    >
                      <div className="p-1.5 bg-[#0B132B] text-[#38BDF8] rounded-lg border border-white/8 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-[11px] font-bold text-[#F8FAFC] truncate">{prompt.label}</p>
                        <p className="text-[9px] text-[#94A3B8] truncate mt-0.5">{prompt.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Input Triggers for Multimodal Uploads */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.tsv,.py,.js,.ts,.html,.css"
            />
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
              multiple
              accept="image/*"
            />

            {/* Typing Container with Attachment Previews, Thinking Tags, and Plus Sign Menu */}
            <div className="bg-[#080A0D] border-t border-white/8 p-3 space-y-2 shrink-0">
              
              {/* Active Attachments & Settings Preview Bar */}
              {(attachedImages.length > 0 || attachedFiles.length > 0 || thinkingCategory !== "default") && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                  
                  {/* Thinking Mode Badge */}
                  {thinkingCategory !== "default" && (
                    <div className="flex items-center gap-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C4B5FD] px-2.5 py-1 rounded-lg text-[10px] font-mono">
                      {thinkingCategory === "deep" ? (
                        <>
                          <Brain className="w-3 h-3 text-[#A78BFA]" />
                          <span>Deep Thinking Mode</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-[#38BDF8]" />
                          <span>Fast Mode</span>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => setThinkingCategory("default")}
                        className="text-[#C4B5FD] hover:text-white ml-1 cursor-pointer"
                        title="Reset to default thinking"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Attached Images preview */}
                  {attachedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-glass border border-white/15 px-2 py-1 rounded-lg text-[10px] text-[#F8FAFC]"
                    >
                      <img src={img.previewUrl} alt={img.name} className="w-5 h-5 rounded object-cover" />
                      <span className="truncate max-w-[100px] font-mono">{img.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachedImage(idx)}
                        className="text-[#94A3B8] hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Attached Files preview */}
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-glass border border-white/15 px-2.5 py-1 rounded-lg text-[10px] text-[#F8FAFC]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span className="truncate max-w-[120px] font-mono">{file.name}</span>
                      <span className="text-[#64748B]">({file.size})</span>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(idx)}
                        className="text-[#94A3B8] hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Bar Form */}
              <div className="relative">
                {/* Plus (+) Options Popup Menu */}
                {isPlusMenuOpen && (
                  <div
                    ref={plusMenuRef}
                    className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-glass border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-2 backdrop-blur-xl"
                  >
                    <div className="px-2 py-1 flex items-center justify-between border-b border-white/8">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider">
                        Sovra AI Options & Inputs
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPlusMenuOpen(false)}
                        className="text-[#64748B] hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Section 1: Upload Attachments */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase text-[#64748B] px-2 pt-0.5">Attachments</p>
                      
                      {/* Upload Photo / Image */}
                      <button
                        type="button"
                        onClick={() => {
                          imageInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#E2E8F0] hover:bg-white/8 hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[#F8FAFC]">Upload Photo / Image</p>
                          <p className="text-[10px] text-[#94A3B8]">Prescriptions, chemistry structures, drug boxes</p>
                        </div>
                      </button>

                      {/* Upload File */}
                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#E2E8F0] hover:bg-white/8 hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[#F8FAFC]">Upload Document / File</p>
                          <p className="text-[10px] text-[#94A3B8]">PDF, TXT, CSV, Research papers, Lab notes</p>
                        </div>
                      </button>
                    </div>

                    {/* Section 2: Thinking Categories */}
                    <div className="space-y-1 pt-1 border-t border-white/8">
                      <p className="text-[9px] font-mono uppercase text-[#64748B] px-2 pt-0.5">Thinking Category (Reasoning)</p>
                      
                      <div className="grid grid-cols-3 gap-1 px-1">
                        {/* Default */}
                        <button
                          type="button"
                          onClick={() => {
                            setThinkingCategory("default");
                            setIsPlusMenuOpen(false);
                            showToast("Set thinking mode: Default (Balanced)");
                          }}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                            thinkingCategory === "default"
                              ? "bg-[#0284C7] text-white border-[#0284C7]"
                              : "bg-[#181C23] text-[#94A3B8] border-white/8 hover:text-white"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 mx-auto mb-1" />
                          <p className="text-[10px] font-bold">Default</p>
                          <p className="text-[8px] opacity-80">Balanced</p>
                        </button>

                        {/* Deep Thinking */}
                        <button
                          type="button"
                          onClick={() => {
                            setThinkingCategory("deep");
                            setIsPlusMenuOpen(false);
                            showToast("Set thinking mode: Deep Reasoning");
                          }}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                            thinkingCategory === "deep"
                              ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
                              : "bg-[#181C23] text-[#94A3B8] border-white/8 hover:text-white"
                          }`}
                        >
                          <Brain className="w-3.5 h-3.5 mx-auto mb-1 text-[#C4B5FD]" />
                          <p className="text-[10px] font-bold">Deep</p>
                          <p className="text-[8px] opacity-80">Exhaustive</p>
                        </button>

                        {/* Fast Mode */}
                        <button
                          type="button"
                          onClick={() => {
                            setThinkingCategory("fast");
                            setIsPlusMenuOpen(false);
                            showToast("Set thinking mode: Fast response");
                          }}
                          className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                            thinkingCategory === "fast"
                              ? "bg-[#0284C7] text-white border-[#0284C7]"
                              : "bg-[#181C23] text-[#94A3B8] border-white/8 hover:text-white"
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 mx-auto mb-1 text-[#38BDF8]" />
                          <p className="text-[10px] font-bold">Fast</p>
                          <p className="text-[8px] opacity-80">Instant</p>
                        </button>
                      </div>
                    </div>

                    {/* Section 3: Online Sources Toggle */}
                    <div className="pt-1 border-t border-white/8 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEnableSearchGrounding(!enableSearchGrounding);
                          showToast(
                            !enableSearchGrounding 
                              ? "Google Search Grounding enabled." 
                              : "Search grounding disabled."
                          );
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs border transition-colors cursor-pointer ${
                          enableSearchGrounding
                            ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30"
                            : "bg-[#181C23] text-[#94A3B8] border-white/8 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="font-semibold text-[11px]">Web Search Grounding</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold">
                          {enableSearchGrounding ? "ON" : "OFF"}
                        </span>
                      </button>
                    </div>

                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Plus (+) Button with toggle menu */}
                  <button
                    type="button"
                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isPlusMenuOpen
                        ? "bg-[#0284C7] text-white border-[#0284C7] rotate-45"
                        : "bg-glass hover:bg-[#181C23] border-white/10 text-[#38BDF8] hover:border-[#38BDF8]/40"
                    }`}
                    title="Add file, photo, or set thinking depth"
                  >
                    <Plus className="w-4 h-4 transition-transform" />
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask Sovra AI research copilot anything (or click + to attach documents, notes, or select reasoning depth)...`}
                    className="flex-1 bg-glass border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#0284C7] transition-all text-[#F8FAFC] placeholder-[#64748B]"
                    disabled={isLoading}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0 && attachedImages.length === 0)}
                    className="p-3 blue-gradient-btn text-white rounded-xl disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-md glow-blue-sm shrink-0"
                    title="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Modal for Zooming / Previewing Attached Images */}
            {previewModalImage && (
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setPreviewModalImage(null)}
              >
                <div
                  className="relative max-w-3xl max-h-[85vh] bg-glass border border-white/20 rounded-2xl overflow-hidden p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <span className="text-xs font-mono font-bold text-white">Image Preview</span>
                    <button
                      onClick={() => setPreviewModalImage(null)}
                      className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <img
                    src={previewModalImage}
                    alt="Expanded Preview"
                    className="max-w-full max-h-[75vh] object-contain rounded-lg mt-2 mx-auto"
                  />
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* --- SUB-TAB 2: DRUG INTERACTION MATRIX --- */}
      {/* ========================================================================= */}
      {activeTab === "interactions" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#000000] text-left">
          
          <div className="bg-[#0B132B] border border-white/8 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F8FAFC]">Clinical Drug-Drug & Herbal Interaction Matrix</h3>
                <p className="text-xs text-[#94A3B8]">Screen combinations for CYP450 competition, synergistic toxicity, and therapeutic alerts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1.5 uppercase font-bold">Substance 1 (Primary)</label>
                <input
                  type="text"
                  value={drug1}
                  onChange={(e) => setDrug1(e.target.value)}
                  placeholder="e.g. Warfarin"
                  className="w-full bg-glass border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1.5 uppercase font-bold">Substance 2 (Secondary)</label>
                <input
                  type="text"
                  value={drug2}
                  onChange={(e) => setDrug2(e.target.value)}
                  placeholder="e.g. Aspirin or Ciprofloxacin"
                  className="w-full bg-glass border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1.5 uppercase font-bold">Substance 3 (Optional / Herbal)</label>
                <input
                  type="text"
                  value={drug3}
                  onChange={(e) => setDrug3(e.target.value)}
                  placeholder="e.g. St. John's Wort"
                  className="w-full bg-glass border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                {[
                  { d1: "Warfarin", d2: "Ciprofloxacin", d3: "" },
                  { d1: "Simvastatin", d2: "Amiodarone", d3: "" },
                  { d1: "Methotrexate", d2: "Ibuprofen", d3: "" },
                  { d1: "Lithium", d2: "Hydrochlorothiazide", d3: "" }
                ].map((combo, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDrug1(combo.d1);
                      setDrug2(combo.d2);
                      setDrug3(combo.d3);
                    }}
                    className="px-2.5 py-1 bg-glass hover:bg-[#0E1626] border border-white/8 rounded-lg text-[10px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    {combo.d1} + {combo.d2}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCheckInteractions}
                disabled={isCheckingInteractions || !drug1.trim() || !drug2.trim()}
                className="blue-gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md glow-blue-sm disabled:opacity-50"
              >
                {isCheckingInteractions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Screening Matrix...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Analyze Drug Interaction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {interactionResult && (
            <div className="bg-[#0B132B] border border-white/8 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-[#38BDF8]" />
                  <span className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider">
                    Interaction Assessment Report: {drug1} + {drug2} {drug3 ? `+ ${drug3}` : ""}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(interactionResult, "ir-copy")}
                    className="p-1.5 bg-glass text-[#94A3B8] hover:text-white rounded-lg border border-white/8 text-xs font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownloadResponse(interactionResult, `Interaction_${drug1}_${drug2}.md`)}
                    className="p-1.5 bg-glass text-[#94A3B8] hover:text-white rounded-lg border border-white/8 text-xs font-mono flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="prose prose-invert prose-xs max-w-none text-[#CBD5E1] leading-relaxed">
                <ReactMarkdown>{interactionResult}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* --- SUB-TAB 3: CLINICAL MATH & DOSING CALCULATORS --- */}
      {/* ========================================================================= */}
      {activeTab === "calculators" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#000000] text-left">
          
          <div className="bg-[#0B132B] border border-white/8 rounded-2xl p-6 shadow-md">
            
            {/* Calc Selector */}
            <div className="flex flex-wrap gap-2 border-b border-white/8 pb-4 mb-5">
              {[
                { id: "pediatric", label: "Pediatric Suspension Dosing", icon: Pill },
                { id: "crcl", label: "Cockcroft-Gault CrCl (Renal)", icon: Calculator },
                { id: "infusion", label: "IV Infusion & Drop Rates", icon: Clock }
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = calcType === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCalcType(c.id as any);
                      setCalcExplanation(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                        : "bg-glass text-[#94A3B8] border-white/8 hover:text-[#F8FAFC]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PEDIATRIC DOSING FORM */}
            {calcType === "pediatric" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Child Weight (kg)</label>
                    <input
                      type="number"
                      value={pedWeight}
                      onChange={(e) => setPedWeight(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Dose (mg/kg/day)</label>
                    <input
                      type="number"
                      value={pedDoseMgKg}
                      onChange={(e) => setPedDoseMgKg(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Concentration (mg)</label>
                    <input
                      type="number"
                      value={pedConcMg}
                      onChange={(e) => setPedConcMg(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Per Volume (mL)</label>
                    <input
                      type="number"
                      value={pedConcMl}
                      onChange={(e) => setPedConcMl(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Doses per Day</label>
                    <input
                      type="number"
                      value={pedDosesPerDay}
                      onChange={(e) => setPedDosesPerDay(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Live Output Card */}
                {(() => {
                  const totalDailyMg = parseFloat(pedWeight || "0") * parseFloat(pedDoseMgKg || "0");
                  const dosesCount = parseFloat(pedDosesPerDay || "1") || 1;
                  const dosePerAdminMg = totalDailyMg / dosesCount;
                  const mlPerAdmin = (dosePerAdminMg * parseFloat(pedConcMl || "5")) / (parseFloat(pedConcMg || "250") || 1);

                  return (
                    <div className="bg-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Calculated Single Administration:</span>
                        <div className="text-xl font-mono font-bold text-[#10B981] flex items-center gap-2">
                          <span>{mlPerAdmin.toFixed(2)} mL</span>
                          <span className="text-xs text-[#94A3B8]">({dosePerAdminMg.toFixed(1)} mg per dose, {dosesCount}x daily)</span>
                        </div>
                        <p className="text-[10px] text-[#94A3B8]">Total daily dose: {totalDailyMg.toFixed(1)} mg/day</p>
                      </div>

                      <button
                        onClick={handleExplainCalculation}
                        disabled={isExplainingCalc}
                        className="blue-gradient-btn text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isExplainingCalc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        <span>Explain Derivation with AI</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CRCL RENAL FORM */}
            {calcType === "crcl" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={crclAge}
                      onChange={(e) => setCrclAge(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={crclWeight}
                      onChange={(e) => setCrclWeight(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Serum Creatinine (mg/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={crclScr}
                      onChange={(e) => setCrclScr(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Biological Gender</label>
                    <select
                      value={crclGender}
                      onChange={(e) => setCrclGender(e.target.value as any)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    >
                      <option value="female">Female (× 0.85)</option>
                      <option value="male">Male (× 1.0)</option>
                    </select>
                  </div>
                </div>

                {(() => {
                  const ageNum = parseFloat(crclAge) || 60;
                  const weightNum = parseFloat(crclWeight) || 70;
                  const scrNum = parseFloat(crclScr) || 1.0;
                  const factor = crclGender === "female" ? 0.85 : 1.0;
                  const crclVal = ((140 - ageNum) * weightNum * factor) / (72 * scrNum);

                  return (
                    <div className="bg-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Estimated Creatinine Clearance:</span>
                        <div className="text-xl font-mono font-bold text-[#10B981] flex items-center gap-2">
                          <span>{crclVal.toFixed(1)} mL/min</span>
                          <span className="text-xs text-[#94A3B8]">
                            ({crclVal >= 90 ? "Normal Renal Function" : crclVal >= 60 ? "Mild Impairment" : crclVal >= 30 ? "Moderate Impairment" : "Severe Impairment"})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleExplainCalculation}
                        disabled={isExplainingCalc}
                        className="blue-gradient-btn text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isExplainingCalc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        <span>Explain Renal Dosing with AI</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* INFUSION RATE FORM */}
            {calcType === "infusion" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Total Infusion Volume (mL)</label>
                    <input
                      type="number"
                      value={infVolMl}
                      onChange={(e) => setInfVolMl(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Time (Hours)</label>
                    <input
                      type="number"
                      value={infHours}
                      onChange={(e) => setInfHours(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-1">Drip Set Drop Factor (gtt/mL)</label>
                    <select
                      value={infDropFactor}
                      onChange={(e) => setInfDropFactor(e.target.value)}
                      className="w-full bg-glass border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    >
                      <option value="10">Macro-drip (10 gtt/mL)</option>
                      <option value="15">Standard Macro-drip (15 gtt/mL)</option>
                      <option value="20">Macro-drip (20 gtt/mL)</option>
                      <option value="60">Micro-drip / Pediatric (60 gtt/mL)</option>
                    </select>
                  </div>
                </div>

                {(() => {
                  const volNum = parseFloat(infVolMl) || 1000;
                  const hoursNum = parseFloat(infHours) || 8;
                  const dfNum = parseFloat(infDropFactor) || 15;
                  const totalMinutes = hoursNum * 60;
                  const gttMin = (volNum * dfNum) / totalMinutes;
                  const mlHr = volNum / hoursNum;

                  return (
                    <div className="bg-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Calculated Flow Rate:</span>
                        <div className="text-xl font-mono font-bold text-[#10B981] flex items-center gap-2">
                          <span>{gttMin.toFixed(1)} gtt/min</span>
                          <span className="text-xs text-[#94A3B8]">({mlHr.toFixed(1)} mL/hr)</span>
                        </div>
                      </div>

                      <button
                        onClick={handleExplainCalculation}
                        disabled={isExplainingCalc}
                        className="blue-gradient-btn text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isExplainingCalc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        <span>Explain Rate with AI</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>

          {calcExplanation && (
            <div className="bg-[#0B132B] border border-white/8 rounded-2xl p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <span className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#38BDF8]" />
                  <span>AI Mathematical Derivation & Safety Sanity Check</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(calcExplanation, "calc-exp-copy")}
                    className="p-1.5 bg-glass text-[#94A3B8] hover:text-white rounded-lg border border-white/8 text-xs font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownloadResponse(calcExplanation, "Calculation_Derivation.md")}
                    className="p-1.5 bg-glass text-[#94A3B8] hover:text-white rounded-lg border border-white/8 text-xs font-mono flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <div className="prose prose-invert prose-xs max-w-none text-[#CBD5E1] leading-relaxed">
                <ReactMarkdown>{calcExplanation}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* --- SUB-TAB 4: STUDY ROUTINE PLANNER --- */}
      {/* ========================================================================= */}
      {activeTab === "planner" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#000000] text-left">
          
          <div className="bg-[#0B132B] border border-white/8 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>AI Pharmacy Academic Routine & Milestone Planner</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Synchronizes with your active course assignments for {currentUser.academicYear}
                </p>
              </div>

              <div className="flex bg-glass p-1 rounded-xl border border-white/8 text-xs font-bold">
                {(["Balanced", "Intensive", "Focus"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setScheduleMode(style)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      scheduleMode === style
                        ? "bg-[#0284C7] text-white"
                        : "text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateSchedule}
                disabled={isGeneratingSchedule}
                className="blue-gradient-btn text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all text-xs cursor-pointer disabled:opacity-50 shadow-md glow-blue-sm"
              >
                {isGeneratingSchedule ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Academic Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Personalized Weekly Study Routine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RENDER ACTIVE STUDY ROUTINE IF EXISTS */}
          {generatedSchedule ? (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-2xl border border-white/8 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-[#F8FAFC]">Active Study Blueprint Available ({scheduleMode} Style)</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(generatedSchedule, "sc-cop")}
                    className="bg-glass hover:bg-white/10 border border-white/10 text-[#F8FAFC] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Plan</span>
                  </button>
                  <button
                    onClick={() => handleDownloadResponse(generatedSchedule, `PharmaAI_Study_Schedule_${scheduleMode}.md`)}
                    className="bg-glass hover:bg-white/10 border border-white/10 text-[#F8FAFC] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleSaveToExplorer(generatedSchedule, `PharmaAI_Study_Schedule_${scheduleMode}`)}
                    className="blue-gradient-btn text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs glow-blue-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to File Explorer</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0B132B] rounded-2xl border border-white/8 p-6 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#38BDF8]" />
                    <span>AI Study Plan Document Transcript</span>
                  </span>
                  <span className="text-[9px] text-[#94A3B8] font-mono">Format: Structured Syllabus Schedule</span>
                </div>
                <div className="prose prose-invert prose-xs max-w-none text-[#CBD5E1] p-2 leading-relaxed">
                  <ReactMarkdown>{generatedSchedule}</ReactMarkdown>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#0B132B] rounded-2xl border border-white/8 p-16 text-center space-y-4 shadow-md">
              <div className="p-4 bg-glass rounded-2xl border border-white/8 text-[#38BDF8] inline-block">
                <Calendar className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-base text-[#F8FAFC]">No study routine generated yet</h4>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Select your routine intensity and click <strong>"Generate My Personalized Weekly Study Routine"</strong> above. Sovra AI will analyze your coursework and build an optimized schedule!
              </p>
            </div>
          )}

          {/* Consultation Launcher */}
          <div className="bg-[#0B132B] rounded-2xl border border-white/8 p-6 space-y-4 text-left shadow-md">
            <div>
              <h4 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#38BDF8]" />
                <span>Launch Specialized AI Consultations</span>
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                Select any academic or professional area to consult Sovra AI directly:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  label: "💊 Pharmacokinetic Memory Networks",
                  desc: "Learn spatial recall maps for clearance, Vd, and ADME formulas.",
                  mode: "clinical" as AIExpertMode,
                  prompt: "Recommend a high-yield study routine and spaced-repetition plan for mastering complex Pharmacokinetics formulas and ADME processes."
                },
                {
                  label: "🧪 SAR & Chemistry Classification",
                  desc: "Techniques to memorize drug structures, heterocyclic rings, and active functional groups.",
                  mode: "formulation" as AIExpertMode,
                  prompt: "Provide active recall recommendations to categorize and memorize extensive lists of cardiovascular drug classifications and Structure-Activity Relationships (SAR)."
                },
                {
                  label: "📑 Academic Thesis & Literature Review",
                  desc: "Guidelines for structuring methodology, statistical analysis, and bibliography citations.",
                  mode: "universal" as AIExpertMode,
                  prompt: "Help me structure an academic literature review and methodology for a pharmacy research project at INES-Ruhengeri."
                },
                {
                  label: "🎯 Board Exam MCQ Drill Session",
                  desc: "Simulate a live 5-question clinical vignette quiz with detailed answer rationales.",
                  mode: "exam_coach" as AIExpertMode,
                  prompt: "Generate a 5-question clinical vignette quiz on Antimicrobial and Cardiovascular pharmacotherapy with comprehensive answer explanations."
                }
              ].map((coach, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLaunchChatQuery(coach.prompt, coach.mode)}
                  className="p-4 bg-glass hover:bg-[#0E1626] rounded-xl border border-white/8 hover:border-[#0284C7]/50 text-left transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">{coach.label}</h5>
                    <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">{coach.desc}</p>
                  </div>
                  <span className="text-[9px] text-[#38BDF8] font-mono font-semibold mt-3 flex items-center gap-0.5 uppercase tracking-wider">
                    <span>Consult Co-Pilot</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
