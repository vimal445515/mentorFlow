export interface IGetSkillsUseCase<Skills>{
    execute(id:string):Promise<Skills[]>
}