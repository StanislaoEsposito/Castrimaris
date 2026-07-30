"use client";

import { useMemo } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

/* ─────────────────────────────────────────────────────────────────────────
   ZOOMABLE CONTENT
   Renders HTML article content with clickable zoom for all <img> tags.
   Images remain full-width in the page but open in a lightbox on click.
   ───────────────────────────────────────────────────────────────────────── */
interface ZoomableContentProps {
  html: string;
  className?: string;
}

type HtmlPart = { type: "text" | "img"; content: string };

export default function ZoomableContent({ html, className }: ZoomableContentProps) {
  /* Split the HTML at every <img ...> tag so we can wrap each one in <Zoom> */
  const parts = useMemo<HtmlPart[]>(() => {
    // Regex that matches a complete <img ...> tag (self-closing or not)
    const IMG_RE = /<img\b[^>]*\/?>/gi;

    const result: HtmlPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = IMG_RE.exec(html)) !== null) {
      // Text before the image
      if (match.index > lastIndex) {
        result.push({ type: "text", content: html.slice(lastIndex, match.index) });
      }
      // The image tag itself
      result.push({ type: "img", content: match[0] });
      lastIndex = match.index + match[0].length;
    }

    // Any remaining text after the last image
    if (lastIndex < html.length) {
      result.push({ type: "text", content: html.slice(lastIndex) });
    }

    return result;
  }, [html]);

  return (
    <div className={className}>
      {parts.map((part, i) => {
        if (part.type === "img") {
          return (
            <Zoom key={i}>
              {/* Render the img tag natively so it preserves all src/alt attrs */}
              <span dangerouslySetInnerHTML={{ __html: part.content }} />
            </Zoom>
          );
        }
        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: part.content }} />
        );
      })}
    </div>
  );
}
