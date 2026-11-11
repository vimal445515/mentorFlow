import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { SlotModal } from "../componets/slotModal";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  getAvailabilitySlots,
} from "../api/availabilityApi";
import type { AvailabilitySlotData } from "../types/avilability";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";
import { RouteLoader } from "@/shared/components/RouteLoader";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSelectedDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const AvailabilityPage: React.FC = () => {
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()));
  const [slots, setSlots] = useState<AvailabilitySlotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await getAvailabilitySlots();
      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response while loading availability.");
      }
      setSlots(response.data.data);
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

  const handleAddSlot = async (
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      for (let slot of slots) {
        if (slot.date === date) {
          if (slot.startTime === startTime || slot.endTime === endTime) {
            showToast("sloat already avilable use another time!", "error");
            return false;
          }

          if (
            (startTime > slot.startTime && startTime < slot.endTime) ||
            (endTime > slot.startTime && endTime < slot.endTime)
          ) {
            showToast("sloat already avilable use another time!", "error");
            return false;
          }
        }
      }
      const response = await createAvailabilitySlot({ date, startTime, endTime });
      setSlots((current) =>
        [...current, response.data.data].sort((a, b) =>
          `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
        ),
      );
      setSelectedDate(date);
      showToast(response.data.message || "Availability added.", "success");
      return true;
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not add this availability."),
        "error",
        "Add Availability Failed",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSlot = async (slot: AvailabilitySlotData) => {
    const confirmation = await showAlert(
      "MENTOR",
      "Remove availability?",
      "Students will no longer be able to book this time.",
      "warning",
      "Remove",
      "Cancel",
    );
    if (!confirmation.isConfirmed) return;

    setDeletingSlotId(slot.slotId);
    try {
      const response = await deleteAvailabilitySlot(slot.slotId);
      setSlots((current) => current.filter((availability) => availability.slotId !== slot.slotId));
      showToast(response.data.message || "Availability removed.", "success");
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not remove this availability."),
        "error",
        "Remove Failed",
      );
    } finally {
      setDeletingSlotId(null);
    }
  };

  const selectedSlots = slots
    .filter((slot) => slot.date.slice(0, 10) === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const availableCount = selectedSlots.filter((slot) => !slot.isBooked).length;
  const bookedCount = selectedSlots.filter((slot) => slot.isBooked).length;

  if (isLoading) {
    return <RouteLoader />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5] font-sans">
      <ProfileTopBar role="MENTOR" pageTitle="Availability" onLogout={handleLogoutClick} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <MentorSidebar activeItem="Availability" />
        <main className="scrollbar-hidden min-h-0 min-w-0 flex-1 overflow-y-auto p-4 text-stone-900 md:p-8">
          <div className="mx-auto max-w-4xl">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Availability</h1>
                <p className="mt-1 text-sm text-stone-500">
                  Add and manage the times students can book with you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-[#3D6946] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4D6946]"
              >
                + Add time
              </button>
            </header>

            {loadError && (
              <div
                role="alert"
                className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
              >
                <span>{loadError}</span>
                <button
                  type="button"
                  onClick={() => void loadAvailability()}
                  className="font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <label
                    htmlFor="availability-date"
                    className="mb-1 block text-sm font-medium text-stone-600"
                  >
                    Select a date
                  </label>
                  <input
                    id="availability-date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <p className="text-sm text-stone-500">
                  {availableCount} available
                  {bookedCount > 0 ? ` · ${bookedCount} booked` : ""}
                </p>
              </div>

              <div className="pt-4">
                <h2 className="mb-3 text-lg font-semibold">{formatSelectedDate(selectedDate)}</h2>
                {selectedSlots.length === 0 ? (
                  <div className="rounded-lg bg-stone-50 px-4 py-10 text-center">
                    <p className="text-sm text-stone-600">No availability added for this date.</p>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Add a time
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {selectedSlots.map((slot) => (
                      <li
                        key={slot.slotId}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="font-medium">
                            {slot.startTime} – {slot.endTime}
                          </p>
                          <p
                            className={`mt-0.5 text-xs ${
                              slot.isBooked ? "text-blue-700" : "text-emerald-700"
                            }`}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </p>
                        </div>
                        {!slot.isBooked && (
                          <button
                            type="button"
                            onClick={() => void handleRemoveSlot(slot)}
                            disabled={deletingSlotId === slot.slotId}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingSlotId === slot.slotId ? "Removing..." : "Remove"}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <SlotModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        onClose={() => setIsModalOpen(false)}
        onAddSlot={handleAddSlot}
        isSubmitting={isSaving}
      />
    </div>
  );
};
