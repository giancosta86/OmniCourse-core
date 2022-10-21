export type TaxonomyKey = Readonly<{ id: string; name: string }>;

export function validateTaxonomyKeys(taxonomyKeys: readonly TaxonomyKey[]) {
  if (!taxonomyKeys.length) {
    throw new Error("Empty taxonomy key array!");
  }

  validateFieldInTaxonomyKeys(taxonomyKeys, "id");
  validateFieldInTaxonomyKeys(taxonomyKeys, "name");
}

function validateFieldInTaxonomyKeys(
  taxonomyKeys: readonly TaxonomyKey[],
  fieldName: keyof TaxonomyKey
) {
  const uniqueValues = new Set<string>();

  taxonomyKeys.forEach(taxonomyKey => {
    const fieldValue = taxonomyKey[fieldName];

    if (fieldValue == null || fieldValue === "") {
      throw new Error(
        `Taxonomy key with empty/missing ${fieldName}: ${JSON.stringify(
          taxonomyKey
        )}`
      );
    }

    if (typeof fieldValue != "string") {
      throw new Error(
        `Taxonomy key ${fieldName} '${fieldValue}' is not a string`
      );
    }

    if (uniqueValues.has(fieldValue)) {
      throw new Error(`Duplicate taxonomy key ${fieldName}: '${fieldValue}'`);
    }
    uniqueValues.add(fieldValue);
  });
}
