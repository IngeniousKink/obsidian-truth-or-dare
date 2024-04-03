import { useContext } from "react";
import { AppContext } from "./context";
import type { App } from "obsidian";

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};