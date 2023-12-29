import { Taxonomy } from "@/core";
import { TestSubjects } from "@/test";
import { SubjectJson } from "./SubjectJson";
import { TaxonomyJson } from "./TaxonomyJson";

describe("Converting a Taxonomy to JSON", () => {
  it("should preserve all the fields", () => {
    const taxonomy = Taxonomy.create("Alpha", TestSubjects.scrambled);

    const taxonomyJson = TaxonomyJson.from(taxonomy);

    expect(taxonomyJson.name).toBe(taxonomy.name);
    expect(taxonomyJson.minutes).toBe(taxonomy.minutes);
    expect(taxonomyJson.items).toEqualSequence(
      TestSubjects.scrambled.map(SubjectJson.from)
    );
  });
});
