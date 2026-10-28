export interface IAddSkillUseCase<Dto> {
    execute(data:Dto):Promise<{message:string}>

}