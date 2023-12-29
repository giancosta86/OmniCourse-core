import { ImmediateOrPromise } from "@giancosta86/swan-lake";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { Taxonomy } from "@/core";
import { RawSubjects } from "./RawSubjects";

export type TaxonomyReifier = (
  source: RawTaxonomy
) => ImmediateOrPromise<Taxonomy>;

export type RawTaxonomy = Readonly<{
  name: string;
  rootSubjects: RawSubjects;
}>;

export namespace RawTaxonomy {
  export function translate(
    dictionary: Dictionary,
    source: RawTaxonomy
  ): RawTaxonomy {
    const translatedName = dictionary.translate(source.name);

    const translatedRootSubjects = RawSubjects.translate(
      dictionary,
      source.rootSubjects
    );

    return {
      name: translatedName,
      rootSubjects: translatedRootSubjects
    };
  }

  export function reify(
    locale: LocaleLike,
    { name, rootSubjects }: RawTaxonomy
  ): Taxonomy {
    const reifiedRootSubjects = RawSubjects.reify(locale, rootSubjects);

    return Taxonomy.create(name, reifiedRootSubjects);
  }
}
