'use client';

import {
  FaSearch,
  FaUser,
  FaRegCalendarAlt,
  FaLightbulb,
  FaChevronDown,
} from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  searchPlaceholder?: string;
  roleOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  showDateFilter?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  showClearButton?: boolean;
  onAddClick?: () => void;
}

interface SearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
  onDateChange: (date: string) => void;
  onClearFilters: () => void;
  config?: FilterConfig;
}

const defaultConfig: FilterConfig = {
  searchPlaceholder: 'Search',
  roleOptions: [
    { value: '', label: 'Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'van owner', label: 'Van Owner' },
    { value: 'driver', label: 'Driver' },
    { value: 'parent', label: 'Parent' },
  ],
  statusOptions: [
    { value: '', label: 'Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
  ],
  showDateFilter: true,
  showAddButton: true,
  showClearButton: true,
  addButtonText: '+ Add User',
};

const SearchFilter = ({
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onDateChange,
  onClearFilters,
  config = {},
}: SearchFilterProps) => {
  const finalConfig = { ...defaultConfig, ...config };

  return (
    <div className="filterWrapper">
      <div className="flex flex-wrap gap-2">
        {/* Search Input */}
        <div className="filterInput">
          <FaSearch />
          <input
            type="text"
            placeholder={finalConfig.searchPlaceholder}
            className="outline-none bg-transparent text-sm w-full"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Role Dropdown */}
        {finalConfig.roleOptions && (
          <div className="filterDropdown">
            <FaUser />
            <select
              className="selectField"
              onChange={(e) => onRoleChange(e.target.value)}
            >
              {finalConfig.roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="dropdownArrow">
              <FaChevronDown />
            </span>
          </div>
        )}

        {/* Status Dropdown */}
        {finalConfig.statusOptions && (
          <div className="filterDropdown">
            <FaLightbulb />
            <select
              className="selectField"
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {finalConfig.statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="dropdownArrow">
              <FaChevronDown />
            </span>
          </div>
        )}

        {/* Date Picker */}
        {finalConfig.showDateFilter && (
          <div className="filterDropdown">
            <FaRegCalendarAlt />
            <input
              type="date"
              className="dateField"
              onChange={(e) => onDateChange(e.target.value)}
            />
            <span className="dropdownArrow">
              <FaChevronDown />
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        {/* Clear Filters Icon */}
        {finalConfig.showClearButton && (
          <div className="relative group">
            <span
              className="cursor-pointer text-gray-500"
              onClick={onClearFilters}
            >
              <MdDeleteSweep size={25} />
            </span>
            <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-xl px-2 py-1 my-1 top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
              Clear
            </div>
          </div>
        )}

        {/* Add Button */}
        {finalConfig.showAddButton && (
          <button className="addUserButton" onClick={finalConfig.onAddClick}>
            {finalConfig.addButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
