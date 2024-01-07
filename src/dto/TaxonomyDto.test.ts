import { Taxonomy } from "@/core";
import { TestSubjects } from "@/test";
import { SubjectDto } from "./SubjectDto";
import { TaxonomyDto } from "./TaxonomyDto";

describe("Converting a Taxonomy to a dto", () => {
  it("should preserve all the fields", () => {
    const taxonomy = Taxonomy.create("Alpha", TestSubjects.scrambled);

    const dto = TaxonomyDto.from(taxonomy);

    expect(dto.name).toBe(taxonomy.name);
    expect(dto.minutes).toBe(taxonomy.minutes);
    expect(dto.items).toEqualSequence(
      TestSubjects.scrambled.map(SubjectDto.from)
    );
  });
});
