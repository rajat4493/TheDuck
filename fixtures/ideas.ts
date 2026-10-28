/**
 * Three materially different founder sessions (made-up data only).
 * Answers are keyed by question id; a session fails loudly if the provider
 * asks something the fixture does not answer.
 */
import type { Answer, DraftPatch } from "../src/core/index.ts";

export interface FixtureSession {
  key: string;
  description: string;
  roughIdea: string;
  workingName?: string;
  answers: Record<string, Answer>;
  /** Optional founder edits on the Product Preview before locking. */
  previewEdits?: DraftPatch;
}

const text = (value: string): Answer => ({ kind: "text", value });
const list = (...values: string[]): Answer => ({ kind: "list", values });
const choice = (value: string): Answer => ({ kind: "choice", value });

/** 1. Simple consumer utility, no sensitive data. Exercises the "everyone" challenge. */
export const freshNudge: FixtureSession = {
  key: "consumer-utility",
  description: "Simple consumer utility with no sensitive data",
  roughIdea: "An app that reminds me before the food in my fridge goes off so I stop wasting groceries.",
  answers: {
    "Q-PRODUCT-NAME": text("FreshNudge"),
    "Q-TARGET-USER": text("Everyone who buys groceries"),
    "Q-TARGET-USER-NARROW": text("Busy home cooks who do one big weekly shop"),
    "Q-JOB": text("Keep track of what is in the fridge and use food before it expires, without writing lists"),
    "Q-OUTCOME": text("They throw away less food because they get a nudge the day before something expires"),
    "Q-WORKFLOW": list(
      "Add an item and its expiry date in under 10 seconds",
      "See everything sorted by what expires first",
      "Get a reminder the day before an item expires",
      "Mark an item as used or thrown away",
    ),
    "Q-OUT-OF-SCOPE": list("Recipe suggestions", "Barcode or receipt scanning", "Sharing a fridge with other people"),
    "Q-MUST-NOT": list("Send more than one reminder per day"),
    "Q-SUCCESS": list("I use it for two weeks and throw away less food than before"),
    "Q-STAGE": choice("demo"),
    "Q-DATA": choice("none"),
    "Q-INTEGRATIONS": list(),
    "Q-AI": choice("no"),
  },
};

/** 2. AI-enabled founder product with usage/cost concerns. */
export const showNotes = (aiWrong: "review" | "auto" = "review"): FixtureSession => ({
  key: aiWrong === "review" ? "ai-product" : "ai-product-auto",
  description: "AI-enabled founder product with estimated usage/cost concerns",
  roughIdea:
    "Upload a podcast episode and get AI-written show notes, chapter markers and social posts in minutes.",
  workingName: "ShowNotes AI",
  answers: {
    "Q-TARGET-USER": text("Independent podcasters who publish weekly and edit their own shows"),
    "Q-JOB": text("Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them"),
    "Q-OUTCOME": text("Publishing an episode's written material takes under 15 minutes instead of about two hours"),
    "Q-WORKFLOW": list(
      "Upload an episode audio file",
      "Get a draft of show notes, chapter markers and three social posts",
      "Copy the final text into their podcast host and social accounts",
    ),
    "Q-OUT-OF-SCOPE": list("Posting directly to social media accounts", "Audio editing", "Hosting or publishing the podcast"),
    "Q-MUST-NOT": list("Use uploaded audio to train AI models"),
    "Q-SUCCESS": list(
      "Five podcasters use it on a real episode and say they would use it again",
      "The AI cost of one episode stays under the agreed cost limit",
    ),
    "Q-STAGE": choice("pilot"),
    "Q-DATA": choice("personal"),
    "Q-INTEGRATIONS": list("A speech-to-text and AI writing service — to transcribe the episode and draft the text"),
    "Q-INTEGRATION-DOWN": choice("message"),
    "Q-AI": choice("yes"),
    "Q-AI-WRONG": choice(aiWrong),
    "Q-AI-USAGE": choice("base"),
  },
  // The founder moves TheDuck's review step to before the copy step.
  previewEdits:
    aiWrong === "review"
      ? {
          coreWorkflow: [
            "Upload an episode audio file",
            "Get a draft of show notes, chapter markers and three social posts",
            "Review and edit the AI's result before it is used or shared",
            "Copy the final text into their podcast host and social accounts",
          ],
        }
      : undefined,
});

/** 3. Sensitive-data + enterprise-integration idea where risk and non-scope matter. */
export const physioPath: FixtureSession = {
  key: "sensitive-integration",
  description: "Sensitive-data / enterprise-integration idea where risks and non-scope materially matter",
  roughIdea:
    "A portal where physiotherapy clinic patients see their home exercise plan, and physios update it from the clinic's practice management system.",
  workingName: "PhysioPath",
  answers: {
    "Q-TARGET-USER": text("Patients of one partner physiotherapy clinic who have a home exercise plan"),
    "Q-JOB": text("Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment"),
    "Q-OUTCOME": text("Patients follow their plan correctly between appointments and stop relying on paper handouts"),
    "Q-WORKFLOW": list(
      "Patient signs in with an invite from the clinic",
      "Patient sees today's exercises with instructions",
      "Patient marks exercises as done",
      "Physio changes the plan in the clinic's system and the patient sees the update",
    ),
    "Q-OUT-OF-SCOPE": list(
      "Diagnosis, medical advice or symptom checking",
      "Booking appointments or taking payments",
      "Messaging between patients and physios",
      "Any clinic other than the one partner clinic",
    ),
    "Q-MUST-NOT": list(
      "Show one patient's information to another patient",
      "Change anything in the clinic's practice management system",
    ),
    "Q-SUCCESS": list(
      "Ten pilot patients use it for four weeks",
      "The partner clinic confirms the plans shown match their system",
    ),
    "Q-STAGE": choice("production"),
    "Q-DATA": choice("sensitive_or_regulated"),
    "Q-INTEGRATIONS": list("The clinic's practice management system — the source of each patient's exercise plan"),
    "Q-INTEGRATION-DOWN": choice("queue"),
    "Q-AI": choice("no"),
  },
};

export const ALL_FIXTURES: FixtureSession[] = [freshNudge, showNotes("review"), physioPath];
