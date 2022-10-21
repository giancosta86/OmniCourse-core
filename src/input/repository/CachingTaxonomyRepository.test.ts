import { TaxonomyRepository } from "./TaxonomyRepository";
import { CachingTaxonomyRepository } from "./CachingTaxonomyRepository";
import { Taxonomy } from "../../Taxonomy";
import { Work } from "../../Work";
import { Subject } from "../../Subject";
import { TaxonomyKey } from "./TaxonomyKey";

class MockTaxonomyRepository implements TaxonomyRepository {
  static readonly validKey: TaxonomyKey = {
    id: "ok",
    name: "My taxonomy"
  };

  static readonly crashingKey: TaxonomyKey = {
    id: "crashing",
    name: "Unretrievable taxonomy"
  };

  static readonly expectedTaxonomy = new Taxonomy("Test taxonomy", [
    new Subject("Test subject", [new Work("Test work", 90)])
  ]);

  private readonly requestCountByKey: Map<TaxonomyKey, number> = new Map();

  getByKey(taxonomyKey: TaxonomyKey): Promise<Taxonomy> {
    const requestsForKey = this.requestCountByKey.get(taxonomyKey) ?? 0;
    this.requestCountByKey.set(taxonomyKey, requestsForKey + 1);

    return taxonomyKey.id == MockTaxonomyRepository.validKey.id
      ? Promise.resolve(MockTaxonomyRepository.expectedTaxonomy)
      : Promise.reject("Arbitrary repository error");
  }

  getRequestCountFor(taxonomyKey: TaxonomyKey): number {
    return this.requestCountByKey.get(taxonomyKey) ?? 0;
  }
}

describe("CachingTaxonomyRepository", () => {
  it("should return the taxonomy via the target repository on the first attempt only", async () => {
    const targetRepository = new MockTaxonomyRepository();
    const repository = new CachingTaxonomyRepository(targetRepository);

    const firstCallTaxonomy = await repository.getByKey(
      MockTaxonomyRepository.validKey
    );
    const secondCallTaxonomy = await repository.getByKey(
      MockTaxonomyRepository.validKey
    );

    expect(firstCallTaxonomy).toBe(MockTaxonomyRepository.expectedTaxonomy);
    expect(secondCallTaxonomy).toBe(firstCallTaxonomy);

    expect(
      targetRepository.getRequestCountFor(MockTaxonomyRepository.validKey)
    ).toBe(1);
  });

  it("should repeat failing retrieval attempts via the target repository", async () => {
    const targetRepository = new MockTaxonomyRepository();
    const repository = new CachingTaxonomyRepository(targetRepository);

    for (let i = 1; i <= 5; i++) {
      await repository.getByKey(MockTaxonomyRepository.validKey);
      try {
        await repository.getByKey(MockTaxonomyRepository.crashingKey);
      } catch {
        //Just do nothing
      }
    }

    expect(
      targetRepository.getRequestCountFor(MockTaxonomyRepository.validKey)
    ).toBe(1);

    expect(
      targetRepository.getRequestCountFor(MockTaxonomyRepository.crashingKey)
    ).toBe(5);
  });
});
