(function () {
  "use strict";

  const APERTURES = [
    1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5,
    5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32,
  ];
  const ISO_VALUES = [
    50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000,
    1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800,
    16000, 20000, 25600,
  ];
  const SHUTTERS = [
    ["1/8000", 1 / 8000], ["1/6400", 1 / 6400], ["1/5000", 1 / 5000],
    ["1/4000", 1 / 4000], ["1/3200", 1 / 3200], ["1/2500", 1 / 2500],
    ["1/2000", 1 / 2000], ["1/1600", 1 / 1600], ["1/1250", 1 / 1250],
    ["1/1000", 1 / 1000], ["1/800", 1 / 800], ["1/640", 1 / 640],
    ["1/500", 1 / 500], ["1/400", 1 / 400], ["1/320", 1 / 320],
    ["1/250", 1 / 250], ["1/200", 1 / 200], ["1/160", 1 / 160],
    ["1/125", 1 / 125], ["1/100", 1 / 100], ["1/80", 1 / 80],
    ["1/60", 1 / 60], ["1/50", 1 / 50], ["1/40", 1 / 40],
    ["1/30", 1 / 30], ["1/25", 1 / 25], ["1/20", 1 / 20],
    ["1/15", 1 / 15], ["1/13", 1 / 13], ["1/10", 1 / 10],
    ["1/8", 1 / 8], ["1/6", 1 / 6], ["1/5", 1 / 5], ["1/4", 1 / 4],
    ["0,3″", 0.3], ["0,4″", 0.4], ["0,5″", 0.5], ["0,6″", 0.6],
    ["0,8″", 0.8], ["1″", 1], ["1,3″", 1.3], ["1,6″", 1.6],
    ["2″", 2], ["2,5″", 2.5], ["3,2″", 3.2], ["4″", 4], ["5″", 5],
    ["6″", 6], ["8″", 8], ["10″", 10], ["13″", 13], ["15″", 15],
    ["20″", 20], ["25″", 25], ["30″", 30],
  ];
  const SHUTTER_VALUES = SHUTTERS.map((item) => item[0]);
  const STEPS_PER_STOP = 3;
  const EMPTY_SETTINGS = () => ({ a: "", i: "", s: "" });

  const COPY = {
    ru: {
      select: "Выберите",
      fields: {
        a: ["Диафрагма", "влияет на глубину резкости"],
        i: ["ISO", "влияет на количество шума"],
        s: ["Выдержка", "влияет на смазывание движения"],
      },
      taskFields: { a: "диафрагму", i: "ISO", s: "выдержку" },
      alternativeFields: { a: "диафрагмы", i: "ISO", s: "выдержки" },
      modeCalculator: "Калькулятор",
      modeTraining: "Тренировка",
      randomExample: "Случайный пример",
      newTask: "Новое задание",
      share: "Поделиться",
      shared: "Ссылка скопирована",
      shareFailed: "Не удалось скопировать. Скопируйте адрес из строки браузера.",
      calculatorReference: "Введите параметры удачного первого кадра.",
      calculatorNext: "Подберите параметры с такой же яркостью и проверьте результат ниже.",
      trainingReference: "Исходные настройки заданы тренажёром.",
      trainingNext: "Измените доступный параметр, чтобы компенсировать яркость.",
      calculatorKicker: "Как вернуть прежнюю яркость",
      trainingKicker: "Проверка решения",
      calculatorNote: "Значения округляются до ближайших стандартных настроек камеры. Небольшое отклонение до 0,1 ступени визуально почти незаметно.",
      trainingNote: "Сначала решите задачу самостоятельно. Подсказка появляется только после проверки неверного ответа.",
      incompleteStatus: "Заполните параметры",
      incompleteTitle: "Заполните параметры обоих кадров",
      sameStatus: "Одинаковые параметры",
      sameTitle: "Это одинаковые параметры. Подберите одинаковую яркость с другими настройками.",
      matchedStatus: "Яркость совпадает",
      matchedTitle: "Уже получилось",
      successTitle: "Эта комбинация равноценна первой.",
      successText: "Можно делать кадр и переходить к следующему изменению.",
      addLight: "Добавьте света одним из способов",
      reduceLight: "Уменьшите свет одним из способов",
      stops: "ступ.",
      keepApertureShutter: "Оставить диафрагму и выдержку",
      keepApertureIso: "Оставить диафрагму и ISO",
      keepIsoShutter: "Оставить ISO и выдержку",
      apply: "Применить →",
      check: "Проверить",
      trainingReadyStatus: "Ждёт проверки",
      trainingReadyTitle: "Компенсируйте изменение и проверьте ответ",
      trainingCorrectTitle: "Верно — экспозиция сохранена",
      trainingCorrectText: "Вы компенсировали изменение параметра. Попробуйте следующее задание.",
      trainingWrongTitle: "Пока не совпадает",
      trainingTooLight: "Второй кадр светлее эталона",
      trainingTooDark: "Второй кадр темнее эталона",
      showHint: "Показать подсказку",
      hintPrefix: "Попробуйте установить",
      solved: "решено",
      streak: "серия",
      trainingInstruction: (name, from, to, alternatives) =>
        `Измените ${name} с ${from} на ${to}. Компенсируйте яркость с помощью ${alternatives}.`,
    },
    uk: {
      select: "Оберіть",
      fields: {
        a: ["Діафрагма", "впливає на глибину різкості"],
        i: ["ISO", "впливає на кількість шуму"],
        s: ["Витримка", "впливає на розмиття руху"],
      },
      taskFields: { a: "діафрагму", i: "ISO", s: "витримку" },
      alternativeFields: { a: "діафрагми", i: "ISO", s: "витримки" },
      modeCalculator: "Калькулятор",
      modeTraining: "Тренування",
      randomExample: "Випадковий приклад",
      newTask: "Нове завдання",
      share: "Поділитися",
      shared: "Посилання скопійовано",
      shareFailed: "Не вдалося скопіювати. Скопіюйте адресу з рядка браузера.",
      calculatorReference: "Введіть параметри вдалого першого кадру.",
      calculatorNext: "Доберіть параметри з такою самою яскравістю та перевірте результат нижче.",
      trainingReference: "Початкові налаштування задані тренажером.",
      trainingNext: "Змініть доступний параметр, щоб компенсувати яскравість.",
      calculatorKicker: "Як повернути попередню яскравість",
      trainingKicker: "Перевірка рішення",
      calculatorNote: "Значення округлюються до найближчих стандартних налаштувань камери. Невелике відхилення до 0,1 ступеня візуально майже непомітне.",
      trainingNote: "Спочатку розв’яжіть завдання самостійно. Підказка з’явиться лише після перевірки неправильної відповіді.",
      incompleteStatus: "Заповніть параметри",
      incompleteTitle: "Заповніть параметри обох кадрів",
      sameStatus: "Однакові параметри",
      sameTitle: "Це однакові параметри. Доберіть однакову яскравість з іншими налаштуваннями.",
      matchedStatus: "Яскравість збігається",
      matchedTitle: "Уже вийшло",
      successTitle: "Ця комбінація рівноцінна першій.",
      successText: "Можна робити кадр і переходити до наступної зміни.",
      addLight: "Додайте світла одним зі способів",
      reduceLight: "Зменште кількість світла одним зі способів",
      stops: "ступ.",
      keepApertureShutter: "Залишити діафрагму й витримку",
      keepApertureIso: "Залишити діафрагму й ISO",
      keepIsoShutter: "Залишити ISO й витримку",
      apply: "Застосувати →",
      check: "Перевірити",
      trainingReadyStatus: "Очікує перевірки",
      trainingReadyTitle: "Компенсуйте зміну та перевірте відповідь",
      trainingCorrectTitle: "Правильно — експозицію збережено",
      trainingCorrectText: "Ви компенсували зміну параметра. Спробуйте наступне завдання.",
      trainingWrongTitle: "Поки не збігається",
      trainingTooLight: "Другий кадр світліший за еталон",
      trainingTooDark: "Другий кадр темніший за еталон",
      showHint: "Показати підказку",
      hintPrefix: "Спробуйте встановити",
      solved: "розв’язано",
      streak: "серія",
      trainingInstruction: (name, from, to, alternatives) =>
        `Змініть ${name} з ${from} на ${to}. Компенсуйте яскравість за допомогою ${alternatives}.`,
    },
  };

  const language = document.documentElement.lang === "uk" ? "uk" : "ru";
  const text = COPY[language];
  const scoreStorageKey = "exposure-triangle-trainer:score:v3";
  const legacyStorageKey = `exposure-triangle-trainer:${language}:v2`;
  const canonicalBase = language === "uk"
    ? "https://green4.photo/exposure-triangle-trainer/uk/"
    : "https://green4.photo/exposure-triangle-trainer/";
  const alternateLink = document.querySelector('.languages a:not([aria-current="page"])');
  const alternatePath = alternateLink?.getAttribute("href") || "";

  let state = {
    mode: "calculator",
    calculator: { reference: EMPTY_SETTINGS(), next: EMPTY_SETTINGS() },
    training: {
      reference: EMPTY_SETTINGS(),
      next: EMPTY_SETTINGS(),
      locked: "",
      checked: false,
      solved: false,
    },
    score: { total: 0, streak: 0 },
  };

  const elements = {
    calculatorMode: document.getElementById("mode-calculator"),
    trainingMode: document.getElementById("mode-training"),
    random: document.getElementById("random"),
    share: document.getElementById("share"),
    shareStatus: document.getElementById("share-status"),
    trainingBrief: document.getElementById("training-brief"),
    trainingInstruction: document.getElementById("training-instruction"),
    scoreTotal: document.getElementById("score-total"),
    scoreStreak: document.getElementById("score-streak"),
    referenceDescription: document.getElementById("reference-description"),
    nextDescription: document.getElementById("next-description"),
    status: document.getElementById("status"),
    answerKicker: document.getElementById("answer-kicker"),
    title: document.getElementById("title"),
    result: document.getElementById("result"),
    note: document.getElementById("answer-note"),
    check: document.getElementById("check"),
    reset: document.getElementById("reset"),
  };

  const valuesFor = (key) => key === "a" ? APERTURES : key === "i" ? ISO_VALUES : SHUTTER_VALUES;
  const shutterSeconds = (value) => {
    const match = SHUTTERS.find((item) => item[0] === value);
    return match ? match[1] : NaN;
  };
  const isComplete = (settings) => Boolean(settings.a && settings.i && settings.s);
  const exposure = (settings) =>
    (settings.i * shutterSeconds(settings.s)) / (settings.a * settings.a);
  const stopsDifference = (first, second) => {
    const apertureSteps = APERTURES.indexOf(second.a) - APERTURES.indexOf(first.a);
    const isoSteps = ISO_VALUES.indexOf(second.i) - ISO_VALUES.indexOf(first.i);
    const shutterSteps = SHUTTER_VALUES.indexOf(second.s) - SHUTTER_VALUES.indexOf(first.s);
    const usesStandardValues = [first.a, second.a, first.i, second.i, first.s, second.s]
      .every((value) => value !== undefined) &&
      APERTURES.includes(first.a) && APERTURES.includes(second.a) &&
      ISO_VALUES.includes(first.i) && ISO_VALUES.includes(second.i) &&
      SHUTTER_VALUES.includes(first.s) && SHUTTER_VALUES.includes(second.s);

    return usesStandardValues
      ? (isoSteps + shutterSteps - apertureSteps) / STEPS_PER_STOP
      : Math.log2(exposure(second) / exposure(first));
  };
  const nearest = (values, target, getValue = (value) => value) =>
    values.reduce((current, candidate) =>
      Math.abs(Math.log2(getValue(candidate) / target)) < Math.abs(Math.log2(getValue(current) / target))
        ? candidate
        : current,
    );
  const randomItem = (values, start = 0, end = values.length - 1) =>
    values[Math.floor(Math.random() * (end - start + 1)) + start];
  const settingsEqual = (first, second) =>
    first.a === second.a && first.i === second.i && first.s === second.s;
  const formatValue = (key, value) => key === "a" ? `f/${value}` : key === "i" ? `ISO ${value}` : value;

  function validSettings(settings) {
    return settings && APERTURES.includes(Number(settings.a)) &&
      ISO_VALUES.includes(Number(settings.i)) && SHUTTER_VALUES.includes(settings.s);
  }

  function normalizeSettings(settings) {
    return { a: Number(settings.a), i: Number(settings.i), s: settings.s };
  }

  function activeData() {
    return state.mode === "training" ? state.training : state.calculator;
  }

  function saveScore() {
    try {
      localStorage.setItem(scoreStorageKey, JSON.stringify(state.score));
    } catch (_) {
      // Storage can be disabled; training remains fully usable without a saved score.
    }
  }

  function loadScore() {
    try {
      const current = JSON.parse(localStorage.getItem(scoreStorageKey));
      const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
      const savedScore = current || legacy?.score;
      state.score.total = Math.max(0, Number(savedScore?.total) || 0);
      state.score.streak = Math.max(0, Number(savedScore?.streak) || 0);
      if (!current && savedScore) localStorage.setItem(scoreStorageKey, JSON.stringify(state.score));
      localStorage.removeItem(legacyStorageKey);
    } catch (_) {
      // Ignore malformed or unavailable score data.
    }
  }

  function parseSettings(value) {
    if (!value) return null;
    const parts = value.split("|");
    if (parts.length !== 3) return null;
    const parsed = { a: Number(parts[0]), i: Number(parts[1]), s: parts[2] };
    return validSettings(parsed) ? parsed : null;
  }

  function loadSharedState() {
    const params = new URLSearchParams(window.location.search);
    const reference = parseSettings(params.get("r"));
    const next = parseSettings(params.get("n"));
    const mode = params.get("mode") === "training" ? "training" : params.get("mode") === "calculator" ? "calculator" : null;
    if (!mode || !reference || !next) return false;

    state.mode = mode;
    if (mode === "calculator") {
      state.calculator = { reference, next };
    } else {
      const locked = params.get("lock");
      if (!["a", "i", "s"].includes(locked)) return false;
      state.training = { reference, next, locked, checked: false, solved: false };
    }
    return true;
  }

  function shareUrl(base = canonicalBase) {
    const data = activeData();
    const url = new URL(base);
    if (isComplete(data.reference) && isComplete(data.next)) {
      url.searchParams.set("mode", state.mode);
      url.searchParams.set("r", `${data.reference.a}|${data.reference.i}|${data.reference.s}`);
      url.searchParams.set("n", `${data.next.a}|${data.next.i}|${data.next.s}`);
      if (state.mode === "training") url.searchParams.set("lock", data.locked);
    }
    return url.toString();
  }

  function stateQuery() {
    const data = activeData();
    if (!isComplete(data.reference) || !isComplete(data.next)) return "";
    const params = new URLSearchParams();
    params.set("mode", state.mode);
    params.set("r", `${data.reference.a}|${data.reference.i}|${data.reference.s}`);
    params.set("n", `${data.next.a}|${data.next.i}|${data.next.s}`);
    if (state.mode === "training") params.set("lock", data.locked);
    return params.toString();
  }

  function updateLanguageLink() {
    if (!alternateLink) return;
    const query = stateQuery();
    alternateLink.setAttribute("href", query ? `${alternatePath}?${query}` : alternatePath);
  }

  function createField(key, settings, options = {}) {
    const [name, note] = text.fields[key];
    const label = document.createElement("label");
    const title = document.createElement("b");
    const select = document.createElement("select");
    const hint = document.createElement("small");
    const placeholder = document.createElement("option");
    const disabled = options.disabled === true || options.locked === key;

    label.className = `field${options.locked === key ? " is-target" : ""}`;
    title.textContent = name;
    hint.textContent = note;
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = settings[key] === "";
    placeholder.textContent = text.select;
    select.append(placeholder);

    valuesFor(key).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = String(value) === String(settings[key]);
      select.append(option);
    });

    select.disabled = disabled;
    select.addEventListener("change", (event) => {
      settings[key] = key === "s" ? event.target.value : Number(event.target.value);
      if (state.mode === "training") state.training.checked = false;
      update();
    });
    label.append(title, select, hint);
    return label;
  }

  function renderFields() {
    const data = activeData();
    const training = state.mode === "training";
    document.getElementById("ref").replaceChildren(
      ...["a", "i", "s"].map((key) => createField(key, data.reference, { disabled: training })),
    );
    document.getElementById("next").replaceChildren(
      ...["a", "i", "s"].map((key) => createField(key, data.next, { locked: training ? data.locked : "" })),
    );
  }

  function applySuggestion(settings) {
    state.calculator.next = { ...settings };
    renderFields();
    update();
  }

  function renderSuccess(titleText = text.successTitle, paragraphText = text.successText, withNext = false) {
    const success = document.createElement("div");
    const icon = document.createElement("i");
    const copy = document.createElement("div");
    const strong = document.createElement("strong");
    const paragraph = document.createElement("p");
    success.className = "success";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✓";
    strong.textContent = titleText;
    paragraph.textContent = paragraphText;
    copy.append(strong, paragraph);
    if (withNext) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "primary-button hint-button";
      button.textContent = text.newTask;
      button.addEventListener("click", generateTrainingTask);
      copy.append(button);
    }
    success.append(icon, copy);
    elements.result.replaceChildren(success);
  }

  function renderCalculatorSuggestions(items) {
    const box = document.createElement("div");
    box.className = "suggestions";
    items.forEach(([description, value, settings]) => {
      const button = document.createElement("button");
      const small = document.createElement("small");
      const strong = document.createElement("strong");
      const action = document.createElement("span");
      button.type = "button";
      button.className = "suggestion";
      small.textContent = description;
      strong.textContent = value;
      action.textContent = text.apply;
      button.append(small, strong, action);
      button.addEventListener("click", () => applySuggestion(settings));
      box.append(button);
    });
    elements.result.replaceChildren(box);
  }

  function calculatorSuggestions(reference, next) {
    const target = exposure(reference);
    const iso = nearest(ISO_VALUES, (target * next.a * next.a) / shutterSeconds(next.s));
    const shutter = nearest(SHUTTERS, (target * next.a * next.a) / next.i, (item) => item[1])[0];
    const aperture = nearest(APERTURES, Math.sqrt((next.i * shutterSeconds(next.s)) / target));
    return [
      [text.keepApertureShutter, `ISO ${iso}`, { ...next, i: iso }],
      [text.keepApertureIso, shutter, { ...next, s: shutter }],
      [text.keepIsoShutter, `${text.fields.a[0]} ${aperture}`, { ...next, a: aperture }],
    ];
  }

  function updateCalculator() {
    const { reference, next } = state.calculator;
    if (!isComplete(reference) || !isComplete(next)) {
      elements.status.className = "status";
      elements.status.textContent = text.incompleteStatus;
      elements.title.textContent = text.incompleteTitle;
      elements.result.replaceChildren();
      return;
    }
    if (settingsEqual(reference, next)) {
      elements.status.className = "status";
      elements.status.textContent = text.sameStatus;
      elements.title.textContent = text.sameTitle;
      elements.result.replaceChildren();
      return;
    }

    const difference = stopsDifference(reference, next);
    const matches = Math.abs(difference) < 0.12;
    elements.status.className = `status${matches ? " ok" : ""}`;
    elements.status.textContent = matches
      ? text.matchedStatus
      : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} ${text.stops}`;
    if (matches) {
      elements.title.textContent = text.matchedTitle;
      renderSuccess();
    } else {
      elements.title.textContent = difference < 0 ? text.addLight : text.reduceLight;
      renderCalculatorSuggestions(calculatorSuggestions(reference, next));
    }
  }

  function bestTrainingHint() {
    const { reference, next, locked } = state.training;
    const candidates = calculatorSuggestions(reference, next)
      .map((item, index) => ({ item, key: ["i", "s", "a"][index] }))
      .filter((candidate) => candidate.key !== locked)
      .map((candidate) => ({
        ...candidate,
        error: Math.abs(stopsDifference(reference, candidate.item[2])),
      }))
      .sort((first, second) => first.error - second.error);
    const best = candidates[0];
    return `${text.hintPrefix} ${formatValue(best.key, best.item[2][best.key])}.`;
  }

  function renderTrainingFeedback(difference) {
    const feedback = document.createElement("div");
    const strong = document.createElement("strong");
    const paragraph = document.createElement("span");
    const hintButton = document.createElement("button");
    feedback.className = "training-feedback";
    strong.textContent = difference > 0 ? text.trainingTooLight : text.trainingTooDark;
    paragraph.textContent = `${difference > 0 ? "+" : ""}${difference.toFixed(1)} ${text.stops}`;
    hintButton.type = "button";
    hintButton.className = "utility-button hint-button";
    hintButton.textContent = text.showHint;
    hintButton.addEventListener("click", () => {
      paragraph.textContent = bestTrainingHint();
      hintButton.remove();
    });
    feedback.append(strong, paragraph, hintButton);
    elements.result.replaceChildren(feedback);
  }

  function updateTraining() {
    const training = state.training;
    const difference = stopsDifference(training.reference, training.next);
    elements.trainingInstruction.textContent = trainingInstruction();
    elements.scoreTotal.textContent = state.score.total;
    elements.scoreStreak.textContent = state.score.streak;

    if (!training.checked) {
      elements.status.className = "status";
      elements.status.textContent = text.trainingReadyStatus;
      elements.title.textContent = text.trainingReadyTitle;
      elements.result.replaceChildren();
      return;
    }

    const matches = Math.abs(difference) < 0.12;
    elements.status.className = `status${matches ? " ok" : ""}`;
    elements.status.textContent = matches
      ? text.matchedStatus
      : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} ${text.stops}`;
    if (matches) {
      elements.title.textContent = text.trainingCorrectTitle;
      renderSuccess(text.trainingCorrectTitle, text.trainingCorrectText, true);
    } else {
      elements.title.textContent = text.trainingWrongTitle;
      renderTrainingFeedback(difference);
    }
  }

  function trainingInstruction() {
    const { reference, next, locked } = state.training;
    const alternatives = ["a", "i", "s"]
      .filter((key) => key !== locked)
      .map((key) => text.alternativeFields[key])
      .join(language === "uk" ? " або " : " или ");
    return text.trainingInstruction(
      text.taskFields[locked],
      formatValue(locked, reference[locked]),
      formatValue(locked, next[locked]),
      alternatives,
    );
  }

  function renderMode() {
    const training = state.mode === "training";
    elements.calculatorMode.textContent = text.modeCalculator;
    elements.trainingMode.textContent = text.modeTraining;
    elements.calculatorMode.setAttribute("aria-pressed", String(!training));
    elements.trainingMode.setAttribute("aria-pressed", String(training));
    elements.random.textContent = training ? text.newTask : text.randomExample;
    elements.share.textContent = text.share;
    elements.check.textContent = text.check;
    elements.trainingBrief.hidden = !training;
    elements.check.hidden = !training;
    elements.reset.hidden = training;
    elements.referenceDescription.textContent = training ? text.trainingReference : text.calculatorReference;
    elements.nextDescription.textContent = training ? text.trainingNext : text.calculatorNext;
    elements.answerKicker.textContent = training ? text.trainingKicker : text.calculatorKicker;
    elements.note.textContent = training ? text.trainingNote : text.calculatorNote;
    document.querySelectorAll(".score small")[0].textContent = text.solved;
    document.querySelectorAll(".score small")[1].textContent = text.streak;
  }

  function update() {
    renderMode();
    if (state.mode === "training") updateTraining();
    else updateCalculator();
    updateLanguageLink();
  }

  function renderAll() {
    renderFields();
    update();
  }

  function randomSettings() {
    return {
      a: randomItem(APERTURES, 6, 23),
      i: randomItem(ISO_VALUES, 3, 18),
      s: randomItem(SHUTTER_VALUES, 10, 38),
    };
  }

  function generateCalculatorExample() {
    const reference = randomSettings();
    const next = randomSettings();
    if (settingsEqual(reference, next)) next.i = ISO_VALUES[ISO_VALUES.indexOf(next.i) + 1];
    state.calculator = { reference, next };
    renderAll();
  }

  function generateTrainingTask() {
    const reference = randomSettings();
    const locked = randomItem(["a", "i", "s"]);
    const values = valuesFor(locked);
    const currentIndex = values.indexOf(reference[locked]);
    const possibleOffsets = [-3, 3].filter((offset) => values[currentIndex + offset] !== undefined);
    const offset = randomItem(possibleOffsets);
    const next = { ...reference, [locked]: values[currentIndex + offset] };
    state.training = { reference, next, locked, checked: false, solved: false };
    renderAll();
    document.querySelector(`#next .field:not(.is-target) select`)?.focus();
  }

  function changeMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    if (mode === "training" && !validSettings(state.training.reference)) {
      generateTrainingTask();
      return;
    }
    renderAll();
  }

  function checkTrainingAnswer() {
    const training = state.training;
    training.checked = true;
    const matches = Math.abs(stopsDifference(training.reference, training.next)) < 0.12;
    if (matches && !training.solved) {
      state.score.total += 1;
      state.score.streak += 1;
      training.solved = true;
    } else if (!matches && !training.solved) {
      state.score.streak = 0;
    }
    update();
    saveScore();
  }

  async function copyShareLink() {
    const url = shareUrl();
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      copied = document.execCommand("copy");
      input.remove();
    }
    elements.shareStatus.textContent = copied ? text.shared : text.shareFailed;
    elements.shareStatus.hidden = false;
    window.setTimeout(() => { elements.shareStatus.hidden = true; }, 3000);
  }

  elements.calculatorMode.addEventListener("click", () => changeMode("calculator"));
  elements.trainingMode.addEventListener("click", () => changeMode("training"));
  elements.random.addEventListener("click", () => {
    if (state.mode === "training") generateTrainingTask();
    else generateCalculatorExample();
  });
  elements.share.addEventListener("click", copyShareLink);
  elements.check.addEventListener("click", checkTrainingAnswer);
  elements.reset.addEventListener("click", () => {
    state.calculator = { reference: EMPTY_SETTINGS(), next: EMPTY_SETTINGS() };
    renderAll();
    document.querySelector("#ref select")?.focus();
  });

  loadScore();
  loadSharedState();
  if (state.mode === "training" && !validSettings(state.training.reference)) generateTrainingTask();
  else renderAll();

  window.ExposureTrainer = Object.freeze({ exposure, stopsDifference });
})();
