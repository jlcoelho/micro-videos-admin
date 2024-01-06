import { Entity } from "../../../../domain/entity";
import { NotFoundEntityError } from "../../../../domain/errors/not-found-entity.error";
import { ValueObject } from "../../../../domain/value-object";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./../in-memory.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price
    }
  }

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

}

describe('InMemoryRepository Unit Tests', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
  });

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  it('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await repo.insert(entity);

    const entities = await repo.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it('should throws error on delete when entity not found', async () => {
    const uuid = new Uuid();
    expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundEntityError(uuid.id, StubEntity),
    );

    await expect(repo.delete(new Uuid('14814cd3-cd6f-4a64-baf6-23ff6349fcc2')),
    ).rejects.toThrow(
      new NotFoundEntityError('14814cd3-cd6f-4a64-baf6-23ff6349fcc2', StubEntity),
    );
  });

  it('should throws error on update when entity not found', async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundEntityError(entity.entity_id.id, StubEntity),
    );
  });

  it('should updates an entity', async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: "updated",
      price: 1
    });

    await repo.update(entityUpdated);
    
    expect(entityUpdated.toJSON()).toStrictEqual(repo.items[0].toJSON());
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 });
    await repo.insert(entity);

    await repo.delete(entity.entity_id);
    expect(repo.items).toHaveLength(0);
  })
})