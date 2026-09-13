// Vendor-neutral, pre-lock data boundary. This module cannot create a lock.
export const intentFields = [
  "definition",
  "targetUser",
  "jtbd",
  "journey",
  "scope",
  "nonGoals",
  "constraints",
  "assumptions",
  "acceptance",
];
export const listFields = intentFields.slice(3);
export const fieldLabels = {
  definition: "what you’re building",
  targetUser: "who it’s for",
  jtbd: "what it helps them do",
  journey: "the core experience",
  scope: "the first version",
  nonGoals: "what is left out",
  constraints: "the promises to keep",
  assumptions: "what is still uncertain",
  acceptance: "how you’ll know it is ready",
};
const requiredFields = [
  "definition",
  "targetUser",
  "jtbd",
  "journey",
  "scope",
  "acceptance",
];
const object = (properties) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});
const string = { type: "string", maxLength: 5000 };
const array = (items, maxItems = 40) => ({ type: "array", items, maxItems });
const fieldName = { type: "string", enum: intentFields };
const value = { anyOf: [string, array(string)] };
export const interpretationSchema = object({
  fields: object(
    Object.fromEntries(
      intentFields.map((field) => [
        field,
        object({
          value: listFields.includes(field) ? array(string) : string,
          kind: {
            type: "string",
            enum: ["HUMAN", "INTERPRETED", "UNRESOLVED"],
          },
          sourceIds: array(string),
        }),
      ]),
    ),
  ),
  questions: array(
    object({
      id: string,
      title: string,
      why: string,
      field: fieldName,
      options: array(object({ id: string, label: string, value }), 4),
    }),
    3,
  ),
  suggestions: array(
    object({
      id: string,
      title: string,
      why: string,
      field: { type: "string", enum: listFields },
      value: string,
    }),
    3,
  ),
  fidelity: array(
    object({
      sourceId: string,
      field: fieldName,
      status: {
        type: "string",
        enum: ["PRESERVED", "INTERPRETED", "UNRESOLVED"],
      },
    }),
    100,
  ),
  unresolved: array(object({ field: fieldName, reason: string }), 20),
});
function validateShape(value, schema, path = "interpretation") {
  if (schema.anyOf) {
    if (
      schema.anyOf.some((s) => {
        try {
          validateShape(value, s, path);
          return true;
        } catch {
          return false;
        }
      })
    )
      return;
    throw Error(`${path}: wrong value type`);
  }
  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error(`${path}: expected object`);
    if (Object.keys(value).some((k) => !Object.hasOwn(schema.properties, k)))
      throw Error(`${path}: unexpected property`);
    for (const [key, rule] of Object.entries(schema.properties))
      validateShape(value[key], rule, `${path}.${key}`);
  } else if (schema.type === "array") {
    if (!Array.isArray(value) || value.length > schema.maxItems)
      throw Error(`${path}: invalid list`);
    value.forEach((v, i) => validateShape(v, schema.items, `${path}[${i}]`));
  } else if (typeof value !== "string" || value.length > schema.maxLength)
    throw Error(`${path}: invalid text`);
  if (schema.enum && !schema.enum.includes(value))
    throw Error(`${path}: invalid choice`);
}
export function sourcesFor(state) {
  const parts = state.idea.match(/[^.!?\n]+[.!?]?/g) || [state.idea];
  const sources = parts
    .map((text, i) => ({ id: `idea:${i}`, text: text.trim() }))
    .filter((s) => s.text);
  for (const [field, text] of Object.entries(state.edits || {}))
    sources.push({ id: `edit:${field}`, text });
  for (const q of state.semantic?.initial.questions || [])
    if (state.answers?.[q.id]) {
      const option = q.options.find((o) => o.id === state.answers[q.id]);
      sources.push({
        id: `answer:${q.id}`,
        text: option ? JSON.stringify(option.value) : state.answers[q.id],
      });
    }
  return sources;
}
export function validateInterpretation(raw, sources) {
  validateShape(raw, interpretationSchema);
  const byId = new Map(sources.map((s) => [s.id, s.text]));
  const checkValue = (field, value) => {
    if (
      listFields.includes(field)
        ? !Array.isArray(value) || value.some((v) => !v.trim())
        : typeof value !== "string"
    )
      throw Error(`Wrong value for ${field}`);
  };
  for (const [field, entry] of Object.entries(raw.fields)) {
    checkValue(field, entry.value);
    if (entry.sourceIds.some((id) => !byId.has(id)))
      throw Error(`Unknown source for ${field}`);
    if (
      entry.value.length &&
      entry.kind !== "UNRESOLVED" &&
      !entry.sourceIds.length
    )
      throw Error(`Missing source for ${field}`);
    if (entry.kind === "HUMAN")
      for (const v of Array.isArray(entry.value)
        ? entry.value
        : [entry.value]) {
        if (v && !entry.sourceIds.some((id) => byId.get(id).includes(v)))
          throw Error(`Unattributed human wording for ${field}`);
      }
  }
  for (const collection of [raw.questions, raw.suggestions]) {
    const ids = collection.map((q) => q.id);
    if (
      new Set(ids).size !== ids.length ||
      ids.some(
        (id) => !id || ["__proto__", "constructor", "prototype"].includes(id),
      )
    )
      throw Error("Invalid decision identifiers");
  }
  for (const q of raw.questions) {
    if (!q.title.trim() || !q.why.trim())
      throw Error("Question lacks a material rationale");
    const ids = q.options.map((o) => o.id);
    if (new Set(ids).size !== ids.length || ids.some((id) => !id))
      throw Error("Invalid answer identifiers");
    q.options.forEach((o) => checkValue(q.field, o.value));
    if (
      q.options.length === 1 ||
      (q.options.length &&
        new Set(q.options.map((o) => JSON.stringify(o.value))).size < 2)
    )
      throw Error("Question does not offer materially different answers");
  }
  for (const row of raw.fidelity)
    if (!byId.has(row.sourceId)) throw Error("Unknown fidelity source");
  for (const s of raw.suggestions) {
    if (!s.title.trim() || !s.why.trim() || !s.value.trim())
      throw Error("Incomplete suggestion");
    if (JSON.stringify(raw.fields).includes(s.value))
      throw Error("Suggestion leaked into the base interpretation");
  }
  return structuredClone(raw);
}
export function createSemanticExperience(idea) {
  if (typeof idea !== "string" || idea.trim().length < 8 || idea.length > 5000)
    throw Error("Tell me a little more about the idea (8–5,000 characters).");
  return {
    version: 2,
    idea: idea.trim(),
    answers: {},
    suggestionChoices: {},
    corrections: [],
    edits: {},
    accounted: [],
    semantic: null,
  };
}
export function acceptInterpretation(state, response) {
  if (!response || !response.interpretation)
    throw Error("The provider returned no interpretation.");
  if (state.semantic && Object.keys(state.suggestionChoices).length)
    throw Error(
      "Keep your reviewed suggestions. Model refresh is unavailable after suggestion decisions.",
    );
  if (state.semantic?.updates >= 1)
    throw Error(
      "This draft has already used its one semantic update. Corrections remain available without a model call.",
    );
  const inputSources = sourcesFor(state);
  const interpretation = validateInterpretation(
    response.interpretation,
    inputSources,
  );
  if (state.semantic)
    for (const s of state.semantic.initial.suggestions)
      if (JSON.stringify(interpretation.fields).includes(s.value))
        throw Error(
          "A suggestion appeared in the model’s base interpretation. Keep the previous draft and retry.",
        );
  const next = structuredClone(state);
  next.semantic = {
    initial: state.semantic?.initial || interpretation,
    current: interpretation,
    sources: inputSources,
    provider: response.provider,
    updates: state.semantic ? 1 : 0,
  };
  next.accounted = [];
  return next;
}
export function shapeSemantic(state) {
  const sources = {},
    model = { idea: state.idea },
    blocking = [],
    fidelity = [];
  if (!state.semantic)
    throw Error(
      "Your idea has not been interpreted yet. Retry the model or open a labelled sample.",
    );
  const raw = validateInterpretation(
    state.semantic.current,
    state.semantic.sources,
  );
  const initial = validateInterpretation(
    state.semantic.initial,
    state.semantic.sources,
  );
  const byId = new Map(state.semantic.sources.map((s) => [s.id, s.text]));
  for (const field of intentFields) {
    const entry = raw.fields[field];
    model[field] = structuredClone(entry.value);
    sources[field] = {
      value: structuredClone(entry.value),
      kind: entry.kind,
      origin:
        entry.kind === "HUMAN" ? "HUMAN" : "THEDUCK-SUGGESTED + HUMAN-APPROVED",
      source:
        entry.sourceIds.map((id) => byId.get(id)).join("\n") ||
        "Still unresolved",
    };
  }
  const decided = new Set();
  const applyHuman = (field, value, source) => {
    model[field] = listFields.includes(field)
      ? Array.isArray(value)
        ? structuredClone(value)
        : value
            .split(/\n|→/)
            .map((v) => v.trim())
            .filter(Boolean)
      : value.trim();
    sources[field] = {
      value: structuredClone(model[field]),
      kind: "HUMAN",
      origin: "HUMAN",
      source,
    };
    decided.add(field);
  };
  const questions = initial.questions.map((q) => ({
    ...q,
    answer: state.answers[q.id] || null,
  }));
  for (const q of questions) {
    if (!q.answer) {
      blocking.push(q.title);
      continue;
    }
    const option = q.options.find((o) => o.id === q.answer);
    if (q.options.length && !option) throw Error("Choose a displayed answer.");
    if (typeof q.answer !== "string" || !q.answer.trim())
      throw Error("Answer in your own words.");
    applyHuman(
      q.field,
      option?.value || q.answer,
      `${q.title}\n${option?.label || q.answer}`,
    );
    fidelity.push({
      said: option?.label || q.answer,
      placed: Array.isArray(model[q.field])
        ? model[q.field].join(" → ")
        : model[q.field],
      status: "PRESERVED",
      source: "Your answer",
      fields: [q.field],
    });
  }
  for (const [field, text] of Object.entries(state.edits || {})) {
    if (
      !intentFields.includes(field) ||
      typeof text !== "string" ||
      !text.trim()
    )
      throw Error("Invalid human correction");
    applyHuman(field, text, text);
    fidelity.push({
      said: text,
      placed: `Your correction is applied to ${fieldLabels[field]}.`,
      status: "PRESERVED",
      source: "Your correction",
      fields: [field],
    });
  }
  for (const issue of raw.unresolved)
    if (!decided.has(issue.field)) blocking.push(issue.reason);
  for (const field of intentFields) {
    if (raw.fields[field].kind === "UNRESOLVED" && !decided.has(field))
      blocking.push(`This part is still unclear: ${fieldLabels[field]}`);
    if (requiredFields.includes(field) && !model[field].length)
      blocking.push(`This part needs a decision: ${fieldLabels[field]}`);
  }
  for (const source of sourcesFor(state).filter((s) =>
    s.id.startsWith("idea:"),
  )) {
    const maps = raw.fidelity.filter((r) => r.sourceId === source.id);
    const unresolved =
      !maps.length || maps.some((r) => r.status === "UNRESOLVED");
    const accounted = state.accounted.includes(source.id);
    const fields = [...new Set(maps.map((r) => r.field))];
    const placed = fields
      .map((f) => (Array.isArray(model[f]) ? model[f].join(" → ") : model[f]))
      .filter(Boolean)
      .join(" · ");
    fidelity.push({
      id: source.id,
      said: source.text,
      placed:
        placed ||
        "This statement has not been mapped. Correct the shaped idea before accounting for it.",
      status:
        unresolved && !accounted
          ? "UNRESOLVED"
          : maps.every((r) => r.status === "PRESERVED")
            ? "PRESERVED"
            : "INTERPRETED",
      fields,
    });
    if (unresolved && !accounted)
      blocking.push(`This part is still unclear: ${source.text}`);
  }
  const acceptedSuggestions = [];
  const proposals = initial.suggestions.map((s) => ({
    ...s,
    choice: state.suggestionChoices[s.id] || "undecided",
  }));
  for (const s of proposals) {
    if (s.choice === "accepted") {
      if (!model[s.field].includes(s.value)) model[s.field].push(s.value);
      acceptedSuggestions.push({
        ...s,
        origin: "THEDUCK-SUGGESTED + HUMAN-APPROVED",
      });
    }
    fidelity.push({
      said: "—",
      placed: s.value,
      status: "THEDUCK SUGGESTION",
      choice: s.choice,
      fields: [s.field],
    });
  }
  return {
    model,
    sources,
    questions,
    questionCount: questions.length,
    proposals,
    acceptedSuggestions,
    fidelity,
    blocking: [...new Set(blocking)],
    corrections: state.corrections,
  };
}
