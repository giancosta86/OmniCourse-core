import { RSet } from "@rimbu/collection-types";
import { Subject } from "./Subject";
import { Work } from "./Work";

/**
 * Browsable taxonomy level - which can contain either `Subject` or `Work` instances
 */
export interface TaxonomyLevel {
  readonly name: string;
  readonly items: RSet.NonEmpty<Subject> | RSet.NonEmpty<Work>;
  readonly minutes: number;
  readonly hasSubjects: boolean;
}

export namespace TaxonomyLevel {
  /**
   * A taxonomy level is meaningful if it:
   *
   * * contains `Work` items, **or**
   *
   * * contains at least 2 `Subject` items
   */
  export function isMeaningful(taxonomyLevel: TaxonomyLevel): boolean {
    return !taxonomyLevel.hasSubjects || taxonomyLevel.items.size >= 2;
  }
}
