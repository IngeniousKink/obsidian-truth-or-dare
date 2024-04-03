import { useInMemoryTemplate } from "@obsidian-truth-or-dare/InMemoryTemplateContext.js";
import { useEffect, useState } from "react";

export const useCombinedTemplateAndEventFileContent = () => {
  const value = useInMemoryTemplate();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;
    if (!value.templateFileContent) return;

    setContent(value.templateFileContent + value.eventsFileContent);
  }, [value]);

  return content;
};

export const useMediaResource = () => {
  return (url: string) => {
    let mediaResource = null;

    if (url.startsWith('http')) {
      mediaResource = url;
    }

    return mediaResource;
  }
}
