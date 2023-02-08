import { Subject, Work } from "@/core";
import { Test } from "./settings";

export namespace TestSubject {
  export function create(
    name: string,
    items: Iterable<Subject> | Iterable<Work>
  ): Subject {
    return Subject.create(Test.locale, name, items);
  }
}
