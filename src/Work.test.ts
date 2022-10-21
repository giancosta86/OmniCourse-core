import { IsoDate } from "./IsoDate";
import { compareWorks, Work } from "./Work";

describe("Work", () => {
  describe("constructor", () => {
    it("should work", () => {
      new Work("My title", 90);
    });

    it("should throw on empty title", () => {
      expect(() => {
        new Work("", 90);
      }).toThrow("Empty work title");
    });

    it("should throw when totalMinutes is 0", () => {
      expect(() => {
        new Work("My title", 0);
      }).toThrow("Invalid total minutes for work 'My title'");
    });

    it("should throw when totalMinutes is < 0", () => {
      expect(() => {
        new Work("My title", -7);
      }).toThrow("Invalid total minutes for work 'My title'");
    });
  });

  describe("key", () => {
    describe("when the completion date is present", () => {
      it("should include title, completion dates and minutes", () => {
        const completionDate = new IsoDate("2009-02-12");
        const work = new Work("My test", 92, { completionDate });

        expect(work.key).toBe(
          `My test # ${completionDate.unboxed.getTime()} # 92`
        );
      });
    });

    describe("when the completion date is missing", () => {
      it("should include just the title", () => {
        const work = new Work("My test", 95);

        expect(work.key).toBe("My test");
      });
    });
  });

  describe("comparison", () => {
    it("should comply with the described algorithm", () => {
      const longestWithoutCompletionDate = new Work(
        "Longest without completion date",
        90
      );

      const shortestWithoutCompletionDate = new Work(
        "Shortest without completion date",
        34
      );

      const shortestWithoutCompletionDateHavingSuffixInTitle = new Work(
        shortestWithoutCompletionDate.title + " - with suffix",
        shortestWithoutCompletionDate.totalMinutes
      );

      const longestButMoreDated = new Work("Longest but more dated", 492, {
        completionDate: new IsoDate("2012-07-09")
      });

      const shortestButMoreRecent = new Work("Shortest but more recent", 14, {
        completionDate: new IsoDate("2021-04-26")
      });

      const shortestButMoreRecentHavingSuffixInTitle = new Work(
        shortestButMoreRecent.title + " - with suffix",
        shortestButMoreRecent.totalMinutes,
        { completionDate: shortestButMoreRecent.completionDate }
      );

      const sortedWorks = [
        shortestButMoreRecent,
        shortestWithoutCompletionDate,
        shortestButMoreRecentHavingSuffixInTitle,
        longestWithoutCompletionDate,
        shortestWithoutCompletionDateHavingSuffixInTitle,
        longestButMoreDated
      ].sort(compareWorks);

      expect(sortedWorks).toEqual([
        longestWithoutCompletionDate,
        shortestWithoutCompletionDate,
        shortestWithoutCompletionDateHavingSuffixInTitle,
        shortestButMoreRecent,
        shortestButMoreRecentHavingSuffixInTitle,
        longestButMoreDated
      ]);
    });
  });
});
