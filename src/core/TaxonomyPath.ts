import { RSet } from "@rimbu/collection-types";
import { Reducer } from "@rimbu/common";
import { List } from "@rimbu/list";
import { TaxonomyLevel } from "./TaxonomyLevel";
import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";

export class TaxonomyPath {
  static fromTaxonomy(taxonomy: Taxonomy): TaxonomyPath {
    return new TaxonomyPath(List.from<TaxonomyLevel>([taxonomy]));
  }

  readonly currentLevel: TaxonomyLevel;
  readonly previousLevels: List<TaxonomyLevel>;
  readonly topSubjectsInPreviousLevels: number;

  private constructor(readonly levels: List.NonEmpty<TaxonomyLevel>) {
    this.currentLevel = this.levels.last();
    this.previousLevels = this.levels.take(this.levels.length - 1);

    this.topSubjectsInPreviousLevels = this.previousLevels
      .stream()
      .map(level => level.items.size)
      .reduce(Reducer.sum);
  }

  push(subject: Subject): TaxonomyPath {
    if (!(this.currentLevel.items as RSet<Subject>).has(subject)) {
      throw new Error(
        `Cannot push subject '${subject.name}' not belonging to the current level of the path`
      );
    }

    return new TaxonomyPath(this.levels.append(subject));
  }

  revertTo(levelInPath: TaxonomyLevel): TaxonomyPath {
    const requestedLevelIndex = this.findLevelIndex(levelInPath);

    const levelsUpToAndIncludingRequestedOne = this.levels
      .slice({
        start: 0,
        amount: requestedLevelIndex + 1
      })
      .assumeNonEmpty();

    return new TaxonomyPath(levelsUpToAndIncludingRequestedOne);
  }

  private findLevelIndex(level: TaxonomyLevel): number {
    const levelIndex = this.levels.stream().indexOf(level);

    if (levelIndex === undefined) {
      throw new Error(
        `Cannot find level '${level.name}' not belonging to the path`
      );
    }

    return levelIndex;
  }

  toMeaningful(): TaxonomyPath {
    if (TaxonomyLevel.isMeaningful(this.currentLevel)) {
      return this;
    }

    return this.push(
      this.currentLevel.items.stream().first() as Subject
    ).toMeaningful();
  }

  navigateTaxonomy(taxonomy: Taxonomy): TaxonomyPath {
    const initialMatchingTaxonomyLevels = List.from<TaxonomyLevel>([taxonomy]);

    const newPathLevels = this.levels
      .stream()
      .drop(1)
      .fold(
        initialMatchingTaxonomyLevels,

        (matchingTaxonomyLevels, pathLevel, _, halt) => {
          const taxonomyLevelToExplore = matchingTaxonomyLevels.last();

          if (!taxonomyLevelToExplore.hasSubjects) {
            halt();

            return matchingTaxonomyLevels;
          }

          const matchingSubject = (
            taxonomyLevelToExplore.items as RSet<Subject>
          )
            .stream()
            .find(subject => subject.name === pathLevel.name);

          if (!matchingSubject) {
            halt();
            return matchingTaxonomyLevels;
          }

          return matchingTaxonomyLevels.append(matchingSubject);
        }
      );

    return new TaxonomyPath(newPathLevels);
  }
}
