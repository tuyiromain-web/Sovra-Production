/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstitutionTenant, FacultyDocument, AcademicProgram, VaultResource, StudentCohort } from "./workspaceTypes";

export const INSTITUTION_TENANTS: InstitutionTenant[] = [
  {
    id: "tenant-stjude",
    name: "St. Jude Technical University",
    code: "SJTU",
    domain: "sjtu.edu",
    accreditationBody: "National Accreditation Council & ABET",
    isolatedPartitionKey: "sec_prt_sjtu_091a7f92",
    totalStudents: "3,480",
    activeFaculty: "184",
    facultyDocsCount: "612",
    coverageMetric: "98.4%",
    term: "Spring Semester 2026"
  },
  {
    id: "tenant-ines",
    name: "INES-Ruhengeri Applied Sciences",
    code: "INES",
    domain: "ines.ac.rw",
    accreditationBody: "Higher Education Council (HEC)",
    isolatedPartitionKey: "sec_prt_ines_88f2a014",
    totalStudents: "2,490",
    activeFaculty: "142",
    facultyDocsCount: "524",
    coverageMetric: "99.1%",
    term: "Academic Year 2025/2026"
  },
  {
    id: "tenant-kcs",
    name: "Kigali College of Science",
    code: "KCS",
    domain: "kcs.ac.rw",
    accreditationBody: "East African Inter-University Council (IUCEA)",
    isolatedPartitionKey: "sec_prt_kcs_77b3c198",
    totalStudents: "1,850",
    activeFaculty: "96",
    facultyDocsCount: "380",
    coverageMetric: "97.8%",
    term: "Trimester II 2026"
  },
  {
    id: "tenant-ahm",
    name: "Academy of Health & Medicine",
    code: "AHM",
    domain: "ahm.edu.rw",
    accreditationBody: "Medical and Dental Council Accreditation",
    isolatedPartitionKey: "sec_prt_ahm_99d1e441",
    totalStudents: "940",
    activeFaculty: "68",
    facultyDocsCount: "295",
    coverageMetric: "100.0%",
    term: "Clinical Cycle 2026"
  }
];

export const INITIAL_DOCUMENTS: Record<string, FacultyDocument[]> = {
  "tenant-stjude": [
    {
      id: "doc-sjtu-01",
      title: "Advanced Autonomous Robotics Syllabus",
      code: "ROB-401",
      programId: "prog-sjtu-robotics",
      programName: "Robotics & Mechatronics",
      category: "Syllabus",
      version: "v3.2",
      author: "Prof. Arthur Vance",
      authorRole: "Chair of Mechatronics",
      status: "Verified",
      updatedAt: "2026-03-02",
      summary: "Comprehensive laboratory syllabus covering inverse kinematics, sensor fusion with Kalman filters, ROS2 navigation stack, and embedded edge inferencing.",
      learningObjectives: [
        "Formulate forward and inverse kinematic models for 6-DOF manipulators",
        "Implement extended Kalman filtering for IMU and LiDAR odometry",
        "Deploy deterministic ROS2 nodes with real-time Linux priority"
      ],
      creditHours: 4,
      prerequisites: ["MATH-240 (Linear Algebra)", "ENG-210 (Dynamic Systems)"],
      accreditationAlignment: "ABET Criterion 3 (Complex Engineering Problems)",
      fileSize: "2.4 MB",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: "doc-sjtu-02",
      title: "Distributed Fault-Tolerant Consensus Protocol Audit",
      code: "CS-520",
      programId: "prog-sjtu-cs",
      programName: "Computer Science & Systems",
      category: "Accreditation Record",
      version: "v2.0",
      author: "Dr. Elena Rostova",
      authorRole: "Director of Systems Research",
      status: "Verified",
      updatedAt: "2026-02-18",
      summary: "Formal verification suite and accreditation compliance review for graduate distributed systems course modules, covering Paxos, Raft, and Byzantine Fault Tolerance.",
      learningObjectives: [
        "Prove safety and liveness invariants in leader-based consensus",
        "Analyze network partition recovery under asynchronous network models",
        "Verify TLA+ specification models against real state-machine implementations"
      ],
      creditHours: 3,
      prerequisites: ["CS-310 (Operating Systems)", "CS-330 (Algorithms)"],
      accreditationAlignment: "ACM/IEEE CS2023 Curriculum Standards (Systems)",
      fileSize: "4.8 MB",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
    },
    {
      id: "doc-sjtu-03",
      title: "Biomedical Signal Processing & Neural Interfaces",
      code: "BIO-415",
      programId: "prog-sjtu-bio",
      programName: "Biomedical Engineering",
      category: "Curriculum Framework",
      version: "v1.4",
      author: "Dr. Marcus Thorne",
      authorRole: "Associate Professor of Bioengineering",
      status: "Under Review",
      updatedAt: "2026-03-09",
      summary: "Curriculum framework for non-invasive electroencephalogram (EEG) signal acquisition, wavelet transform filtering, and real-time prosthesis actuation.",
      learningObjectives: [
        "Design active analog filtering stages with 120 dB common-mode rejection",
        "Extract spectral power features via discrete wavelet transforms",
        "Evaluate latency and classification accuracy in closed-loop motor decoders"
      ],
      creditHours: 4,
      prerequisites: ["ELEC-301 (Signals & Systems)", "BIO-200 (Physiology)"],
      accreditationAlignment: "ABET Bioengineering Specific Program Criteria",
      fileSize: "3.1 MB",
      hash: "cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860"
    },
    {
      id: "doc-sjtu-04",
      title: "High-Performance Semiconductor Devices Packet",
      code: "ECE-380",
      programId: "prog-sjtu-ece",
      programName: "Electrical & Computer Engineering",
      category: "Lecture Packet",
      version: "v4.1",
      author: "Prof. Sarah Sterling",
      authorRole: "Dean of Electrical Engineering",
      status: "Verified",
      updatedAt: "2026-01-24",
      summary: "Complete lecture compendium and laboratory problem sets on FinFET electrostatics, gate dielectric tunneling, and wide bandgap silicon carbide power converters.",
      learningObjectives: [
        "Model drain-induced barrier lowering (DIBL) in sub-7nm architectures",
        "Calculate thermal dissipation thresholds in high-power GaN switches",
        "Fabricate and characterize MOS capacitance-voltage curves in cleanroom"
      ],
      creditHours: 4,
      prerequisites: ["PHYS-210 (Solid State Physics)", "ECE-220 (Circuits)"],
      accreditationAlignment: "ABET Engineering Accreditation Commission EAC-2025",
      fileSize: "6.7 MB",
      hash: "1b8f40251c142c38f4924294a5e2f38992144b62f55963c6d66e5797d3910381"
    }
  ],
  "tenant-ines": [
    {
      id: "doc-ines-01",
      title: "Applied Pharmacology & Clinical Dosage Modeling",
      code: "PHA-301",
      programId: "prog-ines-pharma",
      programName: "Applied Pharmacology",
      category: "Syllabus",
      version: "v2.8",
      author: "Dr. Emmanuel Mutangana",
      authorRole: "Head of Pharmacology Department",
      status: "Verified",
      updatedAt: "2026-03-05",
      summary: "Core accredited syllabus for two-compartment pharmacokinetic models, hepatic clearance kinetics, therapeutic drug monitoring, and pediatric safety indices.",
      learningObjectives: [
        "Calculate apparent volume of distribution and elimination rate constants",
        "Formulate multi-dose IV infusion regimens with peak-trough constraints",
        "Evaluate pharmacogenomic polymorphisms influencing CYP2D6 metabolism"
      ],
      creditHours: 5,
      prerequisites: ["CHEM-202 (Organic Chemistry)", "BIOL-210 (Biochemistry)"],
      accreditationAlignment: "Rwanda Higher Education Council (HEC) Medical Benchmark",
      fileSize: "3.8 MB",
      hash: "a4f2c921501d5a7d79b94decfeb4899c75bf67b848bb2909477bcf4d17f7d142"
    },
    {
      id: "doc-ines-02",
      title: "Geotechnical Infrastructure & Seismic Assessment",
      code: "CIV-402",
      programId: "prog-ines-civil",
      programName: "Civil & Environmental Engineering",
      category: "Curriculum Framework",
      version: "v3.0",
      author: "Eng. Diane Mukamana",
      authorRole: "Senior Lecturer in Geotechnics",
      status: "Verified",
      updatedAt: "2026-02-12",
      summary: "Curriculum specifications for slope stability analysis in volcanic soils, deep foundation load capacities, and seismic liquefaction risk mitigation.",
      learningObjectives: [
        "Execute Bishop and Morgenstern-Price slope stability limit equilibrium calculations",
        "Design bored concrete cast-in-situ piles with lateral soil resistance",
        "Analyze spectral acceleration responses according to Eurocode 8 standards"
      ],
      creditHours: 4,
      prerequisites: ["CIV-301 (Soil Mechanics)", "MATH-310 (Numerical Analysis)"],
      accreditationAlignment: "Institution of Engineers Rwanda (IER) Certified Standards",
      fileSize: "5.2 MB",
      hash: "f71c271822830f6d6db2f7ebce7ef21a5925b65ff771a4a496f86c230f653f5a"
    }
  ]
};

export const INITIAL_PROGRAMS: Record<string, AcademicProgram[]> = {
  "tenant-stjude": [
    {
      id: "prog-sjtu-robotics",
      name: "Robotics & Mechatronics",
      code: "ROB",
      department: "Faculty of Applied Engineering",
      dean: "Prof. Arthur Vance",
      degreeType: "Bachelor of Science (Honors)",
      duration: "4 Years",
      enrolledStudents: 480,
      totalModules: 32,
      documentationCoverage: 98.6,
      sharedResourcesCount: 142,
      accessTier: "Departmental Partition"
    },
    {
      id: "prog-sjtu-cs",
      name: "Computer Science & Systems",
      code: "CS",
      department: "School of Computing & Mathematical Sciences",
      dean: "Dr. Elena Rostova",
      degreeType: "Bachelor of Science",
      duration: "4 Years",
      enrolledStudents: 890,
      totalModules: 40,
      documentationCoverage: 100.0,
      sharedResourcesCount: 228,
      accessTier: "Departmental Partition"
    },
    {
      id: "prog-sjtu-bio",
      name: "Biomedical Engineering",
      code: "BIO",
      department: "Faculty of Health Sciences & Technology",
      dean: "Dr. Marcus Thorne",
      degreeType: "Bachelor of Science (Honors)",
      duration: "4 Years",
      enrolledStudents: 340,
      totalModules: 28,
      documentationCoverage: 96.4,
      sharedResourcesCount: 94,
      accessTier: "Clinical Cross-Listing"
    },
    {
      id: "prog-sjtu-ece",
      name: "Electrical & Computer Engineering",
      code: "ECE",
      department: "Faculty of Applied Engineering",
      dean: "Prof. Sarah Sterling",
      degreeType: "Master of Engineering",
      duration: "2 Years (Graduate)",
      enrolledStudents: 220,
      totalModules: 18,
      documentationCoverage: 98.8,
      sharedResourcesCount: 88,
      accessTier: "Graduate Research Access"
    }
  ],
  "tenant-ines": [
    {
      id: "prog-ines-pharma",
      name: "Applied Pharmacology",
      code: "PHA",
      department: "Faculty of Health & Biological Sciences",
      dean: "Dr. Emmanuel Mutangana",
      degreeType: "Bachelor of Science (Honors)",
      duration: "4 Years",
      enrolledStudents: 420,
      totalModules: 34,
      documentationCoverage: 99.4,
      sharedResourcesCount: 165,
      accessTier: "Clinical Cohort Gated"
    },
    {
      id: "prog-ines-civil",
      name: "Civil & Environmental Engineering",
      code: "CIV",
      department: "Faculty of Applied Fundamental Sciences",
      dean: "Eng. Diane Mukamana",
      degreeType: "Bachelor of Science",
      duration: "4 Years",
      enrolledStudents: 560,
      totalModules: 36,
      documentationCoverage: 98.8,
      sharedResourcesCount: 130,
      accessTier: "Departmental Partition"
    }
  ]
};

export const INITIAL_VAULT_RESOURCES: Record<string, VaultResource[]> = {
  "tenant-stjude": [
    {
      id: "vault-sjtu-01",
      title: "ROS2 Humble Architecture & Manipulation Manual",
      moduleCode: "ROB-401",
      programName: "Robotics & Mechatronics",
      format: "PDF",
      lecturer: "Prof. Arthur Vance",
      downloadsCount: 384,
      fileSize: "8.4 MB",
      hash: "sha256-8a9d...01ef",
      publishedDate: "2026-02-10"
    },
    {
      id: "vault-sjtu-02",
      title: "Byzantine Agreement Protocol Formal Proofs",
      moduleCode: "CS-520",
      programName: "Computer Science & Systems",
      format: "PDF",
      lecturer: "Dr. Elena Rostova",
      downloadsCount: 512,
      fileSize: "3.2 MB",
      hash: "sha256-4b11...99ca",
      publishedDate: "2026-02-28"
    },
    {
      id: "vault-sjtu-03",
      title: "Neural Spike Sorting Laboratory Guide",
      moduleCode: "BIO-415",
      programName: "Biomedical Engineering",
      format: "LAB",
      lecturer: "Dr. Marcus Thorne",
      downloadsCount: 245,
      fileSize: "4.1 MB",
      hash: "sha256-c21f...77ae",
      publishedDate: "2026-03-01"
    },
    {
      id: "vault-sjtu-04",
      title: "FinFET Electrostatics Lecture Slides Pack",
      moduleCode: "ECE-380",
      programName: "Electrical & Computer Engineering",
      format: "SLIDES",
      lecturer: "Prof. Sarah Sterling",
      downloadsCount: 290,
      fileSize: "14.5 MB",
      hash: "sha256-91d4...33fc",
      publishedDate: "2026-01-30"
    }
  ],
  "tenant-ines": [
    {
      id: "vault-ines-01",
      title: "Two-Compartment Pharmacokinetics Calculation Sheets",
      moduleCode: "PHA-301",
      programName: "Applied Pharmacology",
      format: "DOCX",
      lecturer: "Dr. Emmanuel Mutangana",
      downloadsCount: 410,
      fileSize: "2.1 MB",
      hash: "sha256-66af...02eb",
      publishedDate: "2026-02-14"
    },
    {
      id: "vault-ines-02",
      title: "Volcanic Ash Soil Shear Strength Triaxial Data",
      moduleCode: "CIV-402",
      programName: "Civil & Environmental Engineering",
      format: "LAB",
      lecturer: "Eng. Diane Mukamana",
      downloadsCount: 320,
      fileSize: "6.8 MB",
      hash: "sha256-77d1...99bc",
      publishedDate: "2026-02-20"
    }
  ]
};

export const INITIAL_STUDENT_COHORTS: Record<string, StudentCohort[]> = {
  "tenant-stjude": [
    {
      id: "cohort-sjtu-rob-y4",
      cohortCode: "ROB-2022-Y4",
      program: "Robotics & Mechatronics",
      year: "Year 4 (Senior Clinical/Lab)",
      studentCount: 114,
      representative: "Liam O'Connor",
      attendanceRate: "97.4%",
      lastActive: "Today at 14:20"
    },
    {
      id: "cohort-sjtu-cs-y3",
      cohortCode: "CS-2023-Y3",
      program: "Computer Science & Systems",
      year: "Year 3 (Core Distributed Systems)",
      studentCount: 245,
      representative: "Maya Chen",
      attendanceRate: "98.9%",
      lastActive: "Today at 15:45"
    },
    {
      id: "cohort-sjtu-bio-y2",
      cohortCode: "BIO-2024-Y2",
      program: "Biomedical Engineering",
      year: "Year 2 (Signal Processing Track)",
      studentCount: 92,
      representative: "David Adebayo",
      attendanceRate: "96.2%",
      lastActive: "Yesterday at 17:10"
    }
  ],
  "tenant-ines": [
    {
      id: "cohort-ines-pha-y3",
      cohortCode: "PHA-2023-Y3",
      program: "Applied Pharmacology",
      year: "Year 3 (Clinical Kinetics)",
      studentCount: 130,
      representative: "Jean de Dieu Nshimiyimana",
      attendanceRate: "99.2%",
      lastActive: "Today at 16:10"
    },
    {
      id: "cohort-ines-civ-y4",
      cohortCode: "CIV-2022-Y4",
      program: "Civil & Environmental Engineering",
      year: "Year 4 (Geotechnical Design)",
      studentCount: 140,
      representative: "Aline Uwase",
      attendanceRate: "98.1%",
      lastActive: "Today at 13:30"
    }
  ]
};
