import { RSet } from "@rimbu/collection-types";
import { Reducer } from "@rimbu/common";
import { OrderedHashSet } from "@rimbu/ordered";
import { HasEquals } from "@giancosta86/swan-lake";
import { LocaleLike } from "@giancosta86/hermes";
import { Iterable } from "@giancosta86/stream-utils";
import { SubjectJson, WorkJson } from "@/json";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Work } from "./Work";
import { SubjectSet } from "./SubjectSet";
import { WorkSet } from "./WorkSet";

type SubjectParams = Readonly<{
  name: string;
  items: RSet.NonEmpty<Subject> | RSet.NonEmpty<Work>;
  minutes: number;
  hasSubjects: boolean;
}>;

export class Subject implements TaxonomyLevel, HasEquals {
  static create(
    locale: LocaleLike,
    name: string,
    items: Iterable<Subject> | Iterable<Work>
  ): Subject {
    if (!name) {
      throw new Error("Empty subject name");
    }

    let firstItem: Subject | Work;

    try {
      firstItem = Iterable.getFirst(items as Iterable<Subject | Work>);
    } catch {
      throw new Error(`No items for subject '${name}'`);
    }

    const hasSubjects = firstItem instanceof Subject;

    const itemSet = hasSubjects
      ? SubjectSet.createSorted(
          locale,
          items as Iterable<Subject>
        ).assumeNonEmpty()
      : WorkSet.createSorted(locale, items as Iterable<Work>).assumeNonEmpty();

    const minutes = itemSet
      .stream()
      .map(subject => subject.minutes)
      .reduce(Reducer.sum);

    return new Subject({
      name,
      items: itemSet,
      hasSubjects,
      minutes
    });
  }

  static fromJson(subjectJson: SubjectJson): Subject {
    return new Subject({
      name: subjectJson.name,
      hasSubjects: subjectJson.hasSubjects,
      minutes: subjectJson.minutes,
      items: subjectJson.hasSubjects
        ? OrderedHashSet.from(
            (subjectJson.items as readonly SubjectJson[]).map(Subject.fromJson)
          ).assumeNonEmpty()
        : OrderedHashSet.from(
            (subjectJson.items as readonly WorkJson[]).map(Work.fromJson)
          ).assumeNonEmpty()
    });
  }

  readonly name: string;
  readonly items: RSet.NonEmpty<Subject> | RSet.NonEmpty<Work>;
  readonly minutes: number;
  readonly hasSubjects: boolean;

  private constructor({ name, hasSubjects, minutes, items }: SubjectParams) {
    this.name = name;
    this.hasSubjects = hasSubjects;
    this.minutes = minutes;
    this.items = items;
  }

  equals(other: Subject): boolean {
    return (
      this.name === other.name &&
      this.hasSubjects === other.hasSubjects &&
      this.minutes === other.minutes &&
      (this.hasSubjects
        ? Iterable.equals(
            this.items as RSet<Subject>,
            other.items as RSet<Subject>,
            (a, b) => a.equals(b)
          )
        : Iterable.equals(
            this.items as RSet<Work>,
            other.items as RSet<Work>,
            (a, b) => a.equals(b)
          ))
    );
  }
}
