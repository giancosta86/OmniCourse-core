import { RSet } from "@rimbu/collection-types";
import { Subject, Work } from "@/core";
import { WorkDto } from "./WorkDto";

export type SubjectDto = Readonly<{
  name: string;
  hasSubjects: boolean;
  minutes: number;
  items: readonly SubjectDto[] | readonly WorkDto[];
}>;

export namespace SubjectDto {
  export function from(subject: Subject): SubjectDto {
    return {
      name: subject.name,
      hasSubjects: subject.hasSubjects,
      minutes: subject.minutes,
      items: subject.hasSubjects
        ? (subject.items as RSet<Subject>)
            .stream()
            .map(SubjectDto.from)
            .toArray()
        : (subject.items as RSet<Work>).stream().map(WorkDto.from).toArray()
    };
  }
}
