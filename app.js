const STORAGE = {
  questions: "fc_questions_v2",
  stats: "fc_stats_v2",
  settings: "fc_settings_v2",
  history: "fc_history_v1",
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
  history: [],
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
  trackSession(result);
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

function trackSession(result) {
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
    });
  }
  const session = state.history[state.history.length - 1];
  session.attempts += 1;
  if (result === "correct_first" || result === "correct_second") {
    session.correct += 1;
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
