import { Taxonomy } from "@/core";
import { SubjectJson } from "./SubjectJson";

export type TaxonomyJson = Readonly<{
  name: string;
  items: readonly SubjectJson[];
  minutes: number;
}>;

export namespace TaxonomyJson {
  export function from(taxonomy: Taxonomy): TaxonomyJson {
    return {
      name: taxonomy.name,
      items: taxonomy.items.stream().map(SubjectJson.from).toArray(),
      minutes: taxonomy.minutes
    };
  }
}
