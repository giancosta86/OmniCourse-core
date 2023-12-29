import { Subject } from "./Subject";
import { Taxonomy } from "./Taxonomy";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Work } from "./Work";

describe("TaxonomyLevel", () => {
  describe("isMeaningful()", () => {
    describe("when applied to a taxonomy", () => {
      describe("when the taxonomy has just 1 subject", () => {
        it("should return false", () => {
          const taxonomy = Taxonomy.create("Test taxonomy", [
            Subject.create("First subject", [Work.create("Alpha", 90)])
          ]);

          expect(TaxonomyLevel.isMeaningful(taxonomy)).toBe(false);
        });
      });

      describe("when the taxonomy has at least 2 subjects", () => {
        it("should return true", () => {
          const taxonomy = Taxonomy.create("Test taxonomy", [
            Subject.create("First subject", [Work.create("Alpha", 90)]),
            Subject.create("Second subject", [Work.create("Beta", 75)])
          ]);

          expect(TaxonomyLevel.isMeaningful(taxonomy)).toBe(true);
        });
      });
    });

    describe("when applied to a subject", () => {
      describe("when the subject has just 1 subject", () => {
        it("should return false", () => {
          const subject = Subject.create("First subject", [
            Subject.create("Second subject", [Work.create("Alpha", 90)])
          ]);

          expect(TaxonomyLevel.isMeaningful(subject)).toBe(false);
        });
      });

      describe("when the subject has at least 2 subjects", () => {
        it("should return true", () => {
          const firstSubject = Subject.create("First subject", [
            Subject.create("Second subject", [Work.create("Alpha", 90)]),
            Subject.create("Third subject", [Work.create("Beta", 42)])
          ]);

          expect(TaxonomyLevel.isMeaningful(firstSubject)).toBe(true);
        });
      });

      describe("when the subject has even a single work", () => {
        it("should return true", () => {
          const testSubject = Subject.create("Test subject", [
            Work.create("Beta", 42)
          ]);

          expect(TaxonomyLevel.isMeaningful(testSubject)).toBe(true);
        });
      });
    });
  });
});
