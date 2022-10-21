import { Taxonomy } from "../../Taxonomy";
import { RawTaxonomy, TaxonomyReifier, toTaxonomy } from "../raw";
import { TaxonomyKey } from "./TaxonomyKey";
import { TaxonomyRepository } from "./TaxonomyRepository";

export type RawTaxonomyFetcher = (taxonomyId: string) => Promise<RawTaxonomy>;

export class FetchingTaxonomyRepository implements TaxonomyRepository {
  constructor(
    private readonly rawTaxonomyFetcher: RawTaxonomyFetcher,
    private readonly taxonomyReifier: TaxonomyReifier = toTaxonomy
  ) {}

  async getByKey(taxonomyKey: TaxonomyKey): Promise<Taxonomy> {
    const rawTaxonomy = await this.rawTaxonomyFetcher(taxonomyKey.id);

    return this.taxonomyReifier(taxonomyKey.name, rawTaxonomy);
  }
}
