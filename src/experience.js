// Pre-lock interpretation only. No persistence, network calls, or pack generation.
const HUMAN = "HUMAN";
const INTERPRETED = "THEDUCK-SUGGESTED + HUMAN-APPROVED";
const split = (text) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
const unique = (values) => [...new Set(values)];
export function createExperience(idea) {
  if (typeof idea !== "string" || idea.trim().length < 8 || idea.length > 5000)
    throw Error("Tell me a little more about the idea (8–5,000 characters).");
  return {
    version: 1,
    idea: idea.trim(),
    answers: {},
    suggestionChoices: {},
    corrections: [],
    accounted: [],
  };
}
export function answerExperience(state, id, answer) {
  const next = structuredClone(state);
  next.answers[id] = answer;
  return next;
}
export function chooseSuggestion(state, id, choice) {
  if (!["accepted", "rejected"].includes(choice))
    throw Error("Choose Accept or Reject.");
  return {
    ...structuredClone(state),
    suggestionChoices: { ...state.suggestionChoices, [id]: choice },
  };
}
export function correctExperience(state, text, field = "scope") {
  if (!text?.trim())
    throw Error("Tell me what I misunderstood or what you want to change.");
  if (text.length > 5000)
    throw Error("Keep this correction within 5,000 characters.");
  // Keep explicit earlier decisions. A correction conflicts visibly rather than erasing them.
  if (!["definition", "targetUser", "jtbd", "journey", "scope"].includes(field))
    throw Error("Choose which part to correct.");
  return {
    ...structuredClone(state),
    corrections: [...state.corrections, text.trim()],
    accounted: [],
    edits: { ...state.edits, [field]: text.trim() },
  };
}
export function shapeExperience(state) {
  createExperience(state.idea);
  const corrections = state.corrections || [];
  const text = [state.idea, ...corrections].join("\n");
  const lower = text.toLowerCase();
  const answers = state.answers || {};
  const rows = [];
  const questions = [];
  const proposals = [];
  const sources = {};
  const model = {
    idea: state.idea,
    definition: "",
    targetUser: "",
    jtbd: "",
    journey: [],
    scope: [],
    nonGoals: [],
    assumptions: [],
    constraints: [],
    acceptance: [],
  };
  const set = (field, value, source = text, kind = "INTERPRETED") => {
    model[field] = value;
    sources[field] = {
      origin: kind === "HUMAN" ? HUMAN : INTERPRETED,
      kind,
      source,
      value: structuredClone(value),
    };
  };
  const question = (id, title, why, options) => {
    questions.push({ id, title, why, options, answer: answers[id] || null });
  };
  const add = (field, value) => {
    model[field] = unique([...model[field], value]);
    if (!sources[field])
      sources[field] = {
        origin: INTERPRETED,
        kind: "INTERPRETED",
        source: text,
        value: [],
      };
    sources[field].value = structuredClone(model[field]);
  };
  // Narrow, transparent language rules. Unsupported statements remain visible for owner review.
  let category = "general";
  if (
    /antique|collectible|vintage/.test(lower) &&
    /photo|picture|camera|scan/.test(lower)
  )
    category = "antique";
  else if (
    /book|read|journal/.test(lower) &&
    /note|remember|journal|read/.test(lower)
  )
    category = "reading";
  else if (
    /leave|time off|holiday|vacation/.test(lower) &&
    /team|staff|manager|employee/.test(lower)
  )
    category = "leave";
  const covered =
    category === "antique"
      ? /antique|collectible|vintage|photo|picture|camera|scan|rough|value|worth|valuable|why|evidence|confidence|apprais|listing|price/gi
      : category === "reading"
        ? /book|read|journal|note|remember|forget|private|myself|personal|share|club/gi
        : category === "leave"
          ? /leave|time off|holiday|vacation|team|staff|manager|employee|approv|decision|date/gi
          : null;
  if (category === "antique") {
    set(
      "definition",
      "A photo-based antique guide that helps people understand what an object may be worth.",
    );
    set("targetUser", "People checking an antique or collectible");
    set("jtbd", "Understand an antique’s possible value from a photo");
    set("journey", [
      "Take a photo of the object",
      "Identify the likely object",
      "See what its value is based on",
    ]);
    set("scope", [
      "Photo input",
      "Likely object identification",
      "Value guidance",
    ]);
    const explicitEstimate = /rough|estimate|ballpark/.test(lower);
    const explicitListings = /comparable|sold listing|actual listing/.test(
      lower,
    );
    question(
      "value",
      "When you say value, what would be useful?",
      "A rough estimate and real comparable listings need different evidence and produce different results.",
      [
        {
          id: "estimate",
          label: "A rough estimate",
          value: "Give an approximate value, not a certified appraisal.",
        },
        {
          id: "listings",
          label: "Actual comparable listings",
          value: "Show actual comparable listings as evidence of value.",
        },
      ],
    );
    if (explicitEstimate && !explicitListings && !answers.value)
      questions.pop();
    if (explicitListings && !explicitEstimate && !answers.value)
      questions.pop();
    const mode =
      answers.value ||
      (explicitEstimate && !explicitListings
        ? "estimate"
        : explicitListings && !explicitEstimate
          ? "listings"
          : null);
    if (mode === "estimate") {
      set("jtbd", "Get a rough estimate of an antique’s value");
      add("journey", "See an approximate value");
      add("scope", "Approximate value estimate");
      add("nonGoals", "Certified appraisal");
      add(
        "acceptance",
        "Photograph an antique and see an approximate value clearly described as an estimate.",
      );
    } else if (mode === "listings") {
      set("jtbd", "Compare an antique with actual comparable listings");
      add("journey", "Review actual comparable listings");
      add("scope", "Actual comparable listings with their sources");
      add(
        "acceptance",
        "Photograph an antique and inspect the actual comparable listings used, including their sources.",
      );
      add(
        "assumptions",
        "A reliable source of comparable listings still needs to be established.",
      );
    }
    if (/why|explain|evidence|reason/.test(lower)) {
      add("journey", "Read why the evidence supports the result");
      add("scope", "Explanation of the evidence behind the result");
      add(
        "acceptance",
        "Read an explanation showing why the evidence supports the result.",
      );
    }
    proposals.push({
      id: "another-photo",
      field: "acceptance",
      value:
        "When the photo is too unclear to identify the object, ask for another photo instead of guessing.",
      title: "Ask for another photo when the first one is unclear",
      why: "This gives the person a useful next step and avoids pretending an uncertain result is reliable.",
    });
  } else if (category === "reading") {
    set(
      "definition",
      "A reading journal that helps people remember their books and notes.",
    );
    set(
      "targetUser",
      /club/.test(lower)
        ? "Members of a book club"
        : /myself|\bmy\b|personal/.test(lower)
          ? "You, as a reader"
          : "People who want to remember what they read",
    );
    set("jtbd", "Remember books and the thoughts they prompted");
    set("journey", [
      "Add a book",
      "Write a note about it",
      "Return to the note later",
    ]);
    set("scope", [
      "A record of books",
      "Notes attached to each book",
      "Reading saved notes again",
    ]);
    set("acceptance", [
      "Add a book and a note, then return later and find the same note with that book.",
    ]);
    if (
      /share|club|friends/.test(lower) &&
      !/only me|just me|private/.test(lower)
    ) {
      question(
        "readers",
        "Who should be able to read the notes?",
        "This changes whether notes are private or shared with other people.",
        [
          {
            id: "private",
            label: "Just me",
            value: "Only the owner can read their notes.",
          },
          {
            id: "club",
            label: "My book club",
            value: "Members of the same book club can read shared notes.",
          },
        ],
      );
      if (answers.readers === "private") {
        set("targetUser", "Individual readers");
        add("constraints", "Only the owner can read their notes.");
      }
      if (answers.readers === "club") {
        set("targetUser", "Members of a book club");
        add("scope", "Share notes within the book club");
        add(
          "constraints",
          "Only members of the same book club can read shared notes.",
        );
      }
    }
    if (/private|only me|just me/.test(lower))
      add("constraints", "Only the owner can read their notes.");
    proposals.push({
      id: "find-notes",
      field: "scope",
      value: "Search saved notes by book title.",
      title: "Find an old note by its book title",
      why: "Once the journal grows, this makes it easier to revisit a thought without scrolling through every book.",
    });
  } else if (category === "leave") {
    set(
      "definition",
      "A shared leave-request flow so staff can request time off and see a clear decision.",
    );
    set("targetUser", "Staff and the people who approve their time off");
    set("jtbd", "Get a clear decision on requested time off");
    set("journey", [
      "Staff enters the dates they need off",
      "The request is reviewed",
      "Staff sees the decision",
    ]);
    set("scope", [
      "Submit requested dates",
      "Review a leave request",
      "Show the decision to the requester",
    ]);
    set("acceptance", [
      "Submit requested dates and verify that the requester sees the reviewer’s decision for those dates.",
    ]);
    if (!/manager.*approv|approv.*manager/.test(lower))
      question(
        "reviewer",
        "Who gives the final yes or no?",
        "The answer determines who is allowed to approve a request.",
        [
          {
            id: "manager",
            label: "Their manager",
            value: "The requester’s manager approves or declines the request.",
          },
          {
            id: "owner",
            label: "The business owner",
            value: "The business owner approves or declines the request.",
          },
        ],
      );
    const reviewer =
      answers.reviewer ||
      (/manager.*approv|approv.*manager/.test(lower) ? "manager" : null);
    if (reviewer)
      add(
        "constraints",
        reviewer === "manager"
          ? "The requester’s manager approves or declines the request."
          : "The business owner approves or declines the request.",
      );
    proposals.push({
      id: "no-self-approval",
      field: "constraints",
      value: "A requester cannot approve their own leave request.",
      title: "Keep approval separate from requesting",
      why: "This prevents someone from accidentally deciding their own request.",
    });
  } else {
    // Retain unknown ideas verbatim rather than pretending to have understood them.
    set("definition", state.idea, state.idea, "HUMAN");
    question(
      "example",
      "Who would use this, and what would they do in one useful visit?",
      "I cannot yet tell who needs this or what the main experience would be. One concrete example can resolve both.",
      [],
    );
    const example =
      typeof answers.example === "string" ? answers.example.trim() : "";
    if (example) {
      set(
        "targetUser",
        "The person described in your example",
        example,
        "INTERPRETED",
      );
      set("jtbd", example, example, "HUMAN");
      set("journey", [example], example, "HUMAN");
      set("scope", [state.idea, example], state.idea + "\n" + example, "HUMAN");
      set(
        "acceptance",
        [
          `Try the visit you described and check that you can complete it: ${example}`,
        ],
        example,
      );
    }
  }
  // Preserve explicit constraints regardless of the main product family.
  if (/offline|without (a )?(network|internet)/.test(lower)) {
    add(
      "constraints",
      "The core experience must be available without an internet connection.",
    );
    add(
      "acceptance",
      "Complete the core experience with the internet connection turned off.",
    );
  }
  if (/medical|diagnos|bank|payment|real.?time/.test(lower)) {
    question(
      "risk",
      "What must this never get wrong?",
      "Your idea includes a requirement where failure could materially change whether the product is safe or useful.",
      [],
    );
    if (typeof answers.risk === "string" && answers.risk.trim())
      add("constraints", answers.risk.trim());
  }
  // Bind every chosen answer to the decision it made, separately from inferred text.
  for (const q of questions) {
    if (!q.answer) continue;
    if (q.options.length && !q.options.some((o) => o.id === q.answer))
      throw Error("Choose one of the displayed answers.");
    if (!q.options.length && typeof q.answer !== "string")
      throw Error("Answer in your own words.");
    rows.push({
      said: q.options.find((o) => o.id === q.answer)?.label || q.answer,
      placed: q.options.find((o) => o.id === q.answer)?.value || q.answer,
      status: "PRESERVED",
      source: "Your answer",
      fields:
        q.id === "value"
          ? ["jtbd", "journey", "scope", "acceptance"]
          : q.id === "readers"
            ? ["targetUser", "scope", "constraints"]
            : ["constraints"],
    });
  }
  if (category === "antique") {
    for (const [pattern, placed, field] of [
      [/photo|picture|camera|scan/i, "Take a photo of the object", "journey"],
      [
        /rough|estimate|ballpark/i,
        "Approximate value, not a certified appraisal",
        "jtbd",
      ],
      [
        /why|explain|evidence|reason/i,
        "Explain the evidence behind the result",
        "scope",
      ],
    ]) {
      const match = state.idea.match(pattern);
      if (match)
        rows.push({
          said: match[0],
          placed,
          status: "PRESERVED",
          source: "Your original wording",
          fields: [field],
        });
    }
  }
  for (const [index, statement] of split(state.idea).entries()) {
    const known = covered && new RegExp(covered.source, "i").test(statement);
    // A matched noun does not imply every extra request was understood. Show the entire statement.
    const accounted = (state.accounted || []).includes(index);
    rows.push({
      id: index,
      said: statement,
      placed: known
        ? `${model.definition} → ${model.journey.join(" → ")}`
        : "Retained in your original idea. I need you to check where it belongs before locking.",
      status: accounted ? "PRESERVED" : "UNRESOLVED",
      source: "Your original idea",
      fields: ["definition", "scope"],
    });
  }
  for (const correction of corrections) {
    const field = Object.keys(state.edits || {}).find(key => state.edits[key] === correction);
    const labels = {definition: "what you’re building", targetUser: "who it’s for", jtbd: "what it helps them do", journey: "the core experience", scope: "what matters in the first version"};
    rows.push({
      said: correction,
      placed: field ? `Applied to ${labels[field]}.` : "Earlier wording, replaced by a later correction.",
      status: field ? "PRESERVED" : "INTERPRETED",
      source: "Your correction",
      fields: field ? [field] : [],
    });
  }
  // Natural corrections for the most material choices; earlier answers stay visible if they conflict.
  const latest = corrections.at(-1) || "";
  const userMatch = latest.match(
    /(?:it(?:'s| is) for|for users? (?:who|like)|the users? (?:is|are))\s+(.+?)(?:[.!\n]|$)/i,
  );
  if (userMatch) set("targetUser", userMatch[1].trim(), latest, "HUMAN");
  for (const [field, value] of Object.entries(state.edits || {})) {
    if (
      !["definition", "targetUser", "jtbd", "journey", "scope"].includes(
        field,
      ) ||
      typeof value !== "string" ||
      !value.trim()
    )
      throw Error("Invalid correction.");
    set(
      field,
      ["journey", "scope"].includes(field)
        ? value
            .split(/\n|→/)
            .map((s) => s.trim())
            .filter(Boolean)
        : value.trim(),
      value,
      "HUMAN",
    );
  }
  if (state.edits?.journey)
    set(
      "acceptance",
      [
        `Follow this experience and check that you can finish it: ${model.journey.join(" → ")}`,
      ],
      state.edits.journey,
    );
  const conflict =
    (answers.value === "estimate" &&
      /actual comparable|actual listing/.test(latest.toLowerCase())) ||
    (answers.value === "listings" &&
      /rough estimate|not.*listing/.test(latest.toLowerCase()));
  for (const row of rows)
    if (row.id !== undefined)
      row.placed = `${model.definition} → ${model.journey.join(" → ")}`;
  const blocking = [];
  if (conflict)
    blocking.push(
      "Your correction and earlier value choice disagree. Update that choice so we keep the decision you actually want.",
    );
  for (const q of questions)
    if (!q.answer || (typeof q.answer === "string" && !q.answer.trim()))
      blocking.push(q.title);
  // Only truly unknown statements block. Every original statement needs an explicit fidelity review,
  // even recognized ones; this avoids equating keyword matching with semantic coverage.
  for (const row of rows.filter((r) => r.status === "UNRESOLVED"))
    blocking.push(`Check this part of your idea: “${row.said}”`);
  const acceptedSuggestions = [];
  for (const proposal of proposals) {
    const choice = state.suggestionChoices?.[proposal.id] || "undecided";
    proposal.choice = choice;
    if (choice === "accepted") {
      model[proposal.field] = unique([
        ...model[proposal.field],
        proposal.value,
      ]);
      acceptedSuggestions.push({ ...proposal, origin: INTERPRETED });
    }
    rows.push({
      said: "—",
      placed: proposal.value,
      status: "THEDUCK SUGGESTION",
      choice,
      fields: [proposal.field],
    });
  }
  for (const field of ["nonGoals", "constraints", "assumptions"])
    if (!sources[field])
      sources[field] = {
        origin: HUMAN,
        kind: "UNSPECIFIED",
        source: "No decision supplied",
        value: [],
      };
  // Describe provenance per field, while preserving exact raw wording, answer history and suggestions.
  for (const field of Object.keys(model).filter((f) => f !== "idea"))
    if (!sources[field])
      sources[field] = {
        origin: HUMAN,
        kind: "UNRESOLVED",
        source: state.idea,
        value: model[field],
      };
  for (const row of rows.filter(r => r.source === "Your answer")) {
    for (const field of row.fields) {
      if (sources[field] && !state.edits?.[field]) sources[field].source += `\nHuman choice: ${row.said} — ${row.placed}`;
    }
  }
  const fidelity = rows;
  return {
    category,
    model,
    sources,
    questions: questions.slice(0, 3),
    proposals,
    acceptedSuggestions,
    fidelity,
    blocking: unique(blocking),
    questionCount: questions.length,
    corrections,
  };
}
export function accountStatement(state, index) {
  return {
    ...structuredClone(state),
    accounted: unique([...(state.accounted || []), index]),
  };
}
