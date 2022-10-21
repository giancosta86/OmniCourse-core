import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";
import { Work } from "./Work";

describe("Taxonomy", () => {
  describe("constructor", () => {
    it("should compute the total minutes from the subjects", () => {
      const taxonomy = new Taxonomy("My taxonomy", [
        new Subject("First subject", [new Work("Alpha", 90)]),

        new Subject("Second subject", [
          new Work("Beta", 4),
          new Work("Gamma", 2)
        ])
      ]);

      expect(taxonomy.totalMinutes).toBe(90 + 4 + 2);
    });

    it("should throw when the name is empty", () => {
      expect(() => {
        new Taxonomy("", [
          new Subject("First subject", [new Work("Alpha", 90)])
        ]);
      }).toThrow("Empty taxonomy name");
    });

    it("should throw when the subject list is empty", () => {
      expect(() => {
        new Taxonomy("My taxonomy", []);
      }).toThrow("Cannot create taxonomy 'My taxonomy' with no subjects");
    });
  });

  it("should contain subjects", () => {
    const firstSubject = new Subject("First", [new Work("Alpha", 90)]);

    const secondSubject = new Subject("Second", [
      new Subject("Third", [new Work("Beta", 95)])
    ]);

    const taxonomy = new Taxonomy("Test", [firstSubject, secondSubject]);

    expect(taxonomy.items).toEqual([firstSubject, secondSubject]);
    expect(taxonomy.containsSubjects).toBe(true);
  });
});
