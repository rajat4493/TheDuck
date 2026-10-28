<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d pack=builder file=SCOPE.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Scope

## In scope

The main journey (see USER_FLOWS.md) and what is needed to meet ACCEPTANCE_CRITERIA.md:

1. Upload an episode audio file
2. Get a draft of show notes, chapter markers and three social posts
3. Review and edit the AI's result before it is used or shared
4. Copy the final text into their podcast host and social accounts

## Out of scope (explicit non-scope)

- Posting directly to social media accounts
- Audio editing
- Hosting or publishing the podcast

## Must never

- Must not use uploaded audio to train AI models.
- Must not publish, send or act on AI output without the user's approval.

Anything not listed as in scope needs a Change Proposal before you build it.
