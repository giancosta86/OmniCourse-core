import { IsoDate } from "../IsoDate";
import { Taxonomy } from "../Taxonomy";
import { Subject } from "../Subject";
import { Work } from "../Work";
import { RawTaxonomy, toTaxonomy } from "./raw";

describe("Converting a raw taxonomy", () => {
  describe("should work and apply sorting algorithms", () => {
    it("with a basic taxonomy", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90
          }
        ]
      };

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [new Work("Basic work", 90)])
        ])
      );
    });

    it("with a basic taxonomy where numbers are written as string literals", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: "90"
          }
        ]
      };

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy as RawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [new Work("Basic work", 90)])
        ])
      );
    });

    it("with a basic taxonomy, applying rounding to floor", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90.2
          }
        ]
      };

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [new Work("Basic work", 90)])
        ])
      );
    });

    it("with a basic taxonomy, applying rounding to ceil", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 94.9
          }
        ]
      };

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [new Work("Basic work", 95)])
        ])
      );
    });

    it("with a basic taxonomy having a work with all the fields", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90,
            kind: "Book",
            completionDate: "2019-03-18",
            url: "https://gianlucacosta.info/",
            certificateUrl: "https://gianlucacosta.info/certificate"
          }
        ]
      };

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [
            new Work("Basic work", 90, {
              kind: "Book",
              completionDate: new IsoDate("2019-03-18"),
              url: "https://gianlucacosta.info/",
              certificateUrl: "https://gianlucacosta.info/certificate"
            })
          ])
        ])
      );
    });

    it("with a basic taxonomy having a work with all the fields and the portal field from v1", () => {
      const hybridTaxonomy: unknown = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90,
            kind: "Book",
            portal: "MY PORTAL",
            completionDate: "2019-03-18",
            url: "https://gianlucacosta.info/",
            certificateUrl: "https://gianlucacosta.info/certificate"
          }
        ]
      };

      const taxonomy = toTaxonomy(
        "Basic taxonomy",
        hybridTaxonomy as RawTaxonomy
      );

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [
            new Work("Basic work", 90, {
              kind: "Book",
              completionDate: new IsoDate("2019-03-18"),
              url: "https://gianlucacosta.info/",
              certificateUrl: "https://gianlucacosta.info/certificate"
            })
          ])
        ])
      );
    });

    it("with a taxonomy having two first-level subjects and some works", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Gamma",
            minutes: 37
          }
        ],

        "Second subject": [
          {
            title: "Alpha",
            minutes: 5
          },

          {
            title: "Beta",
            minutes: 90
          }
        ]
      };

      const taxonomy = toTaxonomy("Elementary taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Elementary taxonomy", [
          new Subject("Second subject", [
            new Work("Beta", 90),
            new Work("Alpha", 5)
          ]),

          new Subject("First subject", [new Work("Gamma", 37)])
        ])
      );
    });

    it("with a taxonomy having nested subjects and some works", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First-level subject": {
          "Second-level subject": {
            "Third-level subject": [
              {
                title: "Alpha",
                minutes: 24
              },

              {
                title: "Beta",
                minutes: 6
              }
            ],

            "Another third-level subject": [
              {
                title: "Gamma",
                minutes: 8
              }
            ]
          },

          "Another second-level subject": [
            {
              title: "Delta",
              minutes: 89
            }
          ]
        },

        "Another first-level subject": [
          {
            title: "Epsilon",
            minutes: 202
          }
        ]
      };

      const taxonomy = toTaxonomy("Taxonomy with nesting", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Taxonomy with nesting", [
          new Subject("Another first-level subject", [
            new Work("Epsilon", 202)
          ]),

          new Subject("First-level subject", [
            new Subject("Another second-level subject", [
              new Work("Delta", 89)
            ]),
            new Subject("Second-level subject", [
              new Subject("Third-level subject", [
                new Work("Alpha", 24),
                new Work("Beta", 6)
              ]),

              new Subject("Another third-level subject", [new Work("Gamma", 8)])
            ])
          ])
        ])
      );
    });

    it("with a taxonomy having empty, prunable subjects", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": {
          "Second subject": {
            "Third subject": [
              {
                title: "Alpha",
                minutes: 45
              },

              {
                title: "Beta",
                minutes: 90
              }
            ],

            "Fourth subject": {
              "Fifth subject": []
            },

            "Core subject": [
              {
                title: "Tau",
                minutes: 87
              }
            ]
          },

          "Another second-level-subject": {
            Again: {
              Furthermore: [],
              Nothing: []
            },

            Empty: []
          },

          "Another empty": []
        },

        "More empty": []
      };

      const taxonomy = toTaxonomy("Minified taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Minified taxonomy", [
          new Subject("First subject", [
            new Subject("Second subject", [
              new Subject("Third subject", [
                new Work("Beta", 90),
                new Work("Alpha", 45)
              ]),
              new Subject("Core subject", [new Work("Tau", 87)])
            ])
          ])
        ])
      );
    });

    it("when sibling subjects have the same name - because the last one is used", () => {
      const rawTaxonomy = JSON.parse(`{
        "First subject": [
          {
            "title": "Alpha",
            "minutes": 90
          }
        ],

        "First subject": [
          {
            "title": "Beta",
            "minutes": 7
          }
        ]
      }`) as RawTaxonomy;

      const taxonomy = toTaxonomy("Basic taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Basic taxonomy", [
          new Subject("First subject", [new Work("Beta", 7)])
        ])
      );
    });

    it("when two works have same title and duration, but only one has no completion date", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Alpha",
            minutes: 90,
            completionDate: "2019-04-29"
          },

          {
            title: "Alpha",
            minutes: 90
          }
        ]
      };

      const taxonomy = toTaxonomy("Test taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Test taxonomy", [
          new Subject("First subject", [
            new Work("Alpha", 90),
            new Work("Alpha", 90, { completionDate: new IsoDate("2019-04-29") })
          ])
        ])
      );
    });

    it("when two works have same title and duration, but different completion dates", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Alpha",
            minutes: 90,
            completionDate: "2019-04-29"
          },

          {
            title: "Alpha",
            minutes: 90,
            completionDate: "2021-08-12"
          }
        ]
      };

      const taxonomy = toTaxonomy("Test taxonomy", rawTaxonomy);

      expect(taxonomy).toEqual(
        new Taxonomy("Test taxonomy", [
          new Subject("First subject", [
            new Work("Alpha", 90, {
              completionDate: new IsoDate("2021-08-12")
            }),
            new Work("Alpha", 90, { completionDate: new IsoDate("2019-04-29") })
          ])
        ])
      );
    });
  });

  describe("should throw", () => {
    it("when a subject name is empty", () => {
      const rawTaxonomy: RawTaxonomy = {
        "": [
          {
            title: "Basic work",
            minutes: 90
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy);
      }).toThrow("Empty subject name");
    });

    it("when a work title is missing", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            minutes: 90
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy);
      }).toThrow('Missing work title: {"minutes":90}');
    });

    it("when work minutes are missing", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work"
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy);
      }).toThrow("Missing 'minutes' field in work 'Basic work'");
    });

    it("when work minutes are not a number", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: "NOT_A_NUMBER"
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy as RawTaxonomy);
      }).toThrow("'minutes' field in work 'Basic work' is not a number");
    });

    it("when a work completion date is impossible", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90,
            completionDate: "2006-02-31"
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy);
      }).toThrow("Invalid date string: '2006-02-31'");
    });

    it("when a work completion date is in the wrong format", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Basic work",
            minutes: 90,
            completionDate: "NOT A DATE"
          }
        ]
      };

      expect(() => {
        toTaxonomy("Test taxonomy", rawTaxonomy);
      }).toThrow("Invalid date string: 'NOT A DATE'");
    });

    it("when two sibling works have same title and no completion date, even if they have different duration", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Alpha",
            minutes: 90
          },

          {
            title: "Alpha",
            minutes: 32
          }
        ]
      };

      expect(() => {
        toTaxonomy("Basic taxonomy", rawTaxonomy);
      }).toThrow("Duplicate work: 'Alpha'");
    });

    it("when two sibling works have same title, completion date and duration", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First subject": [
          {
            title: "Alpha",
            minutes: 90,
            completionDate: "2019-04-29"
          },

          {
            title: "Alpha",
            minutes: 90,
            completionDate: "2019-04-29"
          }
        ]
      };

      expect(() => {
        toTaxonomy("Basic taxonomy", rawTaxonomy);
      }).toThrow("Duplicate work: 'Alpha'");
    });

    it("when parsing a blank taxonomy", () => {
      const rawTaxonomy: RawTaxonomy = {
        "First-level subject": {
          "Second-level subject": {
            "Third-level subject": [],
            "Another third-level subject": [],
            "Yet another third-level subject": []
          },

          "Again second-level subject": []
        },

        "Still first-level subject": {
          "Second-level subject, once more": [],
          "Second-level subject bis": {
            "Third-level subject": []
          }
        }
      };

      expect(() => {
        toTaxonomy("Blank taxonomy", rawTaxonomy);
      }).toThrow("Cannot create taxonomy 'Blank taxonomy' with no subjects");
    });
  });
});
