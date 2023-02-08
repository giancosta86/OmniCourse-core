import { Subject, Taxonomy } from "@/core";
import { Test } from "./settings";

export namespace TestTaxonomy {
  export function create(name: string, subjects: Iterable<Subject>): Taxonomy {
    return Taxonomy.create(Test.locale, name, subjects);
  }
}
