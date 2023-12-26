import { HashMap } from "@rimbu/hashed";
import { TestRawTaxonomy } from "@/test";
import { CachingRawTaxonomyFetcher } from "./CachingRawTaxonomyFetcher";
import { TaxonomyId } from "./RawTaxonomyFetcher";
import { FactoryRawTaxonomyFetcher } from "./FactoryRawTaxonomyFetcher";
import { RawTaxonomy } from "../RawTaxonomy";

describe("Retrieving via a caching RawTaxonomyFetcher", () => {
  const registeredId: TaxonomyId = "<REGISTERED ID>";

  const factoryFetcher = FactoryRawTaxonomyFetcher.create(
    HashMap.of([registeredId, TestRawTaxonomy.createCopy])
  );

  describe("on the first request of any key", () => {
    it("should return the expected taxonomy", async () => {
      const fetcher = CachingRawTaxonomyFetcher.create(factoryFetcher);

      const retrievedRawTaxonomy = await fetcher(registeredId);

      expect(retrievedRawTaxonomy).toEqual(TestRawTaxonomy.instance);
    });

    it("should ask the source fetcher", async () => {
      const mockFetcher = jest.fn(factoryFetcher);
      const fetcher = CachingRawTaxonomyFetcher.create(mockFetcher);

      await fetcher(registeredId);

      expect(mockFetcher).toHaveBeenCalledExactlyOnceWith(registeredId);
    });
  });

  describe("on subsequent requests of the same key", () => {
    it("should return the very same raw taxonomy", async () => {
      const fetcher = CachingRawTaxonomyFetcher.create(factoryFetcher);

      const firstCallTaxonomy = await fetcher(registeredId);
      const secondCallTaxonomy = await fetcher(registeredId);

      expect(secondCallTaxonomy).toBe(firstCallTaxonomy);
    });

    it("should rely on the source fetcher only for the first call", async () => {
      const mockFetcher = jest.fn(factoryFetcher);
      const fetcher = CachingRawTaxonomyFetcher.create(mockFetcher);

      for (let i = 1; i <= 5; i++) {
        await fetcher(registeredId);
      }

      expect(mockFetcher).toHaveBeenCalledExactlyOnceWith(registeredId);
    });
  });

  describe("if the source fetcher threw while trying to provide a taxonomy", () => {
    it("should keep asking the source fetcher", async () => {
      const mockFetcher = jest.fn(factoryFetcher);
      const fetcher = CachingRawTaxonomyFetcher.create(mockFetcher);

      const unregisteredId: TaxonomyId = "<UNREGISTERED ID>";
      const testLoopCount = 5;

      for (let i = 1; i <= testLoopCount; i++) {
        await fetcher(registeredId);

        try {
          await fetcher(unregisteredId);
        } catch {
          //Just do nothing
        }
      }

      expect(mockFetcher).toHaveBeenNthCalledWith<[TaxonomyId]>(
        1,
        registeredId
      );

      expect(mockFetcher).toHaveBeenNthCalledWith<[TaxonomyId]>(
        testLoopCount,
        unregisteredId
      );
    });
  });

  describe("when a custom map builder factory is provided", () => {
    it("should actually call it to create its map builder", () => {
      const mapBuilderFactory = jest.fn(() =>
        HashMap.builder<TaxonomyId, RawTaxonomy>()
      );

      CachingRawTaxonomyFetcher.create(factoryFetcher, mapBuilderFactory);

      expect(mapBuilderFactory).toHaveBeenCalledOnce();
    });
  });
});
