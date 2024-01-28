import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { Category as CategoryPrisma } from '@prisma/client'

export class CategoryModelMapper {
    static toModel(entity: Category): CategoryPrisma {
        return {
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at
        };
    }

    static toEntity(model: CategoryPrisma): Category {
        const category =  new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at
        });
        category.validate();
        if (category.notification.hasErrors()) {
            throw new EntityValidationError(category.notification.toJSON());
        }
        return category;
    }
}