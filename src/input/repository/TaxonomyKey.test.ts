import { TaxonomyKey, validateTaxonomyKeys } from "./TaxonomyKey";

describe("Taxonomy key", () => {
  describe("array validation", () => {
    it("should pass for valid keys", () => {
      validateTaxonomyKeys([
        { id: "a", name: "Alpha" },
        { id: "b", name: "Beta" }
      ]);
    });

    it("should throw for empty array", () => {
      expect(() => {
        validateTaxonomyKeys([]);
      }).toThrow("Empty taxonomy key array!");
    });

    it("should throw for key with missing id", () => {
      expect(() => {
        validateTaxonomyKeys([
          { id: "a", name: "Alpha" },
          { name: "Beta" } as unknown as TaxonomyKey
        ]);
      }).toThrow('Taxonomy key with empty/missing id: {"name":"Beta"}');
    });

    it("should throw for key with empty name", () => {
      expect(() => {
        validateTaxonomyKeys([
          { id: "a", name: "Alpha" },
          { id: "b" } as unknown as TaxonomyKey
        ]);
      }).toThrow('Taxonomy key with empty/missing name: {"id":"b"}');
    });

    it("should throw for keys with the same id", () => {
      expect(() => {
        validateTaxonomyKeys([
          { id: "w", name: "Alpha" },
          { id: "w", name: "Test" } as unknown as TaxonomyKey
        ]);
      }).toThrow("Duplicate taxonomy key id: 'w'");
    });

    it("should throw for keys with the same name", () => {
      expect(() => {
        validateTaxonomyKeys([
          { id: "a", name: "Alpha" },
          { id: "b", name: "Alpha" } as unknown as TaxonomyKey
        ]);
      }).toThrow("Duplicate taxonomy key name: 'Alpha'");
    });

    it("should throw for keys where the id is not a string", () => {
      expect(() => {
        const taxonomyKey = { id: 90, name: "Alpha" } as unknown as TaxonomyKey;
        validateTaxonomyKeys([taxonomyKey]);
      }).toThrow("Taxonomy key id '90' is not a string");
    });

    it("should throw for keys where the name is not a string", () => {
      expect(() => {
        const taxonomyKey = { id: "Alpha", name: 95 } as unknown as TaxonomyKey;
        validateTaxonomyKeys([taxonomyKey]);
      }).toThrow("Taxonomy key name '95' is not a string");
    });
  });
});
