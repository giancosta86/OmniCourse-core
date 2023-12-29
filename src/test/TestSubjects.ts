import { Subject, Work } from "@/core";

export namespace TestSubjects {
  const longestSubject = Subject.create("Longest subject", [
    Work.create("Alpha", 324),
    Work.create("Beta", 418)
  ]);

  const longestSubjectHavingSuffixInTitle = Subject.create(
    longestSubject.name + " - and suffix",
    longestSubject.items
  );

  const shortestSubject = Subject.create("Shortest subject", [
    Work.create("Gamma", 2),
    Work.create("Delta", 1),
    Work.create("Epsilon", 3)
  ]);

  const shortestSubjectHavingSuffixInTitle = Subject.create(
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
