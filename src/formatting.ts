import { IsoDate } from "./IsoDate";

export const defaultLocale = "en";

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 0) {
    throw new Error(`Invalid total minutes: ${totalMinutes}`);
  }

  const hours = Math.floor(totalMinutes / 60);

  const minutes = totalMinutes % 60;

  if (!hours) {
    return formatMinutes(minutes);
  }

  if (!minutes) {
    return formatHours(hours);
  }

  return `${formatHours(hours)}, ${formatMinutes(minutes)}`;
}

function formatHours(hours: number): string {
  return `${hours} hour${hours == 1 ? "" : "s"}`;
}

function formatMinutes(minutes: number): string {
  return `${minutes} minute${minutes == 1 ? "" : "s"}`;
}

export function formatDate(date: IsoDate): string {
  return date.unboxed.toLocaleString(defaultLocale, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
