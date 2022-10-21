import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";
import { isMeaningful } from "./TaxonomyLevel";
import { Work } from "./Work";

describe("isMeaningful()", () => {
  describe("when applied to a taxonomy", () => {
    it("should return false if the taxonomy has just 1 subject", () => {
      const taxonomy = new Taxonomy("Test taxonomy", [
        new Subject("First subject", [new Work("Alpha", 90)])
      ]);

      expect(isMeaningful(taxonomy)).toBe(false);
    });

    it("should return true if the taxonomy has at least 2 subjects", () => {
      const taxonomy = new Taxonomy("Test taxonomy", [
        new Subject("First subject", [new Work("Alpha", 90)]),
        new Subject("Second subject", [new Work("Beta", 75)])
      ]);

      expect(isMeaningful(taxonomy)).toBe(true);
    });
  });

  describe("when applied to a subject", () => {
    it("should return false if the subject contains just 1 subject", () => {
      const secondSubject = new Subject("Second subject", [
        new Work("Alpha", 90)
      ]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      expect(isMeaningful(firstSubject)).toBe(false);
    });

    it("should return true if the subject contains at least 2 subjects", () => {
      const secondSubject = new Subject("Second subject", [
        new Work("Alpha", 90)
      ]);

      const thirdSubject = new Subject("Third subject", [new Work("Beta", 42)]);

      const firstSubject = new Subject("First subject", [
        secondSubject,
        thirdSubject
      ]);

      expect(isMeaningful(firstSubject)).toBe(true);
    });

    it("should return true if the subject contains works", () => {
      const testSubject = new Subject("Test subject", [new Work("Beta", 42)]);

      expect(isMeaningful(testSubject)).toBe(true);
    });
  });
});
