// export abstract class BaseRepository {
//    protected constructor(protected readonly dataSource: DataSource) {}

//    async save<E>(manager: EntityManager, entity: E): Promise<void> {
//       await manager.save<E>(entity);
//    }

//    async delete<E>(manager: EntityManager,
//       criteria: DeleteCriteria<E> | DeleteCriteria<E>[],
//       entityTarget: EntityTarget<E>
//    ): Promise<boolean> {
//       const _criteria: {[key: string]: any} = {}

//       if (Array.isArray(criteria)) {
//          criteria.forEach(c => {
//             _criteria[c.key as string] = c.value;
//          })
//       } else {
//          _criteria[criteria.key as string] = criteria.value;
//       }

//       const deletingResult = await manager.delete(entityTarget, _criteria)

//       return deletingResult.affected === 1
//    }  
// }

// export abstract class BaseForEditedFlowRepository<Entity, EditedEntity> extends BaseRepository {
//    protected constructor(protected readonly dataSource: DataSource) {
//       super(dataSource)
//    }

//    abstract getEntityById(manager: EntityManager, id: string): Promise<Entity | null>;

//    abstract getEditedEntityById(manager: EntityManager, id: string): Promise<EditedEntity | null>;
// }