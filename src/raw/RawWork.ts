import { IsoDate } from "@giancosta86/time-utils";
import { ExpressiveUrl, Optional } from "@giancosta86/swan-lake";
import { Work } from "@/core";

export type RawWork = Readonly<
  Partial<{
    title: unknown;
    minutes: unknown;
    kind: unknown;
    completionDate: unknown;
    url: unknown;
    certificateUrl: unknown;
  }>
>;

export namespace RawWork {
  export function reify(rawWork: RawWork): Work {
    if (rawWork.title == null) {
      throw new Error(`Missing work title: ${JSON.stringify(rawWork)}`);
    }
    const title = String(rawWork.title);

    if (rawWork.minutes == null) {
      throw new Error(`Missing 'minutes' field in work '${title}'`);
    }
    const minutes = Math.round(Number(rawWork.minutes));

    if (isNaN(minutes)) {
      throw new Error(`'minutes' field in work '${title}' is not a number`);
    }

    return Work.create(title, minutes, {
      kind: Optional.map(rawWork.kind, String),
      completionDate: Optional.map(
        rawWork.completionDate,
        completionDate => new IsoDate(String(completionDate))
      ),
      url: Optional.map(rawWork.url, url => ExpressiveUrl.create(String(url))),
      certificateUrl: Optional.map(rawWork.certificateUrl, certificateUrl =>
        ExpressiveUrl.create(String(certificateUrl))
      )
    });
  }
}
