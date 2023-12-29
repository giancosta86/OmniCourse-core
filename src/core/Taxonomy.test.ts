import { Equality } from "@giancosta86/more-jest";
import { TestSubjects, JsonConversion } from "@/test";
import { TaxonomyJson } from "@/json";
import { Work } from "./Work";
import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";
0.0;

describe("Taxonomy", () => {
  describe("constructor", () => {
    describe("when the name is empty", () => {
      it("should throw", () => {
        expect(() => {
          Taxonomy.create("", [
            Subject.create("First subject", [Work.create("Alpha", 90)])
          ]);
        }).toThrow("Empty taxonomy name");
      });
    });

    describe("when no subjects are passed", () => {
      it("should throw", () => {
        expect(() => {
          Taxonomy.create("EmptyTaxonomy", []);
        }).toThrow("No subjects for taxonomy 'EmptyTaxonomy'");
      });
    });

    describe("when built with subjects having the same name", () => {
      it("should throw", () => {
        expect(() => {
          Taxonomy.create("MyTaxonomy", [
            Subject.create("Ro", [Work.create("Alpha", 90)]),
            Subject.create("Sigma", [Work.create("Beta", 81)]),
            Subject.create("Ro", [Work.create("Gamma", 34)])
          ]);
        }).toThrow("Duplicate subject: 'Ro'");
      });
    });
  });

  describe("minutes", () => {
    it("should be computed from the subjects'", () => {
      const taxonomy = Taxonomy.create("My taxonomy", [
        Subject.create("First subject", [Work.create("Alpha", 90)]),

        Subject.create("Second subject", [
          Work.create("Beta", 4),
          Work.create("Gamma", 2)
        ])
      ]);

      expect(taxonomy.minutes).toBe(90 + 4 + 2);
    });
  });

  it("should have subjects", () => {
    const taxonomy = Taxonomy.create("Test", [
      Subject.create("First", [Work.create("Alpha", 90)]),
      Subject.create("Second", [
        Subject.create("Third", [Work.create("Beta", 95)])
      ])
    ]);

    expect(taxonomy.hasSubjects).toBe(true);
  });

  it("should have the set of subjects in the given order", () => {
    const firstSubject = Subject.create("First", [Work.create("Alpha", 90)]);

    const secondSubject = Subject.create("Second", [
      Subject.create("Third", [Work.create("Beta", 95)])
    ]);

    const taxonomy = Taxonomy.create("Test", [firstSubject, secondSubject]);

    expect(taxonomy.items.toArray()).toEqual([firstSubject, secondSubject]);
  });

  describe("when the items are subjects having just works", () => {
    const factory = (zWorkTitle: string) =>
      Taxonomy.create("My taxonomy", [
        Subject.create("Alpha", [Work.create("X", 3), Work.create("Y", 4)]),
        Subject.create("Beta", [Work.create(zWorkTitle, 7)])
      ]);

    Equality.test(
      () => factory("Z"),
      () => factory("Z_________2")
    );
  });

  describe("when the items are subjects with nesting", () => {
    const factory = (bWorkTitle: string) =>
      Taxonomy.create("My taxonomy", [
        Subject.create("Alpha", [
          Subject.create("Ro", [Work.create("X", 3), Work.create("Y", 4)]),
          Subject.create("Sigma", [Work.create("Z", 7)])
        ]),

        Subject.create("Gamma", [
          Subject.create("Tau", [Work.create("A", 90)]),
          Subject.create("Omega", [Work.create(bWorkTitle, 18)])
        ])
      ]);

    Equality.test(
      () => factory("B"),
      () => factory("B__________2")
    );
  });

  JsonConversion.testRoundTrip(Taxonomy, TaxonomyJson, () =>
    Taxonomy.create("My taxonomy", TestSubjects.scrambled)
  );
});
