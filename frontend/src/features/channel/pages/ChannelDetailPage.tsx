import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { ChannelHeader } from "../components/ChannelHeader";
import { ChannelStatsSidebar } from "../components/ChannelStatsSidebar";
import { ChannelFeedCard } from "../components/ChannelFeedCard";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { FileText, Download, Play } from "lucide-react";

export const ChannelDetailPage: FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const handleLogoutClick = useMentorLogout();
  const [activeTab, setActiveTab] = useState<"ALL" | "ARTICLES" | "VIDEOS" | "DOCUMENTS">("ALL");
  const createContentPath = channelId
    ? `/mentor/channel/${encodeURIComponent(channelId)}/create-content`
    : "/mentor/channel/create-content";

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      {/* Top Bar */}
      <ProfileTopBar
        role="MENTOR"
        pageTitle="Channels / Backend Engineering Insider"
        onLogout={handleLogoutClick}
        action={() => navigate(createContentPath)}
        actionName="Create Content"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <MentorSidebar activeItem="Channel" />

        {/* Main Content Area */}
        <main className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-6 sm:p-10 max-w-7xl mx-auto space-y-8 w-full">
          {/* Channel Hero Header */}
          <ChannelHeader onOpenCreateModal={() => navigate(createContentPath)} />

          {/* Filter Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
            {[
              { id: "ALL", label: "All (5)", count: 5 },
              { id: "ARTICLES", label: "Articles (2)", count: 2 },
              { id: "VIDEOS", label: "Videos (1)", count: 1 },
              { id: "DOCUMENTS", label: "Documents (1)", count: 1 },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#3D6946] text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Feed + Sidebar Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Feed List */}
            <div className="flex-1 space-y-6 w-full">
              {/* Item 1: Article / Code Tutorial */}
              <ChannelFeedCard
                authorName="John Doe"
                authorRole="Verified Staff Mentor"
                timestamp="2 days ago"
                badgeLabel="Text / Article"
                badgeColor="emerald"
                title="Understanding JavaScript Closures &amp; Lexical Scope"
                description="Closures are one of the most fundamental mental models in modern web development. When a function is declared inside another function, it maintains an active reference to the outer scope variable environment."
                tags={["JavaScript", "Web Development", "ES6"]}
                likesCount={142}
                commentsCount={18}
                viewsCount={1420}
              >
                {/* Code syntax visual preview box */}
                <div className="rounded-xl border border-stone-200 bg-stone-900 text-stone-200 p-4 font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-stone-400 text-[10px]">
                    <span>closure-demo.js</span>
                    <span>Node.js v20.x</span>
                  </div>
                  <code>
                    {`function createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}`}
                  </code>
                </div>
              </ChannelFeedCard>

              {/* Item 2: Video Walkthrough */}
              <ChannelFeedCard
                authorName="John Doe"
                authorRole="Verified Staff Mentor"
                timestamp="Yesterday"
                badgeLabel="Video"
                badgeColor="orange"
                title="PostgreSQL Index Tuning &amp; EXPLAIN ANALYZE Live Teardown"
                description="Watch this deep-dive walkthrough analyzing slow query logs from a production cluster running 150,000 active sessions. We inspect query execution plans, compare sequential scans against bitmap index scans, and demonstrate how composite B-Tree indexes drop query duration from 420ms down to 1.8ms."
                tags={["PostgreSQL", "SQL Tuning", "Indexes"]}
                likesCount={289}
                commentsCount={31}
                viewsCount={2850}
              >
                {/* Video player card */}
                <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 aspect-video flex items-center justify-center group cursor-pointer shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute w-14 h-14 rounded-full bg-[#3D6946] text-white flex items-center justify-center shadow-lg group-hover:bg-[#32573a] transition-colors">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    15:42
                  </span>
                </div>
              </ChannelFeedCard>

              {/* Item 3: PDF / Document */}
              <ChannelFeedCard
                authorName="John Doe"
                authorRole="Verified Staff Mentor"
                timestamp="3 days ago"
                badgeLabel="PDF / Document"
                badgeColor="purple"
                title="High-Concurrency System Design Architecture Blueprint (PDF)"
                description="Compiled 24-page official architecture reference guide. Includes distributed rate limiting via Redis token buckets, circuit breaker patterns using Opossum, idempotency keys for payment webhooks, and zero-downtime database migrations."
                tags={["PDF Notes", "System Design", "Blueprints"]}
                likesCount={394}
                commentsCount={42}
                downloadsCount={890}
              >
                {/* PDF attachment card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        System-Design-Blueprint-v2.pdf
                      </p>
                      <p className="text-[10px] text-stone-500">
                        6.9 MB • 24 Pages • AI Knowledge Base Indexed
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#3D6946]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </ChannelFeedCard>
            </div>

            {/* Sidebar Stats Column */}
            <ChannelStatsSidebar />
          </div>
        </main>
      </div>
    </div>
  );
};
