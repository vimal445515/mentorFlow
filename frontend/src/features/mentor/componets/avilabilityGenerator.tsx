import React, { useState } from "react";

interface AiAvailabilityGeneratorProps {
  onApplySlots: (generatedSlots: Record<string, { time: string; status: "available" }[]>) => void;
  currentYear: number;
  currentMonth: number;
}

export const AiAvailabilityGenerator: React.FC<AiAvailabilityGeneratorProps> = ({
  onApplySlots,
  currentYear,
  currentMonth,
}) => {
  const [prompt, setPrompt] = useState<string>(
    "I'm available Monday to Friday from 6 PM to 9 PM, and Saturdays 10 AM to 1 PM",
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [parsedPreview, setParsedPreview] = useState<{
    summary: string;
    slotsData: Record<string, { time: string; status: "available" }[]>;
    totalSlots: number;
  } | null>(null);

  const parseAiPromptToDateSlots = (inputPrompt: string) => {
    const result: Record<string, { time: string; status: "available" }[]> = {};
    const text = inputPrompt.toLowerCase();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let times = ["06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM"];
    if (text.includes("10 am") || text.includes("morning")) {
      times = ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM"];
    } else if (text.includes("2 pm") || text.includes("afternoon")) {
      times = ["02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM"];
    }

    const isWeekday =
      text.includes("monday to friday") ||
      text.includes("weekday") ||
      text.includes("mon-fri") ||
      (!text.includes("saturday") && !text.includes("weekend"));
    const isWeekend =
      text.includes("saturday") || text.includes("weekend") || text.includes("sunday");

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();

      let shouldAdd = false;
      let slotTimes = times;

      if (isWeekday && dayOfWeek >= 1 && dayOfWeek <= 5) {
        shouldAdd = true;
        slotTimes = ["06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM"];
      }
      if (isWeekend && (dayOfWeek === 6 || dayOfWeek === 0)) {
        shouldAdd = true;
        slotTimes = ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM"];
      }

      if (shouldAdd) {
        result[dStr] = slotTimes.map((t) => ({ time: t, status: "available" }));
      }
    }

    return result;
  };

  const handleGenerate = (textToRun?: string) => {
    const text = textToRun ?? prompt;
    if (!text.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const slots = parseAiPromptToDateSlots(text);
      const dateKeys = Object.keys(slots);
      let total = 0;
      dateKeys.forEach((k) => (total += slots[k].length));

      let summary = `${dateKeys.length} dates configured (${total} slots total)`;
      if (text.includes("monday to friday") || text.includes("weekday")) {
        summary = `Mon–Fri: 6:00 PM – 9:00 PM (${total} slots across weekdays)`;
      } else if (text.includes("saturday") || text.includes("weekend")) {
        summary = `Weekends: 10:00 AM – 1:00 PM (${total} slots)`;
      }

      setParsedPreview({ summary, slotsData: slots, totalSlots: total });
      setIsGenerating(false);
    }, 400);
  };

  const handlePresetClick = (presetText: string) => {
    setPrompt(presetText);
    handleGenerate(presetText);
  };

  const handleConfirmApply = () => {
    if (parsedPreview) {
      onApplySlots(parsedPreview.slotsData);
      setParsedPreview(null);
    }
  };

  return (
    <div className="ai-agent-prompt-card mb-6 p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 mb-2">
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI Availability Generator
          </span>
          <h2 className="text-lg font-bold text-stone-900 mb-1">
            Natural Language Schedule Assistant
          </h2>
          <p className="text-xs text-stone-500">
            Describe your free hours in plain English. The AI agent automatically converts days and
            hours into verified bookable slots on your calendar.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
          <i className="fa-solid fa-bolt mr-1"></i> Auto-Scheduler
        </span>
      </div>

      {/* Prompt Input Bar */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fa-solid fa-message absolute left-4 top-1/2 -translate-y-1/2 text-purple-600"></i>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., I'm available Monday to Friday from 6 PM to 9 PM..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <i
            className={`fa-solid ${isGenerating ? "fa-spinner fa-spin" : "fa-wand-magic-sparkles"}`}
          ></i>
          {isGenerating ? "Generating..." : "Generate Slots"}
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
        <span className="font-bold text-stone-500">Try Presets:</span>
        <button
          type="button"
          onClick={() => handlePresetClick("Available Monday to Friday from 6 PM to 9 PM")}
          className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-stone-700 hover:border-purple-500 transition-colors flex items-center gap-1.5"
        >
          <i className="fa-solid fa-moon text-purple-500"></i> Weekday Evenings (6-9 PM)
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick("Available Saturdays and Sundays from 10 AM to 1 PM")}
          className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-stone-700 hover:border-purple-500 transition-colors flex items-center gap-1.5"
        >
          <i className="fa-solid fa-sun text-amber-500"></i> Weekend Mornings (10 AM - 1 PM)
        </button>
      </div>

      {/* Parsed Slots Live Preview Box */}
      {parsedPreview && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="font-bold text-sm text-purple-700 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check"></i> AI Parsed Schedule Preview:
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1.5 border border-stone-300 text-xs font-semibold rounded-md hover:bg-stone-100 transition-colors"
                onClick={() => setParsedPreview(null)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-secondary text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
                onClick={handleConfirmApply}
              >
                <i className="fa-solid fa-calendar-check"></i> Add to Calendar
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              <i className="fa-solid fa-check mr-1"></i> {parsedPreview.summary}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <i className="fa-solid fa-calendar-plus mr-1"></i> Ready to add to calendar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
