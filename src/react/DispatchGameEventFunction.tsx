import { TimestampedEvent } from "@obsidian-truth-or-dare/events.js";

export type DispatchGameEventFunction = (eventAction: TimestampedEvent) => Promise<void> | null;

export type DispatchGameEventHook = () => DispatchGameEventFunction;