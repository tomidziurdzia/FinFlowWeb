import { CategoriesTable } from "@/components/categories/categories-table";
import { AddCategoryModal } from "@/components/categories/add-category-modal";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your expenses by categories
          </p>
        </div>
        <AddCategoryModal />
      </div>

      <CategoriesTable />
    </div>
  );
}
