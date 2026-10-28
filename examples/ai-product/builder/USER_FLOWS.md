<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d pack=builder file=USER_FLOWS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# User flows

## Main journey — Independent podcasters who publish weekly and edit their own shows

1. Upload an episode audio file
2. Get a draft of show notes, chapter markers and three social posts
3. Review and edit the AI's result before it is used or shared
4. Copy the final text into their podcast host and social accounts

Each step is a locked commitment, not an acceptance criterion. Its expected result, error behaviour and limits are draft verification candidates (ACCEPTANCE_CRITERIA.md) to refine with the product owner.

## Failure behaviour

- Connected service unavailable: Show a clear message and let people try again later.
- AI output wrong: A person reviews and can edit every AI result before it is used or shared.
