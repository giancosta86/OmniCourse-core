import { Taxonomy } from "../Taxonomy";
import { compareSubjects, Subject } from "../Subject";
import { IsoDate } from "../IsoDate";
import { compareWorks, Work } from "../Work";

export type RawTaxonomy = RawSubjects;

type RawSubjects = Readonly<{
  [subjectName: string | number | symbol]: RawSubjectItems;
}>;

type RawSubjectItems = RawSubjects | readonly RawWork[];

type RawWork = Readonly<
  Partial<{
    title: unknown;
    minutes: unknown;
    kind: unknown;
    completionDate: unknown;
    url: unknown;
    certificateUrl: unknown;
  }>
>;

export type TaxonomyReifier = (
  taxonomyName: string,
  rawTaxonomy: RawTaxonomy
) => Taxonomy | Promise<Taxonomy>;

export function toTaxonomy(name: string, rawTaxonomy: RawTaxonomy): Taxonomy {
  const firstLevelSubjects = toSubjects(rawTaxonomy);
  return new Taxonomy(name, firstLevelSubjects);
}

function toSubjects(rawSubjects: RawSubjects): Subject[] {
  return Object.entries(rawSubjects)
    .flatMap(([subjectName, rawSubjectItems]) => {
      const subject = toSubject(subjectName, rawSubjectItems);
      return subject ? [subject] : [];
    })
    .sort(compareSubjects);
}

function toSubject(
  subjectName: string,
  rawSubjectItems: RawSubjectItems
): Subject | null {
  const subjectItems =
    rawSubjectItems instanceof Array
      ? toWorks(rawSubjectItems)
      : toSubjects(rawSubjectItems);

  return subjectItems.length ? new Subject(subjectName, subjectItems) : null;
}

function toWorks(rawWorks: readonly RawWork[]): Work[] {
  return rawWorks.map(toWork).sort(compareWorks);
}

function toWork(rawWork: RawWork): Work {
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

  const completionDate = rawWork.completionDate
    ? new IsoDate(String(rawWork.completionDate))
    : undefined;

  return new Work(title, minutes, {
    kind: rawWork.kind ? String(rawWork.kind) : undefined,
    completionDate,
    url: rawWork.url ? String(rawWork.url) : undefined,
    certificateUrl: rawWork.certificateUrl
      ? String(rawWork.certificateUrl)
      : undefined
  });
}
