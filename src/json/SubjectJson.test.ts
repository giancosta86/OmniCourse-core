import { Subject } from "@/core";
import { TestSubjects, TestWorks } from "@/test";
import { SubjectJson } from "./SubjectJson";
import { WorkJson } from "./WorkJson";

describe("Converting a Subject to JSON", () => {
  describe("when the subject has works", () => {
    it("should preserve all the fields", () => {
      const subject = Subject.create("My test subject", TestWorks.scrambled);

      const subjectJson = SubjectJson.from(subject);

      expect(subjectJson.name).toBe(subject.name);
      expect(subjectJson.hasSubjects).toBe(subject.hasSubjects);
      expect(subjectJson.minutes).toBe(subject.minutes);
      expect(subjectJson.items).toEqual(TestWorks.scrambled.map(WorkJson.from));
    });
  });

  describe("when the subject has other subjects", () => {
    it("should preserve all the fields", () => {
      const subject = Subject.create("Alpha", TestSubjects.scrambled);

      const subjectJson = SubjectJson.from(subject);

      expect(subjectJson.name).toBe(subject.name);
      expect(subjectJson.hasSubjects).toBe(subject.hasSubjects);
      expect(subjectJson.minutes).toBe(subject.minutes);
      expect(subjectJson.items).toEqual(
        TestSubjects.scrambled.map(SubjectJson.from)
      );
    });
  });
});
