import { useState, type FC } from "react";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar.tsx";
import { MentorSidebar } from "../../profile/components/MentorSidebar.tsx";
import { SkillsManager } from "../components/skillsManagement.tsx";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout.ts";
import { Modal } from "@/shared/components/modal.tsx";
import { AddSkillForm } from "../components/addSkills.tsx";
import { useSkills } from "../hooks/useSkills.ts";
import type { SkillFormValues } from "../types/skill.types.ts";

export const MentorSkillsPage: FC = () => {
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const handleLogoutClick = useMentorLogout();
  const {
    skills,
    isLoading,
    isSaving,
    deletingSkillId,
    addSkill,
    editSkill,
    removeSkill,
  } = useSkills();

  const handleAddSkillSubmit = async (values: SkillFormValues) => {
    if (await addSkill(values)) {
      setIsAddSkillModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Modal
        isOpen={isAddSkillModalOpen}
        onClose={() => setIsAddSkillModalOpen(false)}
        title="Add New Skill"
      >
        <AddSkillForm
          isOpen={isAddSkillModalOpen}
          onSubmit={(values) => void handleAddSkillSubmit(values)}
          onCancel={() => setIsAddSkillModalOpen(false)}
          isSubmitting={isSaving}
        />
      </Modal>

      <ProfileTopBar
        role="MENTOR"
        pageTitle="Skills Manager"
        onLogout={handleLogoutClick}
        action={() => setIsAddSkillModalOpen(true)}
        actionName="Add New Skill"
      />

      <div className="flex flex-1">
        <MentorSidebar activeItem="skills" />
        <main className="flex-1 flex flex-col">
          <SkillsManager
            skills={skills}
            isLoading={isLoading}
            onAddSkill={() => setIsAddSkillModalOpen(true)}
            onUpdateSkill={editSkill}
            onDeleteSkill={removeSkill}
            isSaving={isSaving}
            deletingSkillId={deletingSkillId}
          />
        </main>
      </div>
    </div>
  );
};
