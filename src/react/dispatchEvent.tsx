import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import { createContext, useContext } from "react";
import { useMultiplayer } from "./components/useMultiplayer.js";
import { useInMemoryTemplate } from "@obsidian-truth-or-dare/InMemoryTemplateContext.js";
import { DispatchGameEventHook } from "./DispatchGameEventFunction.js";

export const DispatchGameEventContext = createContext<DispatchGameEventHook>(() => (eventAction: TimestampedEvent) => null);

export const useDispatchGameEventHook = (): DispatchGameEventHook => {
  const fun = useContext(DispatchGameEventContext);
  if (fun === undefined) {
    throw new Error('useDispatchGameEvent must be used within a DispatchGameEventContext.Provider')
  }

  return fun;
};

export const appendEventToEventsFile : DispatchGameEventHook = () => {
  const value = useInMemoryTemplate();

  return async (eventAction: TimestampedEvent) =>  {
    if (!value) return;
    value.setEventsFileContent(data => `${data || ''}\n${serializeEventToCodeBlock(eventAction)}`);
  }
};

export const publishEventToMultiplayer : DispatchGameEventHook = () => {
  const { publishGameEvent } = useMultiplayer();

  return async (eventAction: TimestampedEvent) =>  {
    if (!publishGameEvent) return;

    console.log('publishEvent(eventAction):', serializeEventToCodeBlock(eventAction));

    await publishGameEvent(serializeEventToCodeBlock(eventAction));
  }
};

export const appendEventToTemplateFile : DispatchGameEventHook = () => {
  const value = useInMemoryTemplate();

  return async (eventAction: TimestampedEvent) =>  {
    if (!value) return;
    value.setTemplateFileContent(data => `${data}\n${serializeEventToCodeBlock(eventAction)}`);
  }
};