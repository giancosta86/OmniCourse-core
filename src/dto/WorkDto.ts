import { Work } from "@/core";

export type WorkDto = Readonly<{
  title: string;
  minutes: number;
  kind?: string;
  completionDate?: string;
  url?: string;
  certificateUrl?: string;
}>;

export namespace WorkDto {
  export function from(work: Work): WorkDto {
    return {
      title: work.title,
      minutes: work.minutes,
      kind: work.kind,
      completionDate: work.completionDate?.toString(),
      url: work.url?.toString(),
      certificateUrl: work.certificateUrl?.toString()
    };
  }
}
