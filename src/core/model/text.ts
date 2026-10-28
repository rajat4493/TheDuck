/** Small wording helpers shared by renderers. They never change stored text. */

const PROHIBITION_PREFIX = /^(must\s+not|must\s+never|shall\s+not|should\s+not|do\s+not|don't|never)\s+/i;

/** Lower-case the first letter unless the word is an acronym (e.g. "AI"). */
export function lcFirst(text: string): string {
  return /^[A-Z]{2}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

/** The forbidden action alone, e.g. "use uploaded audio to train AI models". */
export function forbiddenAction(text: string): string {
  return lcFirst(text.trim().replace(/[.]+$/, "").replace(PROHIBITION_PREFIX, ""));
}

/** Always an explicit prohibition: "Must not use uploaded audio to train AI models." */
export function prohibition(text: string): string {
  return `Must not ${forbiddenAction(text)}.`;
}

export function withPeriod(text: string): string {
  const t = text.trim();
  return /[.!?)]$/.test(t) ? t : `${t}.`;
}
