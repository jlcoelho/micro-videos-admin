import { FieldsErrors } from "./src/shared/domain/validators/validator-fields-interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      // constainsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>,
      ) => R;
    }
  }
}