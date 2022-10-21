import { Subject } from "./Subject";
import { Work } from "./Work";

export interface TaxonomyLevel {
  readonly name: string;
  readonly items: readonly Subject[] | readonly Work[];
  readonly totalMinutes: number;
  readonly containsSubjects: boolean;
}

export function isMeaningful(taxonomyLevel: TaxonomyLevel): boolean {
  return !taxonomyLevel.containsSubjects || taxonomyLevel.items.length >= 2;
}
