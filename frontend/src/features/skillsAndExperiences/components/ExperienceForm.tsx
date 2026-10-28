import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import type {
  EmploymentType,
  ExperienceFormValues,
  ExperienceRecord,
  WorkPlaceType,
} from "../types/experience.types";

interface ExperienceFormProps {
  initialExperience?: ExperienceRecord | null;
  isSubmitting: boolean;
  onSubmit: (values: ExperienceFormValues) => void | Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM: ExperienceFormValues = {
  title: "",
  company: "",
  employmentType: "FULL_TIME",
  workPlaceType: "REMOTE",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export function ExperienceForm({
  initialExperience,
  isSubmitting,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormValues>(() =>
    initialExperience
      ? {
          title: initialExperience.title,
          company: initialExperience.company ?? "",
          employmentType: initialExperience.employmentType,
          workPlaceType: initialExperience.workPlaceType,
          location: initialExperience.location ?? "",
          startDate: toDateInputValue(initialExperience.startDate),
          endDate: toDateInputValue(initialExperience.endDate),
          isCurrent: initialExperience.isCurrent,
          description: initialExperience.description ?? "",
        }
      : EMPTY_FORM,
  );

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    if (name === "isCurrent" && event.target instanceof HTMLInputElement) {
      const isCurrent = event.target.checked;
      setFormData((previous) => ({
        ...previous,
        isCurrent,
        endDate: isCurrent ? "" : previous.endDate,
      }));
      return;
    }

    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit({
      ...formData,
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      endDate: formData.isCurrent ? "" : formData.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            Job Title / Role <span className="text-red-500">*</span>
          </span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={150}
            placeholder="e.g. Staff Backend Architect"
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm placeholder:text-[#A89F9B] focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            Company / Organization
          </span>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            maxLength={150}
            placeholder="e.g. CloudScale Technologies Inc."
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm placeholder:text-[#A89F9B] focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            Employment Type <span className="text-red-500">*</span>
          </span>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                employmentType: event.target.value as EmploymentType,
              }))
            }
            required
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            Workplace Type <span className="text-red-500">*</span>
          </span>
          <select
            name="workPlaceType"
            value={formData.workPlaceType}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                workPlaceType: event.target.value as WorkPlaceType,
              }))
            }
            required
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
          >
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
          Location
        </span>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          maxLength={150}
          placeholder="e.g. San Francisco, CA or Bengaluru, India"
          className="mb-3 w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm placeholder:text-[#A89F9B] focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
        />
        <span className="flex cursor-pointer select-none items-center gap-3 rounded-2xl border border-[#D9D0CB] bg-white p-4 shadow-sm">
          <input
            name="isCurrent"
            type="checkbox"
            checked={formData.isCurrent}
            onChange={handleChange}
            className="h-4 w-4 accent-[#56755E] focus:ring-[#56755E]"
          />
          <span className="text-sm font-medium text-[#2C2523]">
            I am currently working in this role
          </span>
        </span>
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            Start Date <span className="text-red-500">*</span>
          </span>
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
            End Date
          </span>
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.isCurrent}
            min={formData.startDate || undefined}
            className="w-full rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20 disabled:bg-stone-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#2C2523]">
          Role Description &amp; Key Accomplishments
        </span>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          maxLength={5000}
          placeholder="Describe your responsibilities, systems engineered, and accomplishments..."
          className="w-full resize-y rounded-2xl border border-[#D9D0CB] bg-white px-4 py-3.5 text-sm text-[#2C2523] shadow-sm placeholder:text-[#A89F9B] focus:outline-none focus:ring-2 focus:ring-[#2C2523]/20"
        />
      </label>

      <div className="flex items-center justify-between gap-4 border-t border-[#D9D0CB] pt-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="w-1/2 rounded-full border border-[#2C2523]/30 px-6 py-3.5 text-center text-sm font-medium text-[#2C2523] transition-colors hover:bg-black/5 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-1/2 items-center justify-center gap-2 rounded-full bg-[#56755E] px-6 py-3.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-[#48634F] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus size={18} strokeWidth={2.5} />
              {initialExperience ? "Save Changes" : "Add Experience"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
