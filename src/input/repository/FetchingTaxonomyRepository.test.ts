import { Taxonomy } from "../../Taxonomy";
import { Subject } from "../../Subject";
import { Work } from "../../Work";
import { RawTaxonomy } from "../raw";
import { TaxonomyKey } from "./TaxonomyKey";
import { FetchingTaxonomyRepository } from "./FetchingTaxonomyRepository";

const VALID_KEY: TaxonomyKey = { id: "ok", name: "My taxonomy" };

const CRASHING_KEY: TaxonomyKey = {
  id: "crashing",
  name: "Unretrievable taxonomy"
};

const rawTaxonomy: RawTaxonomy = {
  "First subject": [
    {
      title: "Alpha",
      minutes: 9
    }
  ],

  "Second subject": [
    {
      title: "Beta",
      minutes: 7
    },

    { title: "Gamma", minutes: 8 }
  ]
};

const expectedTaxonomy = new Taxonomy(
  VALID_KEY.name,

  [
    new Subject("Second subject", [new Work("Gamma", 8), new Work("Beta", 7)]),

    new Subject("First subject", [new Work("Alpha", 9)])
  ]
);

function testFetcher(taxonomyId: string): Promise<RawTaxonomy> {
  if (taxonomyId != VALID_KEY.id) {
    throw new Error("Arbitrary fetching error");
  }

  return Promise.resolve(rawTaxonomy);
}

describe("FetchingTaxonomyRepository", () => {
  it("should return the taxonomy obtained from the fetched raw taxonomy", async () => {
    const repository = new FetchingTaxonomyRepository(testFetcher);

    const taxonomy = await repository.getByKey(VALID_KEY);

    expect(taxonomy).toEqual(expectedTaxonomy);
  });

  it("should throw when the fetcher fails", async () => {
    const repository = new FetchingTaxonomyRepository(testFetcher);

    await expect(repository.getByKey(CRASHING_KEY)).rejects.toThrow(
      "Arbitrary fetching error"
    );
  });

  it("should fetch the raw taxonomy every time, no matter the outcome", async () => {
    const mockedTestFetcher = jest.fn((taxonomyId: string) =>
      testFetcher(taxonomyId)
    );

    const repository = new FetchingTaxonomyRepository(mockedTestFetcher);

    for (let i = 1; i <= 5; i++) {
      await repository.getByKey(VALID_KEY);
      try {
        await repository.getByKey(CRASHING_KEY);
      } catch {
        //Just do nothing
      }
    }

    expect(mockedTestFetcher.mock.calls.length).toBe(5 * 2);
  });
});
