import { Work } from "@/core";

export type WorkJson = Readonly<{
  title: string;
  minutes: number;
  kind?: string;
  completionDate?: string;
  url?: string;
  certificateUrl?: string;
}>;

export namespace WorkJson {
  export function from(work: Work): WorkJson {
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
