import { Equality } from "@giancosta86/more-jest";
import { Work, Subject, Taxonomy } from "@/core";

Equality.addTesterFor(Work);
Equality.addTesterFor(Subject);
Equality.addTesterFor(Taxonomy);
