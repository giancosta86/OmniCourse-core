import { Subject } from "./Subject";
import { Taxonomy } from "./Taxonomy";
import { TaxonomyPath } from "./TaxonomyPath";
import { Work } from "./Work";

describe("Taxonomy path", () => {
  it("should be created from a taxonomy", () => {
    const taxonomy = Taxonomy.create("My taxonomy", [
      Subject.create("My subject", [
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
        const firstSubject = Subject.create("My subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

        expect(path.levels).toEqualSequence([taxonomy, firstSubject]);
        expect(path.currentLevel).toBe(firstSubject);
        expect(path.previousLevels).toEqualSequence([taxonomy]);
      });
    });

    describe("if the subject does not belong to the current level of the path", () => {
      it("should throw", () => {
        const secondSubject = Subject.create("Second subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const alternativeSubject = Subject.create("Alternative subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = Subject.create("First subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const taxonomy = Taxonomy.create("My taxonomy", [
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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = Subject.create("First subject", [thirdSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [
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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = Subject.create("Third subject", [fourthSubject]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = Subject.create("Third subject", [fourthSubject]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const firstSubject = Subject.create("First subject", [thirdSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [
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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Gamma", 37),
          Work.create("Delta", 58)
        ]);

        const thirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const secondSubject = Subject.create("Second subject", [
          thirdSubject,
          fourthSubject
        ]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const fourthSubject = Subject.create("Fourth subject", [
          Work.create("Alpha", 90),
          Work.create("Beta", 5)
        ]);

        const thirdSubject = Subject.create("Third subject", [fourthSubject]);

        const secondSubject = Subject.create("Second subject", [thirdSubject]);

        const firstSubject = Subject.create("First subject", [secondSubject]);

        const taxonomy = Taxonomy.create("My taxonomy", [firstSubject]);

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
        const taxonomy = Taxonomy.create("Test", [
          Subject.create("First", [Work.create("Alpha", 90)])
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy);

        expect(path.topSubjectsInPreviousLevels).toBe(0);
      });
    });

    describe("when the path has just 2 levels", () => {
      it("should return the number of subjects directly owned by the taxonomy", () => {
        const firstSubject = Subject.create("First", [
          Work.create("Alpha", 90)
        ]);

        const taxonomy = Taxonomy.create("Test", [
          firstSubject,
          Subject.create("Second", [
            Work.create("Beta", 7),
            Work.create("Gamma", 9),
            Work.create("Delta", 18),
            Work.create("Epsilon", 45)
          ]),
          Subject.create("Third", [Work.create("Zeta", 95)])
        ]);

        const path = TaxonomyPath.fromTaxonomy(taxonomy).push(firstSubject);

        expect(path.topSubjectsInPreviousLevels).toBe(3);
      });
    });

    describe("when the path has more than 2 levels", () => {
      it("should sum the number of subjects directly owned by each previous level", () => {
        const thirdSubject = Subject.create("Third", [
          Subject.create("Fourth", [Work.create("Alpha", 90)])
        ]);

        const secondSubject = Subject.create("Second", [
          thirdSubject,
          Subject.create("Third-bis", [Work.create("Eta", 32)])
        ]);

        const firstSubject = Subject.create("First", [
          secondSubject,
          Subject.create("Second-bis", [Work.create("Beta", 95)]),
          Subject.create("Second-tris", [Work.create("Gamma", 92)])
        ]);

        const taxonomy = Taxonomy.create("Test", [
          firstSubject,
          Subject.create("First-bis", [Work.create("Delta", 7)]),
          Subject.create("First-tris", [Work.create("Epsilon", 9)]),
          Subject.create("First-quatuor", [Work.create("Zeta", 98)])
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
        const initialThirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = Subject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = Subject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = Taxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = Subject.create(initialThirdSubject.name, [
          Work.create("Beta", 50)
        ]);
        const nextSecondSubject = Subject.create(initialSecondSubject.name, [
          nextThirdSubject
        ]);
        const nextFirstSubject = Subject.create(initialFirstSubject.name, [
          nextSecondSubject
        ]);
        const nextTaxonomy = Taxonomy.create("Next taxonomy", [
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
        const initialThirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = Subject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = Subject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = Taxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextSecondSubject = Subject.create(initialSecondSubject.name, [
          Work.create("Gamma", 87)
        ]);
        const nextFirstSubject = Subject.create(initialFirstSubject.name, [
          nextSecondSubject
        ]);
        const nextTaxonomy = Taxonomy.create("Next taxonomy", [
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
        const initialThirdSubject = Subject.create("Third subject", [
          Work.create("Alpha", 90)
        ]);
        const initialSecondSubject = Subject.create("Second subject", [
          initialThirdSubject
        ]);
        const initialFirstSubject = Subject.create("First subject", [
          initialSecondSubject
        ]);
        const initialTaxonomy = Taxonomy.create("Initial taxonomy", [
          initialFirstSubject
        ]);

        const initialPath = TaxonomyPath.fromTaxonomy(initialTaxonomy)
          .push(initialFirstSubject)
          .push(initialSecondSubject)
          .push(initialThirdSubject);

        const nextThirdSubject = Subject.create(initialThirdSubject.name, [
          Work.create("Beta", 50)
        ]);
        const nextSecondSubject = Subject.create(initialSecondSubject.name, [
          nextThirdSubject
        ]);
        const nextFirstSubject = Subject.create("UNKNOWN SUBJECT", [
          nextSecondSubject
        ]);
        const nextTaxonomy = Taxonomy.create("Next taxonomy", [
          nextFirstSubject
        ]);

        const nextPath = initialPath.navigateTaxonomy(nextTaxonomy);

        expect(nextPath.levels).toEqualSequence([nextTaxonomy]);
      });
    });
  });
});
