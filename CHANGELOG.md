# Version 2

- The project uses [Rimbu](https://rimbu.org/) collections instead of the vanilla ones

## core

- All the domain objects (`Work`, `Subject`, `Taxonomy`) now have a private constructor and a static `create()` method - and a subtler `fromJson()` method

- The `WorkComp` and `SubjectComp` namespaces with factory functions replace plain comparator functions

- `totalMinutes` renamed to `minutes` in both `Work` and `Subject`

### Work

- The sorting algorithm has changed - and it is described by `WorkComp`

- `key` no more exists: two `Work` instances are deemed equal if and only if the related sorting algorithm returns 0

- `url` and `certificateUrl` are now of type `URL` instead of plain `string`

### Subject

- `containsSubjects` renamed to `hasSubjects`

### TaxonomyLevel

- Collections of `Work` and `Subject` must be _non-empty collections_

- `isMeaningful()` belongs to the `TaxonomyLevel` namespace

- `Subject`s having the same name are considered duplicate and no more allowed

### TaxonomyPath

- `subjectsInPreviousLevels` renamed to `topSubjectsInPreviousLevels`

## raw

- `TaxonomyRepository` and its implementing classes no more exist - they are replaced by the concept of `RawTaxonomyFetcher`

- The `TaxonomyKey` struct no more exists

- `RawTaxonomy` and `RawSubject` can only have `string` keys - that is, **subject names must be strings**

- `RawTaxonomy` also includes a `Locale`

- `toTaxonomy()` has been renamed to `RawTaxonomy.reify()`,

- JSON serialization now supported via `WorkJson.from()`, `SubjectJson.from()` and `TaxonomyJson.from()`, as well as by the `fromJson()` static constructors
