import { IsoDate } from "@giancosta86/time-utils";
import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { Work } from "@/core";
import { Test } from "@/test";
import { RawWorks } from "./RawWorks";

describe("Raw works", () => {
  describe("reification", () => {
    it("should return Work instances in sorted order", () => {
      const works = RawWorks.reify(Test.locale, [
        {
          title: "Alpha",
          minutes: 90
        },

        {
          title: "Beta",
          minutes: 92,
          completionDate: "1998-06-13"
        },

        {
          title: "Gamma",
          minutes: 95,
          url: "https://gianlucacosta.info/"
        }
      ]);

      expect(works).toEqualSequence([
        Work.create("Gamma", 95, {
          url: ExpressiveUrl.create("https://gianlucacosta.info/")
        }),
        Work.create("Alpha", 90),
        Work.create("Beta", 92, { completionDate: new IsoDate("1998-06-13") })
      ]);
    });
  });
});
