import { LocaleLike } from "@giancosta86/hermes";
import { Taxonomy } from "@/core";
import { SubjectJson } from "./SubjectJson";

export type TaxonomyJson = Readonly<{
  locale: string;
  name: string;
  items: readonly SubjectJson[];
  minutes: number;
}>;

export namespace TaxonomyJson {
  export function from(taxonomy: Taxonomy): TaxonomyJson {
    return {
      locale: LocaleLike.toLanguageTag(taxonomy.locale),
      name: taxonomy.name,
      items: taxonomy.items.stream().map(SubjectJson.from).toArray(),
      minutes: taxonomy.minutes
    };
  }
}
