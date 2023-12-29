import { Iterable } from "@giancosta86/stream-utils";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { Subject } from "@/core";
import { RawWorks } from "./RawWorks";
import { RawSubjects } from "./RawSubjects";

export type RawSubject = [name: string, items: RawSubjectItems];

export type RawSubjectItems = RawSubjects | RawWorks;

export namespace RawSubject {
  export function translate(
    dictionary: Dictionary,
    [name, items]: RawSubject
  ): RawSubject {
    const translatedName = dictionary.translate(name);

    const translatedItems = Iterable.isSupported(items)
      ? (items as RawWorks)
      : RawSubjects.translate(dictionary, items as RawSubjects);

    return [translatedName, translatedItems];
  }

  export function reify(
    locale: LocaleLike,
    [name, items]: RawSubject
  ): Subject | null {
    const reifiedItems = Iterable.isSupported(items)
      ? RawWorks.reify(locale, items as RawWorks)
      : RawSubjects.reify(locale, items as RawSubjects);

    if (Iterable.isEmpty(reifiedItems)) {
      return null;
    }

    return Subject.create(name, reifiedItems);
  }
}
