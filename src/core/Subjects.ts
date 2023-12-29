import { List } from "@rimbu/list";
import { HashSet } from "@rimbu/hashed";
import { LocaleLike } from "@giancosta86/hermes";
import { Subject } from "./Subject";
import { SubjectComp } from "./SubjectComp";

export namespace Subjects {
  export function ensureNoDuplicates(subjects: Iterable<Subject>): void {
    const uniqueNameAccumulator = HashSet.builder<string>();

    for (const subject of subjects) {
      if (!uniqueNameAccumulator.add(subject.name)) {
        throw new Error(`Duplicate subject: '${subject.name}'`);
      }
    }
  }

  export function createSortedList(
    locale: LocaleLike,
    subjects: Iterable<Subject>
  ): List<Subject> {
    return List.from(subjects).sort(SubjectComp.create(locale));
  }
}
