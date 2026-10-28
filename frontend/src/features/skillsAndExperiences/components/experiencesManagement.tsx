import type { FC } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { showAlert } from "@/shared/components/alertBox";
import type { ExperienceRecord } from "../types/experience.types";

interface ExperiencesManagerProps {
  experiences: ExperienceRecord[];
  isLoading: boolean;
  deletingExperienceId: string | null;
  onAddExperience: () => void;
  onEditExperience: (experience: ExperienceRecord) => void;
  onDeleteExperience: (id: string) => Promise<boolean>;
}

function formatDate(value: string | null): string {
  if (!value) return "Present";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "numeric",
      }).format(date);
}

function formatEmploymentType(value: ExperienceRecord["employmentType"]): string {
  return value
    .toLowerCase()
    .replace("_", "-")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatWorkPlaceType(value: ExperienceRecord["workPlaceType"]): string {
  return value === "ONSITE" ? "On-site" : value[0] + value.slice(1).toLowerCase();
}

export const ExperiencesManager: FC<ExperiencesManagerProps> = ({
  experiences,
  isLoading,
  deletingExperienceId,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
}) => {
  const handleDelete = async (experience: ExperienceRecord) => {
    const confirmation = await showAlert(
      "MENTOR",
      "Delete experience?",
      `Are you sure you want to delete "${experience.title}"?`,
      "warning",
      "Delete",
      "Cancel",
    );
    if (confirmation.isConfirmed) {
      await onDeleteExperience(experience.experienceId);
    }
  };

  const currentRoles = experiences.filter(
    (experience) => experience.isCurrent,
  ).length;

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-1 flex-col items-center bg-[#FAF8F5] p-6 sm:p-10">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Work Experience History
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-stone-500">
            Share your professional experience, roles, and accomplishments with
            learners.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onAddExperience}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#3D6946] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#32573a]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#EBE6DF] bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Recorded Roles
              </p>
              <p className="text-lg font-bold text-stone-900">
                {experiences.length} Positions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#EBE6DF] bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Current Roles
              </p>
              <p className="text-lg font-bold text-stone-900">
                {currentRoles} Positions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#EBE6DF] bg-white p-4 shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Verification
              </p>
              <p className="text-lg font-bold text-stone-900">Experience History</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#EBE6DF] bg-white p-12 text-sm text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading experiences...
            </div>
          ) : experiences.length > 0 ? (
            experiences.map((experience) => (
              <article
                key={experience.experienceId}
                className={`space-y-4 rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                  experience.isCurrent
                    ? "border-emerald-600/40 ring-1 ring-emerald-600/10"
                    : "border-[#EBE6DF]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {experience.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
                          Current Position
                        </span>
                      )}
                      <h2 className="text-base font-bold text-stone-900">
                        {experience.title}
                      </h2>
                      <span className="rounded-md bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
                        {formatEmploymentType(experience.employmentType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      <span>{experience.company || "Company not specified"}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditExperience(experience)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors hover:bg-stone-50"
                      aria-label={`Edit ${experience.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5 text-stone-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(experience)}
                      disabled={deletingExperienceId === experience.experienceId}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors hover:bg-stone-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50"
                      aria-label={`Delete ${experience.title}`}
                    >
                      {deletingExperienceId === experience.experienceId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-stone-500" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    <span>
                      {formatDate(experience.startDate)} —{" "}
                      {experience.isCurrent
                        ? "Present"
                        : formatDate(experience.endDate)}
                    </span>
                  </div>
                  <span aria-hidden="true">•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-stone-400" />
                    <span>
                      {experience.location || "Location not specified"} ·{" "}
                      {formatWorkPlaceType(experience.workPlaceType)}
                    </span>
                  </div>
                </div>

                {experience.description && (
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
                    {experience.description}
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-[#EBE6DF] bg-white p-12 text-center text-sm text-stone-400">
              No work experiences added yet. Click “Add Experience” to get
              started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperiencesManager;
