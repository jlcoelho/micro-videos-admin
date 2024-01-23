import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { prisma as PrismaClient } from "../../../../shared/infra/db/prisma/prisma";

import { CategoryModelMapper } from "./category-model-mapper";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";

export class CategoryPrismaRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private prisma: typeof PrismaClient) {}

  async insert(entity: Category): Promise<void> {
    const data = CategoryModelMapper.toModel(entity);
    await this.prisma.category.create({ data });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map(entity => CategoryModelMapper.toModel(entity));
    await this.prisma.category.createMany({ data: models });
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const model = await this._get(id);
    
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const categoryModel = CategoryModelMapper.toModel(entity);

    await this.prisma.category.update({
      data: categoryModel,
      where: { category_id: id }
    });
  }
  async delete(category_id: Uuid): Promise<void> {
    const id = category_id.id
    const model = await this._get(id);
    
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.prisma.category.delete({
      where: {
        category_id: id
      }
    })
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);

    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  private async _get(id: string) {
    return await this.prisma.category.findFirst({ where: { category_id: id } });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.prisma.category.findMany();

    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: SearchParams<string>): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const [count, models] = await this.prisma.$transaction([
      this.prisma.category.count({ 
        ...(props.filter) && {
          where: {
            name: { contains: props.filter, mode: 'insensitive'}
          },
        },
      }),
      this.prisma.category.findMany({
        ...(props.filter) && {
          where: {
            name: { contains: props.filter, mode: 'insensitive'}
          },
        },
        orderBy: props.sort && this.sortableFields.includes(props.sort)
        ? {[props.sort]: props.sort_dir}
        : {'created_at': 'desc'},
        skip: offset,
        take: limit
      })
    ])

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      current_page: props.page,
      per_page: props.per_page,
      total: count
    });
  }
}
