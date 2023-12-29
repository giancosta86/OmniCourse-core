import { RawTaxonomy } from "@/raw";

export namespace TestRawTaxonomy {
  export const instance: RawTaxonomy = {
    name: "Test taxonomy",

    rootSubjects: {
      Alpha: {
        Beta: [
          { title: "Yogi", minutes: 90 },
          { title: "Bubu", minutes: 92 }
        ],
        Gamma: [{ title: "Cip", minutes: 95 }]
      },

      Delta: [{ title: "Alpha", minutes: 98 }]
    }
  };

  export function customize(customizations: Partial<RawTaxonomy>): RawTaxonomy {
    return {
      ...instance,
      ...customizations
    };
  }

  export function createCopy(): RawTaxonomy {
    return { ...instance };
  }
}
