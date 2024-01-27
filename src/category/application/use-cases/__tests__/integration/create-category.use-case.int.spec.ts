import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupPrisma } from "../../../../../shared/infra/testing/helpers";
import { CategoryPrismaRepository } from "../../../../infra/db/prisma/category-prisma.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

jest.setTimeout(50000);

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryPrismaRepository;

  const prismaInstance = setupPrisma();

  beforeEach(() => {
    repository = new CategoryPrismaRepository(prismaInstance.prisma);
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: true,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: 'some description',
      is_active: false,
      created_at: entity!.created_at,
    });
  });
});