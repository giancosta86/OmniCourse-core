import { Equality } from "@giancosta86/more-jest";
import {
  TestTaxonomy,
  TestSubject,
  TestSubjects,
  JsonConversion
} from "@/test";
import { TaxonomyJson } from "@/json";
import { Work } from "./Work";
import { Taxonomy } from "./Taxonomy";

describe("Taxonomy", () => {
  describe("constructor", () => {
    describe("when the name is empty", () => {
      it("should throw", () => {
        expect(() => {
          TestTaxonomy.create("", [
            TestSubject.create("First subject", [Work.create("Alpha", 90)])
          ]);
        }).toThrow("Empty taxonomy name");
      });
    });

    describe("when no subjects are passed", () => {
      it("should throw", () => {
        expect(() => {
          TestTaxonomy.create("EmptyTaxonomy", []);
        }).toThrow("No subjects for taxonomy 'EmptyTaxonomy'");
      });
    });

    describe("when built with subjects having the same name", () => {
      it("should throw", () => {
        expect(() => {
          TestTaxonomy.create("MyTaxonomy", [
            TestSubject.create("Ro", [Work.create("Alpha", 90)]),
            TestSubject.create("Sigma", [Work.create("Beta", 81)]),
            TestSubject.create("Ro", [Work.create("Gamma", 34)])
          ]);
        }).toThrow("Duplicate subject: 'Ro'");
      });
    });
  });

  describe("minutes", () => {
    it("should be computed from the subjects'", () => {
      const taxonomy = TestTaxonomy.create("My taxonomy", [
        TestSubject.create("First subject", [Work.create("Alpha", 90)]),

        TestSubject.create("Second subject", [
          Work.create("Beta", 4),
          Work.create("Gamma", 2)
        ])
      ]);

      expect(taxonomy.minutes).toBe(90 + 4 + 2);
    });
  });

  it("should have subjects", () => {
    const taxonomy = TestTaxonomy.create("Test", [
      TestSubject.create("First", [Work.create("Alpha", 90)]),
      TestSubject.create("Second", [
        TestSubject.create("Third", [Work.create("Beta", 95)])
      ])
    ]);

    expect(taxonomy.hasSubjects).toBe(true);
  });

  it("should have a sorted set of subjects", () => {
    const firstSubject = TestSubject.create("First", [
      Work.create("Alpha", 90)
    ]);

    const secondSubject = TestSubject.create("Second", [
      TestSubject.create("Third", [Work.create("Beta", 95)])
    ]);

    const taxonomy = TestTaxonomy.create("Test", [firstSubject, secondSubject]);

    expect(taxonomy.items.toArray()).toEqual([secondSubject, firstSubject]);
  });

  describe("when the items are subjects having just works", () => {
    const factory = (zWorkTitle: string) =>
      TestTaxonomy.create("My taxonomy", [
        TestSubject.create("Alpha", [Work.create("X", 3), Work.create("Y", 4)]),
        TestSubject.create("Beta", [Work.create(zWorkTitle, 7)])
      ]);

    Equality.test(
      () => factory("Z"),
      () => factory("Z_________2")
    );
  });

  describe("when the items are subjects with nesting", () => {
    const factory = (bWorkTitle: string) =>
      TestTaxonomy.create("My taxonomy", [
        TestSubject.create("Alpha", [
          TestSubject.create("Ro", [Work.create("X", 3), Work.create("Y", 4)]),
          TestSubject.create("Sigma", [Work.create("Z", 7)])
        ]),

        TestSubject.create("Gamma", [
          TestSubject.create("Tau", [Work.create("A", 90)]),
          TestSubject.create("Omega", [Work.create(bWorkTitle, 18)])
        ])
      ]);

    Equality.test(
      () => factory("B"),
      () => factory("B__________2")
    );
  });

  JsonConversion.testRoundTrip(Taxonomy, TaxonomyJson, () =>
    TestTaxonomy.create("My taxonomy", TestSubjects.scrambled)
  );
});
