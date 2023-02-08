import { SortedSet } from "@rimbu/sorted";
import { HashSet } from "@rimbu/hashed";
import { LocaleLike } from "@giancosta86/hermes";
import { Subject } from "./Subject";
import { SubjectComp } from "./SubjectComp";

export namespace SubjectSet {
  export function createSorted(
    locale: LocaleLike,
    subjects: Iterable<Subject>
  ): SortedSet<Subject> {
    const uniqueNameAccumulator = HashSet.builder();

    for (const subject of subjects) {
      if (!uniqueNameAccumulator.add(subject.name)) {
        throw new Error(`Duplicate subject: '${subject.name}'`);
      }
    }

    return SortedSet.createContext({ comp: SubjectComp.create(locale) }).from(
      subjects
    );
  }
}
