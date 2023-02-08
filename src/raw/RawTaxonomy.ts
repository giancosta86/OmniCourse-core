import { ImmediateOrPromise } from "@giancosta86/swan-lake";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { Taxonomy } from "@/core";
import { RawSubjects } from "./RawSubjects";

export type TaxonomyReifier = (
  source: RawTaxonomy
) => ImmediateOrPromise<Taxonomy>;

export type RawTaxonomy = Readonly<{
  locale: LocaleLike;
  name: string;
  rootSubjects: RawSubjects;
}>;

export namespace RawTaxonomy {
  export function localize(
    locale: LocaleLike,
    dictionary: Dictionary,
    source: RawTaxonomy
  ): RawTaxonomy {
    const localizedName = dictionary.translate(source.name);

    const localizedRootSubjects = RawSubjects.localize(
      dictionary,
      source.rootSubjects
    );

    return {
      locale,
      name: localizedName,
      rootSubjects: localizedRootSubjects
    };
  }

  export function reify({ locale, name, rootSubjects }: RawTaxonomy): Taxonomy {
    const reifiedRootSubjects = RawSubjects.reify(locale, rootSubjects);
    return Taxonomy.create(locale, name, reifiedRootSubjects);
  }
}
