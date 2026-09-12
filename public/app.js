import {
  understand,
  preview,
  lock,
  verify,
  generate,
  fields,
} from "/intent.js";
const app = document.querySelector("#app");
const error = document.querySelector("#error");
let draft,
  envelope,
  step = 0;
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
  document
    .querySelectorAll("#progress li")
    .forEach((li, i) => li.classList.toggle("active", i === n));
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
function input(field, value, caption = fields[field]) {
  const label = el("label", caption);
  label.htmlFor = field;
  const box = el("textarea");
  box.id = field;
  box.value = Array.isArray(value) ? value.join("\n") : value || "";
  box.maxLength = 5000;
  app.append(label, box);
  return box;
}
function saveDraft() {
  try {
    localStorage.setItem("theduck-draft", JSON.stringify(draft));
  } catch {
    report(
      Error(
        "Browser storage is unavailable. You can continue, but download your files before closing.",
      ),
    );
  }
}
function start() {
  stage(0);
  title(
    "What do you want to build?",
    "A few messy sentences are enough to start. We’ll make the important parts clear together.",
  );
  const idea = input("idea", draft?.idea || "", "Your rough idea");
  idea.placeholder = "I want an app that helps…";
  actions(
    button("Let’s make it clear →", () => {
      if (!draft || draft.idea !== idea.value.trim())
        draft = understand(idea.value);
      step = 0;
      saveDraft();
      questions();
    }),
  );
}
function questions() {
  stage(1);
  const q = draft.questions[step];
  title(
    q.title,
    `Question ${step + 1} of ${draft.questions.length}. ${q.hint}`,
  );
  const boxes = q.fields.map((field) => [field, input(field, draft[field])]);
  const save = () => {
    for (const [field, box] of boxes) draft[field] = box.value;
    saveDraft();
  };
  actions(
    button(
      "Back",
      () => {
        save();
        if (step) {
          step--;
          questions();
        } else start();
      },
      true,
    ),
    button(step === 3 ? "Review my product →" : "Next →", () => {
      save();
      if (step === 3) review();
      else {
        step++;
        questions();
      }
    }),
  );
}
function review() {
  stage(2);
  title(
    "Does this describe your product?",
    "Edit anything below. Nothing is locked yet. Lists use one item per line.",
  );
  const boxes = Object.keys(fields).map((field) => [
    field,
    input(field, draft[field]),
  ]);
  app.append(el("h3", "A small challenge before you lock"));
  for (const suggestion of draft.suggestions) {
    const card = el("div", undefined, "suggestion");
    const label = el("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = draft.accepted.includes(suggestion.id);
    check.onchange = () => {
      draft.accepted = draft.accepted.filter((id) => id !== suggestion.id);
      if (check.checked) draft.accepted.push(suggestion.id);
      saveDraft();
    };
    label.append(
      check,
      el("span", `${suggestion.reason}\nIf accepted: ${suggestion.value}`),
    );
    card.append(label);
    app.append(card);
  }
  const save = () => {
    for (const [field, box] of boxes) draft[field] = box.value;
    saveDraft();
  };
  actions(
    button(
      "Back to questions",
      () => {
        save();
        questions();
      },
      true,
    ),
    button("Show final preview →", () => {
      save();
      showPreview(preview(draft));
    }),
  );
}
function showPreview(p) {
  stage(2);
  title(
    "Your Product Preview",
    "Read this as the owner. The three packs will describe this exact product.",
  );
  for (const field of Object.keys(fields)) {
    const block = el("div", undefined, "preview");
    block.append(el("h3", fields[field]));
    const values = Array.isArray(p[field]) ? p[field] : [p[field]];
    if (!values.length)
      block.append(el("p", "OPEN QUESTION — None specified."));
    for (const value of values) {
      const origin = p.acceptedSuggestions.some(
        (s) => s.field === field && s.value === value,
      )
        ? "THEDUCK-SUGGESTED + HUMAN-APPROVED"
        : "HUMAN";
      block.append(el("p", value), el("span", origin, "tag"));
    }
    app.append(block);
  }
  app.append(
    el(
      "p",
      "Locking protects this definition from changes during pack generation. To change it later, start a new draft and explicitly approve a new lock.",
      "lock-note",
    ),
  );
  const approval = el("label");
  const check = document.createElement("input");
  check.type = "checkbox";
  approval.append(
    check,
    document.createTextNode(
      " I approve this Product Preview and want to LOCK it.",
    ),
  );
  app.append(approval);
  const confirm = button("Approve & LOCK intent", async () => {
    envelope = await lock(draft, check.checked);
    try {
      localStorage.setItem("theduck-lock", JSON.stringify(envelope));
    } catch {
      await showPacks();
      report(
        Error(
          "Lock created, but browser storage is unavailable. Download the canonical lock now.",
        ),
      );
      return;
    }
    await showPacks();
  });
  confirm.disabled = true;
  check.onchange = () => (confirm.disabled = !check.checked);
  actions(button("Keep editing", review, true), confirm);
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
    "One product. Three ways forward.",
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
  portable.append(el("p", "If downloads are unavailable, select this text and copy it into a file named theduck-project.json. It contains the original lock and every pack file.", "hint"));
  const exportLabel = el("label", "Portable project JSON");
  exportLabel.htmlFor = "portable-json";
  const exportText = el("textarea");
  exportText.id = "portable-json";
  exportText.readOnly = true;
  exportText.rows = 8;
  exportText.value = JSON.stringify({envelope, bundle}, null, 2);
  portable.append(exportLabel, exportText, button("Select all project text", () => {exportText.focus(); exportText.select();}, true));
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
        draft = undefined;
        start();
      },
      true,
    ),
  );
}
try {
  const saved = localStorage.getItem("theduck-lock");
  if (saved) {
    envelope = await verify(JSON.parse(saved));
    await showPacks();
  } else {
    const savedDraft = localStorage.getItem("theduck-draft");
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      draft = {
        ...parsed,
        questions: understand(parsed.idea).questions,
        suggestions: understand(parsed.idea).suggestions,
      };
    }
    start();
  }
} catch (e) {
  start();
  report(e);
}
