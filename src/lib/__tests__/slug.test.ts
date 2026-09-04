import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPlDate, parseContentFilename, slugify } from "../slug";

describe("slugify", () => {
  it("folds Polish characters", () => {
    assert.equal(slugify("Ogłoszenia parafialne"), "ogloszenia-parafialne");
    assert.equal(slugify("Święty Wawrzyniec"), "swiety-wawrzyniec");
  });
});

describe("parseContentFilename", () => {
  it("reads date prefix and slug", () => {
    const parsed = parseContentFilename("2026-08-30-ogloszenia-parafialne.docx");
    assert.equal(parsed.date, "2026-08-30");
    assert.equal(parsed.slug, "ogloszenia-parafialne");
  });

  it("works without a date", () => {
    const parsed = parseContentFilename("intencje.docx");
    assert.equal(parsed.date, null);
    assert.equal(parsed.slug, "intencje");
  });
});

describe("formatPlDate", () => {
  it("formats a Sunday announcement date", () => {
    assert.equal(formatPlDate("2026-08-30"), "30 sierpnia 2026");
  });
});
