import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { useToast } from "@/shared/components/Toast";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "../api/skillsApi";
import type {
  MentorSkillRecord,
  SkillFormValues,
  SkillItem,
} from "../types/skill.types";

function toSkillItem(skill: MentorSkillRecord): SkillItem {
  return {
    id: skill.skillId,
    name: skill.skillName,
    description: skill.subtopics ?? "",
    level: skill.proficiencyLevel,
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function useSkills() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const mentorId = user?.role === "MENTOR" ? user.id : null;

  const loadSkills = useCallback(async () => {
    if (!mentorId) {
      setSkills([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getSkills();
      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response while loading skills.");
      }
      setSkills(response.data.data.map(toSkillItem));
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not load skills."),
        "error",
        "Could Not Load Skills",
      );
    } finally {
      setIsLoading(false);
    }
  }, [mentorId, showToast]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void loadSkills();
  }, [loadSkills]);

  const addSkill = async (values: SkillFormValues): Promise<boolean> => {
    if (!mentorId) {
      navigate("/unauthorized", { replace: true });
      return false;
    }

    setIsSaving(true);
    try {
      const response = await createSkill(mentorId, values);
      showToast(
        response.data.message || "Skill added successfully.",
        "success",
      );
      await loadSkills();
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not add skill."),
        "error",
        "Add Skill Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const editSkill = async (
    skillId: string,
    values: SkillFormValues,
  ): Promise<boolean> => {
    if (!mentorId) {
      showToast("You must be signed in as a mentor to edit skills.", "error");
      return false;
    }

    setIsSaving(true);
    try {
      const response = await updateSkill(skillId, mentorId, values);
      setSkills((currentSkills) =>
        currentSkills.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                name: values.skillName,
                description: values.subtopics,
                level: values.proficiencyLevel,
              }
            : skill,
        ),
      );
      showToast(
        response.data.message || "Skill updated successfully.",
        "success",
      );
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not update skill."),
        "error",
        "Update Skill Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const removeSkill = async (skillId: string): Promise<boolean> => {
    if (!mentorId) {
      showToast("You must be signed in as a mentor to delete skills.", "error");
      return false;
    }

    setDeletingSkillId(skillId);
    try {
      const response = await deleteSkill(skillId);
      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== skillId),
      );
      showToast(
        response.data.message || "Skill deleted successfully.",
        "success",
      );
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not delete skill."),
        "error",
        "Delete Skill Failed",
      );
      return false;
    } finally {
      setDeletingSkillId(null);
    }
  };

  return {
    skills,
    isLoading,
    isSaving,
    deletingSkillId,
    addSkill,
    editSkill,
    removeSkill,
  };
}
