export interface RecentAction {
  id: string;
  actionType: string;
  description: string;
  note: string | null;
  createdAt: Date | string | null;
}

export function formatActions(actions: RecentAction[]): string {
  if (!actions || !actions.length) return "No previous actions.";

  return actions
    .map((a) => {
      const time = a.createdAt
        ? new Date(a.createdAt).toISOString()
        : "unknown";
      const note = a.note ? ` | Note: ${a.note}` : "";
      return `[${time}] ${a.actionType}: ${a.description}${note}`;
    })
    .join("\n");
}
