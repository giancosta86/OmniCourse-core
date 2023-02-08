import { RawTaxonomyFetcher } from "./RawTaxonomyFetcher";

describe("Failing taxonomy fetcher", () => {
  describe("for any taxonomy id", () => {
    it("should throw", () => {
      expect(() => {
        RawTaxonomyFetcher.failForInvalidId("<ANY ID>");
      }).toThrow("Invalid taxonomy id: '<ANY ID>'");
    });
  });
});
