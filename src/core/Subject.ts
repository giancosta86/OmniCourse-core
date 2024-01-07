import { RSet } from "@rimbu/collection-types";
import { Reducer } from "@rimbu/common";
import { OrderedHashSet } from "@rimbu/ordered";
import { HasEquals } from "@giancosta86/swan-lake";
import { Iterable } from "@giancosta86/stream-utils";
import { SubjectDto, WorkDto } from "@/dto";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Work } from "./Work";
import { Subjects } from "./Subjects";
import { Works } from "./Works";

type SubjectParams = Readonly<{
  name: string;
  items: RSet.NonEmpty<Subject> | RSet.NonEmpty<Work>;
  minutes: number;
  hasSubjects: boolean;
}>;

export class Subject implements TaxonomyLevel, HasEquals {
  static create(
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

    let itemSet:
      | OrderedHashSet.NonEmpty<Subject>
      | OrderedHashSet.NonEmpty<Work>;

    if (hasSubjects) {
      const subjectIterable = items as Iterable<Subject>;
      Subjects.ensureNoDuplicates(subjectIterable);
      itemSet = OrderedHashSet.from(subjectIterable).assumeNonEmpty();
    } else {
      const workIterable = items as Iterable<Work>;
      Works.ensureNoDuplicates(workIterable);
      itemSet = OrderedHashSet.from(workIterable).assumeNonEmpty();
    }

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

  static fromValidDto(dto: SubjectDto): Subject {
    return new Subject({
      name: dto.name,
      hasSubjects: dto.hasSubjects,
      minutes: dto.minutes,
      items: dto.hasSubjects
        ? OrderedHashSet.from(
            (dto.items as readonly SubjectDto[]).map(Subject.fromValidDto)
          ).assumeNonEmpty()
        : OrderedHashSet.from(
            (dto.items as readonly WorkDto[]).map(Work.fromValidDto)
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
