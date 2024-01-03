import { InvalidUuidError, Uuid } from "../uuid.vo"
import { validate as uuidValidate } from "uuid";

const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

describe("UUid Unit Tests", () => {
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a valid uuid", () => {
    const uuid = new Uuid();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const uuid = new Uuid('d328d6b2-7b3e-4486-b86f-6d86cc83d234');
    expect(uuid.id).toBe('d328d6b2-7b3e-4486-b86f-6d86cc83d234');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })
})