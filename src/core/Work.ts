import { ExpressiveUrl, HasEquals, Optional } from "@giancosta86/swan-lake";
import { IsoDate } from "@giancosta86/time-utils";
import { WorkDto } from "@/dto";

type WorkParams = Readonly<
  {
    title: string;
    minutes: number;
  } & WorkOptionalFields
>;

export type WorkOptionalFields = Readonly<
  Partial<{
    kind: string;
    completionDate: IsoDate;
    url: URL;
    certificateUrl: URL;
  }>
>;

export class Work implements HasEquals {
  static create(
    title: string,
    minutes: number,
    optionalFields?: WorkOptionalFields
  ): Work {
    if (!title) {
      throw new Error("Empty work title");
    }

    if (minutes <= 0) {
      throw new Error(`Invalid minutes for work '${title}': ${minutes}`);
    }

    return new Work({
      title,
      minutes,
      kind: optionalFields?.kind,
      completionDate: optionalFields?.completionDate,
      url: optionalFields?.url,
      certificateUrl: optionalFields?.certificateUrl
    });
  }

  static fromValidDto(dto: WorkDto): Work {
    return new Work({
      title: dto.title,
      minutes: dto.minutes,
      kind: dto.kind,
      completionDate: Optional.map(
        dto.completionDate,
        completionDate => new IsoDate(completionDate)
      ),
      url: Optional.map(dto.url, ExpressiveUrl.create),
      certificateUrl: Optional.map(dto.certificateUrl, ExpressiveUrl.create)
    });
  }

  readonly title: string;
  readonly minutes: number;
  readonly kind?: string;
  readonly completionDate?: IsoDate;
  readonly url?: URL;
  readonly certificateUrl?: URL;

  private constructor({
    title,
    minutes,
    kind,
    completionDate,
    url,
    certificateUrl
  }: WorkParams) {
    this.title = title;
    this.minutes = minutes;
    this.kind = kind;
    this.completionDate = completionDate;
    this.url = url;
    this.certificateUrl = certificateUrl;
  }

  equals(other: Work): boolean {
    return (
      this.title === other.title &&
      this.minutes === other.minutes &&
      this.kind === other.kind &&
      Optional.equals(this.completionDate, other.completionDate) &&
      this.url?.toString() === other.url?.toString() &&
      this.certificateUrl?.toString() === other.certificateUrl?.toString()
    );
  }
}
