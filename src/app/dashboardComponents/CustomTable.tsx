'use client';

import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
}

interface Action {
  type: 'edit' | 'delete' | 'custom';
  onClick: (rowData: any) => void;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  renderCell?: (column: string, value: any, row: any) => ReactNode;
}

export default function DataTable({ 
  columns, 
  data, 
  actions = [], 
  itemsPerPageOptions = [5, 10, 25, 50],
  defaultItemsPerPage = 10,
  renderCell
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };
   
  return (
    <div className="shadow-card rounded-xl bg-white p-0 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-[var(--blue-shade-dark)] text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-gray-400">
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? 'bg-[var(--blue-shade-light)]/10'
                    : 'bg-white'
                }
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle">
                    {renderCell ? renderCell(col.key, row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3 flex gap-2 items-center">
                    {actions.map((action, index) => {
                      let icon;
                      if (action.icon) {
                        icon = action.icon;
                      } else {
                        icon = action.type === 'edit' ? (
                          <Pencil size={16} className="text-[var(--blue-shade-dark)]" />
                        ) : (
                          <Trash2 size={16} className="text-red-500" />
                        );
                      }
                      let buttonClass;
                      if (action.className) {
                        buttonClass = action.className;
                      } else {
                        buttonClass = action.type === 'edit'
                          ? 'hover:bg-[var(--blue-shade-light)]/30 text-[var(--blue-shade-dark)]'
                          : 'hover:bg-red-100 text-red-500';
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => action.onClick(row)}
                          title={action.label || action.type}
                          className={`rounded-full p-2 transition ${buttonClass}`}
                        >
                          {icon}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--blue-shade-light)] bg-white"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>of {data.length} rows</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="rounded p-1 disabled:opacity-40 hover:bg-[var(--blue-shade-light)]/30 transition"
            title="First page"
          >
            <ChevronLeft size={16} className="-ml-2" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded p-1 disabled:opacity-40 hover:bg-[var(--blue-shade-light)]/30 transition"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                disabled={typeof page !== 'number'}
                className={`rounded px-2 py-1 text-xs font-medium transition
                  ${page === currentPage ? 'bg-[var(--blue-shade-dark)] text-white shadow' : 'hover:bg-[var(--blue-shade-light)]/30 text-[var(--blue-shade-dark)]'}
                  ${typeof page !== 'number' ? 'cursor-default text-gray-400 bg-transparent' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded p-1 disabled:opacity-40 hover:bg-[var(--blue-shade-light)]/30 transition"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded p-1 disabled:opacity-40 hover:bg-[var(--blue-shade-light)]/30 transition"
            title="Last page"
          >
            <ChevronRight size={16} className="-ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
