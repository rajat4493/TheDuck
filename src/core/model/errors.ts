/** A locked field was about to change without an approved Change Proposal. */
export class LockViolationError extends Error {
  override name = "LockViolationError";
}

/** Something was asked of the model that its current state does not allow. */
export class StateError extends Error {
  override name = "StateError";
}

/** A refinement provider returned something outside its contract. */
export class ProviderContractError extends Error {
  override name = "ProviderContractError";
}

/** Stored data failed schema validation or its fingerprint no longer matches. */
export class IntegrityError extends Error {
  override name = "IntegrityError";
}
