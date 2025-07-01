'use client';

import { FaSearch, FaUser, FaRegCalendarAlt, FaLightbulb, FaChevronDown} from 'react-icons/fa';

const UserFilterBar = () => {
  return (
    <div className="filterWrapper">
      <div className="flex flex-wrap gap-2">
        {/* Search Input */}
        <div className="filterInput">
          <FaSearch />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-transparent text-sm w-full"
          />
        </div>

        {/* Role Dropdown */}
        <div className="filterDropdown">
          <FaUser />
          <select className="selectField">
            <option value="">Role</option>
            <option value="admin">Admin</option>
            <option value="owner">Van Owner</option>
            <option value="driver">Driver</option>
            <option value="parent">Parent</option>
          </select>
          <span className="dropdownArrow"><FaChevronDown /></span>
        </div>

        {/* Status Dropdown */}
        <div className="filterDropdown">
          <FaLightbulb />
          <select className="selectField">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="restricted">Restricted</option>
            <option value="deleted">Deleted</option>
          </select>
          <span className="dropdownArrow"><FaChevronDown /></span>
        </div>

        {/* Date Picker */}
        <div className="filterDropdown">
          <FaRegCalendarAlt />
          <input type="date" className="dateField" />
          <span className="dropdownArrow"><FaChevronDown /></span>
        </div>
      </div>

      {/* Add User Button */}
      <button className="addUserButton">+ Add User</button>
    </div>
  );
};

export default UserFilterBar;
