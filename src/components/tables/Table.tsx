import React, { useCallback } from "react";
import { MockItemRequest } from "@/lib/types/mock/request";
import Dropdown from "@/components/atoms/Dropdown";
import { RequestStatus } from "@/lib/types/request";
import Pagination from "@/components/molecules/Pagination";

// Move statusTabs outside component to prevent recreation
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" }
] as const;

interface TableProps {
  data: MockItemRequest[];
  onStatusChange?: (id: number, newStatus: RequestStatus) => void;
  className?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  onPageChange?: (page: number) => void;
  selectedStatus?: string;
  onStatusTabChange?: (status: string) => void;
}

// Move formatDate outside component to prevent recreation
const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "N/A";
  
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function Table({ 
  data, 
  onStatusChange, 
  className = "",
  pagination,
  onPageChange,
  selectedStatus = "all",
  onStatusTabChange
}: TableProps) {
  // Memoize handleStatusChange to prevent unnecessary re-renders
  const handleStatusChange = useCallback((id: number, newStatus: RequestStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  }, [onStatusChange]);

  // Render status tabs
  const statusTabsElements = STATUS_TABS.map((tab) => (
    <button
      key={tab.key}
      onClick={() => onStatusTabChange?.(tab.key)}
      className={`
        px-4 py-2 rounded-t-md font-medium transition-colors border border-b-0
        ${selectedStatus === tab.key
          ? 'bg-primary text-white border-primary'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
        }
      `}
    >
      {tab.label}
    </button>
  ));

  // Render table rows
  const tableRows = data.map((item) => (
    <tr
      key={item.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="py-2 px-4 text-gray-text-field text-lg font-light leading-5">
        {item.requestorName}
      </td>
      <td className="py-2 px-4 text-gray-text-field text-lg font-light leading-5">
        {item.itemRequested}
      </td>
      <td className="py-2 px-4 text-gray-text-field text-lg font-light leading-5">
        {formatDate(item.createdDate)}
      </td>
      <td className="py-2 px-4 text-gray-text-field text-lg font-light leading-5">
        {formatDate(item.lastEditedDate)}
      </td>
      <td className="py-2 px-4">
        <Dropdown
          value={item.status}
          onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
          className="w-32"
        />
      </td>
    </tr>
  ));

    // Render mobile cards
  const mobileCards = data.map((item) => (
    <div
      key={item.id}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
    >
      <div className="space-y-2">
        {/* Name and Status Row */}
        <div className="flex items-center justify-between">
          <h3 className="font-normal text-gray-text-field text-lg leading-5">
            {item.requestorName}
          </h3>
          <Dropdown
            value={item.status}
            onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
            className=""
          />
        </div>

        {/* Item Requested */}
        <div>
          <span className="text-sm font-normal text-gray-text-field leading-5">
            Item Requested:
          </span>
          <p className="text-gray-text-field text-sm font-normal leading-5 mt-1">{item.itemRequested}</p>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-normal text-gray-text-field leading-5">
              Created:
            </span>
            <p className="text-gray-text-field text-sm font-normal leading-5 mt-1">
              {formatDate(item.createdDate)}
            </p>
          </div>
          <div>
            <span className="text-sm font-normal text-gray-text-field leading-5">
              Updated:
            </span>
            <p className="text-gray-text-field text-sm font-normal leading-5 mt-1">
              {formatDate(item.lastEditedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className={`w-full ${className}`}>
      {/* Status Filter Tabs */}
      <div className="flex space-x-2 ml-4 mt-2">
        {statusTabsElements}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-b border-gray-100">
                <th className="text-left py-4 px-4 font-light text-gray-text-field leading-5">
                  Name
                </th>
                <th className="text-left py-4 px-4 font-light text-gray-text-field leading-5">
                  Item Requested
                </th>
                <th className="text-left py-4 px-4 font-light text-gray-text-field leading-5">
                  Created
                </th>
                <th className="text-left py-4 px-4 font-light text-gray-text-field leading-5">
                  Updated
                </th>
                <th className="text-left py-4 px-4 font-light text-gray-text-field leading-5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {mobileCards}
      </div>

      {/* Pagination Controls */}
      {pagination && onPageChange && (
        <div className="mt-3 mb-1 pr-6 flex justify-end">
          <Pagination
            pageNumber={pagination.currentPage}
            pageSize={pagination.pageSize}
            totalRecords={pagination.totalCount}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
