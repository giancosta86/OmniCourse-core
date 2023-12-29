import { List } from "@rimbu/list";
import { HashSet } from "@rimbu/hashed";
import { LocaleLike } from "@giancosta86/hermes";
import { Work } from "./Work";
import { WorkComp } from "./WorkComp";

export namespace Works {
  export function ensureNoDuplicates(works: Iterable<Work>): void {
    const uniqueWorksBuilder = HashSet.builder<Work>();
    const titlesOfInProgressWorks = HashSet.builder<string>();

    for (const work of works) {
      if (
        !uniqueWorksBuilder.add(work) ||
        (!work.completionDate && !titlesOfInProgressWorks.add(work.title))
      ) {
        throw new Error(`Duplicate work: '${work.title}'`);
      }
    }
  }

  export function createSortedList(
    locale: LocaleLike,
    works: Iterable<Work>
  ): List<Work> {
    return List.from(works).sort(WorkComp.create(locale));
  }
}
