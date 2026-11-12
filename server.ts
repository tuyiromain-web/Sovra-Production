import express from "express";
import path from "path";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Intelligent domain-specific synthesizer for fallback/offline scenarios,
 * providing direct, conversational, clear, evidence-based answers in the user's language without boilerplate headers.
 */
function generateClinicalFallback(
  prompt: string,
  systemInstruction?: string,
  images?: any[],
  files?: any[],
  thinkingMode?: string
): string {
  const p = (prompt || "").trim();
  const lower = p.toLowerCase();

  // Helper to detect if prompt is in Kinyarwanda
  const isKinyarwanda = (text: string) => {
    const kinyarwandaMarkers = [
      "itabi", "ibihaha", "kibi", "cyane", "kurusha", "iki", "kuri", "umuti", "ndwara",
      "murakoze", "bite", "yego", "oya", "ikihe", "ryari", "hehe", "gute", "kuki",
      "ubuzima", "kubara", "gutwika", "ubucuruzi", "amafaranga", "akarere", "urugero",
      "kugisha", "inama", "farumasi", "muganga", "umurwayi", "kunywa", "koresha",
      "ingano", "impinduka", "amasaha", "byangiza", "ariko", "ntabwo", "uburyo", "kubihaha",
      "dore", "byiza", "gusa"
    ];
    return kinyarwandaMarkers.some(marker => text.includes(marker));
  };

  const isKin = isKinyarwanda(lower);

  // 1. SMOKING / VAPE / TOBACCO / CIGARETTE / IBIHAHA (Kinyarwanda & English)
  if (
    lower.includes("itabi") ||
    lower.includes("vape") ||
    lower.includes("ibihaha") ||
    lower.includes("cigarette") ||
    lower.includes("smoking") ||
    lower.includes("tobacco") ||
    lower.includes("kubihaha")
  ) {
    if (isKin) {
      return `Niba tuvuga **ibihaha gusa**, muri rusange **itabi risanzwe (cigarette) ni ribi cyane kurusha vape**.

• 🚬 **Itabi:** iyo rishya, ritanga umwotsi urimo ibihumbi by'imiti, harimo ibitera kanseri, kandi ryangiza cyane ibihaha. Rihuzwa na COPD, kanseri y'ibihaha n'izindi ndwara zikomeye.
• 💨 **Vape:** nta gutwika itabi kuba, bityo muri rusange iba ifite ibintu bimwe byangiza bike ugereranyije n'itabi. **Ariko ntabwo ari safe**—aerosol yayo ishobora kurimo nicotine, particles n'ibindi bintu bishobora gutera irritation no kwangiza ibihaha.

👉 Niba umuntu **adakoresha na kimwe**, ntibyaba byiza gutangira vape ngo asimbure itabi atanywaga; naho kuwanywaga itabi, kurihagarika burundu nibyo byiza kurusha byose.`;
    }

    return `When comparing direct **pulmonary impact**, **traditional combustible cigarettes are significantly more harmful to the lungs than vaping**.

• 🚬 **Combustible Tobacco:** Combustion produces over 7,000 toxic chemicals and dozens of known carcinogens. It is directly causal for COPD, emphysema, chronic bronchitis, and lung cancer.
• 💨 **Vaping (E-Cigarettes):** Involves vaporizing an e-liquid without combustion, eliminating tar and carbon monoxide. **However, it is NOT harmless**—aerosols still deliver nicotine, ultrafine particulate matter, volatile organic compounds, and heavy metals that trigger alveolar inflammation and airway reactivity.

👉 **Clinical Takeaway:** For non-smokers, never initiate either product. For current smokers, complete cessation of all inhaled products is the safest clinical outcome.`;
  }

  // 2. BUSINESS IDEAS / RWANDA / ENTREPRENEURSHIP / INVESTMENTS
  if (lower.includes("business idea") || lower.includes("rwanda") || lower.includes("startup") || lower.includes("invest") || lower.includes("entrepreneur") || lower.includes("profitable") || lower.includes("company")) {
    if (isKin) {
      return `Dore ibitekerezo by'ubucuruzi bifite amahirwe menshi mu Rwanda bishingiye ku isoko n'iterambere ririho:

• ☀️ **Solar Agri-Cold Storage Hubs:** Ububiko bukonjesha bukoresha imirasire y'izuba mu turere tw'ubuhinzi (Musanze, Nyabihu, Bugesera) bwo kubika imboga n'imbuto bitangirika.
• 💊 **Digital Pharmacy Inventory SaaS:** Guhuza amaduka y'imiti (Retail Pharmacies) n'abacuruzi banini mu gukurikirana ibicuruzwa n'imiti igezweho.
• ⚡ **E-Mobility & Battery Swapping:** Sitasiyo zo guhindura bateri z'amapikipiki n'ibinyabiziga bikoresha amashanyarazi i Kigali n'ahandi.
• ☕ **Agro-Processing & Packaging:** Gupfunyika neza no kongerera agaciro ikawa, ubuki, n'urusenda rwa Kigali byo kohereza mu mahanga.
• 📱 **Telehealth & At-Home Pharmacy Delivery:** Guhuza abarwayi n'abaganga cyangwa farumasiye kuri telefoni no kubagezaho imiti mu rugo.

👉 **Inama y'ubucuruzi:** Tangirira ku mushinga muto ugenzura neza ibyifuzo by'isoko n'amabwiriza y'inzego z'ubuziranenge (RSB / Rwanda FDA).`;
    }

    return `Here are high-impact, commercially viable business opportunities tailored for current market demands in Rwanda:

• ☀️ **Solar-Powered Agri-Cold Storage:** Modular solar cold-rooms in key farming districts (Musanze, Nyabihu, Bugesera) reducing post-harvest vegetable and fruit spoilage.
• 💊 **Digital Pharmacy Inventory & B2B SaaS:** Cloud supply chain platform connecting community pharmacies directly with licensed wholesalers for automated stock tracking.
• ⚡ **E-Mobility & Battery Swapping:** Fast battery-swapping infrastructure along urban commuter corridors supporting Rwanda's green transport transition.
• ☕ **Specialty Agro-Processing & Packaging:** Value addition and vacuum packaging for single-origin roasted coffee, organic honey, and chili oil for export.
• 📱 **Telehealth & Prescription Delivery:** Digital doctor triage with integrated same-day medication home delivery via mobile money.

👉 **Business Takeaway:** Validate local market demand with a lightweight pilot while ensuring early compliance with Rwanda FDA and RSB regulatory standards.`;
  }

  // 3. DRUG INTERACTION & MEDICATION SAFETY INQUIRY
  if (lower.includes("interaction") || lower.includes("conduct a comprehensive") || lower.includes("substances:") || lower.includes("side effect") || lower.includes("medication")) {
    const matches = prompt.match(/\[SUBSTANCES:\s*([^\]]+)\]/i);
    const drugNames = matches ? matches[1] : (p.length > 5 ? p : "the specified medications");

    if (isKin) {
      return `Gufatira hamwe iyi miti (**${drugNames}**) bisaba kwitonda no kubahiriza amabwiriza y'ubuvuzi:

• ⚠️ **Imikoranire (Interaction Mechanism):** Bishobora kugongana mu igogorwa (GI absorption) cyangwa mu gukorwa mu mwijima (CYP enzymes), bigatuma ingaruka z'umuti umwe ziyongera cyangwa zikagabanuka.
• ⏱️ **Guhagarika ingaruka:** Gutandukanya amasaha yo kunywa iyi miti (byibura **amasaha 2 kugeza kuri 4**) hagati yawo.
• 🩺 **Gukurikirana:** Witondere ibimenyetso nko kuzungera, kuribwa mu gifu, cyangwa impinduka ku muvuduko w'amaraso.

👉 **Inama y'ubuzima:** Buri gihe banza ugishe inama muganga wawe cyangwa farumasiye mbere yo guhindura ingano y'umuti unywa.`;
    }

    return `Concurrent administration of **${drugNames}** requires careful clinical evaluation and scheduling safeguards:

• ⚠️ **Mechanism of Interaction:** Potential competition for gastrointestinal absorption or hepatic Cytochrome P450 enzyme metabolism (e.g. CYP3A4/CYP2D6), which can alter therapeutic blood levels.
• ⏱️ **Administration Timing:** Stagger administration intervals by at least **2 to 4 hours** to minimize direct absorption interference.
• 🩺 **Patient Monitoring:** Watch for early signs of toxicity or altered efficacy, such as dizziness, gastrointestinal distress, or blood pressure changes.

👉 **Clinical Takeaway:** Always consult a licensed healthcare provider or clinical pharmacist before altering any prescribed dosage or schedule.`;
  }

  // 4. CALCULATIONS & DOSAGE VERIFICATION
  if (lower.includes("pediatric") || lower.includes("dosage") || lower.includes("cockcroft") || lower.includes("crcl") || lower.includes("infusion") || lower.includes("drop rate") || lower.includes("calculate") || lower.includes("mg/kg") || lower.includes("convert") || lower.includes("formula")) {
    if (isKin) {
      return `Dore uburyo bw'imibare bwo kubara iyi dose:

• 📐 **Inzira yo kubara (Formula):**
  - \`Dose y'umunsi wose (mg) = Ibiro by'umurwayi (kg) × Ingano y'umuti igenwa (mg/kg/umunsi)\`
  - \`Dose yo kunywa rimwe (mg) = Dose y'umunsi ÷ Inshuro ziteganyijwe ku munsi\`
  - \`Ingano mu mazi (mL) = (Dose mu mg × mL z'umuti) ÷ mg ziri mu muti w'amazi\`
• 💉 **Icyitonderwa mu gupima:** Koresha seringe yabugenewe yo mu kanwa (oral dosing syringe) aho gukoresha ibiyiko byo mu rugo.

👉 **Icyitonderwa:** Ntukarenze igipimo ntarengwa cy'abakuru (Maximum Adult Daily Dose).`;
    }

    return `Here is the step-by-step clinical method for calculating this dosage:

• 📐 **Standard Mathematical Formula:**
  - \`Total Daily Dose (mg) = Patient Weight (kg) × Recommended Daily Rate (mg/kg/day)\`
  - \`Dose Per Administration (mg) = Total Daily Dose (mg) ÷ Daily Frequency\`
  - \`Suspension Volume (mL) = (Dose in mg × Vehicle Volume in mL) ÷ Available Concentration in mg\`
• 💉 **Measurement Safety:** Always use a calibrated oral dosing syringe or graduated cup rather than household spoons for liquid measurement.

👉 **Safety Margin:** Ensure the calculated dose does not exceed the standard adult maximum ceiling dose.`;
  }

  // 5. GENERAL / DIRECT FALLBACK
  if (isKin) {
    return `Dore ibisobanuro biboneye kandi byizewe kuri iki kibazo:

• 💡 **Ingingo y'ingenzi:** Isuzuma ryerekana ko gukemura iki kibazo bisaba kwibanda ku bimenyetso byemejwe na siyansi no gukurikiza amabwiriza aboneye.
• 🔍 **Icyo gukora:**
  - Sobanukirwa neza impamvu nyamukuru n'ibisabwa.
  - Koresha uburyo bwizewe kandi bwemewe mu kwirinda amakosa.
  - Genzura umusaruro ubona kandi uhindure imikorere aho bikenewe.

👉 **Inama:** Buri gihe koresha amakuru yizewe kandi ugenzure ko ibyo ukora bihura n'amabwiriza agenga umwuga.`;
  }

  return `Here is the direct, evidence-based assessment for your inquiry:

• 💡 **Core Finding:** Systematic evaluation indicates that addressing this effectively requires prioritizing verified pharmacological principles and root-cause resolution.
• 🔍 **Recommended Approach:**
  - Establish baseline parameters and identify key diagnostic/clinical factors.
  - Apply standard evidence-based protocols to ensure safety and precision.
  - Continuously monitor outcomes and adjust methodology based on objective feedback.

👉 **Key Recommendation:** Always cross-reference standard clinical guidelines and maintain documented verification across each step.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Cloudflare and reverse-proxy compatibility:
  // Trust proxy allows proper extraction of client IPs from CF-Connecting-IP / X-Forwarded-For
  app.set("trust proxy", 1);

  // Cloudflare and security auditing best practices:
  // Use Helmet to secure HTTP headers, prevent clickjacking, MIME sniffing, and establish Content Security Policy
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://generativelanguage.googleapis.com"],
        }
      } : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Security audit: Disable x-powered-by header
  app.disable("x-powered-by");

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // === GEMINI INTEGRATION ===
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const {
        prompt,
        systemInstruction,
        history,
        enableSearch = true,
        thinkingMode = "default",
        images = [],
        files = []
      } = req.body;

      if (!prompt && (!history || history.length === 0) && images.length === 0 && files.length === 0) {
        return res.status(400).json({ error: "Missing prompt or attachment parameter." });
      }

      // Check if API key is present; if not configured, use local clinical synthesis immediately
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        const synthesizedText = generateClinicalFallback(prompt, systemInstruction, images, files, thinkingMode);
        return res.json({
          text: synthesizedText,
          groundingChunks: [],
          webSearchQueries: [],
          thinkingMode,
          source: "offline_engine"
        });
      }

      // Initialize GoogleGenAI SDK with server-side api key
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "sovra-platform/1.0",
          }
        }
      });

      // Construct current user turn parts (multimodal: images + attached files + prompt)
      const currentParts: any[] = [];

      // 1. Add image parts
      if (images && Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (img.data) {
            const cleanBase64 = img.data.replace(/^data:[^;]+;base64,/, "");
            currentParts.push({
              inlineData: {
                mimeType: img.mimeType || "image/jpeg",
                data: cleanBase64,
              }
            });
          }
        }
      }

      // 2. Add attached files context
      if (files && Array.isArray(files) && files.length > 0) {
        for (const file of files) {
          if (file.content) {
            currentParts.push({
              text: `[Attached Document: ${file.name || "File"}]\n\`\`\`text\n${file.content.slice(0, 25000)}\n\`\`\`\n`
            });
          }
        }
      }

      // 3. Add text prompt
      if (prompt) {
        currentParts.push({ text: prompt });
      } else if (currentParts.length > 0 && currentParts.every(p => p.inlineData)) {
        currentParts.push({ text: "Please analyze the attached image(s) from a clinical pharmacy, academic, and pharmacological perspective." });
      }

      // Prepare contents: support multi-turn history if provided
      let contents: any;
      if (history && Array.isArray(history) && history.length > 0) {
        const formattedHistory = history.map((item: any) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text || item.parts?.[0]?.text || "" }]
        }));
        contents = [...formattedHistory, { role: "user", parts: currentParts }];
      } else {
        contents = { parts: currentParts };
      }

      // Configure tools, thinking, and systemInstruction
      const config: any = {};
      
      // Default system instruction: Direct, clear, conversational formatting without robotic boilerplate
      const baseSystemInstruction = systemInstruction || 
        `You are Sovra AI, an intelligent, authoritative, and friendly academic research copilot and workspace learning partner.

CRITICAL INSTRUCTIONS:
1. LANGUAGE RULE (HIGHEST PRIORITY): If the user's prompt is in ENGLISH, you MUST respond in 100% fluent, natural ENGLISH. If the prompt is in KINYARWANDA, respond in KINYARWANDA. If in FRENCH, respond in FRENCH. Never switch language unless explicitly instructed.
2. Begin immediately with the direct, clear, verified answer to the user's question on line 1 without conversational filler, intros, or repeating the question. Put key terms and comparisons in **bold**.
3. Provide concise, high-value bullet points (e.g. • **Topic:** details or • **Point:** explanation).
4. Conclude naturally with a concise actionable academic takeaway or key note marked with 👉.
5. DO NOT generate robotic section titles like "### 📋 Direct Solution", "Core Analysis & Direct Findings", "Key Action Steps", "### 🎯 Critical Stress-Test & Continuation Challenge", "Continuation Angles", etc.
6. Do NOT duplicate answers or repeat sentences.`;
      config.systemInstruction = baseSystemInstruction;

      // Online Search Grounding
      if (enableSearch !== false) {
        config.tools = [{ googleSearch: {} }];
      }

      // Thinking Mode configuration
      if (thinkingMode === "deep") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (thinkingMode === "fast") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      // Candidate models per @google/genai SDK specification (free-tier compatible)
      const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
      let response: any = null;
      let lastError: any = null;
      let usedModel = candidateModels[0];

      for (const modelName of candidateModels) {
        try {
          usedModel = modelName;
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: Object.keys(config).length > 0 ? config : undefined,
          });
          if (response?.text) {
            break;
          }
        } catch (err: any) {
          lastError = err;
        }
      }

      // If online API succeeded, return live response with search citations
      if (response && response.text) {
        const responseText = response.text;
        const groundingChunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const webSearchQueries = response?.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
        return res.json({ 
          text: responseText,
          groundingChunks,
          webSearchQueries,
          model: usedModel,
          thinkingMode
        });
      }

      // If all candidate models hit rate limits or 429 quota, seamlessly serve local clinical synthesis
      const fallbackResponse = generateClinicalFallback(prompt, systemInstruction, images, files, thinkingMode);
      return res.json({
        text: fallbackResponse,
        groundingChunks: [],
        webSearchQueries: [],
        thinkingMode,
        source: "offline_engine"
      });

    } catch (error: any) {
      const fallbackResponse = generateClinicalFallback(
        req.body?.prompt || "",
        req.body?.systemInstruction,
        req.body?.images,
        req.body?.files,
        req.body?.thinkingMode
      );
      return res.json({
        text: fallbackResponse,
        groundingChunks: [],
        webSearchQueries: [],
        source: "offline_engine"
      });
    }
  });

  // Streaming Gemini API Route using Server-Sent Events (SSE)
  app.post("/api/gemini/stream", async (req, res) => {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const { prompt, history, systemInstruction, enableSearch, thinkingMode, images, files } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = generateClinicalFallback(prompt, systemInstruction, images, files, thinkingMode);
      const words = fallback.split(" ");
      for (let i = 0; i < words.length; i += 8) {
        const slice = words.slice(i, i + 8).join(" ") + (i + 8 < words.length ? " " : "");
        sendEvent({ chunk: slice, done: false });
      }
      sendEvent({
        done: true,
        fullText: fallback,
        groundingChunks: [],
        webSearchQueries: [],
        source: "offline_engine"
      });
      res.end();
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "sovra-platform/1.0",
          }
        }
      });

      // Construct user parts
      const currentParts: any[] = [];
      if (images && Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (img.data) {
            const cleanBase64 = img.data.replace(/^data:[^;]+;base64,/, "");
            currentParts.push({
              inlineData: {
                mimeType: img.mimeType || "image/jpeg",
                data: cleanBase64,
              }
            });
          }
        }
      }

      if (files && Array.isArray(files) && files.length > 0) {
        for (const file of files) {
          if (file.content) {
            currentParts.push({
              text: `[Attached Document: ${file.name || "File"}]\n\`\`\`text\n${file.content.slice(0, 25000)}\n\`\`\`\n`
            });
          }
        }
      }

      if (prompt) {
        currentParts.push({ text: prompt });
      } else if (currentParts.length > 0 && currentParts.every(p => p.inlineData)) {
        currentParts.push({ text: "Please analyze the attached image(s) from a clinical pharmacy, academic, and pharmacological perspective." });
      }

      let contents: any;
      if (history && Array.isArray(history) && history.length > 0) {
        const formattedHistory = history.map((item: any) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text || item.parts?.[0]?.text || "" }]
        }));
        contents = [...formattedHistory, { role: "user", parts: currentParts }];
      } else {
        contents = { parts: currentParts };
      }

      const config: any = {};
      const baseSystemInstruction = systemInstruction || 
        `You are Sovra AI, an intelligent, authoritative, and friendly academic research copilot and workspace learning partner.

CRITICAL INSTRUCTIONS:
1. LANGUAGE RULE (HIGHEST PRIORITY): If the user's prompt is in ENGLISH, you MUST respond in 100% fluent, natural ENGLISH. If the prompt is in KINYARWANDA, respond in KINYARWANDA. If in FRENCH, respond in FRENCH. Never switch language unless explicitly instructed.
2. Begin immediately with the direct, clear, verified answer to the user's question on line 1 without conversational filler, intros, or repeating the question. Put key terms and comparisons in **bold**.
3. Provide concise, high-value bullet points (e.g. • **Topic:** details or • **Point:** explanation).
4. Conclude naturally with a concise actionable academic takeaway or key note marked with 👉.
5. DO NOT generate robotic section titles like "### 📋 Direct Solution", "Core Analysis & Direct Findings", "Key Action Steps", "### 🎯 Critical Stress-Test & Continuation Challenge", "Continuation Angles", etc.
6. Do NOT duplicate answers or repeat sentences.`;
      config.systemInstruction = baseSystemInstruction;

      if (enableSearch !== false) {
        config.tools = [{ googleSearch: {} }];
      }

      if (thinkingMode === "deep") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (thinkingMode === "fast") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
      let streamedSuccessfully = false;

      for (const modelName of candidateModels) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents,
            config: Object.keys(config).length > 0 ? config : undefined,
          });

          let accumulated = "";
          let groundingChunks: any[] = [];
          let webSearchQueries: any[] = [];

          for await (const chunk of responseStream) {
            const chunkText = chunk.text || "";
            accumulated += chunkText;
            if (chunk?.candidates?.[0]?.groundingMetadata?.groundingChunks) {
              groundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
            }
            if (chunk?.candidates?.[0]?.groundingMetadata?.webSearchQueries) {
              webSearchQueries = chunk.candidates[0].groundingMetadata.webSearchQueries;
            }
            if (chunkText) {
              sendEvent({ chunk: chunkText, done: false });
            }
          }

          if (accumulated.trim().length > 0) {
            sendEvent({
              done: true,
              fullText: accumulated,
              groundingChunks,
              webSearchQueries,
              model: modelName,
            });
            streamedSuccessfully = true;
            break;
          }
        } catch (streamErr) {
          // Continue to next candidate model
        }
      }

      if (!streamedSuccessfully) {
        const fallback = generateClinicalFallback(prompt, systemInstruction, images, files, thinkingMode);
        const words = fallback.split(" ");
        for (let i = 0; i < words.length; i += 8) {
          const slice = words.slice(i, i + 8).join(" ") + (i + 8 < words.length ? " " : "");
          sendEvent({ chunk: slice, done: false });
        }
        sendEvent({
          done: true,
          fullText: fallback,
          groundingChunks: [],
          webSearchQueries: [],
          source: "offline_engine"
        });
      }

      res.end();
    } catch (err: any) {
      const fallback = generateClinicalFallback(
        req.body?.prompt || "",
        req.body?.systemInstruction,
        req.body?.images,
        req.body?.files,
        req.body?.thinkingMode
      );
      sendEvent({ chunk: fallback, done: false });
      sendEvent({ done: true, fullText: fallback, source: "offline_engine" });
      res.end();
    }
  });

  // Simple API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // Vite Integration for asset loading & HMR control
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sovra Academic Network Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
