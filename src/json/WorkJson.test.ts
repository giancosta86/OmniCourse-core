import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { IsoDate } from "@giancosta86/time-utils";
import { Work } from "@/core";
import { WorkJson } from "./WorkJson";

describe("Converting a Work to JSON", () => {
  it("should preserve all the fields", () => {
    const work = Work.create("This is a test title", 90, {
      kind: "The work kind",
      completionDate: new IsoDate("1998-06-13"),
      url: ExpressiveUrl.create("https://gianlucacosta.info"),
      certificateUrl: ExpressiveUrl.create(
        "https://gianlucacosta.info/certificate"
      )
    });

    const workJson = WorkJson.from(work);

    expect(workJson.title).toBe(work.title);
    expect(workJson.minutes).toBe(work.minutes);
    expect(workJson.kind).toBe(work.kind);
    expect(workJson.completionDate).toBe(work.completionDate?.toString());
    expect(workJson.url).toBe(work.url?.toString());
    expect(workJson.certificateUrl).toBe(work.certificateUrl?.toString());
  });
});
