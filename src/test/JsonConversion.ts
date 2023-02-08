export type ModelClass<TModel, TJson> = {
  fromJson(json: TJson): TModel;
};

export type JsonNamespace<TModel, TJson> = {
  from(model: TModel): TJson;
};

export namespace JsonConversion {
  export function testRoundTrip<TModel, TJson>(
    modelClass: ModelClass<TModel, TJson>,
    jsonNamespace: JsonNamespace<TModel, TJson>,
    modelFactory: () => TModel
  ) {
    describe("conversion to JSON and back", () => {
      it("should return an equal model instance", () => {
        const sourceModel = modelFactory();

        const json = jsonNamespace.from(sourceModel);

        const restoredModel = modelClass.fromJson(json);

        expect(restoredModel).toEqual(sourceModel);
      });
    });
  }
}
