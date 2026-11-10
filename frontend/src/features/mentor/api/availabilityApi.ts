import { api } from "@/core/api/axios";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  AvailabilityApiResponse,
  AvailabilitySlotData,
} from "../types/avilability";

export function getAvailabilitySlots() {
  return api.get<AvailabilityApiResponse<AvailabilitySlotData[]>>(
    ENDPOINTS.AVAILABILITY.LIST,
  );
}

export function createAvailabilitySlot(values: {
  date: string;
  startTime: string;
  endTime: string;
}) {
  return api.post<AvailabilityApiResponse<AvailabilitySlotData>>(
    ENDPOINTS.AVAILABILITY.CREATE,
    values,
  );
}

export function deleteAvailabilitySlot(slotId: string) {
  return api.delete<AvailabilityApiResponse<null>>(
    ENDPOINTS.AVAILABILITY.DELETE(slotId),
  );
}
