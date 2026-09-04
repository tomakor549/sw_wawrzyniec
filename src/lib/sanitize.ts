import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "span",
  "sup",
  "sub",
];

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      h1: "h2",
    },
    exclusiveFilter: (frame) =>
      frame.tag === "a" &&
      typeof frame.attribs.href === "string" &&
      /^\s*javascript:/i.test(frame.attribs.href),
  });
}

export function stripHtml(html: string): string {
  const spaced = html.replace(/<\/(p|h[1-6]|li|div|tr|blockquote)>/gi, " ");
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptFrom(html: string, max = 220): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function titleFromHtml(html: string, fallback: string): string {
  const heading = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  if (heading) {
    const text = stripHtml(heading[1]);
    if (text) return text;
  }
  const paragraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraph) {
    const text = stripHtml(paragraph[1]);
    if (text && text.length <= 120) return text;
  }
  return fallback;
}
