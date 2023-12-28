import { RSet } from "@rimbu/collection-types";
import { Subject } from "./Subject";
import { Work } from "./Work";

export interface TaxonomyLevel {
  readonly name: string;
  readonly items: RSet.NonEmpty<Subject> | RSet.NonEmpty<Work>;
  readonly minutes: number;
  readonly hasSubjects: boolean;
}

export namespace TaxonomyLevel {
  export function isMeaningful(taxonomyLevel: TaxonomyLevel): boolean {
    return !taxonomyLevel.hasSubjects || taxonomyLevel.items.size >= 2;
  }
}
