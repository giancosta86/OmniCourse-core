import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { Equality } from "@giancosta86/more-jest";
import { IsoDate } from "@giancosta86/time-utils";
import { JsonConversion } from "@/test";
import { WorkJson } from "@/json";
import { Work } from "./Work";

describe("Work", () => {
  describe("creation", () => {
    describe("when passing just the basic parameters", () => {
      it("should work", () => {
        const title = "My title";
        const minutes = 90;

        const work = Work.create(title, minutes);

        expect(work.title).toBe(title);
        expect(work.minutes).toBe(minutes);
        expect(work.kind).toBeUndefined();
        expect(work.completionDate).toBeUndefined();
        expect(work.url).toBeUndefined();
        expect(work.certificateUrl).toBeUndefined();
      });
    });

    describe("when title is empty", () => {
      it("should throw", () => {
        expect(() => {
          Work.create("", 90);
        }).toThrow("Empty work title");
      });
    });

    describe("when passing minutes equal to 0", () => {
      it("should throw", () => {
        expect(() => {
          Work.create("My title", 0);
        }).toThrow("Invalid minutes for work 'My title': 0");
      });
    });

    describe("when passing minutes < 0", () => {
      it("should throw", () => {
        expect(() => {
          Work.create("My title", -7);
        }).toThrow("Invalid minutes for work 'My title': -7");
      });
    });

    describe("when passing valid values to all the parameters", () => {
      it("should work", () => {
        const title = "My title";
        const minutes = 90;
        const kind = "Book";
        const completionDate = new IsoDate("2009-09-10");
        const url = ExpressiveUrl.create("https://gianlucacosta.info/");
        const certificateUrl = ExpressiveUrl.create(
          "https://gianlucacosta.info/certificate"
        );

        const work = Work.create(title, minutes, {
          kind,
          completionDate,
          url,
          certificateUrl
        });

        expect(work.title).toBe(title);
        expect(work.minutes).toBe(minutes);
        expect(work.kind).toBe(kind);
        expect(work.completionDate).toBe(completionDate);
        expect(work.url).toBe(url);
        expect(work.certificateUrl).toBe(certificateUrl);
      });
    });
  });

  Equality.test(
    () =>
      Work.create("Advanced work", 90, {
        kind: "Book",
        completionDate: new IsoDate("2019-03-18"),
        url: ExpressiveUrl.create("https://gianlucacosta.info/"),
        certificateUrl: ExpressiveUrl.create(
          "https://gianlucacosta.info/certificate"
        )
      }),

    () => Work.create("Basic work", 230)
  );

  JsonConversion.testRoundTrip(Work, WorkJson, () =>
    Work.create("Dodo", 90, {
      kind: "Book",
      completionDate: new IsoDate("2008-12-06"),
      url: ExpressiveUrl.create("https://gianlucacosta.info"),
      certificateUrl: ExpressiveUrl.create(
        "https://gianlucacosta.info/certificate"
      )
    })
  );
});
