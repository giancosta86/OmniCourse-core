import { Comp } from "@rimbu/common";
import { LocaleLike } from "@giancosta86/hermes";
import { Work } from "./Work";

export namespace WorkComp {
  /**
   * **COMPARISON ALGORITHM**
   *
   * 1. Works in progress (=> without completion date) are always sorted
   * before works with completion date.
   *
   * 2. Among the works with completion date, more recent works come first
   *
   * Then, within both groups:
   *
   * 3. Works are sorted by duration decreasing
   *
   * 4. Finally, works are sorted alphabetically by title, according to the locale given
   *
   */
  export function create(locale: LocaleLike): Comp<Work> {
    const languageTag = LocaleLike.toLanguageTag(locale);

    return {
      isComparable(obj: any): obj is Work {
        return obj instanceof Work;
      },

      compare(left: Work, right: Work): number {
        if (left.completionDate && right.completionDate) {
          const completionDateComparison =
            right.completionDate.unboxed.getTime() -
            left.completionDate.unboxed.getTime();

          if (completionDateComparison) {
            return completionDateComparison;
          }
        } else if (!left.completionDate && right.completionDate) {
          return -1;
        } else if (left.completionDate && !right.completionDate) {
          return 1;
        }

        const durationComparison = right.minutes - left.minutes;
        if (durationComparison) {
          return durationComparison;
        }

        return left.title.localeCompare(right.title, languageTag);
      }
    };
  }
}
