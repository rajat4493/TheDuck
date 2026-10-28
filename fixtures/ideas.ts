/**
 * Three materially different founder sessions (made-up data only).
 * Answers are keyed by question id; a session fails loudly if the provider
 * asks something the fixture does not answer. Details beyond the short first
 * pass are filled in on the Product Preview (previewEdits), as a founder would.
 */
import type { Answer, DraftPatch } from "../src/core/index.ts";

export interface FixtureSession {
  key: string;
  description: string;
  roughIdea: string;
  workingName?: string;
  answers: Record<string, Answer>;
  /** Founder edits on the Product Preview before locking. */
  previewEdits?: DraftPatch;
}

const text = (value: string): Answer => ({ kind: "text", value });
const list = (...values: string[]): Answer => ({ kind: "list", values });
const choice = (value: string): Answer => ({ kind: "choice", value });
const parts = (values: Record<string, string | string[]>): Answer => ({ kind: "parts", values });

/** 1. Simple consumer utility, no sensitive data. Exercises the "everyone" challenge. */
export const freshNudge: FixtureSession = {
  key: "consumer-utility",
  description: "Simple consumer utility with no sensitive data",
  roughIdea: "An app that reminds me before the food in my fridge goes off so I stop wasting groceries.",
  answers: {
    "Q-USER-JOB": parts({
      user: "Everyone who buys groceries",
      job: "Keep track of what is in the fridge and use food before it expires, without writing lists",
    }),
    "Q-TARGET-USER-NARROW": text("Busy home cooks who do one big weekly shop"),
    "Q-OUTCOME": text("They throw away less food because they get a nudge the day before something expires"),
    "Q-WORKFLOW": list(
      "Add an item and its expiry date in under 10 seconds",
      "See everything sorted by what expires first",
      "Get a reminder the day before an item expires",
      "Mark an item as used or thrown away",
    ),
    "Q-BOUNDARIES": parts({
      exclusions: ["Recipe suggestions", "Barcode or receipt scanning", "Sharing a fridge with other people"],
      never: ["Send more than one reminder per day"],
    }),
    "Q-SUCCESS": list("I use it for two weeks and throw away less food than before"),
  },
  previewEdits: { productName: "FreshNudge", stage: "demo" },
};

/** 2. AI-enabled founder product with usage/cost concerns. Contains the "agreed cost limit" case. */
export const showNotes = (aiWrong: "review" | "auto" = "review"): FixtureSession => ({
  key: aiWrong === "review" ? "ai-product" : "ai-product-auto",
  description: "AI-enabled founder product with estimated usage/cost concerns",
  roughIdea: "Upload a podcast episode and get AI-written show notes, chapter markers and social posts in minutes.",
  workingName: "ShowNotes AI",
  answers: {
    "Q-USER-JOB": parts({
      user: "Independent podcasters who publish weekly and edit their own shows",
      job: "Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them",
    }),
    "Q-OUTCOME": text("Publishing an episode's written material takes under 15 minutes instead of about two hours"),
    "Q-WORKFLOW": list(
      "Upload an episode audio file",
      "Get a draft of show notes, chapter markers and three social posts",
      "Copy the final text into their podcast host and social accounts",
    ),
    "Q-BOUNDARIES": parts({
      exclusions: ["Posting directly to social media accounts", "Audio editing", "Hosting or publishing the podcast"],
      never: ["Use uploaded audio to train AI models"],
    }),
    "Q-SUCCESS": list(
      "Five podcasters use it on a real episode and say they would use it again",
      "The AI cost of one episode stays under the agreed cost limit",
    ),
    "Q-AI": choice(aiWrong),
  },
  previewEdits: {
    ...(aiWrong === "review"
      ? {
          // The founder moves TheDuck's review step to before the copy step.
          coreWorkflow: [
            "Upload an episode audio file",
            "Get a draft of show notes, chapter markers and three social posts",
            "Review and edit the AI's result before it is used or shared",
            "Copy the final text into their podcast host and social accounts",
          ],
        }
      : {}),
    stage: "pilot",
    dataSensitivity: "personal",
    integrations: ["A speech-to-text and AI writing service — to transcribe the episode and draft the text"],
    integrationFailureBehaviour: "Show a clear message and let people try again later.",
  },
});

/** 3. Sensitive-data + enterprise-integration idea where risk and non-scope matter. */
export const physioPath: FixtureSession = {
  key: "sensitive-integration",
  description: "Sensitive-data / enterprise-integration idea where risks and non-scope materially matter",
  roughIdea:
    "A portal where physiotherapy clinic patients see their home exercise plan, and physios update it from the clinic's practice management system.",
  workingName: "PhysioPath",
  answers: {
    "Q-USER-JOB": parts({
      user: "Patients of one partner physiotherapy clinic who have a home exercise plan",
      job: "Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment",
    }),
    "Q-OUTCOME": text("Patients follow their plan correctly between appointments and stop relying on paper handouts"),
    "Q-WORKFLOW": list(
      "Patient signs in with an invite from the clinic",
      "Patient sees today's exercises with instructions",
      "Patient marks exercises as done",
      "Physio changes the plan in the clinic's system and the patient sees the update",
    ),
    "Q-BOUNDARIES": parts({
      exclusions: [
        "Diagnosis, medical advice or symptom checking",
        "Booking appointments or taking payments",
        "Messaging between patients and physios",
        "Any clinic other than the one partner clinic",
      ],
      never: ["Show one patient's information to another patient", "Change anything in the clinic's practice management system"],
    }),
    "Q-SUCCESS": list("Ten pilot patients use it for four weeks", "The partner clinic confirms the plans shown match their system"),
    "Q-DATA": choice("sensitive_or_regulated"),
  },
  previewEdits: {
    stage: "production",
    integrations: ["The clinic's practice management system — the source of each patient's exercise plan"],
    integrationFailureBehaviour: "Keep working with what is already saved and catch up when the service is back.",
  },
};

export const ALL_FIXTURES: FixtureSession[] = [freshNudge, showNotes("review"), physioPath];
