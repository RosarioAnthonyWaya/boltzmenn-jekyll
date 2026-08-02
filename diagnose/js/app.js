// =========================
// CONFIG: Set your CTA URLs
// =========================
const CTA_URLS = {
  A_SOLUTIONS: "https://boltzmenn.com/solutions",
  B_FINANCE:   "https://boltzmenn.com/finance-clarity",
  C_READINESS: "https://boltzmenn.com/funding-readiness",
  D_SESSION:   "https://boltzmenn.com/strategy-session"
};

// =========================
// LOCAL STORAGE
// =========================
const STORAGE_KEY = "boltzmenn_health_scan_v1";

function saveToLocal(){
  const payload = {
    step: state.step,
    answers: state.answers,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadFromLocal(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed?.answers && typeof parsed.step === "number"){
      state.step = parsed.step;
      state.answers = { ...state.answers, ...parsed.answers };
    }
  }catch(e){
    // ignore corrupt storage
  }
}

function resetLocal(){
  localStorage.removeItem(STORAGE_KEY);
}

// =========================
// STATE
// step: 0..13  (14 total screens)
// 0-12 = questions, 13 = recommendation screen
// =========================
const state = {
  step: 0,
  answers: {
    q1: "", q2: "",
    q3: "", q4: "", q5: "",
    q6: "", q7: "", q8: "",
    q9: "", q10: "", q11: "",
    q12: "", q13: ""
  }
};

// =========================
// DOM
// =========================
const stepLabel      = document.getElementById("stepLabel");
const progressBar    = document.getElementById("progressBar");
const sectionTitleEl = document.getElementById("sectionTitle");
const questionEl     = document.getElementById("question");
const subtextEl      = document.getElementById("subtext");
const stepBody       = document.getElementById("stepBody");
const errorBox       = document.getElementById("errorBox");
const miniNote       = document.getElementById("miniNote");
const backBtn        = document.getElementById("backBtn");
const nextBtn        = document.getElementById("nextBtn");
const resetBtn       = document.getElementById("resetBtn");

// =========================
// HELPERS
// =========================
function showError(msg){
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}
function clearError(){
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function setProgress(stepIndex){
  const total = 14; // includes recommendation page
  const pct = Math.round(((stepIndex + 1) / total) * 100);

  stepLabel.textContent = `${pct}% complete`;
  progressBar.style.width = `${pct}%`;

  backBtn.style.visibility = stepIndex === 0 ? "hidden" : "visible";

  if (stepIndex === 12) nextBtn.textContent = "See Recommendation";
  else if (stepIndex === 13) nextBtn.textContent = "Update Answers";
  else nextBtn.textContent = "Continue";
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function requireAnswered(keys){
  for (const k of keys){
    if (!state.answers[k]) return false;
  }
  return true;
}

function renderChoiceQuestion({key, sectionTitle, title, subtitle, options}){
  sectionTitleEl.textContent = sectionTitle;
  questionEl.textContent = title;
  subtextEl.textContent = subtitle || "";

  stepBody.innerHTML = `<div class="choices" id="choices"></div>`;
  const wrap = stepBody.querySelector("#choices");
  const current = state.answers[key];

  options.forEach(opt => {
    const el = document.createElement("div");
    el.className = "choice";
    el.dataset.value = opt.value;
    if (opt.value === current) el.classList.add("selected");

    el.innerHTML = `
      <div class="left">
        <div class="choice-title">${opt.label}</div>
        ${opt.sub ? `<div class="choice-sub">${opt.sub}</div>` : ``}
      </div>
      ${opt.pill ? `<div class="pill">${opt.pill}</div>` : ``}
    `;

    el.addEventListener("click", ()=>{
      wrap.querySelectorAll(".choice").forEach(c => c.classList.remove("selected"));
      el.classList.add("selected");
      state.answers[key] = opt.value;

      saveToLocal();
      clearError();
    });

    wrap.appendChild(el);
  });
}

// =========================
// SCORING (Your model)
// =========================
function scoreFinancialClarity(a){
  const q3 = ({
    "Yes, clearly": 10, "Rough idea": 5, "Not really": 2, "No": 0
  })[a.q3] ?? 0;

  const q4 = ({
    "Proper accounting software": 10,
    "Spreadsheets": 6,
    "Bank alerts only": 2,
    "I don’t track consistently": 0
  })[a.q4] ?? 0;

  const q5 = ({ "Yes": 10, "Maybe": 5, "No": 0 })[a.q5] ?? 0;

  return q3 + q4 + q5; // /30
}

function scoreSalesConsistency(a){
  const q6 = ({
    "Very predictable": 10,
    "Somewhat predictable": 6,
    "Inconsistent": 2,
    "Completely unpredictable": 0
  })[a.q6] ?? 0;

  const q7 = ({
    "Repeat customers": 5,
    "Referrals": 4,
    "Marketing campaigns": 3,
    "Walk-ins / random": 1
  })[a.q7] ?? 0;

  const q8 = ({
    "Yes, documented": 10,
    "Informal but consistent": 6,
    "In my head": 2,
    "No": 0
  })[a.q8] ?? 0;

  return q6 + q7 + q8; // /25
}

function scoreOperationsAndTeam(a){
  const q9 = ({
    "Can run without me": 10,
    "Needs me occasionally": 6,
    "Needs me daily": 2,
    "Completely depends on me": 0
  })[a.q9] ?? 0;

  const q10 = ({ "Yes": 5, "Somewhat": 3, "No": 0 })[a.q10] ?? 0;
  const q11 = ({ "Rarely": 5, "Sometimes": 3, "Often": 0 })[a.q11] ?? 0;

  return q9 + q10 + q11; // /20
}

function scoreFounderDependencyDerived(a){
  const lowDep  = (a.q9 === "Can run without me");
  const medDep  = (a.q9 === "Needs me occasionally");
  const highDep = (a.q9 === "Needs me daily" || a.q9 === "Completely depends on me");

  const rare  = (a.q11 === "Rarely");
  const some  = (a.q11 === "Sometimes");
  const often = (a.q11 === "Often");

  if (lowDep && rare) return 15;
  if ((medDep && some) || (medDep && rare) || (lowDep && some)) return 8;

  if (highDep) return 0;
  if ((medDep && often) || (lowDep && often)) return 0;

  return 0;
}

function scoreGrowthIntent(a){
  const q12 = ({ "Yes": 5, "Maybe": 3, "No": 1 })[a.q12] ?? 0;
  const q13 = ({ "Yes, clearly": 5, "Rough idea": 3, "No": 0 })[a.q13] ?? 0;
  return q12 + q13; // /10
}

function computeResult(){
  const a = state.answers;

  const financial = scoreFinancialClarity(a);
  const sales     = scoreSalesConsistency(a);
  const ops       = scoreOperationsAndTeam(a);
  const depDer    = scoreFounderDependencyDerived(a);
  const intent    = scoreGrowthIntent(a);

  const total = financial + sales + ops + depDer + intent;

  // Hard stop (enforced from your current 13 questions)
  const hardStops = [];
  if (a.q13 === "No") hardStops.push("NO_USE_OF_FUNDS_PLAN");

  const flags = [];
  if (a.q1 === "Less than 1 year") flags.push("SHORT_HISTORY");

  let band = "";
  if (total <= 39) band = "BAND_1";
  else if (total <= 59) band = "BAND_2";
  else if (total <= 74) band = "BAND_3";
  else band = "BAND_4";

  let message = "";
  let ctaText = "";
  let ctaUrl  = "";

  // Routing precedence: hard stop first
  if (hardStops.includes("NO_USE_OF_FUNDS_PLAN")) {
    message = "Taking funding right now would put your business under pressure. Financial clarity comes first.";
    ctaText = "Prepare for Funding →";
    ctaUrl  = CTA_URLS.B_FINANCE;
  } else if (band === "BAND_1") {
    message = "Your next step isn’t funding or scale. It’s clarity and structure.";
    ctaText = "Book a Strategy Session →";
    ctaUrl  = CTA_URLS.D_SESSION;
  } else if (band === "BAND_2") {
    message = "Your business isn’t broken — but it is unstructured. Fixing systems should come before growth or funding.";
    ctaText = "See How We Fix This →";
    ctaUrl  = CTA_URLS.A_SOLUTIONS;
  } else if (band === "BAND_3") {
    message = "Your business shows signs of readiness, pending deeper checks.";
    ctaText = "Run the Funding Readiness Check →";
    ctaUrl  = CTA_URLS.C_READINESS;
  } else {
    if (flags.includes("SHORT_HISTORY")) {
      message = "Your business looks strong, but we need a deeper readiness check before any capital conversation.";
      ctaText = "Run the Funding Readiness Check →";
      ctaUrl  = CTA_URLS.C_READINESS;
    } else {
      message = "Your business may be ready for structured funding — pending a deeper assessment.";
      ctaText = "Start the Capital Assessment →";
      ctaUrl  = CTA_URLS.C_READINESS; // swap if you create a dedicated capital URL
    }
  }

  return { total, band, message, ctaText, ctaUrl };
}

// =========================
// RENDER STEPS (1 question per page)
// step 0..12 = questions, 13 = recommendation page
// =========================
function renderStep(){
  clearError();
  setProgress(state.step);
  miniNote.textContent = "Your progress is saved automatically.";

  // Recommendation page
  if (state.step === 13){
    const result = computeResult();

    sectionTitleEl.textContent = "Recommendation";
    questionEl.textContent = "Your next best step";
    subtextEl.textContent = "Based on stability signals across finance, sales, operations, and founder dependency.";

    stepBody.innerHTML = `
      <div class="resultBox">
        <div class="resultTitle">What we recommend</div>
        <p class="resultMsg">${escapeHtml(result.message)}</p>
        <a class="cta" href="${result.ctaUrl}">${escapeHtml(result.ctaText)}</a>
        <div class="mini">No scores shown. Just one clear next step.</div>
      </div>
    `;
    return;
  }

  switch(state.step){

    case 0:
      return renderChoiceQuestion({
        key: "q1",
        sectionTitle: "Section A — Business Basics",
        title: "How long has your business been operating?",
        options: [
          { label: "Less than 1 year", value: "Less than 1 year" },
          { label: "1–3 years", value: "1–3 years" },
          { label: "3–5 years", value: "3–5 years" },
          { label: "5+ years", value: "5+ years" }
        ]
      });

    case 1:
      return renderChoiceQuestion({
        key: "q2",
        sectionTitle: "Section A — Business Basics",
        title: "Which best describes your current role?",
        subtitle: "This helps interpret your answers properly.",
        options: [
          { label: "Founder / Owner", value: "Founder / Owner" },
          { label: "Co-founder", value: "Co-founder" },
          { label: "Managing Director", value: "Managing Director" },
          { label: "Operations Lead", value: "Operations Lead" }
        ]
      });

    case 2:
      return renderChoiceQuestion({
        key: "q3",
        sectionTitle: "Section B — Finance & Cash Flow",
        title: "Do you know your monthly profit, not just revenue?",
        options: [
          { label: "Yes, clearly", value: "Yes, clearly" },
          { label: "Rough idea", value: "Rough idea" },
          { label: "Not really", value: "Not really" },
          { label: "No", value: "No" }
        ]
      });

    case 3:
      return renderChoiceQuestion({
        key: "q4",
        sectionTitle: "Section B — Finance & Cash Flow",
        title: "How do you currently track your finances?",
        options: [
          { label: "Proper accounting software", value: "Proper accounting software" },
          { label: "Spreadsheets", value: "Spreadsheets" },
          { label: "Bank alerts only", value: "Bank alerts only" },
          { label: "I don’t track consistently", value: "I don’t track consistently" }
        ]
      });

    case 4:
      return renderChoiceQuestion({
        key: "q5",
        sectionTitle: "Section B — Finance & Cash Flow",
        title: "Can your business cover expenses for the next 3 months without new income?",
        options: [
          { label: "Yes", value: "Yes" },
          { label: "Maybe", value: "Maybe" },
          { label: "No", value: "No" }
        ]
      });

    case 5:
      return renderChoiceQuestion({
        key: "q6",
        sectionTitle: "Section C — Sales Consistency",
        title: "How predictable are your monthly sales?",
        options: [
          { label: "Very predictable", value: "Very predictable" },
          { label: "Somewhat predictable", value: "Somewhat predictable" },
          { label: "Inconsistent", value: "Inconsistent" },
          { label: "Completely unpredictable", value: "Completely unpredictable" }
        ]
      });

    case 6:
      return renderChoiceQuestion({
        key: "q7",
        sectionTitle: "Section C — Sales Consistency",
        title: "Where do most of your customers come from?",
        options: [
          { label: "Referrals", value: "Referrals" },
          { label: "Repeat customers", value: "Repeat customers" },
          { label: "Marketing campaigns", value: "Marketing campaigns" },
          { label: "Walk-ins / random", value: "Walk-ins / random" }
        ]
      });

    case 7:
      return renderChoiceQuestion({
        key: "q8",
        sectionTitle: "Section C — Sales Consistency",
        title: "Do you have a defined sales process?",
        options: [
          { label: "Yes, documented", value: "Yes, documented" },
          { label: "Informal but consistent", value: "Informal but consistent" },
          { label: "In my head", value: "In my head" },
          { label: "No", value: "No" }
        ]
      });

    case 8:
      return renderChoiceQuestion({
        key: "q9",
        sectionTitle: "Section D — Operations & Team",
        title: "How dependent is the business on you personally?",
        options: [
          { label: "Can run without me", value: "Can run without me" },
          { label: "Needs me occasionally", value: "Needs me occasionally" },
          { label: "Needs me daily", value: "Needs me daily" },
          { label: "Completely depends on me", value: "Completely depends on me" }
        ]
      });

    case 9:
      return renderChoiceQuestion({
        key: "q10",
        sectionTitle: "Section D — Operations & Team",
        title: "Do your staff have clear roles and accountability?",
        options: [
          { label: "Yes", value: "Yes" },
          { label: "Somewhat", value: "Somewhat" },
          { label: "No", value: "No" }
        ]
      });

    case 10:
      return renderChoiceQuestion({
        key: "q11",
        sectionTitle: "Section D — Operations & Team",
        title: "How often do things break because “someone forgot” or “no one followed up”?",
        options: [
          { label: "Rarely", value: "Rarely" },
          { label: "Sometimes", value: "Sometimes" },
          { label: "Often", value: "Often" }
        ]
      });

    case 11:
      return renderChoiceQuestion({
        key: "q12",
        sectionTitle: "Section E — Growth & Funding Readiness",
        title: "Are you considering funding in the next 6–12 months?",
        options: [
          { label: "Yes", value: "Yes" },
          { label: "Maybe", value: "Maybe" },
          { label: "No", value: "No" }
        ]
      });

    case 12:
      return renderChoiceQuestion({
        key: "q13",
        sectionTitle: "Section E — Growth & Funding Readiness",
        title: "If you received funding today, do you know exactly how it would be used?",
        options: [
          { label: "Yes, clearly", value: "Yes, clearly" },
          { label: "Rough idea", value: "Rough idea" },
          { label: "No", value: "No" }
        ]
      });
  }
}

// =========================
// VALIDATION
// =========================
function validateStep(){
  clearError();

  // For recommendation page, no validation needed
  if (state.step === 13) return true;

  const requiredByStep = {
    0: ["q1"],
    1: ["q2"],
    2: ["q3"],
    3: ["q4"],
    4: ["q5"],
    5: ["q6"],
    6: ["q7"],
    7: ["q8"],
    8: ["q9"],
    9: ["q10"],
    10:["q11"],
    11:["q12"],
    12:["q13"]
  };

  const req = requiredByStep[state.step] || [];
  if (!requireAnswered(req)){
    showError("Please answer the question to continue.");
    return false;
  }
  return true;
}

// =========================
// NAV
// =========================
backBtn.addEventListener("click", ()=>{
  if (state.step > 0){
    state.step--;
    saveToLocal();
    renderStep();
  }
});

nextBtn.addEventListener("click", ()=>{
  // If on recommendation page and user clicks "Update Answers"
  if (state.step === 13){
    // Send them back to the first question (or you can send to last answered)
    state.step = 0;
    saveToLocal();
    renderStep();
    return;
  }

  if (!validateStep()) return;

  // Move forward
  if (state.step < 13){
    state.step++;
    saveToLocal();
    renderStep();
    return;
  }
});


// Reset button (only if it exists)
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    resetLocal();
    state.step = 0;
    Object.keys(state.answers).forEach(k => state.answers[k] = "");
    saveToLocal();
    renderStep();
  });
}


// Init
loadFromLocal();
renderStep();
