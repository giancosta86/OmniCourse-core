import { SortedSet } from "@rimbu/sorted";
import { IsoDate } from "@giancosta86/time-utils";
import { WorkSet, Work } from "@/core";
import { Test } from "./settings";

export namespace TestWorks {
  export function createSortedSet(works: Iterable<Work>): SortedSet<Work> {
    return WorkSet.createSorted(Test.locale, works);
  }

  const averageLongWithoutCompletionDate = Work.create(
    "Average long without completion date",
    90
  );

  const averageShortWithoutCompletionDate = Work.create(
    "Average short without completion date",
    34
  );

  const averageShortWithoutCompletionDateHavingSuffixInTitle = Work.create(
    averageShortWithoutCompletionDate.title + " - with suffix",
    averageShortWithoutCompletionDate.minutes
  );

  const almostShortestButMostRecent = Work.create(
    "Almost shortest but most recent",
    7,
    {
      completionDate: new IsoDate("2021-04-26")
    }
  );

  const almostShortestButMostRecentHavingSuffixInTitle = Work.create(
    almostShortestButMostRecent.title + " - with suffix",
    almostShortestButMostRecent.minutes,
    { completionDate: almostShortestButMostRecent.completionDate }
  );

  const longestButMostAged = Work.create("Longest but most aged", 492, {
    completionDate: new IsoDate("2013-07-09")
  });

  const shortestAndMostAged = Work.create("Shortest and most aged", 1, {
    completionDate: longestButMostAged.completionDate
  });

  export const scrambled = [
    almostShortestButMostRecent,
    averageShortWithoutCompletionDate,
    longestButMostAged,
    almostShortestButMostRecentHavingSuffixInTitle,
    averageLongWithoutCompletionDate,
    shortestAndMostAged,
    averageShortWithoutCompletionDateHavingSuffixInTitle
  ] as const;

  export const sorted = [
    averageLongWithoutCompletionDate,
    averageShortWithoutCompletionDate,
    averageShortWithoutCompletionDateHavingSuffixInTitle,
    almostShortestButMostRecent,
    almostShortestButMostRecentHavingSuffixInTitle,
    longestButMostAged,
    shortestAndMostAged
  ] as const;
}
