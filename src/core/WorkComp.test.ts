import { Comparison } from "@giancosta86/more-jest";
import { Test, TestWorks } from "@/test";
import { WorkComp } from "./WorkComp";

describe("Work", () => {
  Comparison.test({
    comp: WorkComp.create(Test.locale),
    scrambledItems: TestWorks.scrambled,
    sortedItems: TestWorks.sorted
  });
});
