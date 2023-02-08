import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { IsoDate } from "@giancosta86/time-utils";
import { RawWork } from "./RawWork";

describe("Raw work", () => {
  describe("reification", () => {
    describe("for a basic work", () => {
      it("should work", () => {
        const work = RawWork.reify({
          title: "Dodo",
          minutes: 90
        });

        expect(work.title).toBe("Dodo");
        expect(work.minutes).toBe(90);
        expect(work.kind).toBeUndefined();
        expect(work.completionDate).toBeUndefined();
        expect(work.url).toBeUndefined();
        expect(work.certificateUrl).toBeUndefined();
      });
    });

    describe("for a full work", () => {
      it("should work", () => {
        const work = RawWork.reify({
          title: "Dodo",
          minutes: 90,
          kind: "Book",
          completionDate: "2009-10-15",
          url: "https://gianlucacosta.info/",
          certificateUrl: "https://gianlucacosta.info/certificate"
        });

        expect(work.title).toBe("Dodo");
        expect(work.minutes).toBe(90);
        expect(work.kind).toBe("Book");
        expect(work.completionDate).toEqual(new IsoDate("2009-10-15"));
        expect(work.url).toEqual(
          ExpressiveUrl.create("https://gianlucacosta.info/")
        );
        expect(work.certificateUrl).toEqual(
          ExpressiveUrl.create("https://gianlucacosta.info/certificate")
        );
      });
    });

    describe("when the title is missing", () => {
      it("should throw", () => {
        expect(() => {
          RawWork.reify({
            minutes: 90
          });
        }).toThrow('Missing work title: {"minutes":90}');
      });
    });

    describe("when the minutes are missing", () => {
      it("should throw", () => {
        expect(() => {
          RawWork.reify({
            title: "Dodo"
          });
        }).toThrow("Missing 'minutes' field in work 'Dodo'");
      });
    });

    describe("when the minutes are a float", () => {
      describe.each([
        {
          decimalPartDescription: "< 0.5",
          rawMinutes: 90.3,
          expectedAction: "round to floor",
          expectedMinutes: 90
        },

        {
          decimalPartDescription: "> 0.5",
          rawMinutes: 90.7,
          expectedAction: "round to ceiling",
          expectedMinutes: 91
        },

        {
          decimalPartDescription: "precisely 0.5",
          rawMinutes: 90.5,
          expectedAction: "round to ceiling",
          expectedMinutes: 91
        }
      ])(
        "when the decimal part is $decimalPartDescription",
        ({ rawMinutes, expectedAction, expectedMinutes }) => {
          it(`should ${expectedAction}`, () => {
            const work = RawWork.reify({
              title: "Dodo",
              minutes: rawMinutes
            });

            expect(work.minutes).toBe(expectedMinutes);
          });
        }
      );
    });

    describe("when the minutes are a string", () => {
      describe("if it can be converted to number", () => {
        it("should work", () => {
          const work = RawWork.reify({
            title: "Dodo",
            minutes: "90.3"
          });

          expect(work.minutes).toBe(90);
        });
      });

      describe("if it does not express a number", () => {
        it("should throw", () => {
          expect(() => {
            RawWork.reify({
              title: "Dodo",
              minutes: "<NOT A NUMBER>"
            });
          }).toThrow("'minutes' field in work 'Dodo' is not a number");
        });
      });
    });

    describe("when the completion date is not acceptable", () => {
      describe("because of a wrong format", () => {
        it("should throw", () => {
          expect(() => {
            RawWork.reify({
              title: "Dodo",
              minutes: 90,
              completionDate: "2003**06**09"
            });
          }).toThrow("Invalid date string: '2003**06**09'");
        });
      });

      describe("because it refers to an inexisting day", () => {
        it("should throw", () => {
          expect(() => {
            RawWork.reify({
              title: "Dodo",
              minutes: 90,
              completionDate: "2003/02/39"
            });
          }).toThrow("Invalid date string: '2003/02/39'");
        });
      });
    });

    describe("when the url is invalid", () => {
      it("should throw", () => {
        expect(() => {
          RawWork.reify({
            title: "MyTest",
            minutes: 90,
            url: "<CIP>"
          });
        }).toThrow("Invalid URL: <CIP>");
      });
    });

    describe("when the certificate url is invalid", () => {
      it("should throw", () => {
        expect(() => {
          RawWork.reify({
            title: "MyTest",
            minutes: 90,
            certificateUrl: "<CIOP>"
          });
        }).toThrow("Invalid URL: <CIOP>");
      });
    });
  });
});
