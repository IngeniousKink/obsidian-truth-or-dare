import * as React from 'react';
import { ParsedCard, Annotation } from '../../parse/parse-card.js';
import { useApp } from '../hooks.js';

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg"];

const CurrentCard: React.FC<{ card: ParsedCard }> = ({ card }) => {

  const app = useApp()

  const createMediaElement = (key: string, url: string, extension: string) => {
    if (IMAGE_EXTENSIONS.includes(extension)) {
      return <img key={key} src={url} />;
    } else if (VIDEO_EXTENSIONS.includes(extension)) {
      return <video key={key} src={url} controls />;
    }
    return null;
  }

  const createTextElement = (key: string, text: string) => {
    return <span key={key}>{text}</span>;
  }

  const processAnnotation = (annotation: Annotation, i: number, text: string, lastEndPos: number) => {
    const cardElements: JSX.Element[] = [];
    cardElements.push(createTextElement(`t-${i}`, text.slice(lastEndPos, annotation.startPos)));

    const urlParts = String(annotation.url || "").split("|");
    const url = urlParts[0];
    const size = urlParts.length > 1 ? urlParts[1] : null;

    const extension = url.split('.').pop()?.toLowerCase() || IMAGE_EXTENSIONS[0];

    if (url.startsWith('http')) {
      const mediaElement = createMediaElement(`m-${i}`, url, extension);
      if (mediaElement) {
        cardElements.push(mediaElement);
      }
    } else if (app) {
      const mediaPath = app.metadataCache.getFirstLinkpathDest(url, ".")?.path;
      if (mediaPath) {
        const mediaResource = app.vault.adapter.getResourcePath(mediaPath);
        const mediaElement = createMediaElement(`m-${i}`, mediaResource, extension);
        if (mediaElement) {
          cardElements.push(mediaElement);
        }
      }
    }
    return { cardElements, endPos: annotation.endPos || 0 };
  }

  const textWithImages = React.useMemo(() => {
    let text = card.text;

    card.annotations.sort((a, b) => (a.startPos || 0) - (b.startPos || 0));

    let cardElements: JSX.Element[] = [];
    let lastEndPos = 0;
    for (let i = 0; i < card.annotations.length; i++) {
      const annotation = card.annotations[i];
      const processed = processAnnotation(annotation, i, text, lastEndPos);
      cardElements = [...cardElements, ...processed.cardElements];
      lastEndPos = processed.endPos;
    }
    cardElements.push(createTextElement('t-last', text.slice(lastEndPos)));

    return cardElements;
  }, [card]);

  return (
    <div className="card-stack">
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card">
        <h2 className="card-text">{textWithImages}</h2>
      </div>
    </div>
  );
}

export default CurrentCard;