import { Set } from "immutable";
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

  describe("instances having the same components", () => {
    describe("when part of a set", () => {
      it("should be equivalent", () => {
        const dateString = "2022-04-22";

        const originalDate = new IsoDate(dateString);
        const identicalDate = new IsoDate(dateString);

        const set = Set([originalDate]);

        expect(set.has(identicalDate)).toBeTrue();
      });
    });
  });

  describe("conversion to string", () => {
    describe("when the month and the day have 1 digit", () => {
      it("should have 1-digit components", () => {
        const stringValue = "2009-5-9";

        const date = new IsoDate(stringValue);

        expect(date.toString()).toBe(stringValue);
      });
    });

    describe("when the month and the day have 2 digits", () => {
      it("should have 2-digit components", () => {
        const stringValue = "2009-12-25";

        const date = new IsoDate(stringValue);

        expect(date.toString()).toBe(stringValue);
      });
    });
  });
});
