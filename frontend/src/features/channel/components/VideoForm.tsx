import type { FC } from "react";
import { Video, Upload, Trash2, CheckCircle2 } from "lucide-react";

interface VideoFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  tags: string;
  setTags: (val: string) => void;
}

export const VideoForm: FC<VideoFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
          <Video className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">Upload Educational Video</h3>
          <p className="text-xs text-stone-500">
            Share walkthroughs, query teardowns, and architecture screencasts.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Video Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
            placeholder="PostgreSQL Index Tuning &amp; EXPLAIN ANALYZE Live Teardown"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Video Description *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white resize-none"
            placeholder="Watch this deep-dive walkthrough analyzing slow query logs..."
          />
        </div>

        {/* Video File Upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Video File *</label>
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-3 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900">Upload Educational Video</p>
              <p className="text-[11px] text-stone-500">
                Drag &amp; drop your MP4, WebM, or MOV video here (up to 2GB)
              </p>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 hover:bg-stone-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse Video File</span>
            </button>
          </div>

          {/* Uploaded Video Progress Card */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-[#3D6946]" />
                <span className="text-xs font-bold text-stone-900">
                  postgresql-index-tuning-session.mp4
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Ready for publishing
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>184.2 MB • Duration 15:42</span>
              <button type="button" className="text-red-600 font-semibold hover:underline">
                Replace file
              </button>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#3D6946] rounded-full" />
            </div>
            <span className="text-[10px] text-stone-400 block">100% Uploaded &amp; Encoded</span>
          </div>
        </div>

        {/* Video Thumbnail Poster */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">
            Video Thumbnail Poster (Direct Upload)
          </label>
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-3 bg-[#FAF8F5]/50">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900">Upload Video Cover Thumbnail</p>
              <p className="text-[11px] text-stone-500">
                Click to browse or drag &amp; drop video cover image (16:9 recommended)
              </p>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image File</span>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white shadow-xs mt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600">
                  COVER
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">postgres-cover.jpg</p>
                <p className="text-[10px] text-stone-500">Image attached</p>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">Category / Subject *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white cursor-pointer"
            >
              <option value="Database Optimization">Database Optimization</option>
              <option value="Backend Engineering">Backend Engineering</option>
              <option value="System Design">System Design</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white"
              placeholder="PostgreSQL, SQL Tuning, Indexes"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
