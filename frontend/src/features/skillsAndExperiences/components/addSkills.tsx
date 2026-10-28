import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { SkillFormValues } from "../types/skill.types";

export interface AddSkillFormProps {
  isOpen: boolean;
  onSubmit: (data: SkillFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialValue?: SkillFormValues;
  submitLabel?: string;
}

export function AddSkillForm({
  isOpen,
  onSubmit,
  onCancel,
  isSubmitting,
  initialValue,
  submitLabel = "Save skill",
}: AddSkillFormProps) {
  const [formData, setFormData] = useState<SkillFormValues>(initialValue ?? {
    skillName: "",
    proficiencyLevel: "ADVANCED",
    subtopics: "",
  });
  const [skillNameError, setSkillNameError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(initialValue ?? {
        skillName: "",
        proficiencyLevel: "ADVANCED",
        subtopics: "",
      });
      setSkillNameError("");
    }
  }, [isOpen, initialValue]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (name === "skillName") {
      setSkillNameError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const skillName = formData.skillName.trim();
    if (!skillName) {
      setSkillNameError("Skill name is required.");
      return;
    }

    onSubmit({
      ...formData,
      skillName,
      subtopics: formData.subtopics.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6">
      <div>
        <label
          htmlFor="skillName"
          className="mb-2 block text-sm font-semibold text-stone-800"
        >
          Skill name
        </label>
        <input
          id="skillName"
          name="skillName"
          type="text"
          value={formData.skillName}
          onChange={handleChange}
          placeholder="e.g. Redis, GraphQL, Kubernetes"
          required
          aria-invalid={Boolean(skillNameError)}
          aria-describedby={skillNameError ? "skillName-error" : undefined}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
        />
        {skillNameError && (
          <p
            id="skillName-error"
            className="mt-2 flex items-center gap-1 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle size={15} />
            {skillNameError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="proficiencyLevel"
          className="mb-2 block text-sm font-semibold text-stone-800"
        >
          Proficiency level
        </label>
        <select
          id="proficiencyLevel"
          name="proficiencyLevel"
          value={formData.proficiencyLevel}
          onChange={handleChange}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
        >
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="subtopics"
          className="mb-2 block text-sm font-semibold text-stone-800"
        >
          Subtopics covered
          <span className="ml-1 font-normal text-stone-500">(optional)</span>
        </label>
        <input
          id="subtopics"
          name="subtopics"
          type="text"
          value={formData.subtopics}
          onChange={handleChange}
          placeholder="e.g. In-memory caching, pub/sub queues"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full border border-stone-300 px-5 py-2.5 font-medium text-stone-700 transition-colors hover:bg-stone-100"
        >
          Cancel
        </button>
        <button disabled={isSubmitting}
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-[#52775E] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#43634e]"
        >
          {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    <>
      <Plus size={17} />
      {submitLabel}
    </>
  )}
        </button>
      </div>
    </form>
  );
}
