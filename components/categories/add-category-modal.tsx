"use client";

import { useState, useEffect } from "react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Search, Edit } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CATEGORY_ICONS, POPULAR_ICONS, searchIcons } from "@/constants/icons";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "@/constants/colors";

const ICON_CATEGORIES = {
  popular: "Popular",
  food: "Food & Beverages",
  transport: "Transportation",
  home: "Home & Services",
  work: "Work & Education",
  entertainment: "Entertainment",
  health: "Health & Wellness",
  shopping: "Shopping & Retail",
  communication: "Communication & Tech",
  sports: "Sports & Activities",
  misc: "Others",
} as const;

interface Category {
  id: string;
  name: string;
  type: "expense" | "income" | "investment";
  color: string;
  icon: string;
}

interface AddCategoryModalProps {
  category?: Category;
  trigger?: React.ReactNode;
}

export function AddCategoryModal({ category, trigger }: AddCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIconCategory, setSelectedIconCategory] =
    useState<keyof typeof ICON_CATEGORIES>("popular");
  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "expense" | "income" | "investment",
    color: DEFAULT_CATEGORY_COLOR as string,
    icon: "ShoppingCart",
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
    } else {
      setFormData({
        name: "",
        type: "expense",
        color: DEFAULT_CATEGORY_COLOR as string,
        icon: "ShoppingCart",
      });
    }
  }, [category]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      color: DEFAULT_CATEGORY_COLOR as string,
      icon: "ShoppingCart",
    });
    setIconSearch("");
    setSelectedIconCategory("popular");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          ...formData,
        });
      } else {
        await createCategory.mutateAsync(formData);
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the mutation hooks with toasts
      console.error("Error saving category:", error);
    }
  };

  const getDisplayIcons = () => {
    if (iconSearch.trim()) {
      return searchIcons(iconSearch);
    }

    if (selectedIconCategory === "popular") {
      return POPULAR_ICONS;
    }

    return (
      CATEGORY_ICONS[selectedIconCategory as keyof typeof CATEGORY_ICONS] || []
    );
  };

  const displayIcons = getDisplayIcons();

  const firstRowColors = CATEGORY_COLORS.slice(0, 8);
  const secondRowColors = CATEGORY_COLORS.slice(8, 16);

  const defaultTrigger = isEditing ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Category
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                placeholder="e.g., Food, Transportation, Entertainment"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "expense" | "income" | "investment",
                  })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>

              <div className="mb-2">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedIconCategory}
                  onChange={(e) =>
                    setSelectedIconCategory(
                      e.target.value as keyof typeof ICON_CATEGORIES
                    )
                  }
                >
                  {Object.entries(ICON_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search icon..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-6 gap-2 max-h-64 border rounded-md p-3">
                {displayIcons.map((iconName) => {
                  const IconComponent = LucideIcons[
                    iconName as keyof typeof LucideIcons
                  ] as React.ComponentType<{ className?: string }>;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`p-2 rounded border-2 flex items-center justify-center ${
                        formData.icon === iconName
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, icon: iconName })
                      }
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  {firstRowColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
                <div className="flex justify-center space-x-2">
                  {secondRowColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
                className="flex-1"
              >
                {createCategory.isPending || updateCategory.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : isEditing ? (
                  "Update Category"
                ) : (
                  "Save Category"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
