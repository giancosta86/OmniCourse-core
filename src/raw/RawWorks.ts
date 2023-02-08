import { Stream } from "@rimbu/stream";
import { Work } from "@/core";
import { RawWork } from "./RawWork";

export type RawWorks = Iterable<RawWork>;

export namespace RawWorks {
  export function reify(rawWorks: Iterable<RawWork>): Stream<Work> {
    return Stream.from(rawWorks).map(RawWork.reify);
  }
}
