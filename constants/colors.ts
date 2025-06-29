export const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#6366f1",
  "#a855f7",
  "#f43f5e",
  "#84cc16",
  "#f472b6",
] as const;

export const COLOR_CATEGORIES = {
  warm: ["#ef4444", "#f97316", "#eab308", "#f59e0b", "#f43f5e"],
  cool: ["#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#6366f1"],
  neutral: ["#ec4899", "#a855f7", "#14b8a6", "#10b981", "#84cc16"],
} as const;

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[0];

export function getColorsByCategory(category: keyof typeof COLOR_CATEGORIES) {
  return COLOR_CATEGORIES[category];
}

export function getRandomColor(): string {
  return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
}

export function getNextColor(currentColor: string): string {
  const currentIndex = CATEGORY_COLORS.indexOf(
    currentColor as (typeof CATEGORY_COLORS)[number]
  );
  const nextIndex = (currentIndex + 1) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[nextIndex];
}
