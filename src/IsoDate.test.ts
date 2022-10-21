import { IsoDate } from "./IsoDate";

describe("ISO date", () => {
  describe("constructor", () => {
    it("should parse a valid date", () => {
      const isoDate = new IsoDate("1995-04-29");
      expect(isoDate.unboxed).toEqual(new Date(1995, 3, 29));
    });

    it("should throw when parsing garbage input", () => {
      expect(() => {
        new IsoDate("DEFINITELY NOT A DATE");
      }).toThrow("Invalid date string: 'DEFINITELY NOT A DATE'");
    });

    it("should throw when parsing sophisticated garbage input", () => {
      expect(() => {
        new IsoDate("XXXX-YY-ZZ");
      }).toThrow("Invalid date string: 'XXXX-YY-ZZ'");
    });

    it("should throw when parsing an impossible date", () => {
      expect(() => {
        new IsoDate("1995-02-31");
      }).toThrow("Invalid date string: '1995-02-31'");
    });

    it("should throw when parsing an incomplete date", () => {
      expect(() => {
        new IsoDate("1995-02");
      }).toThrow("Invalid date string: '1995-02'");
    });
  });
});
