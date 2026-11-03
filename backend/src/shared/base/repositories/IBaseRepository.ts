export interface IBaseRepository<
  T,
  TCreate = T,
  TUpdate = Partial<T>,
> {
  create(data: TCreate): Promise<T>;

  findById(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;

  update(id: string, data: TUpdate): Promise<T>;

  delete(id: string): Promise<void>;
}