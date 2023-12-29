import { Equality } from "@giancosta86/more-jest";
import { JsonConversion, TestSubjects, TestWorks } from "@/test";
import { SubjectJson } from "@/json";
import { Work } from "./Work";
import { Subject } from "./Subject";

describe("Subject", () => {
  describe("constructor", () => {
    describe("when the name is empty", () => {
      it("should throw", () => {
        expect(() => {
          Subject.create("", [Work.create("Test", 90)]);
        }).toThrow("Empty subject name");
      });
    });

    describe("when no items are passed", () => {
      it("should throw", () => {
        expect(() => {
          Subject.create("MySubject", []);
        }).toThrow("No items for subject 'MySubject'");
      });
    });

    describe("when receiving duplicate works", () => {
      it("should throw", () => {
        expect(() => {
          Subject.create("Test subject", [
            Work.create("Alpha", 90),
            Work.create("Beta", 23),
            Work.create("Alpha", 70)
          ]);
        }).toThrow("Duplicate work: 'Alpha'");
      });
    });

    describe("when receiving duplicate subjects", () => {
      it("should throw ", () => {
        expect(() => {
          Subject.create("Test subject", [
            Subject.create("Ro", [
              Work.create("Alpha", 90),
              Work.create("Beta", 23)
            ]),

            Subject.create("Ro", [Work.create("Gamma", 58)])
          ]);
        }).toThrow("Duplicate subject: 'Ro'");
      });
    });
  });

  describe("minutes", () => {
    it("should be the sum of its works' minutes", () => {
      const subject = Subject.create("Test subject", [
        Work.create("Alpha", 90),
        Work.create("Beta", 5)
      ]);

      expect(subject.minutes).toBe(90 + 5);
    });

    it("should be the sum of its subjects' minutes", () => {
      const thirdSubject = Subject.create("Third subject", [
        Work.create("Alpha", 90),
        Work.create("Beta", 85)
      ]);

      const secondSubject = Subject.create("Second subject", [
        Work.create("Gamma", 3),
        Work.create("Delta", 7),
        Work.create("Epsilon", 19)
      ]);

      const firstSubject = Subject.create("First subject", [
        secondSubject,
        thirdSubject
      ]);

      expect(firstSubject.minutes).toBe(90 + 85 + 3 + 7 + 19);
    });

    it("should be the sum of its descendant items', recursively", () => {
      const thirdLevelSubject = Subject.create("Third-level subject", [
        Work.create("Alpha", 12),
        Work.create("Beta", 4)
      ]);

      const anotherThirdLevelSubject = Subject.create(
        "Another third-level subject",
        [
          Work.create("Gamma", 3),
          Work.create("Delta", 8),
          Work.create("Epsilon", 9)
        ]
      );

      const secondLevelSubject = Subject.create("Second-level subject", [
        thirdLevelSubject,
        anotherThirdLevelSubject
      ]);

      const anotherSecondLevelSubject = Subject.create(
        "Another second-level subject",
        [Work.create("Zeta", 45), Work.create("Eta", 2)]
      );

      const firstLevelSubject = Subject.create("First subject", [
        secondLevelSubject,
        anotherSecondLevelSubject
      ]);

      expect(firstLevelSubject.minutes).toBe(12 + 4 + 3 + 8 + 9 + 45 + 2);
    });
  });

  describe("hasSubjects", () => {
    describe("when the items are works", () => {
      it("should be false", () => {
        const subject = Subject.create("Test", [Work.create("Alpha", 45)]);

        expect(subject.hasSubjects).toBe(false);
      });
    });

    describe("when the items are subjects", () => {
      it("should be true", () => {
        const firstSubject = Subject.create("First", [
          Subject.create("Second", [Work.create("Alpha", 90)])
        ]);

        expect(firstSubject.hasSubjects).toBe(true);
      });
    });
  });

  describe("item order", () => {
    describe("when the items are works", () => {
      it("should be preserved", () => {
        const subject = Subject.create("My subject", TestWorks.scrambled);

        expect(subject.items.toArray()).toEqual(TestWorks.scrambled);
      });
    });

    describe("when the items are subjects", () => {
      it("should be preserved", () => {
        const subject = Subject.create("My subject", TestSubjects.scrambled);

        expect(subject.items.toArray()).toEqual(TestSubjects.scrambled);
      });
    });
  });

  describe("when the items are works", () => {
    const factory = (kind: string) =>
      Subject.create("My subject", [
        Work.create("Alpha", 90),
        Work.create("Beta", 98, { kind })
      ]);

    Equality.test(
      () => factory("book"),
      () => factory("<SOMETHING ELSE>")
    );
  });

  describe("when the items are subjects having works", () => {
    const factory = (changingWorkTitle: string) =>
      Subject.create("My subject", [
        Subject.create("Alpha", [Work.create("X", 3), Work.create("Y", 4)]),
        Subject.create("Beta", [Work.create(changingWorkTitle, 7)])
      ]);

    Equality.test(
      () => factory("Z"),
      () => factory("Z______2")
    );
  });

  describe("when the items are subjects with nesting", () => {
    const factory = (tauSubjectName: string) =>
      Subject.create("My subject", [
        Subject.create("Alpha", [
          Subject.create("Ro", [Work.create("X", 3), Work.create("Y", 4)]),
          Subject.create("Sigma", [Work.create("Z", 7)])
        ]),

        Subject.create("Beta", [
          Subject.create(tauSubjectName, [Work.create("A", 90)]),
          Subject.create("Omega", [Work.create("B", 18)])
        ])
      ]);

    Equality.test(
      () => factory("Tau"),
      () => factory("Tau________2")
    );
  });

  describe("when one subject has subjects and the other has works", () =>
    Equality.test(
      () =>
        Subject.create("Alpha", [
          Subject.create("Beta", [Work.create("Gamma", 20)])
        ]),
      () => Subject.create("Alpha", [Work.create("Beta", 10)])
    ));

  JsonConversion.testRoundTrip(Subject, SubjectJson, () =>
    Subject.create("Alpha", [
      Subject.create("Beta", TestWorks.scrambled),
      Subject.create("Gamma", [Subject.create("Delta", TestWorks.scrambled)])
    ])
  );
});
