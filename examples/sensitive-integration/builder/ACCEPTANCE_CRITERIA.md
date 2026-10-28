<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=builder file=ACCEPTANCE_CRITERIA.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Acceptance criteria

Each criterion needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

## AC-01

- **Statement:** Main journey step 1 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient signs in with an invite from the clinic".
- **How to check:** Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient signs in with an invite from the clinic" end to end. It completes without help from the builder.
- **Source:** workflow · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-02

- **Statement:** Main journey step 2 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient sees today's exercises with instructions".
- **How to check:** Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient sees today's exercises with instructions" end to end. It completes without help from the builder.
- **Source:** workflow · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-03

- **Statement:** Main journey step 3 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient marks exercises as done".
- **How to check:** Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient marks exercises as done" end to end. It completes without help from the builder.
- **Source:** workflow · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-04

- **Statement:** Main journey step 4 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Physio changes the plan in the clinic's system and the patient sees the update".
- **How to check:** Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Physio changes the plan in the clinic's system and the patient sees the update" end to end. It completes without help from the builder.
- **Source:** workflow · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-05

- **Statement:** Protection holds — the product never does this: "Show one patient's information to another patient".
- **How to check:** Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-06

- **Statement:** Protection holds — the product never does this: "Change anything in the clinic's practice management system".
- **How to check:** Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-07

- **Statement:** Protection holds — the product never does this: "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)".
- **How to check:** Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-08

- **Statement:** Done means: Ten pilot patients use it for four weeks
- **How to check:** Show observed evidence (not a claim) that this is true.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## AC-09

- **Statement:** Done means: The partner clinic confirms the plans shown match their system
- **How to check:** Show observed evidence (not a claim) that this is true.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet
