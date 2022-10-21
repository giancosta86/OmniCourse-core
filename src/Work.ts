import { defaultLocale } from "./formatting";
import { IsoDate } from "./IsoDate";

export type WorkOptionalFields = Readonly<
  Partial<{
    kind: string;
    completionDate: IsoDate;
    url: string;
    certificateUrl: string;
  }>
>;

export class Work {
  readonly completionDate?: IsoDate;
  readonly kind?: string;
  readonly url?: string;
  readonly certificateUrl?: string;

  readonly key: string;

  constructor(
    readonly title: string,
    readonly totalMinutes: number,
    optionalFields?: WorkOptionalFields
  ) {
    if (!title) {
      throw new Error("Empty work title");
    }

    if (totalMinutes <= 0) {
      throw new Error(`Invalid total minutes for work '${title}'`);
    }

    this.completionDate = optionalFields?.completionDate;
    this.kind = optionalFields?.kind;
    this.url = optionalFields?.url;
    this.certificateUrl = optionalFields?.certificateUrl;

    this.key = this.completionDate
      ? `${title} # ${this.completionDate.unboxed.getTime()} # ${totalMinutes}`
      : title;
  }
}

/**
  Works without completion date (=>in progress) are sorted before works with completion date.

  Among works without completion date, works are sorted by total minutes decreasing, then by title.

  Among works with completion date, works are sorted by completion date decreasing, then by title.
*/
export function compareWorks(left: Work, right: Work): number {
  if (!left.completionDate || !right.completionDate) {
    if (right.completionDate) {
      return -1;
    }

    if (left.completionDate) {
      return +1;
    }

    const totalMinutesComparison = right.totalMinutes - left.totalMinutes;

    return totalMinutesComparison
      ? totalMinutesComparison
      : left.title.localeCompare(right.title, defaultLocale);
  }

  const completionDateComparison =
    right.completionDate.unboxed.getTime() -
    left.completionDate.unboxed.getTime();

  if (completionDateComparison) {
    return completionDateComparison;
  }

  return left.title.localeCompare(right.title, defaultLocale);
}
