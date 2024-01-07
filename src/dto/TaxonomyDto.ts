import { Taxonomy } from "@/core";
import { SubjectDto } from "./SubjectDto";

export type TaxonomyDto = Readonly<{
  name: string;
  items: readonly SubjectDto[];
  minutes: number;
}>;

export namespace TaxonomyDto {
  export function from(taxonomy: Taxonomy): TaxonomyDto {
    return {
      name: taxonomy.name,
      items: taxonomy.items.stream().map(SubjectDto.from).toArray(),
      minutes: taxonomy.minutes
    };
  }
}
