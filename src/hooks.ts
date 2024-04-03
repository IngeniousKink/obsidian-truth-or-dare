import { useContext } from "react";
import type { App } from "obsidian";
import { EventRegistryContext, EventRegistryFunction, AppContext } from "./context.js";

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};

export const useRegisterEvent = (): EventRegistryFunction | undefined => {
  return useContext(EventRegistryContext);
};