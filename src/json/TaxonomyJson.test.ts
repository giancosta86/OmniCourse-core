import { TestSubjects, TestTaxonomy } from "@/test";
import { SubjectJson } from "./SubjectJson";
import { TaxonomyJson } from "./TaxonomyJson";

describe("Converting a Taxonomy to JSON", () => {
  it("should preserve all the fields", () => {
    const taxonomy = TestTaxonomy.create("Alpha", TestSubjects.scrambled);

    const taxonomyJson = TaxonomyJson.from(taxonomy);

    expect(taxonomyJson.locale).toBe(taxonomy.locale.toString());
    expect(taxonomyJson.name).toBe(taxonomy.name);
    expect(taxonomyJson.minutes).toBe(taxonomy.minutes);
    expect(taxonomyJson.items).toEqualSequence(
      TestSubjects.sorted.map(SubjectJson.from)
    );
  });
});
