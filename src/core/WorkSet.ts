import { SortedSet } from "@rimbu/sorted";
import { HashSet } from "@rimbu/hashed";
import { LocaleLike } from "@giancosta86/hermes";
import { Work } from "./Work";
import { WorkComp } from "./WorkComp";

/**
 * Builds a `SortedSet<Work>` sorted according to `WorkComp` and
 * enforcing an additional constraint:
 *
 * *«Whatever the other attributes may be, two works
 * without completion date cannot have the same name.»*
 */
export namespace WorkSet {
  export function createSorted(
    locale: LocaleLike,
    works: Iterable<Work>
  ): SortedSet<Work> {
    const resultBuilder = SortedSet.createContext({
      comp: WorkComp.create(locale)
    }).builder();

    const titlesOfInProgressWorks = HashSet.builder<string>();

    for (const work of works) {
      if (
        !resultBuilder.add(work) ||
        (!work.completionDate && !titlesOfInProgressWorks.add(work.title))
      ) {
        throw new Error(`Duplicate work: '${work.title}'`);
      }
    }

    return resultBuilder.build();
  }
}
