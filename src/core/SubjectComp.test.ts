import { Comparison } from "@giancosta86/more-jest";
import { Test, TestSubjects } from "@/test";
import { SubjectComp } from "./SubjectComp";

describe("Subject", () => {
  Comparison.test({
    comp: SubjectComp.create(Test.locale),
    scrambledItems: TestSubjects.scrambled,
    sortedItems: TestSubjects.sorted
  });
});
