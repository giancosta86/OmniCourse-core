import { TestTaxonomy, TestSubject } from "@/test";
import { TaxonomyPath } from "./TaxonomyPath";
import { Work } from "./Work";

describe("Taxonomy path", () => {
  it("should be created from a taxonomy", () => {
    const taxonomy = TestTaxonomy.create("My taxonomy", [
      TestSubject.create("My subject", [
        Work.create("Alpha", 90),
        Work.create("Beta", 5)
      ])
    ]);

    const path = TaxonomyPath.fromTaxonomy(taxonomy);

    expect(path.levels).toEqualSequence([taxonomy]);
    expect(path.currentLevel).toBe(taxonomy);
    expect(path.previousLevels).toBeEmpty();
  });

  describe("pushing a subject", () => {
    describe("if the subject belongs to the current level of the path", () => {
      it("should work", () => {
        const firstSubject = TestSubject.create("My subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

        expect(path.levels).toEqualSequence([taxonomy, firstSubject]);
        expect(path.currentLevel).toBe(firstSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy]);
      });
    });

    describe("if the subject does not belong to the current level of the path", () => {
      it("should throw", () => {
        const secondSubject = TestSubject.create("Second subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy);

        expect(() => {
          path.push(secondSubject);
        }).toThrow(
          "Cannot push subject 'Second subject' not belonging to the current level of the path"
        );
      });
    });

    describe("if the current level of the path only has works", () => {
      it("should throw", () => {
        const alternativeSubject = TestSubject.create("Alternative subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = TestSubject.create("First subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [
          firstSubject,
          alternativeSubject
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

        expect(() => {
          path.push(alternativeSubject);
        }).toThrow(
          "Cannot push subject 'Alternative subject' not belonging to the current level of the path"
        );
      });
    });
  });

  describe("Reverting to a level", () => {
    describe("if the target level is the taxonomy", () => {
      it("should work", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(secondSubject)
          .push(thirdSubject)
          .revertTo(taxonomy);

        expect(path.levels).toEqualSequence([taxonomy]);
        expect(path.currentLevel).toBe(taxonomy);
        expect(path.previousLevels).toBeEmpty();
      });
    });

    describe("if the target level is a previous subject level", () => {
      it("should work", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(secondSubject)
          .push(thirdSubject)
          .revertTo(firstSubject);

        expect(path.levels).toEqualSequence([taxonomy, firstSubject]);
        expect(path.currentLevel).toBe(firstSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy]);
      });
    });

    describe("if the target level is the current subject level", () => {
      it("should work", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(secondSubject)
          .push(thirdSubject)
          .revertTo(thirdSubject);

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject
        ]);
        expect(path.currentLevel).toBe(thirdSubject);
        expect(path.previousLevels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject
        ]);
      });
    });

    describe("if the target level is not in the path", () => {
      it("should throw", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        expect(() => {
          TaxonomyPath.fromTaxonomy(taxonomy)
            .push(firstSubject)
            .push(secondSubject)
            .revertTo(thirdSubject);
        }).toThrow(
          "Cannot find level 'Third subject' not belonging to the path"
        );
      });
    });
  });

  describe("requesting a meaningful level upon creation", () => {
    describe("if the taxonomy has at least 2 subjects", () => {
      it("should remain at taxonomy level", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = TestSubject.create("First subject", [
          thirdSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [
          firstSubject,
          secondSubject
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

        expect(path.levels).toEqualSequence([taxonomy]);
        expect(path.currentLevel).toBe(taxonomy);
        expect(path.previousLevels).toBeEmpty();
      });
    });

    describe("until it finds a level having at least 2 subjects", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject
        ]);
        expect(path.currentLevel).toBe(secondSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy, firstSubject]);
      });
    });

    describe("until it finds a level having works", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          fourthSubject
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject,
          fourthSubject
        ]);
        expect(path.currentLevel).toBe(fourthSubject);
        expect(path.previousLevels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject
        ]);
      });
    });
  });

  describe("pushing to a meaningful level", () => {
    describe("until it finds a level having at least 2 subjects", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject
        ]);
        expect(path.currentLevel).toBe(secondSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy, firstSubject]);
      });
    });

    describe("until it finds a level having works", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          fourthSubject
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject,
          fourthSubject
        ]);
        expect(path.currentLevel).toBe(fourthSubject);
        expect(path.previousLevels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject
        ]);
      });
    });
  });

  describe("reverting to a meaningful level", () => {
    describe("if the target level has at least 2 subjects", () => {
      it("should revert to the target level", () => {
        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = TestSubject.create("First subject", [
          thirdSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [
          firstSubject,
          secondSubject
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(thirdSubject)
          .revertTo(taxonomy)
          .toMeaningful();

        expect(path.levels).toEqualSequence([taxonomy]);
        expect(path.currentLevel).toBe(taxonomy);
        expect(path.previousLevels).toBeEmpty();
      });
    });

    describe("until it finds a level having at least 2 subjects", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .revertTo(taxonomy)
          .toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject
        ]);
        expect(path.currentLevel).toBe(secondSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy, firstSubject]);
      });
    });

    describe("until it finds a level having works", () => {
      it("should drill down", () => {
        const fourthSubject = TestSubject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = TestSubject.create("Third subject", [
          fourthSubject
        ]);

        const secondSubject = TestSubject.create("Second subject", [
          thirdSubject
        ]);

        const firstSubject = TestSubject.create("First subject", [
          secondSubject
        ]);

        const taxonomy = TestTaxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .revertTo(taxonomy)
          .toMeaningful();

        expect(path.levels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject,
          fourthSubject
        ]);
        expect(path.currentLevel).toBe(fourthSubject);
        expect(path.previousLevels).toEqualSequence([
          taxonomy,
          firstSubject,
          secondSubject,
          thirdSubject
        ]);
      });
    });
  });

  describe("top subjects in previous levels", () => {
    describe("when the path has just the taxonomy", () => {
      it("should be zero", () => {
        const taxonomy = TestTaxonomy.create("Test", [
          TestSubject.create("First", [Work.create("Alpha", 90)])
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy);

        expect(path.topSubjectsInPreviousLevels).toBe(0);
      });
    });

    describe("when the path has just 2 levels", () => {
      it("should return the number of subjects directly owned by the taxonomy", () => {
        const firstSubject = TestSubject.create("First", [
          Work.create("Alpha", 90)
        ]);

        const taxonomy = TestTaxonomy.create("Test", [
          firstSubject,
          TestSubject.create("Second", [
            Work.create("Beta", 7),
            Work.create("Gamma", 9),
            Work.create("Delta", 18),
            Work.create("Epsilon", 45)
          ]),
          TestSubject.create("Third", [Work.create("Zeta", 95)])
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

        expect(path.topSubjectsInPreviousLevels).toBe(3);
      });
    });

    describe("when the path has more than 2 levels", () => {
      it("should sum the number of subjects directly owned by each previous level", () => {
        const thirdSubject = TestSubject.create("Third", [
          TestSubject.create("Fourth", [Work.create("Alpha", 90)])
        ]);

        const secondSubject = TestSubject.create("Second", [
          thirdSubject,
          TestSubject.create("Third-bis", [Work.create("Eta", 32)])
        ]);

        const firstSubject = TestSubject.create("First", [
          secondSubject,
          TestSubject.create("Second-bis", [Work.create("Beta", 95)]),
          TestSubject.create("Second-tris", [Work.create("Gamma", 92)])
        ]);

        const taxonomy = TestTaxonomy.create("Test", [
          firstSubject,
          TestSubject.create("First-bis", [Work.create("Delta", 7)]),
          TestSubject.create("First-tris", [Work.create("Epsilon", 9)]),
          TestSubject.create("First-quatuor", [Work.create("Zeta", 98)])
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy)
          .push(firstSubject)
          .push(secondSubject)
          .push(thirdSubject);

        expect(path.topSubjectsInPreviousLevels).toBe(4 + 3 + 2);
      });
    });
  });

  describe("navigating a taxonomy", () => {
    describe("when all the path levels are in the taxonomy", () => {
      it("should return the path itself", () => {
        const initialThirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = TestSubject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = TestSubject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = TestTaxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = TestSubject.create(initialThirdSubject.name, [
          Work.create("Beta", 50)
        ]);
        const nextSecondSubject = TestSubject.create(
          initialSecondSubject.name,
          [nextThirdSubject]
        );
        const nextFirstSubject = TestSubject.create(initialFirstSubject.name, [
          nextSecondSubject
        ]);
        const nextTaxonomy = TestTaxonomy.create("Next taxonomy", [
          nextFirstSubject
        ]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqualSequence([
          nextTaxonomy,
          nextFirstSubject,
          nextSecondSubject,
          nextThirdSubject
        ]);
      });
    });

    describe("when only part of the path levels are in the taxonomy", () => {
      it("should navigate up to the deepest level supported by the taxonomy", () => {
        const initialThirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = TestSubject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = TestSubject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = TestTaxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextSecondSubject = TestSubject.create(
          initialSecondSubject.name,
          [Work.create("Gamma", 87)]
        );
        const nextFirstSubject = TestSubject.create(initialFirstSubject.name, [
          nextSecondSubject
        ]);
        const nextTaxonomy = TestTaxonomy.create("Next taxonomy", [
          nextFirstSubject
        ]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqualSequence([
          nextTaxonomy,
          nextFirstSubject,
          nextSecondSubject
        ]);
      });
    });

    describe("when the first level of the taxonomy does not match the path", () => {
      it("should return a path with just the taxonomy", () => {
        const initialThirdSubject = TestSubject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = TestSubject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = TestSubject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = TestTaxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = TestSubject.create(initialThirdSubject.name, [
          Work.create("Beta", 50)
        ]);
        const nextSecondSubject = TestSubject.create(
          initialSecondSubject.name,
          [nextThirdSubject]
        );
        const nextFirstSubject = TestSubject.create("UNKNOWN SUBJECT", [
          nextSecondSubject
        ]);
        const nextTaxonomy = TestTaxonomy.create("Next taxonomy", [
          nextFirstSubject
        ]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqualSequence([nextTaxonomy]);
      });
    });
  });
});
