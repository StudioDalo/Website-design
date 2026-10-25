import { test } from "node:test";
import assert from "node:assert/strict";
import {
  approvedProjects,
  disciplines,
  filterProjects,
  neighbors,
} from "../lib/catalog";
import { sourceProjects } from "../lib/project-source";
import { getProjects, getProject } from "../lib/projects";
import { validateEnquiry, deliverEnquiry, type Enquiry } from "../lib/enquiry";

test("all public data access excludes unapproved records and private media", () => {
  assert.equal(sourceProjects.length, 9);
  assert.equal(getProjects().length, 8);
  assert.equal(getProject("unpublished-internal-study"), undefined);
  const output = JSON.stringify(getProjects());
  assert.ok(!output.includes("Unpublished internal study"));
  assert.ok(!output.includes("/private/"));
  assert.equal(filterProjects(sourceProjects, "All", "Unpublished").length, 0);
});
test("discipline counts are calculated from approved records", () => {
  assert.equal(filterProjects(sourceProjects, "Architecture").length, 3);
  assert.equal(filterProjects(sourceProjects, "Interiors").length, 3);
  assert.equal(filterProjects(sourceProjects, "Design").length, 2);
});
test("search is case-insensitive and matches titles, sectors and tags", () => {
  assert.equal(
    filterProjects(sourceProjects, "All", "  COURTYARD  ")[0].slug,
    "courtyard-study",
  );
  assert.equal(filterProjects(sourceProjects, "All", "Hospitality").length, 2);
  assert.equal(filterProjects(sourceProjects, "All", "material").length, 2);
  assert.equal(
    filterProjects(sourceProjects, "Interiors", "hospitality").length,
    1,
  );
  assert.equal(
    filterProjects(sourceProjects, "Architecture", "objects").length,
    0,
  );
});
test("new disciplines come from approved data without layout changes", () => {
  const base = getProjects()[0];
  assert.deepEqual(
    disciplines([
      ...sourceProjects,
      { ...base, discipline: "Landscape" },
      { ...base, discipline: "Secret", approved: false },
    ]),
    ["Architecture", "Interiors", "Design", "Landscape"],
  );
});
test("project neighbors wrap around the active filtered set", () => {
  const set = filterProjects(sourceProjects, "Design");
  const result = neighbors(set, set[0].slug);
  assert.equal(result.next?.id, set[1].id);
  assert.equal(result.previous?.id, set[1].id);
  assert.deepEqual(neighbors([set[0]], set[0].slug), {
    previous: null,
    next: null,
  });
  assert.deepEqual(neighbors(set, "missing"), { previous: null, next: null });
});
test("approved project schema has accessible credited media and deliberate placeholders", () => {
  for (const p of getProjects()) {
    assert.ok(p.placeholder && p.title.includes("Placeholder"));
    assert.equal(p.year, undefined);
    assert.equal(p.practice, undefined);
    assert.ok(p.hero.caption.includes("Demonstration imagery"));
    for (const m of [p.hero, ...p.gallery]) {
      assert.ok(m.alt && m.credit && m.caption && m.width > 0 && m.height > 0);
      assert.ok(Math.abs(m.aspectRatio - m.width / m.height) < 0.01);
    }
    assert.ok(p.gallery.some((m) => m.type === "drawing"));
  }
});
const valid: Enquiry = {
  name: "QA Visitor",
  email: "qa@example.org",
  company: "",
  projectType: "Architecture",
  location: "",
  message: "A local demonstration enquiry.",
  reference: "",
};
test("enquiry validation rejects missing required values and malformed email", () => {
  assert.deepEqual(validateEnquiry(valid), {});
  assert.deepEqual(
    Object.keys(
      validateEnquiry({
        ...valid,
        name: " ",
        email: "invalid@",
        projectType: "",
        message: "short",
      }),
    ).sort(),
    ["email", "message", "name", "projectType"],
  );
});
test("delivery boundary reports demo, never delivery success", async () => {
  const result = await deliverEnquiry(valid);
  assert.deepEqual(result, { mode: "demo" });
});
test("approval filter leaves source untouched and respects featured ordering", () => {
  const copy = [...sourceProjects].reverse();
  const before = copy.map((p) => p.id);
  const publicSet = approvedProjects(copy);
  assert.equal(publicSet[0].featuredOrder, 1);
  assert.deepEqual(
    copy.map((p) => p.id),
    before,
  );
});
