"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-zinc-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3 text-xs font-semibold tracking-wide text-zinc-600 uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-4 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="p-10 text-center">
          <div className="text-sm font-medium text-zinc-900">
            No hay productos
          </div>
          <div className="text-sm text-zinc-600 mt-1">
            Crea tu primer producto para verlo aquí.
          </div>
        </div>
      )}
    </div>
  );
}
