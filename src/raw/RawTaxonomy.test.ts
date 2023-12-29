import { Dictionary } from "@giancosta86/hermes";
import { ExpressiveUrl } from "@giancosta86/swan-lake";
import { IsoDate } from "@giancosta86/time-utils";
import { Taxonomy, Subject, Work } from "@/core";
import { Test, TestRawTaxonomy } from "@/test";
import { RawTaxonomy } from "./RawTaxonomy";
import { RawSubjects } from "./RawSubjects";

describe("Raw taxonomy", () => {
  describe("localization", () => {
    describe("when the translation map is empty", () => {
      it("should translate nothing", () => {
        const source = TestRawTaxonomy.instance;

        const localized = RawTaxonomy.localize(new Dictionary(), source);

        expect(localized).toEqual(source);
      });
    });

    describe("when the translation map contains just one non-matching entry", () => {
      it("should translate nothing", () => {
        const source = TestRawTaxonomy.instance;

        const localized = RawTaxonomy.localize(
          Dictionary.fromRawTranslations({
            "<INEXISTING>": "Some translation"
          }),
          source
        );

        expect(localized).toEqual(source);
      });
    });

    describe("when the translation map contains matching entries", () => {
      it("should translate taxonomy name and subject names", () => {
        const source = TestRawTaxonomy.instance;

        const dictionary = Dictionary.fromRawTranslations({
          [source.name]: "Localized taxonomy name",
          Alpha: "Ro",
          Beta: "Sigma",
          Delta: "Omicron",
          Yogi: "Crocus"
        });

        const localized = RawTaxonomy.localize(dictionary, source);

        expect(localized).toEqual({
          name: "Localized taxonomy name",
          rootSubjects: {
            Ro: {
              Sigma: [Work.create("Yogi", 90), Work.create("Bubu", 92)],
              Gamma: [Work.create("Cip", 95)]
            },

            Omicron: [Work.create("Alpha", 98)]
          }
        });
      });
    });
  });

  describe("reification", () => {
    describe("of a minimalist taxonomy", () => {
      describe("in the most basic scenario", () => {
        it("should work", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
                "First subject": [
                  {
                    title: "Basic work",
                    minutes: 90
                  }
                ]
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [Work.create("Basic work", 90)])
            ])
          );
        });
      });

      describe("when numbers are written as string literals", () => {
        it("should parse them anyway", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
                "First subject": [
                  {
                    title: "Basic work",
                    minutes: "90"
                  }
                ]
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [Work.create("Basic work", 90)])
            ])
          );
        });
      });

      describe.each([
        {
          decimalPartToZeroFive: "<",
          originalMinutes: 90.2,
          expectedMinutes: 90,
          expectedRounding: "floor"
        },
        {
          decimalPartToZeroFive: ">",
          originalMinutes: 94.9,
          expectedMinutes: 95,
          expectedRounding: "ceiling"
        },
        {
          decimalPartToZeroFive: "==",
          originalMinutes: 30.5,
          expectedMinutes: 31,
          expectedRounding: "ceiling"
        }
      ])(
        "when minutes have decimal part $decimalPartToZeroFive 0.5",
        ({ originalMinutes, expectedMinutes, expectedRounding }) => {
          it(`should round to ${expectedRounding}`, () => {
            const taxonomy = RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Basic work",
                      minutes: originalMinutes
                    }
                  ]
                }
              })
            );

            expect(taxonomy).toEqual(
              Taxonomy.create(TestRawTaxonomy.instance.name, [
                Subject.create("First subject", [
                  Work.create("Basic work", expectedMinutes)
                ])
              ])
            );
          });
        }
      );

      describe("when a work has all the fields", () => {
        it("should work", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
                "First subject": [
                  {
                    title: "Full work",
                    minutes: 90,
                    kind: "Book",
                    completionDate: "2019-03-18",
                    url: "https://gianlucacosta.info/",
                    certificateUrl: "https://gianlucacosta.info/certificate"
                  }
                ]
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [
                Work.create("Full work", 90, {
                  kind: "Book",
                  completionDate: new IsoDate("2019-03-18"),
                  url: ExpressiveUrl.create("https://gianlucacosta.info/"),
                  certificateUrl: ExpressiveUrl.create(
                    "https://gianlucacosta.info/certificate"
                  )
                })
              ])
            ])
          );
        });
      });

      describe("when a work has all the fields plus the 'portal' field from v1", () => {
        it("should still be parsed", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
                "First subject": [
                  {
                    title: "Extra work",
                    minutes: 90,
                    kind: "Book",
                    portal: "MY PORTAL",
                    completionDate: "2019-03-18",
                    url: "https://gianlucacosta.info/",
                    certificateUrl: "https://gianlucacosta.info/certificate"
                  } as any
                ]
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [
                Work.create("Extra work", 90, {
                  kind: "Book",
                  completionDate: new IsoDate("2019-03-18"),
                  url: ExpressiveUrl.create("https://gianlucacosta.info/"),
                  certificateUrl: ExpressiveUrl.create(
                    "https://gianlucacosta.info/certificate"
                  )
                })
              ])
            ])
          );
        });
      });

      describe("when a subject name is empty", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "": [
                    {
                      title: "Basic work",
                      minutes: 90
                    }
                  ]
                }
              })
            );
          }).toThrow("Empty subject name");
        });
      });

      describe("when a work title is missing", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      minutes: 90
                    }
                  ]
                }
              })
            );
          }).toThrow('Missing work title: {"minutes":90}');
        });
      });

      describe("when work minutes are missing", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Basic work"
                    }
                  ]
                }
              })
            );
          }).toThrow("Missing 'minutes' field in work 'Basic work'");
        });
      });

      describe("when the work minutes are not a parsable number", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Basic work",
                      minutes: "NOT_A_NUMBER"
                    }
                  ]
                }
              })
            );
          }).toThrow("'minutes' field in work 'Basic work' is not a number");
        });
      });

      describe("when the work completion date is impossible", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Basic work",
                      minutes: 90,
                      completionDate: "2006-02-31"
                    }
                  ]
                }
              })
            );
          }).toThrow("Invalid date string: '2006-02-31'");
        });
      });

      describe("when the work completion date has a wrong format", () => {
        it("should throw", () => {
          expect(() => {
            RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Basic work",
                      minutes: 90,
                      completionDate: "NOT A DATE"
                    }
                  ]
                }
              })
            );
          }).toThrow("Invalid date string: 'NOT A DATE'");
        });
      });
    });

    describe("of a more sophisticated taxonomy", () => {
      describe("with two first-level subjects and some works", () => {
        it("should work", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
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
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("Second subject", [
                Work.create("Beta", 90),
                Work.create("Alpha", 5)
              ]),

              Subject.create("First subject", [Work.create("Gamma", 37)])
            ])
          );
        });
      });

      describe("with nested subjects and some works", () => {
        it("should work", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
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
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("Another first-level subject", [
                Work.create("Epsilon", 202)
              ]),

              Subject.create("First-level subject", [
                Subject.create("Another second-level subject", [
                  Work.create("Delta", 89)
                ]),
                Subject.create("Second-level subject", [
                  Subject.create("Third-level subject", [
                    Work.create("Alpha", 24),
                    Work.create("Beta", 6)
                  ]),

                  Subject.create("Another third-level subject", [
                    Work.create("Gamma", 8)
                  ])
                ])
              ])
            ])
          );
        });
      });

      describe("with two sibling subjects having the same name", () => {
        it("should allow it, because the second field overrides the first one", () => {
          const rootSubjects = JSON.parse(`{
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
          }`) as RawSubjects;

          const rawTaxonomy = TestRawTaxonomy.customize({ rootSubjects });

          const taxonomy = RawTaxonomy.reify(Test.locale, rawTaxonomy);
          expect(taxonomy.minutes).toBe(7);
        });
      });
    });

    describe("of a taxonomy with sibling works having equal title", () => {
      describe("when neither has completion date", () => {
        describe("when the duration is different", () => {
          it("should throw", () => {
            expect(() => {
              RawTaxonomy.reify(
                Test.locale,
                TestRawTaxonomy.customize({
                  rootSubjects: {
                    "First subject": [
                      {
                        title: "Alpha",
                        minutes: 90
                      },

                      {
                        title: "Alpha",
                        minutes: 35
                      }
                    ]
                  }
                })
              );
            }).toThrow("Duplicate work: 'Alpha'");
          });
        });

        describe("when both have the same duration", () => {
          it("should throw", () => {
            expect(() =>
              RawTaxonomy.reify(
                Test.locale,
                TestRawTaxonomy.customize({
                  rootSubjects: {
                    "First subject": [
                      {
                        title: "Alpha",
                        minutes: 90
                      },

                      {
                        title: "Alpha",
                        minutes: 90
                      }
                    ]
                  }
                })
              )
            ).toThrow("Duplicate work: 'Alpha'");
          });
        });
      });

      describe("when only one work has completion date", () => {
        it("should let both works coexist", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
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
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [
                Work.create("Alpha", 90),
                Work.create("Alpha", 90, {
                  completionDate: new IsoDate("2019-04-29")
                })
              ])
            ])
          );
        });
      });

      describe("when they have different completion dates", () => {
        it("should let both works coexist", () => {
          const taxonomy = RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              rootSubjects: {
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
              }
            })
          );

          expect(taxonomy).toEqual(
            Taxonomy.create(TestRawTaxonomy.instance.name, [
              Subject.create("First subject", [
                Work.create("Alpha", 90, {
                  completionDate: new IsoDate("2021-08-12")
                }),
                Work.create("Alpha", 90, {
                  completionDate: new IsoDate("2019-04-29")
                })
              ])
            ])
          );
        });
      });

      describe("when they also have equal completion dates", () => {
        describe("when they have different durations", () => {
          it("should let both works coexist", () => {
            const taxonomy = RawTaxonomy.reify(
              Test.locale,
              TestRawTaxonomy.customize({
                rootSubjects: {
                  "First subject": [
                    {
                      title: "Alpha",
                      minutes: 90,
                      completionDate: "2019-04-29"
                    },

                    {
                      title: "Alpha",
                      minutes: 37,
                      completionDate: "2019-04-29"
                    }
                  ]
                }
              })
            );

            expect(taxonomy).toEqual(
              Taxonomy.create(TestRawTaxonomy.instance.name, [
                Subject.create("First subject", [
                  Work.create("Alpha", 90, {
                    completionDate: new IsoDate("2019-04-29")
                  }),
                  Work.create("Alpha", 37, {
                    completionDate: new IsoDate("2019-04-29")
                  })
                ])
              ])
            );
          });
        });

        describe("when both works also have the same duration", () => {
          it("should throw", () => {
            expect(() => {
              RawTaxonomy.reify(
                Test.locale,
                TestRawTaxonomy.customize({
                  rootSubjects: {
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
                  }
                })
              );
            }).toThrow("Duplicate work: 'Alpha'");
          });
        });
      });
    });

    describe("of a taxonomy also having empty subjects", () => {
      it("should keep just the non-empty subjects", () => {
        const taxonomy = RawTaxonomy.reify(
          Test.locale,
          TestRawTaxonomy.customize({
            rootSubjects: {
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
            }
          })
        );

        expect(taxonomy).toEqual(
          Taxonomy.create(TestRawTaxonomy.instance.name, [
            Subject.create("First subject", [
              Subject.create("Second subject", [
                Subject.create("Third subject", [
                  Work.create("Beta", 90),
                  Work.create("Alpha", 45)
                ]),
                Subject.create("Core subject", [Work.create("Tau", 87)])
              ])
            ])
          ])
        );
      });
    });

    describe("of a taxonomy with no works", () => {
      it("should throw", () => {
        expect(() => {
          RawTaxonomy.reify(
            Test.locale,
            TestRawTaxonomy.customize({
              name: "Blank taxonomy",
              rootSubjects: {
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
              }
            })
          );
        }).toThrow("No subjects for taxonomy 'Blank taxonomy'");
      });
    });
  });
});
