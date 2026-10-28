export interface IUpdateSkillUseCase<UpdateDto>{
    execute(data:UpdateDto):Promise<{message:string}>
}