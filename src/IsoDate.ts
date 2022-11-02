import { ValueObject } from "immutable";

export class IsoDate implements ValueObject {
  readonly unboxed: Date;

  constructor(source: string) {
    const [year, month, day] = source.split("-").map(Number);

    try {
      if (!year || !month || !day) {
        throw new Error();
      }

      this.unboxed = new Date(year, month - 1, day);

      if (
        this.unboxed.getFullYear() != year ||
        this.unboxed.getMonth() != month - 1 ||
        this.unboxed.getDate() != day
      ) {
        throw new Error();
      }
    } catch {
      throw new Error(`Invalid date string: '${source}'`);
    }
  }

  equals(other: unknown): boolean {
    if (!(other instanceof IsoDate)) {
      return false;
    }

    return this.unboxed.getTime() == other.unboxed.getTime();
  }

  hashCode(): number {
    return this.unboxed.getFullYear();
  }

  toString(): string {
    const year = this.unboxed.getFullYear();
    const month = this.unboxed.getMonth() + 1;
    const day = this.unboxed.getDate();

    return `${year}-${month}-${day}`;
  }
}
