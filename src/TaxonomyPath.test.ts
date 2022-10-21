import { TaxonomyPath } from "./TaxonomyPath";
import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";
import { Work } from "./Work";

describe("Taxonomy path", () => {
  it("should be built from a taxonomy", () => {
    const taxonomy = new Taxonomy("My taxonomy", [
      new Subject("My subject", [new Work("Alpha", 90), new Work("Beta", 5)])
    ]);

    const path = TaxonomyPath.fromTaxonomy(taxonomy);

    expect(path.levels).toEqual([taxonomy]);
    expect(path.currentLevel).toBe(taxonomy);
    expect(path.previousLevels).toEqual([]);
  });

  describe("pushing a subject", () => {
    it("should work if the subject belongs to the current level of the path", () => {
      const firstSubject = new Subject("My subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

      expect(path.levels).toEqual([taxonomy, firstSubject]);
      expect(path.currentLevel).toBe(firstSubject);
      expect(path.previousLevels).toEqual([taxonomy]);
    });

    it("should throw if the subject does not belong to the current level of the path", () => {
      const secondSubject = new Subject("Second subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy);

      expect(() => {
        path.push(secondSubject);
      }).toThrow(
        "Cannot push subject 'Second subject' not belonging to the current level of the path"
      );
    });

    it("should throw if the current level of the path only contains works", () => {
      const secondSubject = new Subject("Second subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const firstSubject = new Subject("First subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy);

      expect(() => {
        path.push(secondSubject);
      }).toThrow(
        "Cannot push subject 'Second subject' not belonging to the current level of the path"
      );
    });
  });

  describe("Reverting to a level", () => {
    it("should work if the target level is the taxonomy", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .push(secondSubject)
        .push(thirdSubject)
        .revertTo(taxonomy);

      expect(path.levels).toEqual([taxonomy]);
      expect(path.currentLevel).toBe(taxonomy);
      expect(path.previousLevels).toEqual([]);
    });

    it("should work if the target level is a previous subject level", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .push(secondSubject)
        .push(thirdSubject)
        .revertTo(firstSubject);

      expect(path.levels).toEqual([taxonomy, firstSubject]);
      expect(path.currentLevel).toBe(firstSubject);
      expect(path.previousLevels).toEqual([taxonomy]);
    });

    it("should work if the target level is the current subject level", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .push(secondSubject)
        .push(thirdSubject)
        .revertTo(thirdSubject);

      expect(path.levels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject
      ]);
      expect(path.currentLevel).toBe(thirdSubject);
      expect(path.previousLevels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject
      ]);
    });

    it("should throw if the target level is not in the path", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      expect(() => {
        TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(secondSubject)
          .revertTo(thirdSubject);
      }).toThrow("Cannot find level 'Third subject' not belonging to the path");
    });
  });

  describe("requesting a meaningful level upon creation", () => {
    it("should remain at taxonomy level if it contains at least 2 subjects", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const firstSubject = new Subject("First subject", [thirdSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [
        firstSubject,
        secondSubject
      ]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

      expect(path.levels).toEqual([taxonomy]);
      expect(path.currentLevel).toBe(taxonomy);
      expect(path.previousLevels).toEqual([]);
    });

    it("should drill down until it finds a level having at least 2 subjects", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        thirdSubject,
        fourthSubject
      ]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

      expect(path.levels).toEqual([taxonomy, firstSubject, secondSubject]);
      expect(path.currentLevel).toBe(secondSubject);
      expect(path.previousLevels).toEqual([taxonomy, firstSubject]);
    });

    it("should drill down until it finds a level having works", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const thirdSubject = new Subject("Third subject", [fourthSubject]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

      expect(path.levels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject,
        fourthSubject
      ]);
      expect(path.currentLevel).toBe(fourthSubject);
      expect(path.previousLevels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject
      ]);
    });
  });

  describe("pushing to a meaningful level", () => {
    it("should drill down until it finds a level having at least 2 subjects", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        thirdSubject,
        fourthSubject
      ]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .toMeaningful();

      expect(path.levels).toEqual([taxonomy, firstSubject, secondSubject]);
      expect(path.currentLevel).toBe(secondSubject);
      expect(path.previousLevels).toEqual([taxonomy, firstSubject]);
    });

    it("should drill down until it finds a level having works", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const thirdSubject = new Subject("Third subject", [fourthSubject]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .toMeaningful();

      expect(path.levels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject,
        fourthSubject
      ]);
      expect(path.currentLevel).toBe(fourthSubject);
      expect(path.previousLevels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject
      ]);
    });
  });

  describe("reverting to a meaningful level", () => {
    it("should revert to the target level if it contains at least 2 subjects", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const firstSubject = new Subject("First subject", [thirdSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [
        firstSubject,
        secondSubject
      ]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .push(thirdSubject)
        .revertTo(taxonomy)
        .toMeaningful();

      expect(path.levels).toEqual([taxonomy]);
      expect(path.currentLevel).toBe(taxonomy);
      expect(path.previousLevels).toEqual([]);
    });

    it("should drill down until it finds a level having at least 2 subjects", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Gamma", 37),
        new Work("Delta", 58)
      ]);

      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        thirdSubject,
        fourthSubject
      ]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .revertTo(taxonomy)
        .toMeaningful();

      expect(path.levels).toEqual([taxonomy, firstSubject, secondSubject]);
      expect(path.currentLevel).toBe(secondSubject);
      expect(path.previousLevels).toEqual([taxonomy, firstSubject]);
    });

    it("should drill down until it finds a level having works", () => {
      const fourthSubject = new Subject("Fourth subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const thirdSubject = new Subject("Third subject", [fourthSubject]);

      const secondSubject = new Subject("Second subject", [thirdSubject]);

      const firstSubject = new Subject("First subject", [secondSubject]);

      const taxonomy = new Taxonomy("My taxonomy", [firstSubject]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .revertTo(taxonomy)
        .toMeaningful();

      expect(path.levels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject,
        fourthSubject
      ]);
      expect(path.currentLevel).toBe(fourthSubject);
      expect(path.previousLevels).toEqual([
        taxonomy,
        firstSubject,
        secondSubject,
        thirdSubject
      ]);
    });
  });

  describe("subjects in previous levels", () => {
    it("should be zero when the path has just a taxonomy", () => {
      const taxonomy = new Taxonomy("Test", [
        new Subject("First", [new Work("Alpha", 90)])
      ]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy);

      expect(path.subjectsInPreviousLevels).toBe(0);
    });

    it("should return the number of first-level subjects in a basic scenario", () => {
      const firstSubject = new Subject("First", [new Work("Alpha", 90)]);

      const taxonomy = new Taxonomy("Test", [
        firstSubject,
        new Subject("Second", [
          new Work("Beta", 7),
          new Work("Gamma", 9),
          new Work("Delta", 18),
          new Work("Epsilon", 45)
        ]),
        new Subject("Third", [new Work("Zeta", 95)])
      ]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

      expect(path.subjectsInPreviousLevels).toBe(3);
    });

    it("should sum the subjects in all the previous levels", () => {
      const thirdSubject = new Subject("Third", [
        new Subject("Fourth", [new Work("Alpha", 90)])
      ]);

      const secondSubject = new Subject("Second", [
        thirdSubject,
        new Subject("Third-bis", [new Work("Eta", 32)])
      ]);

      const firstSubject = new Subject("First", [
        secondSubject,
        new Subject("Second-bis", [new Work("Beta", 95)]),
        new Subject("Second-tris", [new Work("Gamma", 92)])
      ]);

      const taxonomy = new Taxonomy("Test", [
        firstSubject,
        new Subject("First-bis", [new Work("Delta", 7)]),
        new Subject("First-tris", [new Work("Epsilon", 9)]),
        new Subject("First-quatuor", [new Work("Zeta", 98)])
      ]);

      const path = TaxonomyPath.fromTaxonomy(taxonomy)
        .push(firstSubject)
        .push(secondSubject)
        .push(thirdSubject);

      expect(path.subjectsInPreviousLevels).toBe(4 + 3 + 2);
    });
  });

  describe("navigating a taxonomy", () => {
    describe("when all the path levels are in the taxonomy", () => {
      it("should return the path itself", () => {
        const initialThirdSubject = new Subject("Third subject", [
          new Work("Alpha", 90)
        ]);
        const initialSecondSubject = new Subject("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = new Subject("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = new Taxonomy("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = new Subject("Third subject", [
          new Work("Beta", 50)
        ]);
        const nextSecondSubject = new Subject("Second subject", [
          nextThirdSubject
        ]);
        const nextFirstSubject = new Subject("First subject", [
          nextSecondSubject
        ]);
        const nextTaxonomy = new Taxonomy("Next taxonomy", [nextFirstSubject]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqual([
          nextTaxonomy,
          nextFirstSubject,
          nextSecondSubject,
          nextThirdSubject
        ]);
      });
    });

    describe("when part of the path levels are in the taxonomy", () => {
      it("should navigate up to the last level supported by the taxonomy", () => {
        const initialThirdSubject = new Subject("Third subject", [
          new Work("Alpha", 90)
        ]);
        const initialSecondSubject = new Subject("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = new Subject("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = new Taxonomy("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextSecondSubject = new Subject("Second subject", [
          new Work("Gamma", 87)
        ]);
        const nextFirstSubject = new Subject("First subject", [
          nextSecondSubject
        ]);
        const nextTaxonomy = new Taxonomy("Next taxonomy", [nextFirstSubject]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqual([
          nextTaxonomy,
          nextFirstSubject,
          nextSecondSubject
        ]);
      });
    });

    describe("when the first level of the taxonomy does not match the path", () => {
      it("should return a path with just the taxonomy", () => {
        const initialThirdSubject = new Subject("Third subject", [
          new Work("Alpha", 90)
        ]);
        const initialSecondSubject = new Subject("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = new Subject("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = new Taxonomy("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = new Subject("Third subject", [
          new Work("Beta", 50)
        ]);
        const nextSecondSubject = new Subject("Second subject", [
          nextThirdSubject
        ]);
        const nextFirstSubject = new Subject("UNKNOWN SUBJECT", [
          nextSecondSubject
        ]);
        const nextTaxonomy = new Taxonomy("Next taxonomy", [nextFirstSubject]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqual([nextTaxonomy]);
      });
    });
  });
});
