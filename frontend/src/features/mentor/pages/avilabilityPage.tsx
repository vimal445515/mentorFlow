import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { AvailabilitySlotData, ScheduleMap, TimeSlot } from "../types/avilability";
// import { AiAvailabilityGenerator } from "../componets/avilabilityGenerator";
import { CalendarComponent } from "../componets/calenderComponet";
import { SlotModal } from "../componets/slotModal";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import {
  getAvailabilitySlots,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../api/availabilityApi";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";
import { RouteLoader } from "@/shared/components/RouteLoader";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function toTimeSlot(slot: AvailabilitySlotData): TimeSlot {
  return {
    id: slot.slotId,
    time: `${slot.startTime} - ${slot.endTime}`,
    status: "available",
  };
}

function toScheduleMap(slots: AvailabilitySlotData[]): ScheduleMap {
  return slots.reduce<ScheduleMap>((schedule, slot) => {
    const date = slot.date.slice(0, 10);
    schedule[date] = [...(schedule[date] ?? []), toTimeSlot(slot)];
    return schedule;
  }, {});
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const AvailabilityPage: React.FC = () => {
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(() => formatLocalDate(new Date()));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await getAvailabilitySlots();
      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response while loading availability.");
      }
      setSchedule(toScheduleMap(response.data.data));
    } catch (error) {
      const message = getErrorMessage(error, "Could not load availability.");
      setLoadError(message);
      showToast(message, "error", "Load Failed");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const handleMonthChange = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(formatLocalDate(today));
  };

  const handleRemoveSlot = async (date: string, slotId: string) => {
    const confirmation = await showAlert(
      "MENTOR",
      "Remove time slot?",
      "This availability slot will be removed and students will no longer be able to book it.",
      "warning",
      "Remove",
      "Cancel",
    );
    if (!confirmation.isConfirmed) return;

    setDeletingSlotId(slotId);
    try {
      const response = await deleteAvailabilitySlot(slotId);
      setSchedule((current) => ({
        ...current,
        [date]: (current[date] ?? []).filter((slot) => slot.id !== slotId),
      }));
      showToast(response.data.message || "Time slot removed.", "success");
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not remove this time slot."),
        "error",
        "Remove Failed",
      );
    } finally {
      setDeletingSlotId(null);
    }
  };

  const handleAddSlot = async (
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await createAvailabilitySlot({ date, startTime, endTime });
      const slot = response.data.data;
      const slotDate = slot.date.slice(0, 10);
      setSchedule((current) => ({
        ...current,
        [slotDate]: [...(current[slotDate] ?? []), toTimeSlot(slot)],
      }));
      setSelectedDate(slotDate);
      showToast(response.data.message || "Time slot added.", "success");
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not add this time slot."),
        "error",
        "Add Slot Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const dateObj = new Date(`${selectedDate}T00:00:00`);
  const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const activeSlots = schedule[selectedDate] || [];
  const openCount = activeSlots.filter((s) => s.status === "available").length;
  const bookedCount = activeSlots.filter((s) => s.status === "booked").length;

  if (isLoading) {
    return <RouteLoader />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <ProfileTopBar role="MENTOR" pageTitle="Availability" onLogout={handleLogoutClick} />
      <div className="flex flex-1">
        <MentorSidebar activeItem="Availability" />
        <main className="flex-1 flex flex-col">
          <div className="w-full max-w-[1600px] mx-auto p-4 md:p-5 text-stone-900">
            {/* Top Header Row */}
            {loadError && (
              <div
                role="alert"
                className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
              >
                <span>{loadError}</span>
                <button
                  type="button"
                  onClick={() => void loadAvailability()}
                  className="shrink-0 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-stone-900 mb-1">
                  Schedule Date & Time Availability
                </h1>
                <p className="text-sm text-stone-500">
                  Select any date on the calendar to see available slots, add new time slots, or
                  view booked student sessions.
                </p>
              </div>
              <button
                onClick={() => showToast("Availability changes are saved automatically.", "info")}
                className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <i className="fa-solid fa-floppy-disk"></i> Save Availability
              </button>
            </div>

            {/* Main Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* LEFT: INTERACTIVE CALENDAR */}
              <div>
                <CalendarComponent
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  schedule={schedule}
                  onSelectDate={setSelectedDate}
                  onChangeMonth={handleMonthChange}
                  onGoToToday={handleGoToToday}
                />
              </div>

              {/* RIGHT: SELECTED DATE TIME SLOTS MANAGER */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm sticky top-20 h-[680px] flex flex-col">
                <div className="pb-4 border-b border-stone-200 mb-4">
                  <div
                    className="text-xs font-bold text-indigo-600 uppercase tracking-wider"
                    id="day-inspector-dow"
                  >
                    {dayOfWeek}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <h2 className="text-xl font-extrabold text-stone-900" id="day-inspector-date">
                      {formattedDate}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-plus"></i> Add Slot
                    </button>
                  </div>
                  <div className="text-xs text-stone-500 mt-1" id="day-inspector-summary">
                    {openCount} available &bull; {bookedCount} booked
                  </div>
                </div>

                {/* Slots List */}
                <div
                  id="day-slots-list"
                  className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-1"
                >
                  {activeSlots.length === 0 ? (
                    <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center">
                      <i className="fa-regular fa-clock text-2xl text-stone-400 mb-2"></i>
                      <div className="font-bold text-sm text-stone-900 mb-1">
                        No slots for this date
                      </div>
                      <p className="text-xs text-stone-500 mb-4">
                        Students cannot book on this day until you add a time slot.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                      >
                        <i className="fa-solid fa-plus"></i> Add Time Slot
                      </button>
                    </div>
                  ) : (
                    activeSlots.map((slot) =>
                      slot.status === "booked" ? (
                        <div
                          key={slot.id}
                          className="flex justify-between items-center p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-stone-900">{slot.time}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                Booked
                              </span>
                            </div>
                            <div className="text-xs text-stone-500 mt-1 truncate">
                              <strong>{slot.student?.name}</strong> &bull; {slot.student?.topic}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleRemoveSlot(selectedDate, slot.id)}
                            disabled={deletingSlotId === slot.id}
                            className="px-2.5 py-1 text-xs font-semibold border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-60"
                          >
                            {deletingSlotId === slot.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      ) : (
                        <div
                          key={slot.id}
                          className="flex justify-between items-center p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-xl"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-stone-900">{slot.time}</strong>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Available
                              </span>
                            </div>
                            <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                              Open for student booking
                            </div>
                          </div>
                          <button
                            onClick={() => void handleRemoveSlot(selectedDate, slot.id)}
                            disabled={deletingSlotId === slot.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove slot"
                            aria-label={`Remove ${slot.time} slot`}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      ),
                    )
                  )}
                </div>

                {/* Footer / Quick Action */}
                <div className="mt-5 pt-4 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-xs text-stone-400">Changes save automatically</span>
                  <button
                    onClick={() =>
                      showToast("Availability changes are saved automatically.", "info")
                    }
                    className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <i className="fa-solid fa-floppy-disk"></i> Save Availability
                  </button>
                </div>
              </div>
            </div>

            {/* Add Slot Modal */}
            <SlotModal
              isOpen={isModalOpen}
              selectedDate={selectedDate}
              onClose={() => setIsModalOpen(false)}
              onAddSlot={handleAddSlot}
              isSubmitting={isSaving}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
