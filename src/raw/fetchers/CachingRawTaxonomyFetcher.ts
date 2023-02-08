import { RMap } from "@rimbu/collection-types";
import { HashMap } from "@rimbu/hashed";
import { RawTaxonomy } from "@/raw";
import { RawTaxonomyFetcher, TaxonomyId } from "./RawTaxonomyFetcher";

export namespace CachingRawTaxonomyFetcher {
  export function create(
    sourceFetcher: RawTaxonomyFetcher,
    mapBuilderFactory?: () => RMap.Builder<TaxonomyId, RawTaxonomy>
  ): RawTaxonomyFetcher {
    const taxonomiesById = mapBuilderFactory
      ? mapBuilderFactory()
      : HashMap.builder<TaxonomyId, RawTaxonomy>();

    return async (taxonomyId: TaxonomyId) => {
      const cachedTaxonomy = taxonomiesById.get(taxonomyId);

      if (cachedTaxonomy) {
        return cachedTaxonomy;
      }

      const fetchedTaxonomy = await sourceFetcher(taxonomyId);

      taxonomiesById.set(taxonomyId, fetchedTaxonomy);

      return fetchedTaxonomy;
    };
  }
}
