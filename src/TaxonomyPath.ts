import { isMeaningful, TaxonomyLevel } from "./TaxonomyLevel";
import { Taxonomy } from "./Taxonomy";
import { Subject } from "./Subject";

export class TaxonomyPath {
  static fromTaxonomy(taxonomy: Taxonomy): TaxonomyPath {
    return new TaxonomyPath([taxonomy]);
  }

  readonly currentLevel: TaxonomyLevel;
  readonly previousLevels: readonly TaxonomyLevel[];
  readonly subjectsInPreviousLevels: number;

  private constructor(readonly levels: TaxonomyLevel[]) {
    this.currentLevel = levels[levels.length - 1] as TaxonomyLevel;
    this.previousLevels = this.levels.slice(0, levels.length - 1);

    this.subjectsInPreviousLevels = this.previousLevels.reduce(
      (cumulatedCounter, level) => cumulatedCounter + level.items.length,
      0
    );
  }

  push(subject: Subject): TaxonomyPath {
    if (!(this.currentLevel.items as unknown[]).includes(subject)) {
      throw new Error(
        `Cannot push subject '${subject.name}' not belonging to the current level of the path`
      );
    }

    return new TaxonomyPath([...this.levels, subject]);
  }

  revertTo(levelInPath: TaxonomyLevel): TaxonomyPath {
    const requestedLevelIndex = this.findLevelIndex(levelInPath);

    const levelsUpToAndIncludingRequestedOne = this.levels.slice(
      0,
      requestedLevelIndex + 1
    );

    return new TaxonomyPath(levelsUpToAndIncludingRequestedOne);
  }

  private findLevelIndex(level: TaxonomyLevel): number {
    const levelIndex = this.levels.indexOf(level);

    if (levelIndex < 0) {
      throw new Error(
        `Cannot find level '${level.name}' not belonging to the path`
      );
    }

    return levelIndex;
  }

  toMeaningful(): TaxonomyPath {
    if (isMeaningful(this.currentLevel)) {
      return this;
    }

    return this.push(this.currentLevel.items[0] as Subject).toMeaningful();
  }

  navigateTaxonomy(taxonomy: Taxonomy): TaxonomyPath {
    const resultLevels: TaxonomyLevel[] = [taxonomy];

    let currentNewLevel: TaxonomyLevel = taxonomy;

    for (const oldSubjectLevel of this.levels.slice(1)) {
      if (!currentNewLevel.containsSubjects) {
        break;
      }

      const matchingNewSubject = (currentNewLevel.items as Subject[]).find(
        newSubject => newSubject.name == oldSubjectLevel.name
      );

      if (!matchingNewSubject) {
        break;
      }

      resultLevels.push(matchingNewSubject);
      currentNewLevel = matchingNewSubject;
    }

    return new TaxonomyPath(resultLevels);
  }
}
