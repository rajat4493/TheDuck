import { lock, verify, generate } from "/intent.js";
import {
  createExperience,
  shapeExperience,
  answerExperience,
  chooseSuggestion,
  correctExperience,
  accountStatement,
} from "/experience.js";
const app = document.querySelector("#app");
const error = document.querySelector("#error");
let conversation, envelope;
const el = (tag, text, cls) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
};
function report(e) {
  error.textContent = e.message;
  error.hidden = false;
  error.scrollIntoView({ block: "nearest" });
}
function stage(n) {
  app.replaceChildren();
  error.hidden = true;
  document.querySelectorAll("#progress li").forEach((li, i) => {
    li.classList.toggle("active", i === n);
    if (i === n) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
}
function button(text, action, secondary = false) {
  const b = el("button", text, secondary ? "secondary" : "");
  b.type = "button";
  b.onclick = async () => {
    b.disabled = true;
    try {
      await action();
    } catch (e) {
      report(e);
    } finally {
      b.disabled = false;
    }
  };
  return b;
}
function actions(...buttons) {
  const row = el("div", undefined, "actions");
  row.append(...buttons);
  app.append(row);
}
function title(text, hint) {
  const heading = el("h2", text);
  heading.tabIndex = -1;
  app.append(heading);
  if (hint) app.append(el("p", hint, "hint"));
  heading.focus();
}
function input(id, caption, value = "") {
  const label = el("label", caption);
  label.htmlFor = id;
  const box = el("textarea");
  box.id = id;
  box.value = value;
  box.maxLength = 5000;
  app.append(label, box);
  return box;
}
function save() {
  try {
    localStorage.setItem("theduck-conversation", JSON.stringify(conversation));
    localStorage.setItem("theduck-conversation-active", "true");
  } catch {
    report(
      Error(
        "Your browser cannot save this draft. Keep this tab open and copy your final files before closing.",
      ),
    );
  }
}
function start() {
  stage(0);
  title(
    "What do you want to build?",
    "Tell me like you’d tell a friend. A messy idea is a perfectly good start.",
  );
  const idea = input("idea", "Your idea", conversation?.idea || "");
  idea.rows = 7;
  idea.placeholder =
    "I want to take a photo of an antique and find out if it’s valuable — and why…";
  actions(
    button("Make sense of my idea →", () => {
      if (!conversation || conversation.idea !== idea.value.trim())
        conversation = createExperience(idea.value);
      save();
      heard();
    }),
  );
  app.append(
    el(
      "p",
      "Local preview · Your words stay in this browser. Language rules help shape familiar ideas; anything unclear stays visible for you to correct.",
      "hint privacy",
    ),
  );
  if (envelope) actions(button("Return to my saved lock", showPacks, true));
}
function block(label, value, cls = "") {
  if (!value?.length) return;
  const card = el("section", undefined, `product-part ${cls}`);
  card.append(el("h3", label));
  if (Array.isArray(value)) {
    const list = el("ul");
    for (const item of value) list.append(el("li", item));
    card.append(list);
  } else card.append(el("p", value));
  app.append(card);
}
function heard() {
  const shaped = shapeExperience(conversation);
  stage(1);
  title(
    "Here’s what I heard",
    "This is my interpretation, not a decision made for you.",
  );
  block("What you’re building", shaped.model.definition);
  block(
    "Who I think it’s for",
    shaped.model.targetUser || "I’m not sure who would use this yet.",
  );
  block(
    "What it helps them do",
    shaped.model.jtbd ||
      "I need a concrete example to understand the main result.",
  );
  block("The experience", shaped.model.journey.join(" → "), "journey");
  const pending = shaped.questions.filter((q) => !q.answer);
  if (pending.length)
    block(
      "One thing to make clear",
      pending.map((q) => q.title),
    );
  actions(
    button(
      pending.length
        ? "Yes — let’s make that clear →"
        : "Yes — shape my idea →",
      nextQuestion,
    ),
    button("You misunderstood me", () => correction("misunderstood"), true),
  );
}
function nextQuestion() {
  const shaped = shapeExperience(conversation);
  const q = shaped.questions.find((q) => !q.answer);
  if (!q) {
    shapedIdea();
    return;
  }
  stage(1);
  title(q.title, q.why);
  if (q.options.length) {
    for (const option of q.options) {
      const b = button(
        option.label,
        () => {
          conversation = answerExperience(conversation, q.id, option.id);
          save();
          nextQuestion();
        },
        true,
      );
      b.classList.add("choice");
      app.append(b);
    }
  } else {
    const answer = input("answer", "In your own words");
    actions(
      button("That’s what I mean →", () => {
        if (!answer.value.trim())
          throw Error("Tell me a little more so I don’t have to guess.");
        conversation = answerExperience(
          conversation,
          q.id,
          answer.value.trim(),
        );
        save();
        nextQuestion();
      }),
    );
  }
  actions(button("Back to what you heard", heard, true));
}
function correction(mode) {
  stage(2);
  title(
    mode === "misunderstood"
      ? "Let’s get your idea right"
      : "What should change?",
    "Your earlier choices and suggestions stay saved. Correct just the part that needs it, then review the whole idea again.",
  );
  const label = el("label", "Which part did I get wrong?");
  label.htmlFor = "correction-part";
  const select = el("select");
  select.id = "correction-part";
  for (const [value, text] of Object.entries({
    definition: "What you’re building",
    targetUser: "Who it’s for",
    jtbd: "What it helps them do",
    journey: "The core experience",
    scope: "What matters in the first version",
  })) {
    const option = el("option", text);
    option.value = value;
    select.append(option);
  }
  app.append(label, select);
  const words = input("correction", "Tell me how it should read");
  actions(
    button("Update my idea →", () => {
      conversation = correctExperience(conversation, words.value, select.value);
      save();
      shapedIdea();
    }),
    button("Keep my current version", shapedIdea, true),
  );
}
function shapedIdea() {
  const shaped = shapeExperience(conversation);
  stage(2);
  title(
    "Your idea, shaped",
    "Your words, made clearer. Check my interpretation and keep only the suggestions you want.",
  );
  block("What you’re building", shaped.model.definition);
  block("Who it’s for", shaped.model.targetUser);
  block("What it helps them do", shaped.model.jtbd);
  block("The core experience", shaped.model.journey.join(" → "), "journey");
  const acceptedValues = shaped.acceptedSuggestions.map((s) => s.value);
  block(
    "What matters in the first version",
    shaped.model.scope.filter((s) => !acceptedValues.includes(s)),
  );
  block(
    "Keep these promises",
    shaped.model.constraints.filter((s) => !acceptedValues.includes(s)),
  );
  block("Not part of this idea", shaped.model.nonGoals);
  block(
    "You’ll know it’s ready when",
    shaped.model.acceptance.filter((s) => !acceptedValues.includes(s)),
  );
  block("Still unresolved", shaped.model.assumptions);
  const decisions = shaped.questions.filter((q) => q.answer);
  if (decisions.length) {
    app.append(el("h3", "Your choices so far"));
    for (const q of decisions) {
      const row = el("div", undefined, "decision");
      row.append(
        el(
          "p",
          `${q.title} ${q.options.find((o) => o.id === q.answer)?.label || q.answer}`,
        ),
        button(
          "Change this choice",
          () => {
            conversation = answerExperience(conversation, q.id, null);
            save();
            nextQuestion();
          },
          true,
        ),
      );
      app.append(row);
    }
  }
  app.append(el("h3", "What TheDuck suggested"));
  if (!shaped.proposals.length)
    app.append(el("p", "No extra suggestions for this idea."));
  for (const s of shaped.proposals) {
    const card = el("section", undefined, "suggestion");
    card.append(
      el("span", "THEDUCK SUGGESTION", "tag"),
      el("h4", s.title),
      el("p", s.value),
      el("p", s.why, "hint"),
    );
    const row = el("div", undefined, "actions");
    for (const [choice, label] of [
      ["accepted", "Accept"],
      ["rejected", "Reject"],
    ]) {
      const b = button(
        label,
        () => {
          conversation = chooseSuggestion(conversation, s.id, choice);
          save();
          shapedIdea();
        },
        choice !== s.choice,
      );
      b.setAttribute("aria-pressed", String(choice === s.choice));
      row.append(b);
    }
    card.append(
      row,
      el(
        "p",
        s.choice === "accepted"
          ? "Accepted — this will be part of your lock."
          : s.choice === "rejected"
            ? "Rejected — this will not enter your lock or packs."
            : "Optional. It stays out unless you accept it.",
        "hint",
      ),
    );
    app.append(card);
  }
  app.append(
    el("h3", "Idea Fidelity"),
    el("p", "MY IDEA → INTERPRETATION → SUGGESTIONS → LOCK", "eyebrow"),
    el(
      "p",
      "Check every part of your original idea. Nothing gets a pretend score. If a detail is missing, correct it before marking it captured.",
      "hint",
    ),
  );
  for (const row of shaped.fidelity) {
    const card = el("section", undefined, "fidelity-row");
    card.append(
      el("span", row.status, "tag"),
      el(
        "h4",
        row.said === "—" ? "TheDuck proposed" : `You said: “${row.said}”`,
      ),
      el("p", row.placed),
    );
    if (row.choice) card.append(el("p", row.choice, "hint"));
    if (row.id !== undefined && row.status === "UNRESOLVED")
      card.append(
        button(
          "This is captured in my shaped idea",
          () => {
            conversation = accountStatement(conversation, row.id);
            save();
            shapedIdea();
          },
          true,
        ),
      );
    app.append(card);
  }
  const pending = shaped.questions.filter((q) => !q.answer);
  if (pending.length) {
    block(
      "Before you lock",
      pending.map((q) => q.title),
    );
    actions(button("Answer the open decision", nextQuestion));
  }
  if (shaped.blocking.length)
    app.append(
      el(
        "p",
        "Before locking, resolve the open decisions and check each original statement above.",
        "lock-note",
      ),
    );
  app.append(
    el(
      "p",
      "Locking means you approve this interpretation and the suggestions you accepted. The three packs will describe this exact product.",
      "hint",
    ),
  );
  const yes = button("Yes, lock it", async () => {
    envelope = await lock({ experience: conversation }, true);
    let storageError = false;
    try {
      localStorage.setItem("theduck-lock", JSON.stringify(envelope));
      localStorage.setItem("theduck-conversation-active", "false");
    } catch {
      storageError = true;
    }
    await showPacks();
    if (storageError)
      report(
        Error(
          "Your intent is locked in this tab, but the browser could not save it. Copy or download it before closing.",
        ),
      );
  });
  yes.disabled = shaped.blocking.length > 0;
  actions(
    yes,
    button("Almost — change something", () => correction("almost"), true),
    button("You misunderstood me", () => correction("misunderstood"), true),
  );
}
function download(name, content, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function showPacks() {
  const bundle = await generate(envelope);
  stage(3);
  title(
    "Your product intent is locked.",
    "Your intent is locked. All three packs are views of the same approved contract.",
  );
  app.append(
    el(
      "p",
      "Keep your canonical lock with the packs. These documents do not mean the product has been built or verified.",
      "lock-note",
    ),
    el("code", bundle.fingerprint),
  );
  actions(
    button("Download canonical lock", () =>
      download(
        "theduck-lock.json",
        JSON.stringify(envelope, null, 2),
        "application/json",
      ),
    ),
    button(
      "Download all pack files (JSON)",
      () =>
        download(
          "theduck-packs.json",
          JSON.stringify(bundle, null, 2),
          "application/json",
        ),
      true,
    ),
  );
  const portable = el("details");
  portable.append(el("summary", "Copy your lock and packs as text"));
  portable.append(
    el(
      "p",
      "If downloads are unavailable, select this text and copy it into a file named theduck-project.json. It contains the original lock and every pack file.",
      "hint",
    ),
  );
  const exportLabel = el("label", "Portable project JSON");
  exportLabel.htmlFor = "portable-json";
  const exportText = el("textarea");
  exportText.id = "portable-json";
  exportText.readOnly = true;
  exportText.rows = 8;
  exportText.value = JSON.stringify({ envelope, bundle }, null, 2);
  portable.append(
    exportLabel,
    exportText,
    button(
      "Select all project text",
      () => {
        exportText.focus();
        exportText.select();
      },
      true,
    ),
  );
  app.append(portable);
  for (const [audience, pack] of Object.entries(bundle.packs)) {
    const detail = el("details");
    detail.append(
      el(
        "summary",
        {
          founder: "Founder / Vibe Coder Pack",
          builder: "AI Builder Pack",
          team: "Professional Product Team Pack",
        }[audience],
      ),
    );
    const markdown = Object.values(pack.files).join("\n---\n\n");
    detail.append(
      button("Download pack (.md)", () =>
        download(`${audience}-pack.md`, markdown),
      ),
    );
    for (const [name, content] of Object.entries(pack.files)) {
      const file = el("details");
      file.append(
        el("summary", name),
        el("pre", content),
        button("Download this file", () => download(name, content), true),
      );
      detail.append(file);
    }
    app.append(detail);
  }
  actions(
    button(
      "Start a separate idea",
      () => {
        conversation = undefined;
        start();
      },
      true,
    ),
  );
}
try {
  const savedConversation = localStorage.getItem("theduck-conversation");
  if (savedConversation) {
    conversation = JSON.parse(savedConversation);
    shapeExperience(conversation);
  }
  const saved = localStorage.getItem("theduck-lock");
  if (saved) envelope = await verify(JSON.parse(saved));
  if (conversation && (!envelope || envelope.contract.idea !== conversation.idea || localStorage.getItem("theduck-conversation-active") === "true")) heard();
  else if (envelope) await showPacks();
  else start();
} catch (e) {
  conversation = undefined;
  start();
  report(e);
}
