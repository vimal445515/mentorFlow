import { Container } from "inversify";
import { bindAuth } from "./bindings/auth.binder.ts";
import { bindCore } from "./bindings/core.bindings.ts";
import { bindProfile } from "./bindings/profile.binder.ts";
import { bindSkillsAndExperiences } from "./bindings/skillsAndExperiences.binder.ts";
import { bindUsers } from "./bindings/user.binder.ts";
import { bindAuditLogs } from "./bindings/auditLog.binder.ts";

const container = new Container();
bindCore(container);

export const auditLogModule = bindAuditLogs();
export const authModule = bindAuth(container, auditLogModule.writeAuditLogUseCase);
export const profileModule = bindProfile(container, auditLogModule.writeAuditLogUseCase);
export const skillsAndExperiencesModule = bindSkillsAndExperiences(container);
export const userModule = bindUsers(auditLogModule.writeAuditLogUseCase);

export default container;
