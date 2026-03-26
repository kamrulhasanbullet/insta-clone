import { formatDistanceToNow, format } from "date-fns";

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMMM d, yyyy");
}
