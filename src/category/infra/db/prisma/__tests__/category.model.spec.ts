import { PrismaClient } from '@prisma/client';
import { generateDatabaseURL } from '../../../../../shared/infra/testing/prisma-integration.helpers';
import { exec } from 'node:child_process';
import util from 'node:util';
import { Category } from '../../../../domain/category.entity';

const execSync = util.promisify(exec);


const prismaBinary = './node_modules/.bin/prisma';

describe("CategoryModel Integration Tests", () => {
  let prisma: PrismaClient;
  const { schemaId, url } = generateDatabaseURL();

  beforeEach(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url } }
    });

    await execSync(`${prismaBinary} db push`, {
      env: {
        ...process.env,
        DATABASE_URL: url,
      },
    });
    
  });
  afterEach(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
    await prisma.$disconnect();
  });

  test("should create a category", async () => {
    const category = Category.fake().aCategory().build();
    
    await prisma.category.create({
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
    const attributesMap = prisma.category.fields;
    const attributes = Object.keys(prisma.category.fields);

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
    const category = await prisma.category.create({ data: arrange });


    //assert
    expect(category.category_id).toBe(arrange.category_id);
    expect(category.name).toBe(arrange.name);
    expect(category.created_at).toStrictEqual(arrange.created_at);
  });
});


