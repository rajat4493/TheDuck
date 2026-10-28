/** Founder decision cards, derived deterministically from locked intent. */
import type { IntentContent } from "../model/schema.ts";

export interface DecisionCard {
  id: string;
  decisionNeeded: string;
  whyItMatters: string;
  options: { label: string; tradeOff: string }[];
  recommendation: string;
  ifDeferred: string;
}

const SPECIFIC: Record<string, (i: IntentContent) => DecisionCard | null> = {
  "Q-AI-WRONG": (i) =>
    i.usesAI && i.aiFailureBehaviour === null
      ? {
          id: "DC-AI-WRONG",
          decisionNeeded: "What should happen when the AI gets something wrong?",
          whyItMatters: "This decides whether an AI mistake can reach your users or the public without anyone checking.",
          options: [
            { label: "A person checks AI work before it is used", tradeOff: "Safer, slightly slower." },
            { label: "Use AI work straight away; fix mistakes later", tradeOff: "Faster, riskier." },
          ],
          recommendation: "Have a person check AI work first in the first version.",
          ifDeferred: "Builders must not let AI output be used or shared automatically until you decide.",
        }
      : null,
  "Q-AI-USAGE": (i) =>
    i.usesAI && i.aiUsageEstimate === null
      ? {
          id: "DC-AI-USAGE",
          decisionNeeded: "Roughly how often will one person use the AI feature each month?",
          whyItMatters: "AI costs money every time it runs. Without a rough number, nobody can set a sensible budget.",
          options: [
            { label: "Under 10 times", tradeOff: "Low cost per person." },
            { label: "About 50 times", tradeOff: "Moderate cost per person." },
            { label: "200 times or more", tradeOff: "AI may be your biggest running cost." },
          ],
          recommendation: "Pick your best guess now; it will be marked as an assumption and checked later.",
          ifDeferred: "The cost estimate stays an open question and no spending limit can be suggested.",
        }
      : null,
  "Q-INTEGRATION-DOWN": (i) =>
    i.integrations.length > 0 && i.integrationFailureBehaviour === null
      ? {
          id: "DC-INTEGRATION-DOWN",
          decisionNeeded: `What should people experience when "${i.integrations[0]?.text ?? "a connected service"}" is unavailable?`,
          whyItMatters: "Every outside service fails sometimes. Without a decision, the builder will guess.",
          options: [
            { label: "Show a clear message; try again later", tradeOff: "Simpler, people wait." },
            { label: "Keep working with saved information; catch up later", tradeOff: "Better for people, more work." },
          ],
          recommendation: "Show a clear message for the first version.",
          ifDeferred: "Builders must show a clear error rather than invent a workaround.",
        }
      : null,
};

export function deriveDecisionCards(intent: IntentContent): DecisionCard[] {
  const cards: DecisionCard[] = [];
  const covered = new Set<string>();
  for (const [ref, make] of Object.entries(SPECIFIC)) {
    const card = make(intent);
    if (card) {
      cards.push(card);
      covered.add(ref);
    }
  }
  for (const q of intent.openQuestions) {
    if (q.ref && covered.has(q.ref)) continue;
    cards.push({
      id: `DC-${q.id}`,
      decisionNeeded: q.text,
      whyItMatters: "If you don't decide, a builder will have to guess — and that guess becomes your product.",
      options: [],
      recommendation: "Decide before anyone builds the part this affects.",
      ifDeferred: "It stays listed as an open question. Builders must not invent an answer.",
    });
  }
  return cards;
}
