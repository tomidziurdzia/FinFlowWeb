"use client";

import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as LucideIcons from "lucide-react";
import {
  CATEGORY_TYPE_LABELS,
  CATEGORY_TYPE_COLORS,
} from "@/constants/categories";

interface Category {
  id: string;
  name: string;
  type: "expense" | "income" | "investment";
  color: string;
  icon: string;
}

export function CategoriesTable() {
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "color",
      header: "",
      cell: ({ row }) => {
        const iconName = row.original.icon;
        const IconComponent = LucideIcons[
          iconName as keyof typeof LucideIcons
        ] as React.ComponentType<{ className?: string }>;
        const color = row.getValue("color") as string;

        return (
          <div className="flex items-center space-x-2">
            <div
              className="h-8 w-8 rounded flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {IconComponent && (
                <IconComponent className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              CATEGORY_TYPE_COLORS[type as keyof typeof CATEGORY_TYPE_COLORS]
            }`}
          >
            {CATEGORY_TYPE_LABELS[type as keyof typeof CATEGORY_TYPE_LABELS]}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const category = row.original;
            if (
              confirm(
                `Are you sure you want to delete the category "${category.name}"?`
              )
            ) {
              deleteCategory.mutate(category.id);
            }
          }}
          disabled={deleteCategory.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: categories || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 border rounded-lg">
        Error loading categories: {error.message}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8 border rounded-lg">
        <Plus className="mx-auto h-12 w-12 mb-4" />
        <p>No categories created</p>
        <p className="text-sm">Start by adding your first category</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No categories.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
