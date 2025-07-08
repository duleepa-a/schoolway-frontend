'use client';

import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
}

interface Action {
  type: 'edit' | 'delete' | 'custom';
  onClick: (rowData: Record<string, string | number | boolean | null | undefined>) => void;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, string | number | boolean | null | undefined>[];
  actions?: Action[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
}

export default function DataTable({ 
  columns, 
  data, 
  actions = [], 
  itemsPerPageOptions = [5, 10, 25, 50],
  defaultItemsPerPage = 10 
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
    <div className="table-container">
      <table className="custom-table">
        <thead className="table-head">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-head-cell">
                {col.label}
              </th>
            ))}
            {actions.length > 0 && <th className="table-head-cell">Actions</th>}
          </tr>
        </thead>
        <tbody className="table-body">
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row-even">
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {String(row[col.key] ?? '')}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="action-cell">
                  {actions.map((action, index) => {
                    // Determine icon to display
                    let icon;
                    if (action.icon) {
                      icon = action.icon;
                    } else {
                      // Default icons based on type
                      icon = action.type === 'edit' ? <Pencil size={16} /> : <Trash2 size={16} />;
                    }

                    // Determine CSS class
                    let buttonClass;
                    if (action.className) {
                      buttonClass = action.className;
                    } else {
                      // Default classes based on type
                      buttonClass = action.type === 'edit' ? 'edit-icon' : 'delete-icon';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        title={action.label || action.type}
                        className={buttonClass}
                      >
                        {icon}
                      </button>
                    );
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div className="pagination-container">
        <div className="pagination-info">
          <span>Rows per page</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="pagination-select"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>
            of {data.length} rows
          </span>
        </div>
        
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="First page"
          >
            
            <ChevronLeft size={16} className="-ml-2" />
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                disabled={typeof page !== 'number'}
                className={`pagination-number ${
                  page === currentPage ? 'pagination-number-active' : ''
                } ${typeof page !== 'number' ? 'pagination-ellipsis' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
            title="Last page"
          >
            
            <ChevronRight size={16} className="-ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
