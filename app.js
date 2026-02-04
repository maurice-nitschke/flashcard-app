const STORAGE = {
  questions: "fc_questions_v2",
  stats: "fc_stats_v2",
  settings: "fc_settings_v2",
  history: "fc_history_v1",
  examHistory: "fc_exam_history_v1",
};

const SAMPLE_DATA = [
  {
    questionId: "121",
    question:
      "What does the \"Affect Base of Subsequent Taxes\" option do when activated on a tax?",
    module: "Accounting and Invoicing",
    answers: [
      {
        answerId: "421",
        text:
          "The current tax will be added to the base on which the next tax (listed after the current one in the taxes' list) will be applied.",
      },
      {
        answerId: "422",
        text:
          "The next tax (listed after the current one in the taxes' list) will be added to the base on which the current tax will be applied.",
      },
      {
        answerId: "423",
        text: "The amount of the tax will be included in the price.",
      },
      {
        answerId: "424",
        text: "It will summon an army of minions.",
      },
    ],
    correctAnswer: {
      answerId: "421",
      text:
        "The current tax will be added to the base on which the next tax (listed after the current one in the taxes' list) will be applied.",
    },
    missingAnswerNote: null,
  },
  {
    questionId: "122",
    question: "Which report summarizes cash in and cash out for a period?",
    module: "Accounting and Invoicing",
    answers: [
      { answerId: "425", text: "Cash flow statement" },
      { answerId: "426", text: "Balance sheet" },
      { answerId: "427", text: "Trial balance" },
      { answerId: "428", text: "Inventory ledger" },
    ],
    correctAnswer: { answerId: "425", text: "Cash flow statement" },
    missingAnswerNote: null,
  },
  {
    questionId: "210",
    question: "What is the purpose of a sales funnel?",
    module: "Sales",
    answers: [
      { answerId: "520", text: "Track leads through stages" },
      { answerId: "521", text: "Generate invoices" },
      { answerId: "522", text: "Manage payroll" },
      { answerId: "523", text: "Store marketing assets" },
    ],
    correctAnswer: { answerId: "520", text: "Track leads through stages" },
    missingAnswerNote: null,
  },
];

const state = {
  questions: [],
  modules: [],
  mode: "random",
  module: "All Modules",
  attemptMode: "reveal",
  shuffle: true,
  autoNext: false,
  current: null,
  attemptCount: 0,
  stats: {},
  sprint: {
    active: false,
    endsAt: 0,
    timer: null,
    correct: 0,
    total: 0,
  },
  micro: {
    active: false,
    remaining: 0,
    correct: 0,
    total: 0,
  },
  answerTiming: {
    startAt: 0,
  },
  history: [],
  examHistory: [],
  exam: {
    active: false,
    completed: false,
    review: false,
    timer: null,
    endsAt: 0,
    startedAt: 0,
    duration: 0,
    total: 0,
    sections: [],
    currentIndex: 0,
    answers: {},
    questionTimes: {},
    reviewTarget: null,
    type: "standard",
  },
  reminder: {
    enabled: false,
    interval: 30,
    nextAt: 0,
    timer: null,
  },
};

const elements = {
  importPanel: document.getElementById("importPanel"),
  dashboardPanel: document.getElementById("dashboardPanel"),
  trainerPanel: document.getElementById("trainerPanel"),
  fileInput: document.getElementById("fileInput"),
  importFile: document.getElementById("importFile"),
  jsonInput: document.getElementById("jsonInput"),
  importPaste: document.getElementById("importPaste"),
  importStatus: document.getElementById("importStatus"),
  loadSample: document.getElementById("loadSample"),
  resetProgress: document.getElementById("resetProgress"),
  modeSelect: document.getElementById("modeSelect"),
  moduleSelect: document.getElementById("moduleSelect"),
  segmentedButtons: document.querySelectorAll(".segmented-btn"),
  shuffleToggle: document.getElementById("shuffleToggle"),
  autoNextToggle: document.getElementById("autoNextToggle"),
  statTotal: document.getElementById("statTotal"),
  statDue: document.getElementById("statDue"),
  statAccuracy: document.getElementById("statAccuracy"),
  statSprint: document.getElementById("statSprint"),
  statReviewed: document.getElementById("statReviewed"),
  statSessions: document.getElementById("statSessions"),
  statBestModule: document.getElementById("statBestModule"),
  ringAccuracy: document.getElementById("ringAccuracy"),
  ringValue: document.getElementById("ringValue"),
  sessionTrend: document.getElementById("sessionTrend"),
  bestModuleSpark: document.getElementById("bestModuleSpark"),
  moduleStats: document.getElementById("moduleStats"),
  historyList: document.getElementById("historyList"),
  clearHistory: document.getElementById("clearHistory"),
  modulePill: document.getElementById("modulePill"),
  counter: document.getElementById("counter"),
  questionText: document.getElementById("questionText"),
  answers: document.getElementById("answers"),
  feedback: document.getElementById("feedback"),
  progressBar: document.getElementById("progressBar"),
  nextBtn: document.getElementById("nextBtn"),
  startMicro: document.getElementById("startMicro"),
  notifyToggle: document.getElementById("notifyToggle"),
  notifyInterval: document.getElementById("notifyInterval"),
  examPanel: document.getElementById("examPanel"),
  examStart: document.getElementById("examStart"),
  examType: document.getElementById("examType"),
  examBegin: document.getElementById("examBegin"),
  examShell: document.getElementById("examShell"),
  examReview: document.getElementById("examReview"),
  examBackToResults: document.getElementById("examBackToResults"),
  examTimer: document.getElementById("examTimer"),
  examProgress: document.getElementById("examProgress"),
  examQuestions: document.getElementById("examQuestions"),
  examModuleTitle: document.getElementById("examModuleTitle"),
  examPrev: document.getElementById("examPrev"),
  examNext: document.getElementById("examNext"),
  examQuicklinks: document.getElementById("examQuicklinks"),
  examCheck: document.getElementById("examCheck"),
  examResult: document.getElementById("examResult"),
  examPrepList: document.getElementById("examPrepList"),
  timeSessionTrend: document.getElementById("timeSessionTrend"),
  timeDayTrend: document.getElementById("timeDayTrend"),
  focusModules: document.getElementById("focusModules"),
  focusQuestions: document.getElementById("focusQuestions"),
};

function loadFromStorage() {
  const storedQuestions = localStorage.getItem(STORAGE.questions);
  if (storedQuestions) {
    try {
      state.questions = JSON.parse(storedQuestions);
    } catch (error) {
      state.questions = [];
    }
  }
  const storedHistory = localStorage.getItem(STORAGE.history);
  if (storedHistory) {
    try {
      state.history = JSON.parse(storedHistory);
    } catch (error) {
      state.history = [];
    }
  }
  const storedExamHistory = localStorage.getItem(STORAGE.examHistory);
  if (storedExamHistory) {
    try {
      state.examHistory = JSON.parse(storedExamHistory);
    } catch (error) {
      state.examHistory = [];
    }
  }
  const storedStats = localStorage.getItem(STORAGE.stats);
  if (storedStats) {
    try {
      state.stats = JSON.parse(storedStats);
    } catch (error) {
      state.stats = {};
    }
  }
  const storedSettings = localStorage.getItem(STORAGE.settings);
  if (storedSettings) {
    try {
      const settings = JSON.parse(storedSettings);
      state.mode = settings.mode || state.mode;
      state.module = settings.module || state.module;
      state.attemptMode = settings.attemptMode || state.attemptMode;
      state.shuffle = settings.shuffle ?? state.shuffle;
      state.autoNext = settings.autoNext ?? state.autoNext;
      state.reminder.enabled = settings.reminderEnabled ?? state.reminder.enabled;
      state.reminder.interval = settings.reminderInterval ?? state.reminder.interval;
    } catch (error) {
      // ignore
    }
  }
}

function saveSettings() {
  localStorage.setItem(
    STORAGE.settings,
    JSON.stringify({
      mode: state.mode,
      module: state.module,
      attemptMode: state.attemptMode,
      shuffle: state.shuffle,
      autoNext: state.autoNext,
      reminderEnabled: state.reminder.enabled,
      reminderInterval: state.reminder.interval,
    })
  );
}

function saveQuestions() {
  localStorage.setItem(STORAGE.questions, JSON.stringify(state.questions));
}

function saveStats() {
  localStorage.setItem(STORAGE.stats, JSON.stringify(state.stats));
}

function saveHistory() {
  localStorage.setItem(STORAGE.history, JSON.stringify(state.history));
}

function saveExamHistory() {
  localStorage.setItem(STORAGE.examHistory, JSON.stringify(state.examHistory));
}

function normalizeQuestions(input) {
  const list = Array.isArray(input)
    ? input
    : Array.isArray(input?.questions)
    ? input.questions
    : [input];
  return list
    .filter(Boolean)
    .map((question, index) => {
      const answers = Array.isArray(question.answers) ? question.answers : [];
      const module = question.module || "General";
      const correctId =
        question.correctAnswer?.answerId ||
        question.correctAnswerId ||
        question.correctAnswer?.id ||
        null;
      return {
        questionId: String(question.questionId || `q-${index}-${Date.now()}`),
        question: question.question || "Untitled question",
        module,
        answers: answers.map((answer, answerIndex) => ({
          answerId: String(answer.answerId || `a-${index}-${answerIndex}`),
          text: answer.text || "",
        })),
        correctAnswerId: correctId,
        missingAnswerNote: question.missingAnswerNote || null,
      };
    });
}

function buildModules() {
  const modules = new Set(["All Modules"]);
  state.questions.forEach((question) => modules.add(question.module));
  state.modules = Array.from(modules).sort();
}

function renderModules() {
  if (!elements.moduleSelect) return;
  elements.moduleSelect.innerHTML = "";
  state.modules.forEach((module) => {
    const option = document.createElement("option");
    option.value = module;
    option.textContent = module;
    elements.moduleSelect.appendChild(option);
  });
  elements.moduleSelect.value =
    state.modules.includes(state.module) ? state.module : "All Modules";
  state.module = elements.moduleSelect.value;
}

function setPanels() {
  const hasQuestions = state.questions.length > 0;
  if (elements.trainerPanel) {
    elements.trainerPanel.style.display = hasQuestions ? "block" : "none";
  }
  if (elements.dashboardPanel) {
    elements.dashboardPanel.style.display = hasQuestions ? "block" : "none";
  }
  if (elements.importPanel) {
    elements.importPanel.style.display = hasQuestions ? "none" : "block";
  }
  if (!hasQuestions && elements.importStatus) {
    elements.importStatus.textContent = "";
  }
}

function getStats(questionId) {
  if (!state.stats[questionId]) {
    state.stats[questionId] = {
      modes: {
        reveal: { attempts: 0, correctFirst: 0, correctSecond: 0, wrong: 0 },
        second: { attempts: 0, correctFirst: 0, correctSecond: 0, wrong: 0 },
      },
      srs: {
        ease: 2.1,
        interval: 0,
        due: 0,
        lastSeen: 0,
        streak: 0,
      },
    };
  }
  return state.stats[questionId];
}

function getModeStats(questionId) {
  return getStats(questionId).modes[state.attemptMode];
}

function updateSrs(questionId, result) {
  const now = Date.now();
  const stats = getStats(questionId);
  const srs = stats.srs;
  if (result === "wrong") {
    srs.ease = Math.max(1.3, srs.ease - 0.2);
    srs.interval = 2;
    srs.streak = 0;
  } else if (result === "correct_first") {
    srs.ease = Math.min(2.8, srs.ease + 0.1);
    srs.interval = srs.interval ? Math.round(srs.interval * srs.ease) : 10;
    srs.streak += 1;
  } else if (result === "correct_second") {
    srs.ease = Math.min(2.8, srs.ease + 0.05);
    const multiplier = Math.max(1.2, srs.ease - 0.15);
    srs.interval = srs.interval ? Math.round(srs.interval * multiplier) : 5;
    srs.streak = Math.max(1, srs.streak);
  }
  srs.due = now + srs.interval * 60000;
  srs.lastSeen = now;
}

function getStrength(questionId) {
  const modeStats = getModeStats(questionId);
  return modeStats.correctFirst * 2 + modeStats.correctSecond - modeStats.wrong * 2;
}

function getAccuracy() {
  const questions = state.questions;
  let attempts = 0;
  let correct = 0;
  questions.forEach((question) => {
    const stats = getModeStats(question.questionId);
    attempts += stats.attempts;
    correct += stats.correctFirst + stats.correctSecond;
  });
  if (!attempts) return 0;
  return Math.round((correct / attempts) * 100);
}

function getDueCount() {
  const now = Date.now();
  return state.questions.filter((question) => getStats(question.questionId).srs.due <= now)
    .length;
}

function renderStats() {
  if (elements.statTotal) elements.statTotal.textContent = state.questions.length;
  if (elements.statDue) elements.statDue.textContent = getDueCount();
  const accuracy = getAccuracy();
  if (elements.statAccuracy) elements.statAccuracy.textContent = `${accuracy}%`;
  if (elements.statReviewed) elements.statReviewed.textContent = getTotalReviewed();
  if (elements.statSessions) elements.statSessions.textContent = state.history.length;
  const bestModule = getBestModule();
  if (elements.statBestModule) elements.statBestModule.textContent = bestModule || "--";
  if (elements.ringAccuracy && elements.ringValue) updateAccuracyRing(accuracy);
  if (elements.sessionTrend) renderSessionTrend();
  if (elements.bestModuleSpark) renderBestModuleSpark();
  if (elements.moduleStats) renderModuleStats();
  if (elements.historyList) renderHistory();
  if (elements.examPrepList) renderExamPrep();
  if (elements.timeSessionTrend || elements.timeDayTrend) renderTimeTrends();
  if (elements.focusModules || elements.focusQuestions) renderFocusList();
}

function shuffle(list) {
  const array = [...list];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const j = Math.floor(Math.random() * (index + 1));
    [array[index], array[j]] = [array[j], array[index]];
  }
  return array;
}

function buildPool() {
  const now = Date.now();
  let pool = [...state.questions];
  const usesModule = state.mode !== "random" && state.module !== "All Modules";
  if (usesModule) {
    pool = pool.filter((question) => question.module === state.module);
  }
  if (state.mode === "review") {
    const duePool = pool.filter((question) => getStats(question.questionId).srs.due <= now);
    pool = duePool.length ? duePool : pool;
  }
  if (state.mode === "weak") {
    pool = pool
      .map((question) => ({
        question,
        strength: getStrength(question.questionId),
      }))
      .sort((a, b) => a.strength - b.strength)
      .slice(0, Math.max(6, Math.ceil(pool.length * 0.4)))
      .map((entry) => entry.question);
  }
  return pool;
}

function pickWeighted(pool) {
  const now = Date.now();
  const weights = pool.map((question) => {
    const stats = getStats(question.questionId);
    const modeStats = getModeStats(question.questionId);
    const strength = getStrength(question.questionId);
    let weight = 1 + Math.max(0, 4 - strength);
    if (stats.srs.due <= now) weight += 2;
    if (modeStats.wrong > 0) weight += Math.min(2, modeStats.wrong * 0.4);
    return Math.max(1, weight);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[0];
}

function setSprint(active) {
  if (state.sprint.timer) {
    clearInterval(state.sprint.timer);
  }
  if (!active) {
    state.sprint.active = false;
    if (elements.statSprint) {
      elements.statSprint.textContent = "--:--";
    }
    return;
  }
  state.sprint.active = true;
  state.sprint.correct = 0;
  state.sprint.total = 0;
  state.sprint.endsAt = Date.now() + 60 * 1000;
  updateSprintTimer();
  state.sprint.timer = setInterval(updateSprintTimer, 250);
}

function updateSprintTimer() {
  const remaining = Math.max(0, state.sprint.endsAt - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;
  if (elements.statSprint) {
    elements.statSprint.textContent = display;
  }
  if (remaining <= 0) {
    setSprint(false);
    if (elements.feedback) {
      elements.feedback.textContent = `Sprint over: ${state.sprint.correct} correct out of ${state.sprint.total}.`;
    }
    lockAnswers();
    if (elements.nextBtn) {
      elements.nextBtn.textContent = "Restart sprint";
    }
  }
}

function updateProgress(questionId) {
  const stats = getStats(questionId);
  const mastery = Math.min(
    1,
    stats.srs.streak / 6 + (stats.srs.ease - 1.3) / 2.2
  );
  elements.progressBar.style.width = `${Math.round(mastery * 100)}%`;
}

function renderQuestion() {
  if (!elements.questionText || !elements.answers) return;
  const pool = buildPool();
  if (!pool.length) {
    elements.questionText.textContent = "No questions in this mode yet.";
    elements.answers.innerHTML = "";
    elements.feedback.textContent = "";
    elements.counter.textContent = "0 / 0";
    elements.modulePill.textContent = state.module;
    return;
  }
  state.current = pickWeighted(pool);
  state.attemptCount = 0;
  state.answerTiming.startAt = Date.now();

  const question = state.current;
  elements.questionText.textContent = question.question;
  if (elements.modulePill) elements.modulePill.textContent = question.module;
  if (elements.feedback) elements.feedback.textContent = "";
  if (elements.nextBtn) elements.nextBtn.textContent = "Next";

  const answers = state.shuffle ? shuffle(question.answers) : question.answers;
  elements.answers.innerHTML = "";
  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer.text;
    button.dataset.answerId = answer.answerId;
    button.addEventListener("click", () => handleAnswer(button));
    elements.answers.appendChild(button);
  });

  const modulePool =
    state.mode !== "random" && state.module !== "All Modules"
      ? pool
      : state.questions;
  if (elements.counter) {
    elements.counter.textContent = state.micro.active
      ? `${state.micro.remaining} cards left`
      : `${modulePool.length} cards`;
  }
  updateProgress(question.questionId);
}

function lockAnswers() {
  if (!elements.answers) return;
  Array.from(elements.answers.children).forEach((button) => {
    button.classList.add("disabled");
    button.disabled = true;
  });
}

function revealCorrect() {
  if (!elements.answers) return;
  const correctId = state.current.correctAnswerId;
  if (!correctId) return;
  Array.from(elements.answers.children).forEach((button) => {
    if (button.dataset.answerId === correctId) {
      button.classList.add("correct");
    }
  });
}

function handleAnswer(button) {
  if (!state.current) return;
  if (button.classList.contains("disabled")) return;

  const correctId = state.current.correctAnswerId;
  state.attemptCount += 1;
  if (!correctId) {
    if (elements.feedback) {
      elements.feedback.textContent = "No correct answer set for this card.";
    }
    lockAnswers();
    return;
  }

  const isCorrect = button.dataset.answerId === correctId;
  if (isCorrect) {
    button.classList.add("correct");
    const result = state.attemptCount === 1 ? "correct_first" : "correct_second";
    applyResult(result);
    if (elements.feedback) {
      elements.feedback.textContent =
        result === "correct_first"
          ? "Correct on the first try."
          : "Correct on the second try.";
    }
    revealCorrect();
    lockAnswers();
    if (state.autoNext && !state.sprint.active) {
      setTimeout(renderQuestion, 700);
    }
    return;
  }

  button.classList.add("incorrect");
  if (state.attemptMode === "second" && state.attemptCount === 1) {
    if (elements.feedback) {
      elements.feedback.textContent = "Not quite. One more try.";
    }
    button.disabled = true;
    button.classList.add("disabled");
    return;
  }

  applyResult("wrong");
  revealCorrect();
  lockAnswers();
  if (elements.feedback) {
    elements.feedback.textContent = "Wrong answer. The correct one is highlighted.";
  }
}

function applyResult(result) {
  const stats = getModeStats(state.current.questionId);
  stats.attempts += 1;
  if (result === "correct_first") stats.correctFirst += 1;
  if (result === "correct_second") stats.correctSecond += 1;
  if (result === "wrong") stats.wrong += 1;
  updateSrs(state.current.questionId, result);
  saveStats();
  const duration = state.answerTiming.startAt
    ? Math.max(0, Date.now() - state.answerTiming.startAt)
    : 0;
  trackSession(result, duration);
  renderStats();
  updateProgress(state.current.questionId);

  if (state.sprint.active) {
    state.sprint.total += 1;
    if (result === "correct_first" || result === "correct_second") {
      state.sprint.correct += 1;
    }
  }

  if (state.micro.active) {
    state.micro.total += 1;
    if (result === "correct_first" || result === "correct_second") {
      state.micro.correct += 1;
    }
    state.micro.remaining = Math.max(0, state.micro.remaining - 1);
    if (state.micro.remaining === 0) {
      state.micro.active = false;
      if (elements.feedback) {
        elements.feedback.textContent = `Microlearning done: ${state.micro.correct} correct out of ${state.micro.total}.`;
      }
    }
  }
}

function importQuestions(raw) {
  const normalized = normalizeQuestions(raw);
  if (!normalized.length) {
    if (elements.importStatus) {
      elements.importStatus.textContent = "No valid questions found in that JSON.";
    }
    return;
  }
  state.questions = normalized;
  saveQuestions();
  buildModules();
  renderModules();
  setPanels();
  renderStats();
  renderQuestion();
  if (elements.examPanel) {
    setExamPanels();
  }
  if (elements.importStatus) {
    elements.importStatus.textContent = `Loaded ${normalized.length} questions.`;
  }
}

if (elements.importFile) {
  elements.importFile.addEventListener("click", async () => {
    const file = elements.fileInput?.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      importQuestions(JSON.parse(text));
    } catch (error) {
      if (elements.importStatus) {
        elements.importStatus.textContent = "Invalid JSON file.";
      }
      if (elements.feedback) elements.feedback.textContent = "Invalid JSON file.";
    }
  });
}

if (elements.importPaste) {
  elements.importPaste.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(elements.jsonInput.value);
      importQuestions(parsed);
    } catch (error) {
      if (elements.importStatus) {
        elements.importStatus.textContent = "Invalid JSON pasted.";
      }
      if (elements.feedback) elements.feedback.textContent = "Invalid JSON pasted.";
    }
  });
}

if (elements.loadSample) {
  elements.loadSample.addEventListener("click", () => {
    if (elements.jsonInput) {
      elements.jsonInput.value = JSON.stringify(SAMPLE_DATA, null, 2);
    }
    importQuestions(SAMPLE_DATA);
  });
}

if (elements.resetProgress) {
  elements.resetProgress.addEventListener("click", () => {
    state.stats = {};
    saveStats();
    renderStats();
    if (state.current) updateProgress(state.current.questionId);
  });
}

if (elements.clearHistory) {
  elements.clearHistory.addEventListener("click", () => {
    state.history = [];
    saveHistory();
    renderStats();
  });
}

if (elements.modeSelect) {
  elements.modeSelect.addEventListener("change", (event) => {
    state.mode = event.target.value;
    saveSettings();
    if (state.mode === "sprint") {
      setSprint(true);
    } else {
      setSprint(false);
    }
    renderQuestion();
  });
}

if (elements.moduleSelect) {
  elements.moduleSelect.addEventListener("change", (event) => {
    state.module = event.target.value;
    saveSettings();
    renderQuestion();
  });
}

if (elements.segmentedButtons.length) {
  elements.segmentedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.attemptMode = button.dataset.attempt;
      elements.segmentedButtons.forEach((btn) =>
        btn.classList.toggle("active", btn === button)
      );
      saveSettings();
      renderStats();
    });
  });
}

if (elements.shuffleToggle) {
  elements.shuffleToggle.addEventListener("change", (event) => {
    state.shuffle = event.target.checked;
    saveSettings();
    renderQuestion();
  });
}

if (elements.autoNextToggle) {
  elements.autoNextToggle.addEventListener("change", (event) => {
    state.autoNext = event.target.checked;
    saveSettings();
  });
}

if (elements.nextBtn) {
  elements.nextBtn.addEventListener("click", () => {
    if (state.mode === "sprint" && !state.sprint.active) {
      setSprint(true);
    }
    renderQuestion();
  });
}

if (elements.startMicro) {
  elements.startMicro.addEventListener("click", () => {
    state.micro.active = true;
    state.micro.remaining = 20;
    state.micro.correct = 0;
    state.micro.total = 0;
    renderQuestion();
  });
}

if (elements.notifyToggle) {
  elements.notifyToggle.addEventListener("change", async (event) => {
    state.reminder.enabled = event.target.checked;
    saveSettings();
    if (state.reminder.enabled && "Notification" in window) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    }
    setupReminder();
  });
}

if (elements.notifyInterval) {
  elements.notifyInterval.addEventListener("change", (event) => {
    state.reminder.interval = Number(event.target.value);
    saveSettings();
    setupReminder();
  });
}

if (elements.examBegin) {
  elements.examBegin.addEventListener("click", () => {
    const type = elements.examType?.value || "standard";
    startExam(type);
  });
}

if (elements.examPrev) {
  elements.examPrev.addEventListener("click", () => {
    if (!state.exam.active) return;
    state.exam.currentIndex = Math.max(0, state.exam.currentIndex - 1);
    renderExamSection();
  });
}

if (elements.examNext) {
  elements.examNext.addEventListener("click", () => {
    if (!state.exam.active) return;
    state.exam.currentIndex = Math.min(
      state.exam.sections.length - 1,
      state.exam.currentIndex + 1
    );
    renderExamSection();
  });
}

if (elements.examCheck) {
  elements.examCheck.addEventListener("click", () => {
    if (!state.exam.active || state.exam.completed) return;
    finishExam(false);
  });
}

if (elements.examBackToResults) {
  elements.examBackToResults.addEventListener("click", () => {
    if (!state.exam.completed) return;
    state.exam.review = false;
    state.exam.reviewTarget = null;
    if (elements.examShell) elements.examShell.style.display = "none";
    if (elements.examResult) elements.examResult.style.display = "block";
  });
}

function init() {
  loadFromStorage();
  buildModules();
  renderModules();
  setPanels();
  renderStats();
  if (elements.modeSelect) elements.modeSelect.value = state.mode;
  if (elements.shuffleToggle) elements.shuffleToggle.checked = state.shuffle;
  if (elements.autoNextToggle) elements.autoNextToggle.checked = state.autoNext;
  if (elements.notifyToggle) elements.notifyToggle.checked = state.reminder.enabled;
  if (elements.notifyInterval) {
    elements.notifyInterval.value = String(state.reminder.interval);
  }
  if (elements.segmentedButtons.length) {
    elements.segmentedButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.attempt === state.attemptMode);
    });
  }
  if (state.mode === "sprint") setSprint(true);
  setupReminder();
  if (state.questions.length) renderQuestion();
  if (elements.examPanel) initExam();
}

init();

function getTotalReviewed() {
  return Object.values(state.stats).reduce((sum, entry) => {
    const modes = entry.modes;
    return (
      sum +
      modes.reveal.attempts +
      modes.second.attempts
    );
  }, 0);
}

function getBestModule() {
  const moduleStats = getModuleStats();
  const modules = Object.entries(moduleStats);
  if (!modules.length) return "";
  modules.sort((a, b) => b[1].accuracy - a[1].accuracy);
  return modules[0][0];
}

function getModuleStats() {
  const stats = {};
  state.questions.forEach((question) => {
    const module = question.module;
    if (!stats[module]) {
      stats[module] = { attempts: 0, correct: 0 };
    }
    const modeStats = getStats(question.questionId).modes;
    const attempts = modeStats.reveal.attempts + modeStats.second.attempts;
    const correct =
      modeStats.reveal.correctFirst +
      modeStats.reveal.correctSecond +
      modeStats.second.correctFirst +
      modeStats.second.correctSecond;
    stats[module].attempts += attempts;
    stats[module].correct += correct;
  });
  Object.values(stats).forEach((entry) => {
    entry.accuracy = entry.attempts
      ? Math.round((entry.correct / entry.attempts) * 100)
      : 0;
  });
  return stats;
}

function renderModuleStats() {
  const stats = getModuleStats();
  elements.moduleStats.innerHTML = "";
  Object.entries(stats)
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .forEach(([module, entry]) => {
      const card = document.createElement("div");
      card.className = "module-card";
      card.innerHTML = `
        <h4>${module}</h4>
        <div class="hint">Accuracy: ${entry.accuracy}%</div>
        <div class="hint">Attempts: ${entry.attempts}</div>
        <div class="bar"><span style="width: ${entry.accuracy}%"></span></div>
      `;
      elements.moduleStats.appendChild(card);
    });
}

function trackSession(result, durationMs) {
  if (!state.current) return;
  const now = Date.now();
  const lastSession = state.history[state.history.length - 1];
  const withinWindow = lastSession && now - lastSession.startedAt < 30 * 60 * 1000;
  if (!withinWindow) {
    state.history.push({
      id: `session-${now}`,
      startedAt: now,
      mode: state.mode,
      module: state.module,
      attempts: 0,
      correct: 0,
      timeSumMs: 0,
      answeredCount: 0,
    });
  }
  const session = state.history[state.history.length - 1];
  session.attempts += 1;
  if (result === "correct_first" || result === "correct_second") {
    session.correct += 1;
  }
  if (durationMs) {
    session.timeSumMs += durationMs;
    session.answeredCount += 1;
  }
  session.lastAt = now;
  saveHistory();
}

function renderHistory() {
  elements.historyList.innerHTML = "";
  const recent = [...state.history].slice(-10).reverse();
  if (!recent.length) {
    elements.historyList.innerHTML = "<div class=\"hint\">No sessions yet.</div>";
    return;
  }
  recent.forEach((session) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const accuracy = session.attempts
      ? Math.round((session.correct / session.attempts) * 100)
      : 0;
    const time = new Date(session.startedAt).toLocaleString();
    item.innerHTML = `
      <span>${time} · ${session.mode} · ${session.module}</span>
      <span>${session.attempts} attempts · ${accuracy}%</span>
    `;
    elements.historyList.appendChild(item);
  });
}

function renderExamPrep() {
  elements.examPrepList.innerHTML = "";
  const recent = [...state.examHistory].slice(-5).reverse();
  if (!recent.length) {
    elements.examPrepList.innerHTML = "<div class=\"hint\">No exam attempts yet.</div>";
    return;
  }
  recent.forEach((attempt) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const time = new Date(attempt.startedAt).toLocaleString();
    const percent = `${attempt.percent.toFixed(1)}%`;
    item.innerHTML = `
      <span>${time} · ${attempt.type} · ${attempt.total} Q</span>
      <span>${percent} · ${attempt.pass ? "PASS" : "FAIL"}</span>
    `;
    elements.examPrepList.appendChild(item);
  });
}

function renderTimeTrends() {
  if (elements.timeSessionTrend) {
    const recent = state.history
      .filter((session) => session.answeredCount)
      .slice(-10);
    renderTimeBars(elements.timeSessionTrend, recent.map((session) => {
      return session.timeSumMs / session.answeredCount / 1000;
    }));
  }
  if (elements.timeDayTrend) {
    const dayAverages = getTimeByDay(30);
    renderTimeBars(elements.timeDayTrend, dayAverages);
  }
}

function renderTimeBars(container, values) {
  if (!container) return;
  container.innerHTML = "";
  if (!values.length) {
    container.innerHTML = "<div class=\"hint\">No timing data yet.</div>";
    return;
  }
  const max = Math.max(...values, 1);
  values.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "micro-bar";
    const height = Math.max(6, Math.round((value / max) * 44));
    bar.style.height = `${height}px`;
    bar.title = `${value.toFixed(1)}s`;
    container.appendChild(bar);
  });
}

function getTimeByDay(days) {
  const now = new Date();
  const buckets = Array.from({ length: days }, () => ({ sum: 0, count: 0 }));
  state.history.forEach((session) => {
    if (!session.answeredCount) return;
    const date = new Date(session.startedAt);
    const diff = Math.floor((now - date) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) {
      buckets[days - diff - 1].sum += session.timeSumMs / session.answeredCount / 1000;
      buckets[days - diff - 1].count += 1;
    }
  });
  return buckets.map((bucket) => (bucket.count ? bucket.sum / bucket.count : 0));
}

function renderFocusList() {
  if (elements.focusModules) {
    const moduleStats = getModuleStats();
    const weakModules = Object.entries(moduleStats)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 3);
    elements.focusModules.innerHTML = weakModules.length
      ? ""
      : "<div class=\"hint\">No module data yet.</div>";
    weakModules.forEach(([module, stats]) => {
      const item = document.createElement("div");
      item.className = "focus-item";
      item.textContent = `${module} · ${stats.accuracy}%`;
      elements.focusModules.appendChild(item);
    });
  }
  if (elements.focusQuestions) {
    const missed = getMostMissedQuestions(5);
    elements.focusQuestions.innerHTML = missed.length
      ? ""
      : "<div class=\"hint\">No misses yet.</div>";
    missed.forEach((question) => {
      const item = document.createElement("div");
      item.className = "focus-item";
      item.textContent = `${question.module} · ${question.question}`;
      elements.focusQuestions.appendChild(item);
    });
  }
}

function getMostMissedQuestions(limit) {
  return state.questions
    .map((question) => {
      const modes = getStats(question.questionId).modes;
      const wrong = modes.reveal.wrong + modes.second.wrong;
      return { ...question, wrong };
    })
    .filter((question) => question.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, limit);
}

function initExam() {
  setExamPanels();
  if (elements.examType) {
    elements.examType.value = "standard";
  }
  if (elements.examReview) {
    elements.examReview.style.display = "none";
  }
}

function setExamPanels() {
  if (!elements.examPanel) return;
  const hasQuestions = state.questions.length > 0;
  if (elements.importPanel) {
    elements.importPanel.style.display = hasQuestions ? "none" : "block";
  }
  if (elements.examShell) {
    elements.examShell.style.display = hasQuestions ? "none" : "none";
  }
  if (elements.examStart) {
    elements.examStart.style.display = hasQuestions ? "flex" : "none";
  }
  if (elements.examResult) {
    elements.examResult.style.display = "none";
  }
}

function startExam(type) {
  if (!state.questions.length) return;
  const config =
    type === "mock"
      ? { total: 30, minutes: 20, minPer: 2, maxPer: 3 }
      : { total: 120, minutes: 90, minPer: 4, maxPer: 5 };
  const sections = buildExamSections(config.total, config.minPer, config.maxPer);
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  state.exam = {
    active: true,
    completed: false,
    review: false,
    timer: null,
    endsAt: Date.now() + config.minutes * 60 * 1000,
    startedAt: Date.now(),
    duration: config.minutes * 60 * 1000,
    total: totalQuestions,
    sections,
    currentIndex: 0,
    answers: {},
    questionTimes: {},
    reviewTarget: null,
    type: type === "mock" ? "Mock" : "Standard",
  };
  if (elements.examStart) elements.examStart.style.display = "none";
  if (elements.examShell) elements.examShell.style.display = "flex";
  if (elements.examResult) elements.examResult.style.display = "none";
  renderExamQuicklinks();
  renderExamSection();
  startExamTimer();
}

function buildExamSections(totalTarget, minPerModule, maxPerModule) {
  const moduleMap = new Map();
  state.questions.forEach((question) => {
    if (!moduleMap.has(question.module)) moduleMap.set(question.module, []);
    moduleMap.get(question.module).push(question);
  });
  const modules = Array.from(moduleMap.keys());
  modules.forEach((module) => {
    moduleMap.set(module, shuffle(moduleMap.get(module)));
  });
  let availableModules = shuffle(modules);
  const maxModules = Math.max(1, Math.floor(totalTarget / minPerModule));
  if (availableModules.length > maxModules) {
    availableModules = availableModules.slice(0, maxModules);
  }
  const sections = availableModules.map((module) => ({
    module,
    questions: [],
  }));
  let total = 0;
  sections.forEach((section) => {
    const pool = moduleMap.get(section.module) || [];
    const count = Math.min(minPerModule, pool.length);
    section.questions = pool.splice(0, count);
    total += section.questions.length;
  });
  let maxCapReached = false;
  while (total < totalTarget) {
    let added = false;
    const poolOrder = shuffle(sections);
    for (const section of poolOrder) {
      const pool = moduleMap.get(section.module) || [];
      if (!pool.length) continue;
      if (!maxCapReached && section.questions.length >= maxPerModule) continue;
      section.questions.push(pool.shift());
      total += 1;
      added = true;
      if (total >= totalTarget) break;
    }
    if (!added) {
      if (!maxCapReached) {
        maxCapReached = true;
      } else {
        break;
      }
    }
  }
  return sections.filter((section) => section.questions.length > 0);
}

function renderExamQuicklinks() {
  if (!elements.examQuicklinks) return;
  elements.examQuicklinks.innerHTML = "";
  state.exam.sections.forEach((section, index) => {
    const btn = document.createElement("button");
    btn.textContent = section.module;
    btn.title = section.module;
    const answeredCount = section.questions.filter(
      (question) => state.exam.answers[question.questionId]
    ).length;
    const completed = answeredCount === section.questions.length && section.questions.length;
    btn.classList.toggle("active", index === state.exam.currentIndex);
    btn.classList.toggle("completed", completed);
    btn.addEventListener("click", () => {
      state.exam.currentIndex = index;
      renderExamSection();
    });
    elements.examQuicklinks.appendChild(btn);
  });
}

function renderExamSection() {
  if (!elements.examQuestions || !elements.examModuleTitle) return;
  const section = state.exam.sections[state.exam.currentIndex];
  if (!section) return;
  elements.examModuleTitle.textContent = section.module;
  elements.examQuestions.innerHTML = "";
  section.questions.forEach((question, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "exam-question";
    if (state.exam.reviewTarget === question.questionId) {
      wrapper.classList.add("focus");
    }
    wrapper.innerHTML = `<h4>${index + 1}. ${question.question}</h4>`;
    const options = document.createElement("div");
    options.className = "exam-options";
    if (!state.exam.completed && !state.exam.questionTimes[question.questionId]) {
      state.exam.questionTimes[question.questionId] = {
        startAt: Date.now(),
        answeredAt: 0,
        durationMs: 0,
      };
    }
    question.answers.forEach((answer) => {
      const label = document.createElement("label");
      label.className = "exam-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `exam-${question.questionId}`;
      input.value = answer.answerId;
      input.checked = state.exam.answers[question.questionId] === answer.answerId;
      input.disabled = state.exam.completed;
      input.addEventListener("change", () => {
        if (state.exam.completed) return;
        state.exam.answers[question.questionId] = answer.answerId;
        const timing = state.exam.questionTimes[question.questionId];
        if (timing && !timing.answeredAt) {
          timing.answeredAt = Date.now();
          timing.durationMs = timing.answeredAt - timing.startAt;
        }
        renderExamQuicklinks();
      });
      const span = document.createElement("span");
      span.textContent = answer.text;
      label.appendChild(input);
      label.appendChild(span);
      if (state.exam.completed) {
        const selected = state.exam.answers[question.questionId];
        if (answer.answerId === question.correctAnswerId) {
          label.classList.add("correct");
        } else if (selected === answer.answerId) {
          label.classList.add("incorrect");
        }
      }
      options.appendChild(label);
    });
    wrapper.appendChild(options);
    elements.examQuestions.appendChild(wrapper);
  });
  renderExamQuicklinks();
  if (elements.examPrev) elements.examPrev.disabled = state.exam.currentIndex === 0;
  if (elements.examNext) {
    elements.examNext.disabled =
      state.exam.currentIndex === state.exam.sections.length - 1;
  }
  if (elements.examReview) {
    elements.examReview.style.display = state.exam.completed ? "flex" : "none";
  }
  if (elements.examCheck) {
    elements.examCheck.disabled = state.exam.completed;
  }
}

function startExamTimer() {
  if (state.exam.timer) clearInterval(state.exam.timer);
  updateExamTimer();
  state.exam.timer = setInterval(updateExamTimer, 500);
}

function updateExamTimer() {
  if (!state.exam.active) return;
  const remaining = Math.max(0, state.exam.endsAt - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  if (elements.examTimer) {
    elements.examTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
  if (elements.examProgress) {
    const elapsed = state.exam.duration - remaining;
    const percent = Math.min(100, Math.round((elapsed / state.exam.duration) * 100));
    elements.examProgress.style.width = `${percent}%`;
  }
  if (remaining <= 0) {
    finishExam(true);
  }
}

function finishExam(autoTriggered) {
  if (state.exam.completed) return;
  state.exam.active = false;
  state.exam.completed = true;
  if (state.exam.timer) clearInterval(state.exam.timer);
  const result = evaluateExam();
  state.examHistory.push(result);
  saveExamHistory();
  renderStats();
  showExamResult(result, autoTriggered);
}

function evaluateExam() {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let timeSumMs = 0;
  let answeredCount = 0;
  const moduleBreakdown = {};
  state.exam.sections.forEach((section) => {
    moduleBreakdown[section.module] = {
      correct: 0,
      wrong: 0,
      skipped: 0,
      timeSumMs: 0,
      answeredCount: 0,
    };
    section.questions.forEach((question) => {
      const selected = state.exam.answers[question.questionId];
      const timing = state.exam.questionTimes[question.questionId];
      if (!selected) {
        skipped += 1;
        moduleBreakdown[section.module].skipped += 1;
        return;
      }
      if (selected === question.correctAnswerId) {
        correct += 1;
        moduleBreakdown[section.module].correct += 1;
      } else {
        wrong += 1;
        moduleBreakdown[section.module].wrong += 1;
      }
      if (timing && timing.durationMs) {
        timeSumMs += timing.durationMs;
        answeredCount += 1;
        moduleBreakdown[section.module].timeSumMs += timing.durationMs;
        moduleBreakdown[section.module].answeredCount += 1;
      }
    });
  });
  const points = correct - wrong * 0.5;
  const percent = Math.max(0, (points / state.exam.total) * 100);
  const avgTimeMs = answeredCount ? timeSumMs / answeredCount : 0;
  return {
    id: `exam-${Date.now()}`,
    type: state.exam.type,
    startedAt: state.exam.startedAt,
    total: state.exam.total,
    correct,
    wrong,
    skipped,
    points,
    percent,
    pass: percent >= 70,
    moduleBreakdown,
    avgTimeMs,
  };
}

function showExamResult(result, autoTriggered) {
  if (!elements.examResult) return;
  if (elements.examShell) elements.examShell.style.display = "none";
  elements.examResult.style.display = "block";
  const status = result.pass ? "PASS" : "FAIL";
  const note = autoTriggered ? "Time is up. Results are locked." : "Results are locked.";
  const wrongQuestions = [];
  state.exam.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const selected = state.exam.answers[question.questionId];
      if (selected && selected !== question.correctAnswerId) {
        wrongQuestions.push({
          module: section.module,
          questionId: question.questionId,
          text: question.question,
        });
      }
    });
  });
  const avgTimeSec = result.avgTimeMs ? (result.avgTimeMs / 1000).toFixed(1) : "--";
  elements.examResult.innerHTML = `
    <div class="exam-summary">
      <div class="exam-diagram">
        <p class="stat-label">Final score</p>
        <div class="exam-donut">
          <svg viewBox="0 0 120 120">
            <circle class="ring-track" cx="60" cy="60" r="46"></circle>
            <circle class="ring-bar" id="examScoreRing" cx="60" cy="60" r="46"></circle>
          </svg>
          <div class="ring-label">
            <span>${result.percent.toFixed(1)}%</span>
            <small>${status}</small>
          </div>
        </div>
        <p class="hint">Points: ${result.points.toFixed(1)} / ${result.total}</p>
        <p class="hint">Correct ${result.correct} · Wrong ${result.wrong} · Skipped ${result.skipped}</p>
        <p class="hint">Avg time per answer: ${avgTimeSec}s</p>
        <p class="hint">${note}</p>
        <button class="primary" id="examRestart">Start new exam</button>
      </div>
      <div class="exam-bars">
        ${Object.entries(result.moduleBreakdown)
          .map(([module, stats]) => {
            const total = stats.correct + stats.wrong + stats.skipped;
            const accuracy = total
              ? Math.round((stats.correct / total) * 100)
              : 0;
            const avgSec = stats.answeredCount
              ? (stats.timeSumMs / stats.answeredCount / 1000).toFixed(1)
              : "--";
            return `
              <div class="bar-row">
                <span>${module}</span>
                <div class="bar"><span style="width: ${accuracy}%"></span></div>
                <span>${accuracy}% · ${avgSec}s</span>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
    <div class="exam-module-breakdown">
      ${Object.entries(result.moduleBreakdown)
        .map(
          ([module, stats]) => `
          <div class="module-card">
            <h4>${module}</h4>
            <div class="hint">Correct: ${stats.correct}</div>
            <div class="hint">Wrong: ${stats.wrong}</div>
            <div class="hint">Skipped: ${stats.skipped}</div>
            <div class="hint">Avg time: ${
              stats.answeredCount
                ? (stats.timeSumMs / stats.answeredCount / 1000).toFixed(1)
                : "--"
            }s</div>
          </div>
        `
        )
        .join("")}
    </div>
    <div class="exam-wrong-list" id="examWrongList">
      ${wrongQuestions.length
        ? wrongQuestions
            .map(
              (item) => `
            <div class="exam-wrong-item">
              <span>${item.module} · ${item.text}</span>
              <button class="ghost" data-question-id="${item.questionId}">Review</button>
            </div>
          `
            )
            .join("")
        : "<div class=\"hint\">No wrong answers. Great work.</div>"}
    </div>
    <p class="exam-review-note">Click any wrong question to review the locked answers.</p>
  `;
  updateExamDonut(result.percent);
  const restartBtn = elements.examResult.querySelector("#examRestart");
  if (restartBtn) {
    restartBtn.addEventListener("click", resetExam);
  }
  const wrongList = elements.examResult.querySelector("#examWrongList");
  if (wrongList) {
    wrongList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-question-id]");
      if (!button) return;
      openExamReview(button.dataset.questionId);
    });
  }
}

function updateExamDonut(percent) {
  const ring = document.getElementById("examScoreRing");
  if (!ring) return;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (percent / 100) * circumference;
  ring.style.strokeDasharray = String(circumference);
  ring.style.strokeDashoffset = String(offset);
}

function openExamReview(questionId) {
  if (!state.exam.completed) return;
  state.exam.review = true;
  state.exam.reviewTarget = questionId || null;
  const sectionIndex = findExamSectionIndex(questionId);
  if (sectionIndex !== -1) state.exam.currentIndex = sectionIndex;
  if (elements.examResult) elements.examResult.style.display = "none";
  if (elements.examShell) elements.examShell.style.display = "flex";
  renderExamSection();
}

function findExamSectionIndex(questionId) {
  if (!questionId) return -1;
  return state.exam.sections.findIndex((section) =>
    section.questions.some((question) => question.questionId === questionId)
  );
}

function resetExam() {
  state.exam.active = false;
  state.exam.completed = false;
  state.exam.review = false;
  state.exam.sections = [];
  state.exam.answers = {};
  state.exam.questionTimes = {};
  state.exam.reviewTarget = null;
  if (elements.examResult) elements.examResult.style.display = "none";
  if (elements.examStart) elements.examStart.style.display = "flex";
  if (elements.examShell) elements.examShell.style.display = "none";
}

function updateAccuracyRing(value) {
  if (!elements.ringAccuracy || !elements.ringValue) return;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (value / 100) * circumference;
  elements.ringAccuracy.style.strokeDasharray = String(circumference);
  elements.ringAccuracy.style.strokeDashoffset = String(offset);
  elements.ringValue.textContent = `${value}%`;
}

function renderSessionTrend() {
  if (!elements.sessionTrend) return;
  const lastSeven = getSessionsByDay(7);
  elements.sessionTrend.innerHTML = "";
  lastSeven.forEach((count) => {
    const bar = document.createElement("div");
    bar.className = "micro-bar";
    const height = Math.max(6, Math.min(44, count * 8));
    bar.style.height = `${height}px`;
    elements.sessionTrend.appendChild(bar);
  });
}

function renderBestModuleSpark() {
  if (!elements.bestModuleSpark) return;
  const stats = getModuleStats();
  const entries = Object.entries(stats).sort((a, b) => b[1].accuracy - a[1].accuracy);
  elements.bestModuleSpark.innerHTML = "";
  const top = entries.slice(0, 6);
  top.forEach((entry, index) => {
    const dot = document.createElement("span");
    if (index === 0) dot.classList.add("active");
    elements.bestModuleSpark.appendChild(dot);
  });
}

function getSessionsByDay(days) {
  const now = new Date();
  const buckets = Array.from({ length: days }, () => 0);
  state.history.forEach((session) => {
    const date = new Date(session.startedAt);
    const diff = Math.floor((now - date) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) {
      buckets[days - diff - 1] += 1;
    }
  });
  return buckets;
}

function setupReminder() {
  if (state.reminder.timer) {
    clearInterval(state.reminder.timer);
  }
  if (!state.reminder.enabled) return;
  if (!("Notification" in window)) return;
  state.reminder.nextAt = Date.now() + state.reminder.interval * 60 * 1000;
  state.reminder.timer = setInterval(() => {
    if (Date.now() < state.reminder.nextAt) return;
    state.reminder.nextAt = Date.now() + state.reminder.interval * 60 * 1000;
    if (document.visibilityState === "visible") {
      sendReminder();
    }
  }, 10000);
}

function sendReminder() {
  const message = "Microlearning time: 20 quick cards to keep recall sharp.";
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Flashcard Trainer", { body: message });
  }
}
