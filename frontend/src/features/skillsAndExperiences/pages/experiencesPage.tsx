import { useState, type FC } from "react";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar.tsx";
import { MentorSidebar } from "../../profile/components/MentorSidebar.tsx";
import { ExperiencesManager } from "../components/experiencesManagement.tsx";
import { ExperienceForm } from "../components/ExperienceForm.tsx";
import { Modal } from "@/shared/components/modal.tsx";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout.ts";
import { useExperiences } from "../hooks/useExperiences.ts";
import type {
  ExperienceFormValues,
  ExperienceRecord,
} from "../types/experience.types.ts";

export const MentorExperiencePage: FC = () => {
  const handleLogoutClick = useMentorLogout();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceRecord | null>(null);
  const {
    experiences,
    isLoading,
    isSaving,
    deletingExperienceId,
    addExperience,
    editExperience,
    removeExperience,
  } = useExperiences();

  const openAddForm = () => {
    setSelectedExperience(null);
    setIsFormOpen(true);
  };

  const openEditForm = (experience: ExperienceRecord) => {
    setSelectedExperience(experience);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSaving) {
      setIsFormOpen(false);
      setSelectedExperience(null);
    }
  };

  const handleSubmit = async (
    values: ExperienceFormValues,
  ): Promise<void> => {
    const succeeded = selectedExperience
      ? await editExperience(selectedExperience.experienceId, values)
      : await addExperience(values);

    if (succeeded) {
      setIsFormOpen(false);
      setSelectedExperience(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={selectedExperience ? "Edit Work Experience" : "Add Work Experience"}
        subtitle="Highlight your roles, responsibilities, and professional impact."
      >
        {isFormOpen && (
          <ExperienceForm
            key={selectedExperience?.experienceId ?? "new-experience"}
            initialExperience={selectedExperience}
            isSubmitting={isSaving}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </Modal>

      <ProfileTopBar
        role="MENTOR"
        pageTitle="Experience Manager"
        onLogout={handleLogoutClick}
        action={openAddForm}
        actionName="Add experience"
      />

      <div className="flex flex-1">
        <MentorSidebar activeItem="experience" />
        <main className="flex flex-1 flex-col">
          <ExperiencesManager
            experiences={experiences}
            isLoading={isLoading}
            deletingExperienceId={deletingExperienceId}
            onAddExperience={openAddForm}
            onEditExperience={openEditForm}
            onDeleteExperience={removeExperience}
          />
        </main>
      </div>
    </div>
  );
};
