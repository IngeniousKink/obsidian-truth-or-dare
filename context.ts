
import { createContext } from "react";
import { App, EventRef } from "obsidian";

export const AppContext = createContext<App | undefined>(undefined);

export type EventRegistryFunction = (eventRef: EventRef) => void;
export const EventRegistryContext = createContext<EventRegistryFunction | undefined>(undefined);
