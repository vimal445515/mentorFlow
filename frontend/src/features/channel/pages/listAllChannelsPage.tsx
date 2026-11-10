import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ProfileTopBar } from "@/features/profile/components/ProfileTopBar";
import { MentorSidebar } from "@/features/profile/components/MentorSidebar";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { DataTable } from "@/shared/components/DataTable/DataTable";
import type { DataTableProps } from "@/shared/components/DataTable/types";
import { ChannelModal } from "../componets/ChannelModal";
import { Pagination } from "@/shared/components/pagination";
import {
  createChannel,
  deleteChannel,
  listChannels,
  updateChannel,
} from "../api/channelApi";
import type { Channel, ChannelInput, ChannelStatus } from "../types/channel.types";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCreatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

const avatarClasses = [
  "bg-[#FFE6DD] text-[#B85338]",
  "bg-[#E2F3E7] text-[#5E8063]",
  "bg-[#FEF3C7] text-[#B45309]",
];

export const ChannelsPage: React.FC = () => {
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [deletingChannelId, setDeletingChannelId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ChannelStatus>("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "name">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalChannels, setTotalChannels] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const requestSequence = useRef(0);
  const channelsPerPage = 5;

  const loadChannels = useCallback(async (page = currentPage) => {
    const requestId = ++requestSequence.current;
    setIsLoading(true);
    try {
      const result = await listChannels({
        page,
        limit: channelsPerPage,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        sortBy: sortOrder === "name" ? "name" : "createdAt",
        sortOrder: sortOrder === "name" ? "asc" : "desc",
      });
      if (requestId !== requestSequence.current) return;
      setChannels(result.channels);
      setTotalChannels(result.pagination.total);
      const lastPage = Math.max(1, result.pagination.totalPages);
      setTotalPages(lastPage);
      if (page > lastPage) {
        setCurrentPage(lastPage);
      }
      setLoadError(null);
    } catch (error) {
      if (requestId !== requestSequence.current) return;
      const message = getErrorMessage(error, "Could not load channels.");
      setLoadError(message);
      showToast(message, "error", "Load Failed");
    } finally {
      if (requestId === requestSequence.current) setIsLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    showToast,
    sortOrder,
    statusFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    void loadChannels(currentPage);
  }, [currentPage, debouncedSearch, loadChannels, sortOrder, statusFilter]);

  const activePage = Math.min(currentPage, totalPages);
  const pageChannels = channels;

  const handleRetry = () => {
    setIsLoading(true);
    void loadChannels();
  };

  const handleSaveChannel = async (input: ChannelInput): Promise<boolean> => {
    setIsSaving(true);
    try {
      const savedChannel = editingChannel
        ? await updateChannel(editingChannel.channelId, input)
        : await createChannel(input);
      if (editingChannel) {
        setChannels((current) =>
          current.map((channel) =>
            channel.channelId === savedChannel.channelId
              ? savedChannel
              : channel,
          ),
        );
        void loadChannels();
      } else {
        setCurrentPage(1);
        if (currentPage === 1) void loadChannels(1);
      }
      showToast(
        editingChannel ? "Channel updated successfully." : "Channel created successfully.",
        "success",
      );
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not save this channel."),
        "error",
        "Save Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChannel = async (channel: Channel) => {
    const confirmation = await showAlert(
      "MENTOR",
      "Delete channel?",
      "This channel will be removed from your channel list.",
      "warning",
      "Delete",
      "Cancel",
    );
    if (!confirmation.isConfirmed) return;

    setDeletingChannelId(channel.channelId);
    try {
      await deleteChannel(channel.channelId);
      void loadChannels();
      showToast("Channel deleted successfully.", "success");
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not delete this channel."),
        "error",
        "Delete Failed",
      );
    } finally {
      setDeletingChannelId(null);
    }
  };

  const handlePublishChannel = async (channel: Channel) => {
    try {
      const publishedChannel = await updateChannel(channel.channelId, {
        name: channel.name,
        category: channel.category,
        topic: channel.topic,
        description: channel.description,
        tags: channel.tags,
        status: "ACTIVE",
      });
      setChannels((current) =>
        current.map((item) =>
          item.channelId === channel.channelId ? publishedChannel : item,
        ),
      );
      void loadChannels();
      showToast("Channel published successfully.", "success");
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not publish this channel."),
        "error",
        "Publish Failed",
      );
    }
  };

  const columns: DataTableProps<Channel>["columns"] = [
    {
      id: "channel",
      header: "Channel Name & Topic",
      headerClassName: "min-w-72",
      cell: (channel) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-extrabold ${avatarClasses[channel.name.length % avatarClasses.length]}`}
          >
            {getInitials(channel.name)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{channel.name}</div>
            <div className="text-xs text-slate-500">{channel.topic}</div>
          </div>
        </div>
      ),
    },
    {
      id: "followers",
      header: "Followers",
      cell: () => (
        <>
          <div className="font-bold text-slate-800">0</div>
          <div className="text-xs font-semibold text-emerald-600">No followers yet</div>
        </>
      ),
    },
    {
      id: "posts",
      header: "Posts",
      cell: () => (
        <>
          <div className="font-bold text-slate-800">0</div>
          <div className="text-xs text-slate-500">No posts yet</div>
        </>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (channel) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            channel.status === "ACTIVE"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : channel.status === "ARCHIVED"
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {channel.status}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Created Date",
      className: "whitespace-nowrap text-xs text-slate-500",
      cell: (channel) => formatCreatedAt(channel.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (channel) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingChannel(channel);
              setIsChannelModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          {channel.status === "PRIVATE DRAFT" && (
            <button
              type="button"
              onClick={() => void handlePublishChannel(channel)}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleDeleteChannel(channel)}
            disabled={deletingChannelId === channel.channelId}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
            aria-label={`Delete ${channel.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const pagination = (
    <div className="border-t border-slate-200 px-6 py-4">
      <Pagination
        currentPage={activePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showInfo
        totalItems={totalChannels}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <ProfileTopBar
        role="MENTOR"
        pageTitle="Channels"
        onLogout={handleLogoutClick}
      />
      <div className="flex min-h-[calc(100vh-65px)]">
        <MentorSidebar activeItem="Channel" />
        <main className="mx-auto w-full max-w-6xl min-w-0 p-6">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-900">
              My Hosted Channels
            </h1>
            <div className="flex items-center gap-3">
              <a
                href="create-content.html"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D6946] px-3 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Create Content
              </a>
              <button
                type="button"
                onClick={() => {
                  setEditingChannel(null);
                  setIsChannelModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" /> Create New Channel
              </button>
            </div>
          </header>

          <div className="mb-6">
            <p className="text-sm text-slate-500">
              Manage and moderate your community channels. Publish architectural
              articles, answer student inquiries, and cultivate your peer study
              following.
            </p>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search channels by name..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as "all" | ChannelStatus);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Channel Statuses</option>
                <option value="ACTIVE">Active (Public)</option>
                <option value="PRIVATE DRAFT">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value === "name" ? "name" : "recent")
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="name">Name: A to Z</option>
                <option value="recent">Created: Newest</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setSortOrder("recent");
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-3 text-xs text-slate-500">
            Showing{" "}
            <strong className="font-semibold text-slate-700">
              {pageChannels.length}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-slate-700">
              {totalChannels}
            </strong>{" "}
            hosted channels
          </div>

          <DataTable
            columns={columns}
            data={pageChannels}
            getRowId={(channel) => channel.channelId}
            isLoading={isLoading}
            error={loadError}
            onRetry={handleRetry}
            emptyMessage="No channels found."
            loadingMessage="Loading channels..."
            footer={pagination}
          />
        </main>
      </div>
      <ChannelModal
        isOpen={isChannelModalOpen}
        channel={editingChannel}
        isSubmitting={isSaving}
        onSubmit={handleSaveChannel}
        onClose={() => {
          setIsChannelModalOpen(false);
          setEditingChannel(null);
        }}
      />
    </div>
  );
};
