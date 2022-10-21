import { defaultLocale } from "./formatting";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Work } from "./Work";

export class Subject implements TaxonomyLevel {
  readonly totalMinutes: number;
  readonly containsSubjects: boolean;

  constructor(
    readonly name: string,
    readonly items: readonly Subject[] | readonly Work[]
  ) {
    if (!name) {
      throw new Error("Empty subject name");
    }

    if (!items.length) {
      throw new Error(`Cannot create subject '${name}' with no items`);
    }

    this.totalMinutes = (items as readonly { totalMinutes: number }[]).reduce(
      (cumulatedMinutes, item) => cumulatedMinutes + item.totalMinutes,
      0
    );

    this.containsSubjects = items[0] instanceof Subject;

    if (!this.containsSubjects) {
      ensureWorksAreUnique(items as Work[]);
    }
  }
}

function ensureWorksAreUnique(works: readonly Work[]) {
  const uniqueKeys = new Set<string>();

  for (const work of works) {
    if (uniqueKeys.has(work.key)) {
      throw new Error(`Duplicate work: '${work.title}'`);
    }
    uniqueKeys.add(work.key);
  }
}

/**
Subjects are sorted by total minutes decreasing, then by title.
*/
export function compareSubjects(left: Subject, right: Subject): number {
  const totalMinutesComparison = right.totalMinutes - left.totalMinutes;

  return totalMinutesComparison
    ? totalMinutesComparison
    : left.name.localeCompare(right.name, defaultLocale);
}
