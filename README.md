# Engineer

A minimal, dependency-free state manager for JavaScript applications that need fast, predictable state updates without the overhead of larger state libraries.

## Why Engineer?

Engineer was built while developing [Assembly Reality](https://github.com/drb0r1s/assembly-reality), a web-based assembly language simulator (my Bachelor's thesis project at UP FAMNIT). The UI needs to reflect rapid, frequent state changes: CPU registers, memory, and I/O devices updating in near real time as code executes. Redux (and other general solutions) were too slow for this use case, the overhead of its dispatch and selector model introduced noticeable lag under frequent updates.

Engineer solves this with a much smaller surface area: a plain key/value store with direct subscriptions and an explicit batching mechanism, so consumers only get notified when they actually need to be.

## Features

- Simple `get`/`set`/`delete` key-value API.
- Direct event subscriptions per key, no selectors or reducers.
- `sequence()` batching: group multiple updates together and fire listeners only once all of them are applied.
- No dependencies, no build step required to use.

## Installation
 
```bash
npm i drb0r1s/engineer
```
 
```javascript
import { Engineer } from "engineer";
```

## Usage

```javascript
const engineer = new Engineer({
    theme: "dark",
    isRunning: false
});

// Subscribe to changes
const unsubscribe = engineer.subscribe("isRunning", value => {
    console.log("isRunning changed to", value);
});

// Update a value
engineer.set("isRunning", true);

// Batch multiple updates, listeners fire once per key after the sequence completes
engineer.sequence(() => {
    engineer.set("isRunning", false);
    engineer.set("theme", "light");
});

// Custom events not tied to a stored value
engineer.trigger("reset", { reason: "user requested" });

// Clean up
unsubscribe();
```

## API

### `new Engineer(initialValues = {})`
Creates a new instance seeded with the given key-value pairs.

### `.get(key)`
Returns the current value for `key`.

### `.set(key, value)`
Updates the value for `key` and notifies subscribers, unless called inside a `sequence()`.

### `.delete(key)`
Removes `key` from the store.

### `.subscribe(event, callback)`
Registers `callback` to run whenever `event` (a key or a custom trigger name) fires. Returns an unsubscribe function.

### `.trigger(event, data)`
Manually fires listeners for `event` with `data`, without touching the store.

### `.sequence(callback)`
Runs `callback` synchronously, deferring all `set`/`trigger` notifications until it finishes, then fires each affected listener once with its final value. Useful for avoiding redundant re-renders when updating several related values at once.

## Used by

[Assembly Reality](https://github.com/drb0r1s/assembly-reality)'s entire UI state layer (theme, editor state, CPU/memory view toggles, execution state, autosave flags) is built directly on top of Engineer.
