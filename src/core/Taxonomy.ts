import { Reducer } from "@rimbu/common";
import { RSet } from "@rimbu/collection-types";
import { OrderedHashSet } from "@rimbu/ordered";
import { HasEquals, Optional } from "@giancosta86/swan-lake";
import { LocaleLike } from "@giancosta86/hermes";
import { TaxonomyJson } from "@/json";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Subject } from "./Subject";
import { SubjectSet } from "./SubjectSet";

type TaxonomyParams = Readonly<{
  locale: Intl.Locale;
  name: string;
  items: RSet.NonEmpty<Subject>;
  minutes: number;
}>;

export class Taxonomy implements TaxonomyLevel, HasEquals {
  static create(
    locale: LocaleLike,
    name: string,
    subjects: Iterable<Subject>
  ): Taxonomy {
    if (!name) {
      throw new Error("Empty taxonomy name");
    }

    const subjectSet = SubjectSet.createSorted(locale, subjects);

    if (!subjectSet.nonEmpty()) {
      throw new Error(`No subjects for taxonomy '${name}'`);
    }

    const minutes = subjectSet
      .stream()
      .map(subject => subject.minutes)
      .reduce(Reducer.sum);

    return new Taxonomy({
      locale: LocaleLike.toLocale(locale),
      name,
      items: subjectSet,
      minutes
    });
  }

  static fromJson(taxonomyJson: TaxonomyJson): Taxonomy {
    return new Taxonomy({
      locale: LocaleLike.toLocale(taxonomyJson.locale),
      name: taxonomyJson.name,
      minutes: taxonomyJson.minutes,
      items: OrderedHashSet.from(
        taxonomyJson.items.map(Subject.fromJson)
      ).assumeNonEmpty()
    });
  }

  readonly hasSubjects: boolean = true;

  readonly locale: Intl.Locale;
  readonly name: string;
  readonly items: RSet.NonEmpty<Subject>;
  readonly minutes: number;

  private constructor({ locale, name, items, minutes }: TaxonomyParams) {
    this.locale = locale;
    this.name = name;
    this.items = items;
    this.minutes = minutes;
  }

  equals(other: Taxonomy): boolean {
    return (
      this.name === other.name &&
      this.minutes === other.minutes &&
      this.locale.toString() == other.locale.toString() &&
      this.items.stream().equals(other.items, Optional.equals)
    );
  }
}
