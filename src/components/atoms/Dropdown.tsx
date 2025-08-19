import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { RequestStatus } from "@/lib/types/request";

interface DropdownProps {
  value: RequestStatus;
  onChange: (status: RequestStatus) => void;
  disabled?: boolean;
  className?: string;
}

interface StatusOption {
  value: RequestStatus;
  label: string;
  dotColor: string;
  textColor: string;
  badgeColor: string;
}

export default function Dropdown({
  value,
  onChange,
  disabled = false,
  className = ""
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize statusOptions to prevent recreation on every render
  const statusOptions = useMemo<StatusOption[]>(() => [
    {
      value: RequestStatus.PENDING,
      label: "Pending",
      dotColor: "bg-status-pending-dot",
      textColor: "text-status-pending-text",
      badgeColor: "bg-status-pending-badge"
    },
    {
      value: RequestStatus.APPROVED,
      label: "Approved",
      dotColor: "bg-status-approved-dot",
      textColor: "text-status-approved-text",
      badgeColor: "bg-status-approved-badge"
    },
    {
      value: RequestStatus.COMPLETED,
      label: "Completed",
      dotColor: "bg-status-completed-dot",
      textColor: "text-status-completed-text",
      badgeColor: "bg-status-completed-badge"
    },
    {
      value: RequestStatus.REJECTED,
      label: "Rejected",
      dotColor: "bg-status-rejected-dot",
      textColor: "text-status-rejected-text",
      badgeColor: "bg-status-rejected-badge"
    }
  ], []);

  const selectedOption = useMemo(() => 
    statusOptions.find(option => option.value === value), 
    [statusOptions, value]
  );

  // Memoize click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Memoize toggle and select handlers
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  const handleSelect = useCallback((status: RequestStatus) => {
    onChange(status);
    setIsOpen(false);
  }, [onChange]);

  if (!selectedOption) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full px-2 py-1.5 rounded-md border transition-all min-w-[160px]
          ${isOpen 
            ? 'border-primary bg-white hover:bg-status-hover-button'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-status-hover-button'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className={`flex items-center space-x-2 px-2 py-0.5 rounded-full ${selectedOption.badgeColor} min-w-0`}>
          <div className={`w-1.5 h-1.5 rounded-full ${selectedOption.dotColor} flex-shrink-0`} />
          <span className={`font-medium ${selectedOption.textColor} truncate text-sm`}>
            {selectedOption.label}
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div 
          className="fixed bg-white rounded-md z-[9999]"
          style={{
            width: '160px',
            padding: '4px 8px',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0px 0px 4px 0px rgba(63, 63, 63, 0.16), 0px 4px 8px 0px rgba(87, 87, 87, 0.16)'
          }}
        >
          <div className="flex flex-col gap-3 py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full text-left transition-colors"
              >
                <div className={`flex items-center space-x-2 px-2 py-0.5 rounded-full ${option.badgeColor} min-w-0`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${option.dotColor} flex-shrink-0`} />
                  <span className={`font-medium ${option.textColor} truncate text-sm`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}