import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { excerptFrom, sanitizeArticleHtml, titleFromHtml } from "../sanitize";

describe("sanitizeArticleHtml", () => {
  it("drops scripts and javascript links", () => {
    const html = sanitizeArticleHtml(
      `<p>Pokój</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>`,
    );
    assert.equal(html.includes("script"), false);
    assert.equal(html.includes("javascript"), false);
    assert.equal(html.includes("Pokój"), true);
  });

  it("keeps liturgical markup", () => {
    const html = sanitizeArticleHtml("<p><strong>Msze św.</strong> o godz. 8:00</p>");
    assert.match(html, /<strong>/);
  });
});

describe("titleFromHtml", () => {
  it("uses the first heading", () => {
    assert.equal(titleFromHtml("<h1>Ogłoszenia</h1><p>treść</p>", "fallback"), "Ogłoszenia");
  });
});

describe("excerptFrom", () => {
  it("strips tags", () => {
    assert.equal(excerptFrom("<p>Witajcie w <strong>parafii</strong>.</p>"), "Witajcie w parafii.");
  });

  it("separates paragraphs", () => {
    assert.equal(excerptFrom("<p>Tytuł</p><p>Dziś niedziela.</p>"), "Tytuł Dziś niedziela.");
  });
});
