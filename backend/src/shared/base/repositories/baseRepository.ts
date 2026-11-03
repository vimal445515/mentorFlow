import type { IBaseRepository } from "./IBaseRepository.ts";

export abstract class BaseRepository<
    TEntity,
    TPrismaModel,
    TCreateInput,
    TUpdateInput
> implements IBaseRepository<TEntity, TEntity, Partial<TEntity>> {
    constructor(
        protected readonly model: any,
        protected readonly mapper: {
            toDb(entity: TEntity): TCreateInput;
            fromDb(data: TPrismaModel): TEntity;
            toUpdateDb(data: Partial<TEntity>): TUpdateInput;
        },
        private readonly idField = "id",
    ) {}

    async create(entity: TEntity): Promise<TEntity> {
        const result = await this.model.create({
            data: this.mapper.toDb(entity),
        });

        return this.mapper.fromDb(result);
    }

    async findById(id: string): Promise<TEntity | null> {
        const result = await this.model.findUnique({
            where: { [this.idField]: id },
        });

        return result ? this.mapper.fromDb(result) : null;
    }

    async findAll(): Promise<TEntity[]> {
        const results = await this.model.findMany();

        return results.map((item: TPrismaModel) =>
            this.mapper.fromDb(item)
        );
    }

    async update(
        id: string,
        data: Partial<TEntity>
    ): Promise<TEntity> {
        const result = await this.model.update({
            where: { [this.idField]: id },
            data: this.mapper.toUpdateDb(data),
        });

        return this.mapper.fromDb(result);
    }

    async delete(id: string): Promise<void> {
        await this.model.delete({
            where: { [this.idField]: id },
        });
    }
}