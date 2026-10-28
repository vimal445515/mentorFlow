import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/shared/components/Toast";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../api/experiencesApi";
import type {
  ExperienceFormValues,
  ExperienceRecord,
} from "../types/experience.types";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function useExperiences() {
  const { showToast } = useToast();
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingExperienceId, setDeletingExperienceId] = useState<
    string | null
  >(null);

  const loadExperiences = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }
    try {
      const response = await getExperiences();
      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response while loading experiences.");
      }
      setExperiences(response.data.data);
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not load work experiences."),
        "error",
        "Load Failed",
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void loadExperiences(false);
  }, [loadExperiences]);

  const addExperience = async (
    values: ExperienceFormValues,
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await createExperience(values);
      showToast(
        response.data.message || "Experience added successfully.",
        "success",
      );
      await loadExperiences();
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not add work experience."),
        "error",
        "Add Experience Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const editExperience = async (
    experienceId: string,
    values: ExperienceFormValues,
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await updateExperience(experienceId, values);
      showToast(
        response.data.message || "Experience updated successfully.",
        "success",
      );
      await loadExperiences();
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not update work experience."),
        "error",
        "Update Experience Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const removeExperience = async (
    experienceId: string,
  ): Promise<boolean> => {
    setDeletingExperienceId(experienceId);
    try {
      const response = await deleteExperience(experienceId);
      setExperiences((current) =>
        current.filter((experience) => experience.experienceId !== experienceId),
      );
      showToast(
        response.data.message || "Experience deleted successfully.",
        "success",
      );
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not delete work experience."),
        "error",
        "Delete Experience Failed",
      );
      return false;
    } finally {
      setDeletingExperienceId(null);
    }
  };

  return {
    experiences,
    isLoading,
    isSaving,
    deletingExperienceId,
    loadExperiences,
    addExperience,
    editExperience,
    removeExperience,
  };
}
