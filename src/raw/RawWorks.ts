import { List } from "@rimbu/list";
import { Stream } from "@rimbu/stream";
import { LocaleLike } from "@giancosta86/hermes";
import { Work, Works } from "@/core";
import { RawWork } from "./RawWork";

export type RawWorks = Iterable<RawWork>;

export namespace RawWorks {
  export function reify(locale: LocaleLike, rawWorks: RawWorks): List<Work> {
    const reifiedIterable = Stream.from(rawWorks).map(RawWork.reify);
    return Works.createSortedList(locale, reifiedIterable);
  }
}
