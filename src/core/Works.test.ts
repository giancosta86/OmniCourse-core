import { IsoDate } from "@giancosta86/time-utils";
import { Test, TestWorks } from "@/test";
import { Work } from "./Work";
import { Works } from "./Works";

describe("Work sequences", () => {
  describe("when ensuring no duplicates", () => {
    describe("when applied to an empty sequence", () => {
      it("should work", () => {
        Works.ensureNoDuplicates([]);
      });
    });

    describe("when applied to a sequence of unique items", () => {
      it("should work", () => {
        Works.ensureNoDuplicates(TestWorks.scrambled);
      });
    });

    describe("when two sibling works have the same title", () => {
      describe("when neither has the completion date", () => {
        it("should throw", () => {
          expect(() => {
            Works.ensureNoDuplicates([
              Work.create("Alpha", 90),
              Work.create("Alpha", 71)
            ]);
          }).toThrow("Duplicate work: 'Alpha'");
        });
      });

      describe("when only one has the completion date", () => {
        it("should work", () => {
          Works.ensureNoDuplicates([
            Work.create("Alpha", 90),
            Work.create("Alpha", 71, {
              completionDate: new IsoDate("2019-09-10")
            })
          ]);
        });
      });

      describe("when the completion date is defined for both", () => {
        describe("when only the completion date is different", () => {
          it("should work", () => {
            Works.ensureNoDuplicates([
              Work.create("Alpha", 90, {
                completionDate: new IsoDate("2019-11-04")
              }),
              Work.create("Alpha", 90, {
                completionDate: new IsoDate("2020-02-03")
              })
            ]);
          });
        });

        describe("when the completion date is the same", () => {
          describe("when the duration is different", () => {
            it("should work", () => {
              Works.ensureNoDuplicates([
                Work.create("Alpha", 90, {
                  completionDate: new IsoDate("2019-09-10")
                }),
                Work.create("Alpha", 37, {
                  completionDate: new IsoDate("2019-09-10")
                })
              ]);
            });
          });

          describe("when the duration is the same", () => {
            it("should throw", () => {
              expect(() => {
                Works.ensureNoDuplicates([
                  Work.create("Alpha", 90, {
                    completionDate: new IsoDate("2019-09-10")
                  }),
                  Work.create("Alpha", 90, {
                    completionDate: new IsoDate("2019-09-10")
                  })
                ]);
              }).toThrow("Duplicate work: 'Alpha'");
            });
          });
        });
      });
    });
  });
});

describe("Sorted work list", () => {
  describe("when built from an empty source", () => {
    it("should be empty", () => {
      const workList = Works.createSortedList(Test.locale, []);

      expect(workList).toBeEmpty();
    });
  });

  describe("when built from a sequence of works", () => {
    it("should apply the sorting algorithm", () => {
      const workList = Works.createSortedList(Test.locale, TestWorks.scrambled);

      expect(workList).toEqualSequence(TestWorks.sorted);
    });
  });
});
