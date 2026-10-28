<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=builder file=SCOPE.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Scope

## In scope

The main journey (see USER_FLOWS.md) and what is needed to meet ACCEPTANCE_CRITERIA.md:

1. Add an item and its expiry date in under 10 seconds
2. See everything sorted by what expires first
3. Get a reminder the day before an item expires
4. Mark an item as used or thrown away

## Out of scope (explicit non-scope)

- Recipe suggestions
- Barcode or receipt scanning
- Sharing a fridge with other people

## Must never

- Must not send more than one reminder per day.

Anything not listed as in scope needs a Change Proposal before you build it.
