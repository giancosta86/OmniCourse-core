import { HashMap } from "@rimbu/hashed";
import { ImmediateOrPromise } from "@giancosta86/swan-lake";
import { RawTaxonomy, RawTaxonomyFetcher, TaxonomyId } from "@/raw";

export type RawTaxonomyFactory = (
  id?: TaxonomyId
) => ImmediateOrPromise<RawTaxonomy>;

export namespace FactoryRawTaxonomyFetcher {
  export function create(
    factories: HashMap<TaxonomyId, RawTaxonomyFactory>
  ): RawTaxonomyFetcher {
    return (taxonomyId: TaxonomyId) => {
      const factory = factories.get(taxonomyId);

      if (!factory) {
        return RawTaxonomyFetcher.failForInvalidId(taxonomyId);
      }

      return factory(taxonomyId);
    };
  }
}
