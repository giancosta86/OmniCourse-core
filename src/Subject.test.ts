import { compareSubjects, Subject } from "./Subject";
import { Work } from "./Work";

describe("Subject", () => {
  describe("total minutes", () => {
    it("should be the sum of its works' total minutes", () => {
      const subject = new Subject("Test subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      expect(subject.totalMinutes).toBe(90 + 5);
    });

    it("should be the sum of its subjects' total minutes", () => {
      const thirdSubject = new Subject("Third subject", [
        new Work("Alpha", 90),
        new Work("Beta", 5)
      ]);

      const secondSubject = new Subject("Second subject", [
        new Work("Gamma", 3),
        new Work("Delta", 7),
        new Work("Epsilon", 19)
      ]);

      const firstSubject = new Subject("First subject", [
        secondSubject,
        thirdSubject
      ]);

      expect(firstSubject.totalMinutes).toBe(90 + 5 + 3 + 7 + 19);
    });

    it("should be the sum of its descendant items, recursively", () => {
      const thirdLevelSubject = new Subject("Third-level subject", [
        new Work("Alpha", 12),
        new Work("Beta", 4)
      ]);

      const anotherThirdLevelSubject = new Subject(
        "Another third-level subject",
        [new Work("Gamma", 3), new Work("Delta", 8), new Work("Epsilon", 9)]
      );

      const secondLevelSubject = new Subject("Second-level subject", [
        thirdLevelSubject,
        anotherThirdLevelSubject
      ]);

      const anotherSecondLevelSubject = new Subject(
        "Another second-level subject",
        [new Work("Zeta", 45), new Work("Eta", 2)]
      );

      const firstLevelSubject = new Subject("First subject", [
        secondLevelSubject,
        anotherSecondLevelSubject
      ]);

      expect(firstLevelSubject.totalMinutes).toBe(12 + 4 + 3 + 8 + 9 + 45 + 2);
    });
  });

  describe("constructor", () => {
    it("should throw when the title is empty", () => {
      expect(() => {
        new Subject("", [new Work("Test", 90)]);
      }).toThrow("Empty subject name");
    });

    it("should throw when there are no items", () => {
      expect(() => {
        new Subject("Empty subject", []);
      }).toThrow("Cannot create subject 'Empty subject' with no items");
    });

    it("should throw when it contains duplicate works", () => {
      expect(() => {
        new Subject("Wrong subject", [
          new Work("Alpha", 90),
          new Work("Alpha", 90)
        ]);
      }).toThrow("Duplicate work: 'Alpha'");
    });
  });

  describe("comparison", () => {
    it("should comply with the described algorithm", () => {
      const longestSubject = new Subject("Longest subject", [
        new Work("Alpha", 324),
        new Work("Beta", 418)
      ]);

      const longestSubjectHavingSuffixInTitle = new Subject(
        longestSubject.name + " - and suffix",
        longestSubject.items
      );

      const shortestSubject = new Subject("Shortest subject", [
        new Work("Gamma", 2),
        new Work("Delta", 1),
        new Work("Epsilon", 3)
      ]);

      const shortestSubjectHavingSuffixInTitle = new Subject(
        shortestSubject.name + " - and suffix",
        shortestSubject.items
      );

      const sortedSubjects = [
        shortestSubjectHavingSuffixInTitle,
        longestSubject,
        shortestSubject,
        longestSubjectHavingSuffixInTitle
      ].sort(compareSubjects);

      expect(sortedSubjects).toEqual([
        longestSubject,
        longestSubjectHavingSuffixInTitle,
        shortestSubject,
        shortestSubjectHavingSuffixInTitle
      ]);
    });
  });

  describe("containsSubjects", () => {
    it("should be false when the items are works", () => {
      const subject = new Subject("Test", [new Work("Alpha", 45)]);
      expect(subject.containsSubjects).toBe(false);
    });

    it("should be true when the items are actually subjects", () => {
      const subject = new Subject("First", [
        new Subject("Second", [new Work("Alpha", 90)])
      ]);

      expect(subject.containsSubjects).toBe(true);
    });
  });
});
