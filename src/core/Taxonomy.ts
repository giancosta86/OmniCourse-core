import { Reducer } from "@rimbu/common";
import { RSet } from "@rimbu/collection-types";
import { OrderedHashSet } from "@rimbu/ordered";
import { HasEquals, Optional } from "@giancosta86/swan-lake";
import { TaxonomyDto } from "@/dto";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Subject } from "./Subject";
import { Subjects } from "./Subjects";

type TaxonomyParams = Readonly<{
  name: string;
  items: RSet.NonEmpty<Subject>;
  minutes: number;
}>;

export class Taxonomy implements TaxonomyLevel, HasEquals {
  static create(name: string, subjects: Iterable<Subject>): Taxonomy {
    if (!name) {
      throw new Error("Empty taxonomy name");
    }

    Subjects.ensureNoDuplicates(subjects);

    const subjectSet = OrderedHashSet.from(subjects);
    if (!subjectSet.nonEmpty()) {
      throw new Error(`No subjects for taxonomy '${name}'`);
    }

    const minutes = subjectSet
      .stream()
      .map(subject => subject.minutes)
      .reduce(Reducer.sum);

    return new Taxonomy({
      name,
      items: subjectSet,
      minutes
    });
  }

  static fromValidDto(dto: TaxonomyDto): Taxonomy {
    return new Taxonomy({
      name: dto.name,
      minutes: dto.minutes,
      items: OrderedHashSet.from(
        dto.items.map(Subject.fromValidDto)
      ).assumeNonEmpty()
    });
  }

  readonly hasSubjects: boolean = true;

  readonly name: string;
  readonly items: RSet.NonEmpty<Subject>;
  readonly minutes: number;

  private constructor({ name, items, minutes }: TaxonomyParams) {
    this.name = name;
    this.items = items;
    this.minutes = minutes;
  }

  equals(other: Taxonomy): boolean {
    return (
      this.name === other.name &&
      this.minutes === other.minutes &&
      this.items.stream().equals(other.items, Optional.equals)
    );
  }
}
