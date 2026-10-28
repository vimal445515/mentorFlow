import type { Experience } from "../entities/Experience.ts";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const DAYS_PER_EXPERIENCE_YEAR = 365;

type ExperienceDateRange = Pick<
  Experience,
  "startDate" | "endDate" | "isCurrent"
>;

function toUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function calculateYearsExperience(
  experiences: ExperienceDateRange[],
  asOf = new Date(),
): number {
  const today = toUtcDay(asOf);
  const ranges = experiences
    .map(({ startDate, endDate, isCurrent }) => {
      const start = toUtcDay(startDate);
      if (start > today) {
        return null;
      }

      const recordedEnd = isCurrent || !endDate ? today : toUtcDay(endDate);
      const inclusiveEnd = Math.min(recordedEnd, today);
      if (inclusiveEnd < start) {
        return null;
      }

      return { start, end: inclusiveEnd + DAY_IN_MILLISECONDS };
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((left, right) => left.start - right.start);

  let totalDays = 0;
  let currentRange: { start: number; end: number } | null = null;

  for (const range of ranges) {
    if (!currentRange) {
      currentRange = { ...range };
      continue;
    }

    if (range.start <= currentRange.end) {
      currentRange.end = Math.max(currentRange.end, range.end);
      continue;
    }

    totalDays += (currentRange.end - currentRange.start) / DAY_IN_MILLISECONDS;
    currentRange = { ...range };
  }

  if (currentRange) {
    totalDays += (currentRange.end - currentRange.start) / DAY_IN_MILLISECONDS;
  }

  return Math.floor(totalDays / DAYS_PER_EXPERIENCE_YEAR);
}
