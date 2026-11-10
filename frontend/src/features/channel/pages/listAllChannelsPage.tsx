import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { ProfileTopBar } from "@/features/profile/components/ProfileTopBar";
import { MentorSidebar } from "@/features/profile/components/MentorSidebar";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { DataTable } from "@/shared/components/DataTable/DataTable";
import type { DataTableProps } from "@/shared/components/DataTable/types";

interface HostedChannel {
  id: string;
  initials: string;
  avatarClass: string;
  name: string;
  topic: string;
  followers: string;
  followerGrowth: string;
  posts: string;
  lastPost: string;
  status: "ACTIVE" | "PRIVATE DRAFT";
  createdAt: string;
}

const hostedChannels: HostedChannel[] = [
  {
    id: "ch-1",
    initials: "BE",
    avatarClass: "bg-[#FFE6DD] text-[#B85338]",
    name: "Backend Engineering Insider",
    topic: "Node.js Internals, Libuv, Database Scaling",
    followers: "1,420",
    followerGrowth: "+84 this week",
    posts: "24",
    lastPost: "Last: 2h ago",
    status: "ACTIVE",
    createdAt: "Jun 14, 2026",
  },
  {
    id: "ch-2",
    initials: "DS",
    avatarClass: "bg-[#E2F3E7] text-[#5E8063]",
    name: "Distributed Systems & Go",
    topic: "Raft, Paxos, Eventual Consistency",
    followers: "890",
    followerGrowth: "+32 this week",
    posts: "12",
    lastPost: "Last: 3d ago",
    status: "ACTIVE",
    createdAt: "Jul 22, 2026",
  },
  {
    id: "ch-3",
    initials: "AP",
    avatarClass: "bg-[#FEF3C7] text-[#B45309]",
    name: "Advanced PostgreSQL Optimization",
    topic: "Query Planning, Indexes & Vacuum",
    followers: "340",
    followerGrowth: "+10 this week",
    posts: "6",
    lastPost: "Last: Drafting",
    status: "PRIVATE DRAFT",
    createdAt: "Aug 10, 2026",
  },
];

export const ChannelsPage: React.FC = () => {
  const handleLogoutClick = useMentorLogout();

  const columns: DataTableProps<HostedChannel>["columns"] = [
    {
      id: "channel",
      header: "Channel Name & Topic",
      headerClassName: "min-w-72",
      cell: (channel) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-extrabold ${channel.avatarClass}`}
          >
            {channel.initials}
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
      cell: (channel) => (
        <>
          <div className="font-bold text-slate-800">{channel.followers}</div>
          <div className="text-xs font-semibold text-emerald-600">
            {channel.followerGrowth}
          </div>
        </>
      ),
    },
    {
      id: "posts",
      header: "Posts",
      cell: (channel) => (
        <>
          <div className="font-bold text-slate-800">{channel.posts}</div>
          <div className="text-xs text-slate-500">{channel.lastPost}</div>
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
      cell: (channel) => channel.createdAt,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (channel) => (
        <div className="flex justify-end gap-2">
          <a
            href={`channel-details.html?id=${channel.id}`}
            className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
          >
            View
          </a>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          {channel.status === "PRIVATE DRAFT" && (
            <button
              type="button"
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            className="rounded-md p-1 text-slate-400 hover:text-slate-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const pagination = (
    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
      <div className="text-xs text-slate-500">
        Showing{" "}
        <strong className="font-semibold text-slate-700">
          {hostedChannels.length}
        </strong>{" "}
        channels
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
          1
        </button>
        <button
          disabled
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 disabled:opacity-50"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
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
                  placeholder="Search channels by name, topic..."
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                <option value="all">All Channel Statuses</option>
                <option value="ACTIVE">Active (Public)</option>
                <option value="PRIVATE DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                <option value="followers">Most Followers</option>
                <option value="posts">Most Posts</option>
                <option value="recent">Created: Newest</option>
              </select>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-3 text-xs text-slate-500">
            Showing{" "}
            <strong className="font-semibold text-slate-700">
              {hostedChannels.length}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-slate-700">
              {hostedChannels.length}
            </strong>{" "}
            hosted channels
          </div>

          <DataTable
            columns={columns}
            data={hostedChannels}
            getRowId={(channel) => channel.id}
            footer={pagination}
          />
        </main>
      </div>
    </div>
  );
};
