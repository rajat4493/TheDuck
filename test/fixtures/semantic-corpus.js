// Hand-authored test data. These fixtures prove pipeline behavior, NOT live understanding.
import { intentFields, listFields, sourcesFor } from "../../src/semantic.js";
export const corpus = [
  {
    id: "cctv",
    idea: "Residents should report a CCTV incident and share the relevant clip with someone who can help.",
    definition:
      "An incident reporting tool for residents to send a relevant CCTV clip for review.",
    user: "Residents reporting an incident",
    outcome: "Get the right person to review evidence of an incident",
    journey: [
      "Describe the incident",
      "Attach the relevant clip",
      "Send the report for review",
    ],
    scope: [
      "Incident description",
      "Relevant clip attachment",
      "Report review",
    ],
    question: {
      field: "targetUser",
      title: "Who should receive these reports?",
      why: "Public viewing and a private review team need different access rules.",
      options: [
        [
          "council",
          "A private council team",
          "Residents and a private council review team",
        ],
        [
          "neighbors",
          "Neighbours in the community",
          "Residents and neighbours in the community",
        ],
      ],
    },
  },
  {
    id: "tax",
    idea: "I want a tax filing helper that tells freelancers what documents they need and guides them through filing.",
    definition:
      "A filing guide that helps freelancers prepare the right tax documents.",
    user: "Freelancers preparing a tax return",
    outcome: "Prepare the documents and steps needed to file a tax return",
    journey: [
      "Describe the freelance work",
      "See required documents",
      "Follow filing guidance",
    ],
    scope: ["Document checklist", "Filing guidance"],
    question: {
      field: "constraints",
      title: "Which tax system should the first version cover?",
      why: "The country changes the documents and filing rules.",
      options: [
        [
          "uk",
          "United Kingdom",
          ["Cover United Kingdom tax filing requirements."],
        ],
        ["pl", "Poland", ["Cover Polish tax filing requirements."]],
      ],
    },
  },
  {
    id: "tipping",
    idea: "A creator should be able to share a link so fans can leave a tip without signing up.",
    definition: "A simple tipping link creators can share with fans.",
    user: "Creators and fans who want to leave a tip",
    outcome: "Let a fan support a creator without creating an account",
    journey: ["Open the creator’s link", "Choose a tip", "Complete the tip"],
    scope: [
      "Shareable creator link",
      "Tip amount choice",
      "No fan account required",
    ],
    question: {
      field: "scope",
      title:
        "Should this send fans to an existing payment page or collect the tip here?",
      why: "Collecting payments inside the product adds payment handling to this build.",
      options: [
        [
          "link",
          "Use an existing payment page",
          [
            "Shareable creator link",
            "Tip amount choice",
            "No fan account required",
            "Send fans to an existing payment page.",
          ],
        ],
        [
          "collect",
          "Collect it here",
          [
            "Shareable creator link",
            "Tip amount choice",
            "No fan account required",
            "Collect tips within the product.",
          ],
        ],
      ],
    },
  },
  {
    id: "storage",
    idea: "Small shops need to book spare warehouse space by week and see which spaces are available.",
    definition: "A weekly storage booking tool for small shops.",
    user: "Small shops needing temporary storage",
    outcome: "Find available warehouse space and book the weeks needed",
    journey: [
      "Choose the weeks",
      "Compare available spaces",
      "Reserve a space",
    ],
    scope: ["Weekly availability", "Space comparison", "Weekly reservations"],
  },
  {
    id: "school",
    idea: "Help a school administrator arrange weekly classes without putting a teacher in two rooms at the same time.",
    definition: "A timetable planner that flags teacher scheduling conflicts.",
    user: "School administrators",
    outcome: "Arrange weekly classes without overlapping teacher assignments",
    journey: [
      "Enter classes and teachers",
      "Arrange the weekly timetable",
      "Resolve teacher conflicts",
    ],
    scope: [
      "Class and teacher entries",
      "Weekly timetable",
      "Overlapping teacher checks",
    ],
  },
  {
    id: "waitlist",
    idea: "My small restaurant needs a waitlist where staff add walk-ins and seat the next party without making diners create an account.",
    definition:
      "A staff-run waitlist for seating walk-in diners without customer accounts.",
    user: "Restaurant staff seating walk-in diners",
    outcome: "Keep the waiting order clear and seat the next party",
    journey: [
      "Add a walk-in party",
      "See the waiting order",
      "Seat the next party",
    ],
    scope: ["Party entry", "Ordered waitlist", "Mark a party seated"],
    constraints: ["Diners do not need accounts."],
    suggestion: {
      id: "party-size",
      field: "scope",
      value: "Record each party’s size when adding them.",
      title: "Keep the party size beside each name",
      why: "Staff can tell which waiting party fits an available table.",
    },
  },
  {
    id: "agents",
    idea: "Before an AI agent changes customer records I want a human to review its proposed changes and accept or reject them.",
    definition:
      "A human review screen for proposed AI changes to customer records.",
    user: "People responsible for customer records",
    outcome: "Decide whether proposed record changes should proceed",
    journey: [
      "See the proposed changes",
      "Inspect affected records",
      "Accept or reject the proposal",
    ],
    scope: [
      "Proposed change display",
      "Affected record context",
      "Explicit acceptance or rejection",
    ],
    constraints: [
      "No customer record change proceeds before human acceptance.",
    ],
  },
  {
    id: "travel",
    idea: "I want to collect places for a weekend trip and arrange them into a daily plan I can edit.",
    definition:
      "An editable weekend planner built from places the traveller saves.",
    user: "People planning a weekend trip",
    outcome: "Turn saved places into a practical daily plan",
    journey: [
      "Save interesting places",
      "Arrange them by day",
      "Edit the plan",
    ],
    scope: ["Saved places", "Daily itinerary", "Plan editing"],
  },
  {
    id: "survey",
    idea: "Our employees should answer an anonymous pulse survey and managers should see only team totals.",
    definition: "An anonymous employee pulse survey with team-level results.",
    user: "Employees answering surveys and managers reviewing team totals",
    outcome:
      "Understand team sentiment without identifying individual respondents",
    journey: ["Answer a pulse survey", "Combine responses", "View team totals"],
    scope: ["Pulse survey answers", "Team-level totals"],
    constraints: [
      "Managers cannot view individual responses or respondent identities.",
    ],
  },
  {
    id: "rentals",
    idea: "Help renters spot suspicious rental adverts and explain warning signs before they send a deposit.",
    definition:
      "A rental-advert review tool that explains possible scam warning signs.",
    user: "Renters considering a deposit",
    outcome: "Understand warning signs before sending money",
    journey: [
      "Provide a rental advert",
      "Review warning signs",
      "Read the explanation before deciding",
    ],
    scope: [
      "Advert input",
      "Warning sign review",
      "Plain-language explanations",
    ],
    constraints: [
      "Warnings are not guarantees that a listing is safe or fraudulent.",
    ],
  },
  {
    id: "wedding",
    idea: "We need a shared wedding checklist so my partner and I can see who is doing each task and what is left.",
    definition: "A shared wedding checklist with clear task ownership.",
    user: "Two partners planning a wedding",
    outcome: "Coordinate wedding tasks and see what remains",
    journey: ["Add tasks", "Assign each task", "Mark completed work"],
    scope: ["Shared checklist", "Task owners", "Completion state"],
  },
  {
    id: "habit",
    idea: "A private daily water habit tracker where I tap when I drink a glass and see my day total.",
    definition: "A private daily tracker for glasses of water.",
    user: "People tracking their own daily water intake",
    outcome: "Record glasses of water and see the day’s total",
    journey: ["Tap after drinking a glass", "See the daily total"],
    scope: ["Record a glass", "Daily total"],
    constraints: ["The record is private."],
  },
];
export function fixtureInterpretation(item) {
  const values = {
    definition: item.definition,
    targetUser: item.user,
    jtbd: item.outcome,
    journey: item.journey,
    scope: item.scope,
    nonGoals: [],
    constraints: item.constraints || [],
    assumptions: [],
    acceptance: [
      `Complete this experience and confirm the result: ${item.journey.join(" → ")}.`,
    ],
  };
  return {
    fields: Object.fromEntries(
      intentFields.map((field) => [
        field,
        {
          value: structuredClone(values[field]),
          kind: "INTERPRETED",
          sourceIds: ["idea:0"],
        },
      ]),
    ),
    questions: item.question
      ? [
          {
            id: "decision",
            title: item.question.title,
            why: item.question.why,
            field: item.question.field,
            options: item.question.options.map(([id, label, value]) => ({
              id,
              label,
              value,
            })),
          },
        ]
      : [],
    suggestions: item.suggestion ? [item.suggestion] : [],
    fidelity: [
      { sourceId: "idea:0", field: "definition", status: "INTERPRETED" },
      { sourceId: "idea:0", field: "journey", status: "INTERPRETED" },
    ],
    unresolved: item.question
      ? [{ field: item.question.field, reason: item.question.title }]
      : [],
  };
}
export const fixtureResponse = (item) => ({
  interpretation: fixtureInterpretation(item),
  provider: { name: "hand-authored-fixture", model: "none", live: false },
});
export function sampleResponse() {
  const item = corpus.find((i) => i.id === "waitlist");
  return { idea: item.idea, ...fixtureResponse(item) };
}
export function unresolvedFixture(idea) {
  return {
    fields: Object.fromEntries(
      intentFields.map((f) => [
        f,
        {
          value: listFields.includes(f) ? [] : "",
          kind: "UNRESOLVED",
          sourceIds: [],
        },
      ]),
    ),
    questions: [],
    suggestions: [],
    fidelity: sourcesFor({ idea }).map((s) => ({
      sourceId: s.id,
      field: "definition",
      status: "UNRESOLVED",
    })),
    unresolved: [
      { field: "definition", reason: "The product purpose is not clear yet." },
    ],
  };
}
