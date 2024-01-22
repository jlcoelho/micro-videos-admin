import { Category } from '../../../../domain/category.entity';
import { setupPrisma } from '../../../../../shared/infra/testing/helpers';

jest.setTimeout(50000)

describe("CategoryModel Integration Tests", () => {
  const prismaInstance  = setupPrisma();

  test("should create a category", async () => {
    const category = Category.fake().aCategory().build();
    
    await prismaInstance.prisma.category.create({
      data: {
        category_id: category.category_id.id, 
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at
      }
    });
  });

  test('mapping props', () => {
    const attributesMap = prismaInstance.prisma.category.fields;
    const attributes = Object.keys(prismaInstance.prisma.category.fields);

    expect(attributes).toStrictEqual([
      'category_id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);
    
    const categoryIdAttr = attributesMap.category_id;
    
    expect(categoryIdAttr).toMatchObject({
      modelName: 'Category',
      name: 'category_id',
      typeName: 'String',
      isList: false,
      isEnum: false
    });

    const nameAttr = attributesMap.name;

    expect(nameAttr).toMatchObject({
      modelName: 'Category',
      name: 'name',
      typeName: 'String',
      isList: false,
      isEnum: false
    });

    const descriptionAttr = attributesMap.description;

    expect(descriptionAttr).toMatchObject({
      modelName: 'Category',
      name: 'description',
      typeName: 'String',
      isList: false,
      isEnum: false
    });

    const isActiveAttr = attributesMap.is_active;

    expect(isActiveAttr).toMatchObject({
      modelName: 'Category',
      name: 'is_active',
      typeName: 'Boolean',
      isList: false,
      isEnum: false
    });

    const createdAtAttr = attributesMap.created_at;

    expect(createdAtAttr).toMatchObject({
      modelName: 'Category',
      name: 'created_at',
      typeName: 'DateTime',
      isList: false,
      isEnum: false
    });
  });

  test('create', async () => {
    //arrange
    const arrange = {
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      is_active: true,
      created_at: new Date(),
    };

    //act
    const category = await prismaInstance.prisma.category.create({ data: arrange });


    //assert
    expect(category.category_id).toBe(arrange.category_id);
    expect(category.name).toBe(arrange.name);
    expect(category.created_at).toStrictEqual(arrange.created_at);
  });
});


