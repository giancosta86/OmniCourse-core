import { IsoDate } from "@giancosta86/time-utils";
import { TestWorks } from "@/test";
import { Work } from "./Work";

describe("Sorted work set", () => {
  describe("when built from an empty source", () => {
    it("should be empty", () => {
      const workSet = TestWorks.createSortedSet([]);

      expect(workSet).toBeEmpty();
    });
  });

  describe("when built from unique works", () => {
    it("should apply the sorting algorithm", () => {
      const workSet = TestWorks.createSortedSet(TestWorks.scrambled);

      expect(workSet.toArray()).toEqual(TestWorks.sorted);
    });
  });

  describe("when two sibling works have the same title", () => {
    describe("when the completion date is missing from both", () => {
      describe("even when the duration is different", () => {
        it("should still throw", () => {
          expect(() => {
            TestWorks.createSortedSet([
              Work.create("Alpha", 90),
              Work.create("Alpha", 71)
            ]);
          }).toThrow("Duplicate work: 'Alpha'");
        });
      });
    });

    describe("when only one work has completion date", () => {
      it("should work", () => {
        const workSet = TestWorks.createSortedSet([
          Work.create("Alpha", 90),
          Work.create("Alpha", 90, {
            completionDate: new IsoDate("2019-09-10")
          })
        ]);

        expect(workSet.size).toBe(2);
      });
    });

    describe("when the completion date is defined for both", () => {
      describe("when just the completion date is different", () => {
        it("should work", () => {
          const workSet = TestWorks.createSortedSet([
            Work.create("Alpha", 90, {
              completionDate: new IsoDate("2019-11-04")
            }),
            Work.create("Alpha", 90, {
              completionDate: new IsoDate("2020-02-03")
            })
          ]);

          expect(workSet.size).toBe(2);
        });
      });

      describe("when the completion date is the same", () => {
        describe("when the duration is different", () => {
          it("should work", () => {
            const workSet = TestWorks.createSortedSet([
              Work.create("Alpha", 90, {
                completionDate: new IsoDate("2019-09-10")
              }),
              Work.create("Alpha", 37, {
                completionDate: new IsoDate("2019-09-10")
              })
            ]);

            expect(workSet.size).toBe(2);
          });
        });

        describe("when the duration is the same", () => {
          it("should throw", () => {
            expect(() => {
              TestWorks.createSortedSet([
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
