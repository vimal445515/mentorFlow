import React from "react";
import { X, Tags, Plus } from "lucide-react";
import { Modal } from "@/shared/components/modal";
import type {
  Channel,
  ChannelInput,
  ChannelStatus,
} from "../types/channel.types";

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel?: Channel | null;
  isSubmitting: boolean;
  onSubmit: (input: ChannelInput) => Promise<boolean>;
}

export const ChannelModal: React.FC<ChannelModalProps> = ({
  isOpen,
  onClose,
  channel = null,
  isSubmitting,
  onSubmit,
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const status = formData.get("status");
    const statuses: ChannelStatus[] = ["ACTIVE", "PRIVATE DRAFT"];
    const isValidStatus =
      typeof status === "string" &&
      (statuses.includes(status as ChannelStatus) ||
        (channel?.status === "ARCHIVED" && status === "ARCHIVED"));

    if (!isValidStatus) return;

    const saved = await onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? ""),
      topic: String(formData.get("topic") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: status as ChannelStatus,
    });

    if (saved) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="m-auto max-h-[90vh] w-[min(90vw,640px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-900/65 backdrop:backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="m-0 text-xl font-bold text-slate-900">
            {channel ? "Edit Channel" : "Create New Channel"}
          </h3>
          <p className="m-0 text-xs text-slate-500">
            Set up your specialized community space to share articles, technical guides, and
            announcements.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form UI */}
      <form
        key={channel?.name ?? "new-channel"}
        className="space-y-4"
        onSubmit={(event) => void handleSubmit(event)}
      >
        {/* Row 1: Channel Name & Category */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="channel-name"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Channel Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="channel-name"
              name="name"
              defaultValue={channel?.name}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Distributed Systems & Go"
              required
            />
          </div>

          <div>
            <label
              htmlFor="channel-category"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Primary Category / Domain <span className="text-red-600">*</span>
            </label>
            <select
              id="channel-category"
              name="category"
              defaultValue={channel?.category ?? "Backend Engineering"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Backend Engineering">Backend Engineering</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Database Architecture & SQL">Database Architecture & SQL</option>
              <option value="System Design & Architecture">System Design & Architecture</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Frontend Architecture">Frontend Architecture</option>
              <option value="Security & Reliability">Security & Reliability</option>
            </select>
          </div>
        </div>

        {/* Row 2: Tagline / Focus Subtitle */}
        <div>
          <label
            htmlFor="channel-tagline"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Tagline / Subtopic Summary <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="channel-tagline"
            name="topic"
            defaultValue={channel?.topic}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Raft, Paxos, Eventual Consistency & High Concurrency"
            required
          />
        </div>

        {/* Row 3: Description */}
        <div>
          <label htmlFor="channel-desc" className="mb-1 block text-xs font-semibold text-slate-700">
            Channel Description & Purpose <span className="text-red-600">*</span>
          </label>
          <textarea
            id="channel-desc"
            name="description"
            rows={3}
            defaultValue={channel?.description}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Explain the focus of this channel, key problems explored, and what learners will gain by following..."
            required
          />
        </div>

        {/* Row 4: Tags / Keywords */}
        <div>
          <label htmlFor="channel-tags" className="mb-1 block text-xs font-semibold text-slate-700">
            Focus Tags / Keywords
          </label>
          <div className="relative">
            <Tags className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="channel-tags"
              name="tags"
              defaultValue={channel?.tags.join(", ")}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Go, Raft, Kubernetes, gRPC, Distributed Systems (comma-separated)"
            />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Comma-separated tags displayed on your channel badge and search filters.
          </div>
        </div>

        {/* Row 6: Visibility Status */}
        <div>
          {channel?.status === "ARCHIVED" ? (
            <input type="hidden" name="status" value="ARCHIVED" />
          ) : (
            <>
              <label
                htmlFor="channel-status"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Visibility Status
              </label>
              <select
                id="channel-status"
                name="status"
                defaultValue={channel?.status}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ACTIVE">ACTIVE (Public Directory)</option>
                <option value="PRIVATE DRAFT">PRIVATE DRAFT (Creator Only)</option>
              </select>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2D6946] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D6946] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting
              ? "Saving..."
              : channel
                ? "Save Changes"
                : "Create Channel"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
