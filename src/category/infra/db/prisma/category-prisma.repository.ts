import { Entity } from "../../../../shared/domain/entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { prisma as PrismaClient } from "../../../../shared/infra/db/prisma/prisma";
import { NotFoundEntityError } from "../../../../shared/domain/errors/not-found-entity.error";

export class CategoryPrismaRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private prisma: typeof PrismaClient) {}

  async insert(entity: Category): Promise<void> {
    await this.prisma.category.create({
      data: {
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at
      }
    })
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.prisma.category.createMany({
      data: entities.map(entity => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at
      })),
    });
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const model = await this._get(id);
    
    if (!model) {
      throw new NotFoundEntityError(id, this.getEntity());
    }

    await this.prisma.category.update({
      data: {
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at
      },
      where: { category_id: id }
    });
  }
  async delete(category_id: Uuid): Promise<void> {
    const id = category_id.id
    const model = await this._get(id);
    
    if (!model) {
      throw new NotFoundEntityError(id, this.getEntity());
    }

    await this.prisma.category.delete({
      where: {
        category_id: id
      }
    })
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);

    if (!model) return null;

    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at
    });
  }

  private async _get(id: string) {
    return await this.prisma.category.findFirst({ where: { category_id: id } });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.prisma.category.findMany();
    return models.map((model) => {
      return new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at
      });
    });
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: SearchParams<string>): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    
    const [count, models] = await this.prisma.$transaction([
      this.prisma.category.count(),
      this.prisma.category.findMany({
        ...(props.filter && {
          where: {
            name: { contains: props.filter }
          }
        }),
        orderBy: props.sort && this.sortableFields.includes(props.sort)
          ? { [props.sort]: props.sort_dir }
          : { created_at: 'desc' },
        skip: offset,
        take: limit
      })
    ]);
    return new CategorySearchResult({
      items: models.map((model) => {
        return new Category({
          category_id: new Uuid(model.category_id),
          name: model.name,
          description: model.description,
          is_active: model.is_active,
          created_at: model.created_at
        });
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count
    });
  }
}