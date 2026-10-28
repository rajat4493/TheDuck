<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb pack=builder file=SCOPE.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Scope

## In scope

The main journey (see USER_FLOWS.md) and everything needed to meet ACCEPTANCE_CRITERIA.md:

1. Add an item and its expiry date in under 10 seconds
2. See everything sorted by what expires first
3. Get a reminder the day before an item expires
4. Mark an item as used or thrown away

## Out of scope (explicit non-scope)

- Recipe suggestions
- Barcode or receipt scanning
- Sharing a fridge with other people

## Must never

- Send more than one reminder per day

Anything not listed as in scope needs a Change Proposal before you build it.
