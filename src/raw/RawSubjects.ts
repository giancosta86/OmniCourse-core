import { List } from "@rimbu/list";
import { Stream } from "@rimbu/stream";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { Subject, Subjects } from "@/core";
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
  ): List<Subject> {
    const reifiedIterable = Stream.from(Object.entries(rawSubjects)).flatMap(
      rawSubject => {
        const subject = RawSubject.reify(locale, rawSubject);
        return subject ? [subject] : [];
      }
    );

    return Subjects.createSortedList(locale, reifiedIterable);
  }
}
