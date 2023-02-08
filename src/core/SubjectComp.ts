import { Comp } from "@rimbu/common";
import { LocaleLike } from "@giancosta86/hermes";
import { Subject } from "./Subject";

export namespace SubjectComp {
  /**
   * Subjects are sorted by minutes decreasing, then by title.
   */
  export function create(locale: LocaleLike): Comp<Subject> {
    const languageTag = LocaleLike.toLanguageTag(locale);

    return {
      isComparable(obj: any): obj is Subject {
        return obj instanceof Subject;
      },

      compare(left: Subject, right: Subject): number {
        const minutesComparison = right.minutes - left.minutes;

        return minutesComparison
          ? minutesComparison
          : left.name.localeCompare(right.name, languageTag);
      }
    };
  }
}
