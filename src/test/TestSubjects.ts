import { SortedSet } from "@rimbu/sorted";
import { Subject, Work, SubjectSet } from "@/core";
import { Test } from "./settings";
import { TestSubject } from "./TestSubject";

export namespace TestSubjects {
  export function createSortedSet(
    subjects: Iterable<Subject>
  ): SortedSet<Subject> {
    return SubjectSet.createSorted(Test.locale, subjects);
  }

  const longestSubject = TestSubject.create("Longest subject", [
    Work.create("Alpha", 324),
    Work.create("Beta", 418)
  ]);

  const longestSubjectHavingSuffixInTitle = TestSubject.create(
    longestSubject.name + " - and suffix",
    longestSubject.items
  );

  const shortestSubject = TestSubject.create("Shortest subject", [
    Work.create("Gamma", 2),
    Work.create("Delta", 1),
    Work.create("Epsilon", 3)
  ]);

  const shortestSubjectHavingSuffixInTitle = TestSubject.create(
    shortestSubject.name + " - and suffix",
    shortestSubject.items
  );

  export const scrambled = [
    shortestSubjectHavingSuffixInTitle,
    longestSubject,
    shortestSubject,
    longestSubjectHavingSuffixInTitle
  ] as const;

  export const sorted = [
    longestSubject,
    longestSubjectHavingSuffixInTitle,
    shortestSubject,
    shortestSubjectHavingSuffixInTitle
  ] as const;
}
