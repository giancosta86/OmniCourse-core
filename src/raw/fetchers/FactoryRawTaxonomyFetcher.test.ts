import { HashMap } from "@rimbu/hashed";
import { TestRawTaxonomy } from "@/test";
import { FactoryRawTaxonomyFetcher } from "./FactoryRawTaxonomyFetcher";

describe("Factory raw taxonomy fetcher", () => {
  describe("when passing the valid id multiple times", () => {
    it("should return at each call a new RawTaxonomy", async () => {
      const testId = "<ANY ID>";
      const fetcher = FactoryRawTaxonomyFetcher.create(
        HashMap.of([testId, TestRawTaxonomy.createCopy])
      );

      const firstTaxonomy = await fetcher(testId);
      const secondTaxonomy = await fetcher(testId);

      expect(secondTaxonomy).toEqual(firstTaxonomy);
      expect(secondTaxonomy).not.toBe(firstTaxonomy);
    });
  });

  describe("when passing an unexpected id", () => {
    it("should throw", async () => {
      const fetcher = FactoryRawTaxonomyFetcher.create(HashMap.empty());

      expect(() => {
        fetcher("<ANY ID>");
      }).toThrow("Invalid taxonomy id: '<ANY ID>'");
    });
  });
});
