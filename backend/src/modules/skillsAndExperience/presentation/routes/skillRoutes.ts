import { Router } from "express";
import  {addSkillSchema} from "../validators/createSkill.validator.ts"
import { SkillController } from "../controller/skillsController.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { updateSkillSchema } from "../validators/updateSkill.validator.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
export function createMentorSkillRoutes(
    mentorSkillController:SkillController,
){
    const router = Router();

    router.post('/',authMiddleware,validate(addSkillSchema),asyncHandler(mentorSkillController.createSkill.bind(mentorSkillController)))
    router.patch('/',authMiddleware,validate(updateSkillSchema),asyncHandler(mentorSkillController.updateSkill.bind(mentorSkillController)));
    router.get('/',authMiddleware,asyncHandler(mentorSkillController.getAllSkills.bind(mentorSkillController)));
    router.delete('/:skillId',authMiddleware,asyncHandler(mentorSkillController.deleteSkill.bind(mentorSkillController)));

    return router;
}