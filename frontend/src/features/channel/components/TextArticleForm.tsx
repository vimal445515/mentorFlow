import type { FC } from "react";
import {
  FileText,
  Bold,
  Italic,
  Heading,
  Code,
  List,
  ListOrdered,
  Quote,
  Upload,
  Trash2,
} from "lucide-react";

interface TextArticleFormProps {
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  tags: string;
  setTags: (val: string) => void;
}

export const TextArticleForm: FC<TextArticleFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#3D6946] flex items-center justify-center font-bold">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">Article / Educational Post</h3>
          <p className="text-xs text-stone-500">
            Share written technical concepts, mental models, and architectural tutorials.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Article Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
            placeholder="Understanding JavaScript Closures &amp; Lexical Scope"
          />
        </div>

        {/* Content Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-700">Article Content *</label>
            <span className="text-[11px] text-stone-400">53 words</span>
          </div>
          <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-stone-100 bg-stone-50/50 text-stone-600">
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <Code className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-4 bg-stone-200 mx-1" />
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <List className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:bg-stone-200/60 rounded">
                <Quote className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 text-stone-900 text-sm focus:outline-none resize-none bg-white"
              placeholder="Write your article content here..."
            />
          </div>
        </div>

        {/* Thumbnail Image Upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">
            Thumbnail Image (Direct Upload)
          </label>
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-3 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900">Upload Article Thumbnail</p>
              <p className="text-[11px] text-stone-500">
                Click to browse or drag &amp; drop an image (PNG, JPG, WebP)
              </p>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 hover:bg-stone-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image File</span>
            </button>
          </div>

          {/* Attached Image Item Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white shadow-xs mt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                <div className="w-full h-full bg-[#3D6946]/20 flex items-center justify-center text-[10px] font-bold text-[#3D6946]">
                  IMG
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">closures-preview.jpg</p>
                <p className="text-[10px] text-stone-500">Image attached</p>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700">Tags / Topics</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] transition-colors bg-white"
            placeholder="JavaScript, Web Development, ES6"
          />
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-stone-500 mr-1">Quick suggestions:</span>
            {["+ JavaScript", "+ Web Development", "+ Node.js", "+ Architecture"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setTags(
                    tags
                      ? `${tags}, ${tag.replace("+ ", "")}`
                      : tag.replace("+ ", ""),
                  )
                }
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
