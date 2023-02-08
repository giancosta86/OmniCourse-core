import { Stream } from "@rimbu/stream";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { Subject } from "@/core";
import { RawSubjectItems, RawSubject } from "./RawSubject";

export type RawSubjects = Readonly<{
  [subjectName: string]: RawSubjectItems;
}>;

export namespace RawSubjects {
  export function localize(
    dictionary: Dictionary,
    rawSubjects: RawSubjects
  ): RawSubjects {
    const localizedEntries = Object.entries(rawSubjects).map(rawSubject =>
      RawSubject.localize(dictionary, rawSubject)
    );

    return Object.fromEntries(localizedEntries);
  }

  export function reify(
    locale: LocaleLike,
    rawSubjects: RawSubjects
  ): Iterable<Subject> {
    return Stream.from(Object.entries(rawSubjects)).flatMap(rawSubject => {
      const subject = RawSubject.reify(locale, rawSubject);
      return subject ? [subject] : [];
    });
  }
}
