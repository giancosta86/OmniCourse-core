import { Subject } from "@/core";
import { TestSubjects, TestWorks } from "@/test";
import { SubjectDto } from "./SubjectDto";
import { WorkDto } from "./WorkDto";

describe("Converting a Subject to a dto", () => {
  describe("when the subject has works", () => {
    it("should preserve all the fields", () => {
      const subject = Subject.create("My test subject", TestWorks.scrambled);

      const dto = SubjectDto.from(subject);

      expect(dto.name).toBe(subject.name);
      expect(dto.hasSubjects).toBe(subject.hasSubjects);
      expect(dto.minutes).toBe(subject.minutes);
      expect(dto.items).toEqual(TestWorks.scrambled.map(WorkDto.from));
    });
  });

  describe("when the subject has other subjects", () => {
    it("should preserve all the fields", () => {
      const subject = Subject.create("Alpha", TestSubjects.scrambled);

      const subjectDto = SubjectDto.from(subject);

      expect(subjectDto.name).toBe(subject.name);
      expect(subjectDto.hasSubjects).toBe(subject.hasSubjects);
      expect(subjectDto.minutes).toBe(subject.minutes);
      expect(subjectDto.items).toEqual(
        TestSubjects.scrambled.map(SubjectDto.from)
      );
    });
  });
});
