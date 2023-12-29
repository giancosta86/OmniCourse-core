import { Dictionary } from "@giancosta86/hermes";
import { Test } from "@/test";
import { Work, Subject } from "@/core";
import { RawSubjects } from "./RawSubjects";

describe("Raw subjects", () => {
  describe("localization", () => {
    it("should work, recursively", () => {
      const dictionary = Dictionary.fromRawTranslations({
        Gamma: "Sigma",
        Delta: "Tau"
      });

      const localized = RawSubjects.localize(dictionary, {
        Alpha: [],
        Beta: {
          Gamma: []
        },
        Delta: []
      });

      expect(localized).toEqual({
        Alpha: [],
        Beta: {
          Sigma: []
        },
        Tau: []
      });
    });
  });

  describe("reification", () => {
    it("should reify both subjects and works, sorting them", () => {
      const subjects = RawSubjects.reify(Test.locale, {
        Alpha: {
          Beta: [
            {
              title: "Test Work",
              minutes: 92
            },

            {
              title: "Super Work",
              minutes: 159
            }
          ]
        },

        Gamma: [{ title: "Massive Work", minutes: 798 }]
      });

      expect(subjects).toEqualSequence([
        Subject.create("Gamma", [Work.create("Massive Work", 798)]),

        Subject.create("Alpha", [
          Subject.create("Beta", [
            Work.create("Super Work", 159),
            Work.create("Test Work", 92)
          ])
        ])
      ]);
    });
  });
});
