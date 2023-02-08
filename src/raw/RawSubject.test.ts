import { Dictionary } from "@giancosta86/hermes";
import { Test, TestSubject } from "@/test";
import { Work } from "@/core";
import { RawSubject } from "./RawSubject";
import { RawWorks } from "./RawWorks";

describe("Raw subject", () => {
  describe("localization", () => {
    describe("when containing works", () => {
      it("should translate just the subject name, NOT work titles", () => {
        const dictionary = Dictionary.fromRawTranslations({
          Alpha: "A",
          Yogi: "Bubu"
        });

        const localizedRawSubject = RawSubject.localize(dictionary, [
          "Yogi",
          [{ title: "Alpha", minutes: 92 }]
        ]);

        expect(localizedRawSubject).toEqual([
          "Bubu",
          [{ title: "Alpha", minutes: 92 }]
        ]);
      });
    });

    describe("when containing other subjects", () => {
      it("should localize all the subjects, recursively", () => {
        const dictionary = Dictionary.fromRawTranslations({
          Alpha: "A",
          Beta: "B",
          Gamma: "C",
          Cip: "Ciop",
          Yogi: "Bubu"
        });

        const localizedRawSubject = RawSubject.localize(dictionary, [
          "Yogi",
          {
            Alpha: [{ title: "Cip", minutes: 92 }],
            Beta: [{ title: "Crocus", minutes: 95 }]
          }
        ]);

        expect(localizedRawSubject).toEqual([
          "Bubu",
          {
            A: [{ title: "Cip", minutes: 92 }],
            B: [{ title: "Crocus", minutes: 95 }]
          }
        ]);
      });
    });
  });

  describe("reification", () => {
    describe("when containing works", () => {
      it("should also reify the works", () => {
        const subject = RawSubject.reify(Test.locale, [
          "MySubject",
          [
            {
              title: "Alpha",
              minutes: 95
            },
            {
              title: "Beta",
              minutes: 98
            }
          ] as RawWorks
        ]);

        expect(subject).toEqual(
          TestSubject.create("MySubject", [
            Work.create("Alpha", 95),
            Work.create("Beta", 98)
          ])
        );
      });
    });

    describe("when containing other subjects", () => {
      it("should recursively reify subjects and works", () => {
        const subject = RawSubject.reify(Test.locale, [
          "MySubject",
          {
            S2: [{ title: "Alpha", minutes: 95 }],
            S3: [{ title: "Beta", minutes: 98 }]
          }
        ]);

        expect(subject).toEqual(
          TestSubject.create("MySubject", [
            TestSubject.create("S2", [Work.create("Alpha", 95)]),
            TestSubject.create("S3", [Work.create("Beta", 98)])
          ])
        );
      });
    });
  });
});
