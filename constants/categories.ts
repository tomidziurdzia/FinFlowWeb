export const CATEGORY_TYPES = {
  EXPENSE: "expense",
  INCOME: "income",
  INVESTMENT: "investment",
} as const;

export const CATEGORY_TYPE_LABELS = {
  [CATEGORY_TYPES.EXPENSE]: "Expense",
  [CATEGORY_TYPES.INCOME]: "Income",
  [CATEGORY_TYPES.INVESTMENT]: "Investment",
} as const;

export const CATEGORY_TYPE_COLORS = {
  [CATEGORY_TYPES.EXPENSE]: "bg-red-100 text-red-800",
  [CATEGORY_TYPES.INCOME]: "bg-green-100 text-green-800",
  [CATEGORY_TYPES.INVESTMENT]: "bg-blue-100 text-blue-800",
} as const;

export const TYPE_MAPPING = {
  expense: 0,
  income: 1,
  investment: 2,
} as const;

export const REVERSE_TYPE_MAPPING = {
  0: "expense",
  1: "income",
  2: "investment",
} as const;
