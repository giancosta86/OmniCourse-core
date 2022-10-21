import { Taxonomy } from "../../Taxonomy";
import { TaxonomyKey } from "./TaxonomyKey";
import { TaxonomyRepository } from "./TaxonomyRepository";

export class CachingTaxonomyRepository implements TaxonomyRepository {
  private readonly taxonomyCache: Map<TaxonomyKey, Taxonomy> = new Map();

  constructor(private readonly targetRepository: TaxonomyRepository) {}

  async getByKey(taxonomyKey: TaxonomyKey): Promise<Taxonomy> {
    const cachedTaxonomy = this.taxonomyCache.get(taxonomyKey);

    if (cachedTaxonomy) {
      return Promise.resolve(cachedTaxonomy);
    }

    const taxonomyFromTargetRepository = await this.targetRepository.getByKey(
      taxonomyKey
    );
    this.taxonomyCache.set(taxonomyKey, taxonomyFromTargetRepository);
    return taxonomyFromTargetRepository;
  }
}
