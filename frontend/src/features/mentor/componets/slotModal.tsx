import React, { useEffect, useState } from "react";
import { Modal } from "@/shared/components/modal.tsx";

interface SlotModalProps {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onAddSlot: (dateStr: string, startTime: string, endTime: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  isOpen,
  selectedDate,
  onClose,
  onAddSlot,
  isSubmitting,
}) => {
  const [dateVal, setDateVal] = useState<string>(selectedDate);
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("19:00");

  useEffect(() => {
    if (isOpen) {
      setDateVal(selectedDate);
    }
  }, [isOpen, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateVal || isSubmitting) return;
    if (await onAddSlot(dateVal, startTime, endTime)) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Time Slot"
      subtitle="Choose date and time to open availability for students."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="p-6 pt-2">
        {/* Date Selection */}
        <div className="mb-4">
          <label
            className="block text-xs font-semibold text-stone-700 mb-1"
            htmlFor="slot-date-input"
          >
            Select Date
          </label>
          <input
            type="date"
            id="slot-date-input"
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            required
          />
        </div>

        {/* Start & End Time Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label
              className="block text-xs font-semibold text-stone-700 mb-1"
              htmlFor="slot-start-time"
            >
              Start Time
            </label>
            <input
              id="slot-start-time"
              type="time"
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-stone-700 mb-1"
              htmlFor="slot-end-time"
            >
              End Time
            </label>
            <input
              id="slot-end-time"
              type="time"
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#3D6946] hover:bg-[#2D6946] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-plus"></i> {isSubmitting ? "Adding..." : "Add Time Slot"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
