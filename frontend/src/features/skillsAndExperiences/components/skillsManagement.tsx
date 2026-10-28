import { useMemo, useState, type FC } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Modal } from "@/shared/components/modal";
import { showAlert } from "@/shared/components/alertBox";
import { AddSkillForm } from "./addSkills";
import type { SkillFormValues, SkillItem } from "../types/skill.types";

interface SkillsManagerProps {
  skills: SkillItem[];
  isLoading: boolean;
  isSaving: boolean;
  deletingSkillId: string | null;
  onAddSkill: () => void;
  onUpdateSkill: (id: string, values: SkillFormValues) => Promise<boolean>;
  onDeleteSkill: (id: string) => Promise<boolean>;
}

const PAGE_SIZE = 5;

export const SkillsManager: FC<SkillsManagerProps> = ({
  skills,
  isLoading,
  isSaving,
  deletingSkillId,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(skills.length / PAGE_SIZE));
  const visibleSkills = skills.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const editInitialValue = useMemo<SkillFormValues | undefined>(
    () =>
      selectedSkill
        ? {
            skillName: selectedSkill.name,
            proficiencyLevel: selectedSkill.level,
            subtopics: selectedSkill.description,
          }
        : undefined,
    [selectedSkill],
  );

  const openEditModal = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleUpdateSkill = async (values: SkillFormValues) => {
    if (!selectedSkill) return;

    const succeeded = await onUpdateSkill(selectedSkill.id, values);
    if (succeeded) {
      setIsEditModalOpen(false);
      setSelectedSkill(null);
    }
  };

  const handleDeleteSkill = async (skill: SkillItem) => {
    const confirmation = await showAlert(
      "MENTOR",
      "Delete skill?",
      `Are you sure you want to delete ${skill.name}?`,
      "warning",
      "Delete",
      "Cancel",
    );
    if (!confirmation.isConfirmed) return;

    await onDeleteSkill(skill.id);
  };

  const getBadgeStyle = (level: SkillItem["level"]) => {
    switch (level) {
      case "EXPERT":
        return "bg-amber-100 text-amber-800 border-amber-200/60";
      case "ADVANCED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200/60";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-800 border-blue-200/60";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-1 flex-col items-center bg-[#FAF8F5] p-6 sm:p-10">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Technical Skills &amp; Proficiency
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500">
            Skills directly fuel the MentorFlow AI matching engine to connect
            you with learners at the right roadmap milestones.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              Configured Competencies
            </h2>
            <button
              type="button"
              onClick={onAddSkill}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors hover:bg-stone-50"
            >
              <Plus className="h-3.5 w-3.5 text-stone-500" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading skills...
              </div>
            ) : visibleSkills.length ? (
              visibleSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="group flex items-center justify-between rounded-xl border border-stone-200/80 bg-white p-4 transition-all hover:border-stone-300"
                >
                  <div className="space-y-1 pr-4">
                    <h3 className="text-sm font-bold text-stone-900">
                      {skill.name}
                    </h3>
                    <p className="line-clamp-1 text-xs text-stone-500">
                      {skill.description || "No subtopics provided"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider ${getBadgeStyle(skill.level)}`}
                    >
                      {skill.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(skill)}
                      className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteSkill(skill)}
                      disabled={deletingSkillId === skill.id}
                      className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-red-700 disabled:cursor-wait disabled:opacity-50"
                      aria-label={`Delete ${skill.name}`}
                    >
                      {deletingSkillId === skill.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-stone-400">
                No competencies added yet.
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <div className="mx-1 flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[#3D6946] text-white"
                        : "text-stone-600 hover:bg-stone-200/60"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!isSaving) {
            setIsEditModalOpen(false);
            setSelectedSkill(null);
          }
        }}
        title="Edit Skill"
      >
        {selectedSkill && (
          <AddSkillForm
            key={selectedSkill.id}
            isOpen={isEditModalOpen}
            initialValue={editInitialValue}
            submitLabel="Save changes"
            isSubmitting={isSaving}
            onSubmit={handleUpdateSkill}
            onCancel={() => {
              if (!isSaving) {
                setIsEditModalOpen(false);
                setSelectedSkill(null);
              }
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SkillsManager;
