export function HtmlContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`prose-liturgy ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
