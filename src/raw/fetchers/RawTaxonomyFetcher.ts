import { ImmediateOrPromise } from "@giancosta86/swan-lake";
import { RawTaxonomy } from "@/raw";

export type TaxonomyId = string;

export type RawTaxonomyFetcher = (
  taxonomyId: TaxonomyId
) => ImmediateOrPromise<RawTaxonomy>;

export namespace RawTaxonomyFetcher {
  export function failForInvalidId(taxonomyId: TaxonomyId): RawTaxonomy {
    throw new Error(`Invalid taxonomy id: '${taxonomyId}'`);
  }
}
