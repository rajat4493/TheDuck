// Synthetic owner answers for repeatable M1 verification. Not real owner approvals.
export const examples = [
  {
    name: "consumer",
    idea: "A reading journal for people who forget what they read.",
    definition: "A personal reading journal.",
    targetUser: "Casual readers",
    jtbd: "Remember books and the thoughts they prompted",
    journey: ["Add a book", "Write a note", "Find the note later"],
    scope: ["Save book titles and notes", "Find saved notes"],
    nonGoals: ["Social sharing"],
    constraints: ["Only the owner can read their notes"],
    acceptance: [
      "Save a note and find its unchanged text after reopening the journal",
    ],
    accepted: [],
  },
  {
    name: "business",
    idea: "A team workflow for staff to request leave and managers to approve it.",
    definition: "A leave request workflow for small teams.",
    targetUser: "Small-team staff and managers",
    jtbd: "Get a clear decision on requested time off",
    journey: [
      "Staff submits dates",
      "Manager reviews request",
      "Staff sees decision",
    ],
    scope: ["Submit dates", "Approve or decline", "Display decision"],
    nonGoals: ["Payroll"],
    constraints: ["Staff cannot approve their own requests"],
    acceptance: ["A staff member sees the exact decision their manager made"],
    accepted: ["narrow"],
  },
  {
    name: "constrained",
    idea: "An offline AI field guide that identifies plants without a network.",
    definition: "An offline plant identification field guide.",
    targetUser: "Hikers without network access",
    jtbd: "Identify likely plant species while hiking",
    journey: [
      "Capture a plant photo",
      "View possible matches",
      "Read uncertainty notice",
    ],
    scope: ["Capture photos offline", "Show possible matches and uncertainty"],
    nonGoals: ["Edibility advice"],
    constraints: [
      "Must operate without network",
      "Never claim a match is certain",
    ],
    acceptance: [
      "In airplane mode, an example image returns possible matches or a clear unable-to-identify message",
    ],
    accepted: ["feasibility"],
  },
];
