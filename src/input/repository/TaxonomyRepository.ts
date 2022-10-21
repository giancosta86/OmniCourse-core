import { Taxonomy } from "../../Taxonomy";
import { TaxonomyKey } from "./TaxonomyKey";

export interface TaxonomyRepository {
  getByKey(taxonomyKey: TaxonomyKey): Promise<Taxonomy>;
}
