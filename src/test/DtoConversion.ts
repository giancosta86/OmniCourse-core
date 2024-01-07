export type ModelClass<TModel, TDto> = {
  fromValidDto(dto: TDto): TModel;
};

export type DtoNamespace<TModel, TDto> = {
  from(model: TModel): TDto;
};

export namespace DtoConversion {
  export function testRoundTrip<TModel, TDto>(
    modelClass: ModelClass<TModel, TDto>,
    dtoNamespace: DtoNamespace<TModel, TDto>,
    modelFactory: () => TModel
  ) {
    describe("conversion to dto and back", () => {
      it("should return an equal model instance", () => {
        const sourceModel = modelFactory();

        const dto = dtoNamespace.from(sourceModel);

        const restoredModel = modelClass.fromValidDto(dto);

        expect(restoredModel).toEqual(sourceModel);
      });
    });
  }
}
