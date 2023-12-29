import { Test, TestSubjects } from "@/test";
import { Work } from "./Work";
import { Subjects } from "./Subjects";
import { Subject } from "./Subject";

describe("Subject sequences", () => {
  describe("when ensuring no duplicates", () => {
    describe("when applied to an empty sequence", () => {
      it("should work", () => {
        Subjects.ensureNoDuplicates([]);
      });
    });

    describe("when applied to a sequence of unique items", () => {
      it("should work", () => {
        Subjects.ensureNoDuplicates(TestSubjects.scrambled);
      });
    });

    describe("when sibling subjects have the same title", () => {
      describe("even though the subjects have different items", () => {
        it("should throw", () => {
          expect(() => {
            Subjects.ensureNoDuplicates([
              Subject.create("Ro", [Work.create("Alpha", 90)]),
              Subject.create("Sigma", [Work.create("Beta", 90)]),
              Subject.create("Ro", [Work.create("Gamma", 30)])
            ]);
          }).toThrow("Duplicate subject: 'Ro'");
        });
      });
    });
  });
});

describe("Sorted subject list", () => {
  describe("when built with no items", () => {
    it("should be empty", () => {
      const subjectList = Subjects.createSortedList(Test.locale, []);

      expect(subjectList).toBeEmpty();
    });
  });

  describe("when built with unique subjects", () => {
    it("should apply the related sorting algorithm", () => {
      const subjectList = Subjects.createSortedList(
        Test.locale,
        TestSubjects.scrambled
      );

      expect(subjectList).toEqualSequence(TestSubjects.sorted);
    });
  });
});
