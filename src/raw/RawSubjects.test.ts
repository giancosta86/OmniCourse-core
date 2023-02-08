import { Dictionary } from "@giancosta86/hermes";
import { Test, TestSubject } from "@/test";
import { Work } from "@/core";
import { RawSubjects } from "./RawSubjects";

describe("Raw subjects", () => {
  describe("localization", () => {
    it("should work, recursively", () => {
      const source: RawSubjects = {
        Alpha: [],
        Beta: {
          Gamma: []
        },
        Delta: []
      };

      const dictionary = Dictionary.fromRawTranslations({
        Gamma: "Sigma",
        Delta: "Tau"
      });

      const expected: RawSubjects = {
        Alpha: [],
        Beta: {
          Sigma: []
        },
        Tau: []
      };

      const localized = RawSubjects.localize(dictionary, source);

      expect(localized).toEqual(expected);
    });
  });

  describe("reification", () => {
    it("should reify both subjects and works", () => {
      const rawSubjects: RawSubjects = {
        Alpha: {
          Beta: [
            {
              title: "TestWork",
              minutes: 92
            }
          ]
        },

        Gamma: [{ title: "AnotherWork", minutes: 98 }]
      };

      const expectedSubjects = [
        TestSubject.create("Alpha", [
          TestSubject.create("Beta", [Work.create("TestWork", 92)])
        ]),

        TestSubject.create("Gamma", [Work.create("AnotherWork", 98)])
      ];

      const subjects = RawSubjects.reify(Test.locale, rawSubjects);

      expect(subjects).toEqualSequence(expectedSubjects);
    });
  });
});
