import { TaxonomyLevel } from "./TaxonomyLevel";
import { Subject } from "./Subject";

export class Taxonomy implements TaxonomyLevel {
  readonly totalMinutes: number;
  readonly containsSubjects: boolean = true;

  constructor(readonly name: string, readonly items: readonly Subject[]) {
    if (!name) {
      throw new Error("Empty taxonomy name");
    }

    if (!items.length) {
      throw new Error(`Cannot create taxonomy '${name}' with no subjects`);
    }

    this.totalMinutes = items.reduce(
      (cumulatedMinutes, subject) => cumulatedMinutes + subject.totalMinutes,
      0
    );
  }
}
