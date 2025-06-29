export const CATEGORY_ICONS = {
  food: [
    "Utensils",
    "Coffee",
    "Pizza",
    "Hamburger",
    "Apple",
    "Carrot",
    "Wine",
    "Beer",
    "IceCream",
    "Cookie",
    "Cake",
  ],

  transport: [
    "Car",
    "Plane",
    "Train",
    "Bus",
    "Bike",
    "Ship",
    "Rocket",
    "Truck",
  ],

  home: [
    "Home",
    "Building",
    "Hotel",
    "House",
    "Wrench",
    "Hammer",
    "Paintbrush",
    "Lightbulb",
    "Bed",
  ],

  work: [
    "Briefcase",
    "GraduationCap",
    "BookOpen",
    "PenTool",
    "Laptop",
    "Monitor",
    "Printer",
    "Calculator",
    "FileText",
    "Folder",
    "Archive",
    "Presentation",
  ],

  entertainment: [
    "Music",
    "Camera",
    "Headphones",
    "Tv",
    "Film",
    "Ticket",
    "Palette",
    "Brush",
    "Guitar",
  ],

  health: [
    "Heart",
    "Activity",
    "Stethoscope",
    "Pill",
    "Syringe",
    "Thermometer",
    "Brain",
    "Eye",
    "Tooth",
    "Bone",
  ],

  shopping: [
    "ShoppingCart",
    "ShoppingBag",
    "CreditCard",
    "Wallet",
    "Gift",
    "Tag",
    "Percent",
    "DollarSign",
    "Euro",
    "Receipt",
    "Package",
  ],

  communication: [
    "Phone",
    "Mail",
    "MessageCircle",
    "MessageSquare",
    "Wifi",
    "Bluetooth",
    "Signal",
    "Globe",
    "Map",
    "Smartphone",
  ],

  sports: [
    "Target",
    "Flag",
    "Medal",
    "Award",
    "Zap",
    "Mountain",
    "Sun",
    "Moon",
    "Cloud",
    "Umbrella",
  ],

  misc: [
    "Star",
    "Smile",
    "Frown",
    "ThumbsUp",
    "ThumbsDown",
    "Check",
    "X",
    "Plus",
    "Minus",
    "AlertCircle",
    "Info",
    "HelpCircle",
    "Settings",
  ],
} as const;

export const ALL_CATEGORY_ICONS = Object.values(CATEGORY_ICONS).flat();

export const POPULAR_ICONS = [
  "ShoppingCart",
  "Utensils",
  "Car",
  "Home",
  "Briefcase",
  "GraduationCap",
  "Heart",
  "Gift",
  "Music",
  "Camera",
  "Plane",
  "Train",
  "Bus",
  "Bike",
  "BookOpen",
  "Coffee",
  "Pizza",
  "Hamburger",
  "Phone",
  "Mail",
  "CreditCard",
  "Wallet",
  "Tv",
  "Headphones",
  "Star",
  "Settings",
  "Info",
] as const;

export function getIconsByCategory(category: keyof typeof CATEGORY_ICONS) {
  return CATEGORY_ICONS[category];
}

export function searchIcons(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return ALL_CATEGORY_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(lowercaseQuery)
  );
}
