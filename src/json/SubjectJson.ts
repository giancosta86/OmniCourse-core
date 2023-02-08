import { RSet } from "@rimbu/collection-types";
import { Subject, Work } from "@/core";
import { WorkJson } from "./WorkJson";

export type SubjectJson = Readonly<{
  name: string;
  hasSubjects: boolean;
  minutes: number;
  items: readonly SubjectJson[] | readonly WorkJson[];
}>;

export namespace SubjectJson {
  export function from(subject: Subject): SubjectJson {
    return {
      name: subject.name,
      hasSubjects: subject.hasSubjects,
      minutes: subject.minutes,
      items: subject.hasSubjects
        ? (subject.items as RSet<Subject>)
            .stream()
            .map(SubjectJson.from)
            .toArray()
        : (subject.items as RSet<Work>).stream().map(WorkJson.from).toArray()
    };
  }
}
