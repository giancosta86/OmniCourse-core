import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { IsoDate } from "@giancosta86/time-utils";
import { Work } from "@/core";
import { WorkDto } from "./WorkDto";

describe("Converting a Work to a dto", () => {
  it("should preserve all the fields", () => {
    const work = Work.create("This is a test title", 90, {
      kind: "The work kind",
      completionDate: new IsoDate("1998-06-13"),
      url: ExpressiveUrl.create("https://gianlucacosta.info"),
      certificateUrl: ExpressiveUrl.create(
        "https://gianlucacosta.info/certificate"
      )
    });

    const dto = WorkDto.from(work);

    expect(dto.title).toBe(work.title);
    expect(dto.minutes).toBe(work.minutes);
    expect(dto.kind).toBe(work.kind);
    expect(dto.completionDate).toBe(work.completionDate?.toString());
    expect(dto.url).toBe(work.url?.toString());
    expect(dto.certificateUrl).toBe(work.certificateUrl?.toString());
  });
});
