"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Edit,
  Search,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import * as LucideIcons from "lucide-react";
import {
  CATEGORY_TYPE_LABELS,
  CATEGORY_TYPE_COLORS,
} from "@/constants/categories";
import { AddCategoryModal } from "./add-category-modal";
import { DeleteCategoryModal } from "./delete-category-modal";

interface Category {
  id: string;
  name: string;
  type: "expense" | "income" | "investment";
  color: string;
  icon: string;
}

export function CategoriesTable() {
  const { data: categories, isLoading, error } = useCategories();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null,
  });

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({
      isOpen: true,
      category,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      category: null,
    });
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "icon",
      header: "Icon",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const iconName = row.original.icon;
        const IconComponent = LucideIcons[
          iconName as keyof typeof LucideIcons
        ] as React.ComponentType<{ className?: string }>;
        const color = row.original.color;

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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Type
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
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
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex space-x-1">
            <AddCategoryModal
              category={category}
              trigger={
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(category)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: categories || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();

      // Search only in name
      const name = row.getValue("name") as string;
      return name.toLowerCase().includes(searchValue);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Apply type filter
  useEffect(() => {
    if (typeFilter === "all") {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== "type"));
    } else {
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== "type"),
        { id: "type", value: typeFilter },
      ]);
    }
  }, [typeFilter]);

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
                    <div className="flex space-x-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
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
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Type:{" "}
                {typeFilter === "all"
                  ? "All"
                  : CATEGORY_TYPE_LABELS[
                      typeFilter as keyof typeof CATEGORY_TYPE_LABELS
                    ]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("expense")}>
                {CATEGORY_TYPE_LABELS.expense}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("income")}>
                {CATEGORY_TYPE_LABELS.income}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("investment")}>
                {CATEGORY_TYPE_LABELS.investment}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "icon"
                        ? "Icon"
                        : column.id.charAt(0).toUpperCase() +
                          column.id.slice(1)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {table.getFilteredRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} results
          </span>
        </div>
      </div>

      {/* Table */}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <DeleteCategoryModal
        category={deleteModal.category}
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
