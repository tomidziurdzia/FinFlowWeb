"use client";

import React, { useState } from "react";
import { useWallets } from "@/hooks/use-wallets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { AddWalletModal } from "@/components/wallets/add-wallet-modal";
import { DeleteWalletModal } from "@/components/wallets/delete-wallet-modal";
import {
  WALLET_TYPE_MAPPING,
  CURRENCY_TYPE_MAPPING,
} from "@/hooks/use-wallets";

interface Wallet {
  id: string;
  name: string;
  type: keyof typeof WALLET_TYPE_MAPPING;
  balance: number;
  currency: keyof typeof CURRENCY_TYPE_MAPPING;
  description?: string;
}

export function WalletsTable() {
  const { data: wallets, isLoading, error } = useWallets();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    wallet: Wallet | null;
  }>({
    isOpen: false,
    wallet: null,
  });

  const handleDeleteClick = (wallet: Wallet) => {
    setDeleteModal({
      isOpen: true,
      wallet,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      wallet: null,
    });
  };

  const columns: ColumnDef<Wallet>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
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
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
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
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as keyof typeof WALLET_TYPE_MAPPING;
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => <span>${row.getValue("balance")}</span>,
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => {
        const currency = row.getValue(
          "currency"
        ) as keyof typeof CURRENCY_TYPE_MAPPING;
        return <span>{currency}</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.getValue("description")}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div className="flex space-x-1">
            <AddWalletModal
              wallet={wallet}
              trigger={
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(wallet)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: wallets || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <span className="text-red-500">Error loading wallets</span>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <span className="text-gray-500">No wallets found</span>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteWalletModal
        wallet={deleteModal.wallet}
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
