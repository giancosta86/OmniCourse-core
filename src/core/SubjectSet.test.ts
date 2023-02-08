import { TestSubjects, TestSubject } from "@/test";
import { Work } from "./Work";

describe("Sorted subject set", () => {
  describe("when built with no items", () => {
    it("should be empty", () => {
      const subjectSet = TestSubjects.createSortedSet([]);

      expect(subjectSet).toBeEmpty();
    });
  });

  describe("when built with unique subjects", () => {
    it("should apply the related sorting algorithm", () => {
      const subjectSet = TestSubjects.createSortedSet(TestSubjects.scrambled);

      expect(subjectSet.toArray()).toEqual(TestSubjects.sorted);
    });
  });

  describe("when built with sibling subjects having the same title", () => {
    describe("even though the subjects have different items", () => {
      it("should throw", () => {
        expect(() => {
          TestSubjects.createSortedSet([
            TestSubject.create("Ro", [Work.create("Alpha", 90)]),
            TestSubject.create("Sigma", [Work.create("Beta", 90)]),
            TestSubject.create("Ro", [Work.create("Gamma", 30)])
          ]);
        }).toThrow("Duplicate subject: 'Ro'");
      });
    });
  });
});
