import { useRef, type FC } from "react";
import { FileText, Upload, CheckCircle2, Sparkles } from "lucide-react";

interface PdfDocumentFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  tags: string;
  setTags: (val: string) => void;
  documentFile: File | null;
  setDocumentFile: (file: File | null) => void;
}

export const PdfDocumentForm: FC<PdfDocumentFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  subject,
  setSubject,
  tags,
  setTags,
  documentFile,
  setDocumentFile,
}) => {
  const documentInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">Upload PDF / Document</h3>
          <p className="text-xs text-stone-500">Share curriculum notes, architectural blueprints, cheat sheets, and syllabi.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Document Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white"
            placeholder="High-Concurrency System Design Architecture Blueprint (PDF)"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">Description *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white resize-none"
            placeholder="Compiled 24-page official architecture reference guide..."
          />
        </div>

        {/* PDF File Upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700">PDF / Document File *</label>
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            className="sr-only"
            onChange={(event) => {
              setDocumentFile(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-3 bg-[#FAF8F5]/50">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900">Upload PDF Study Material</p>
              <p className="text-[11px] text-stone-500">Drag &amp; drop your PDF or DOCX file (up to 50MB)</p>
            </div>
            <button
              type="button"
              onClick={() => documentInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse Document File</span>
            </button>
          </div>

          {documentFile && (
            <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="text-xs font-bold text-stone-900 truncate">{documentFile.name}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>{(documentFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                <button
                  type="button"
                  onClick={() => setDocumentFile(null)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Replace file
                </button>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-[#3D6946] rounded-full" />
              </div>
              <span className="text-[10px] text-stone-400 block">Selected and ready to upload</span>
            </div>
          )}
        </div>

        {/* AI Learning Assistant Integration Callout */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50/40">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-stone-900">AI Learning Assistant Context Integration</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              AI learning assistant can use this material for contextual answers. When published, this document is automatically indexed into your channel&apos;s AI Knowledge Base so your AI Copilot can answer student inquiries with citation references.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white"
              placeholder="Backend Architecture"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-[#3D6946] focus:ring-1 focus:ring-[#3D6946] bg-white"
              placeholder="PDF Notes, System Design, Blueprints"
            />
          </div>
        </div>
      </div>
    </section>
  );
};