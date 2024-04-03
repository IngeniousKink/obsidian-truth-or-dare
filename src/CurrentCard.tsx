import * as React from 'react';
import { ParsedCard, Annotation } from './parse-card.js';
import { useApp } from './hooks.js';

const CurrentCard: React.FC<{ card: ParsedCard }> = ({ card }) => {

  const app = useApp()

  const textWithImages = React.useMemo(() => {
    let text = card.text;
    let annotations = card.annotations.filter((annotation): annotation is Annotation => annotation.type === 'image');

    annotations.sort((a, b) => (a.startPos || 0) - (b.startPos || 0));

    let jsxArray: JSX.Element[] = [];
    let lastEndPos = 0;
    for (let i = 0; i < annotations.length; i++) {
      const annotation = annotations[i];
      jsxArray.push(<span key={`t-{i}`}>{text.slice(lastEndPos, annotation.startPos)}</span>);

      const urlParts = String(annotation.url || "").split("|");
      const url = urlParts[0];
      const size = urlParts.length > 1 ? urlParts[1] : null;

      const extension = url.split('.').pop()?.toLowerCase() || "jpg";

      if (url.startsWith('http')) {
        if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
          jsxArray.push(<img key={`m-{i}`} src={url} />);
        } else if (["mp4", "webm", "ogg"].includes(extension)) {
          jsxArray.push(<video key={`m-{i}`} src={url} controls />);
        }
      } else if (app) {
        console.log('looking up ', annotation.url);
        const mediaPath = app.metadataCache.getFirstLinkpathDest(url, ".")?.path;
        console.log('found path ', mediaPath);
        if (mediaPath) {
          const mediaResource = app.vault.adapter.getResourcePath(mediaPath);
          console.log('found resource', mediaResource);
          if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
            jsxArray.push(<img key={`m-{i}`} src={mediaResource} />);
          } else if (["mp4", "webm", "ogg"].includes(extension)) {
            jsxArray.push(<video key={`m-{i}`} src={mediaResource} controls autoPlay/>);
          }
        }
      }

      lastEndPos = annotation.endPos || 0;
    }
    jsxArray.push(<span key='t-last'>{text.slice(lastEndPos)}</span>);

    return jsxArray;
  }, [card]);

  console.log('annotations!', card.annotations);
  return (
    <div className="card">
      <h2 className="card-text">{textWithImages}</h2>
      {/* {card.category && <h3 className="card-category">{card.category}</h3>} */}
    </div>
  );
}

export default CurrentCard;