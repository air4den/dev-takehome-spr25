"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Table from "@/components/tables/Table";
import { MockItemRequest } from "@/lib/types/mock/request";
import { RequestStatus } from "@/lib/types/request";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function ItemRequestsPage() {
  const [itemRequests, setItemRequests] = useState<MockItemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 6
  });

  // Memoize fetchRequests to prevent unnecessary re-renders
  const fetchRequests = useCallback(async (page: number = 1, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (status && status !== 'all') {
        params.append('status', status);
      }
      
      const response = await fetch(`/api/request?${params.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setItemRequests(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(1, selectedStatus);
  }, [selectedStatus, fetchRequests]);

  // Memoize handleStatusChange to prevent unnecessary re-renders
  const handleStatusChange = useCallback(async (id: number, newStatus: RequestStatus) => {
    try {
      const response = await fetch('/api/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // Refresh the current page to show updated data
        fetchRequests(pagination.currentPage, selectedStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, [fetchRequests, pagination.currentPage, selectedStatus]);

  // Memoize handlePageChange to prevent unnecessary re-renders
  const handlePageChange = useCallback((newPage: number) => {
    fetchRequests(newPage, selectedStatus);
  }, [fetchRequests, selectedStatus]);

  // Memoize handleStatusTabChange to prevent unnecessary re-renders
  const handleStatusTabChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Memoize the table component props to prevent unnecessary re-renders
  const tableProps = useMemo(() => ({
    data: itemRequests,
    onStatusChange: handleStatusChange,
    pagination: pagination,
    onPageChange: handlePageChange,
    selectedStatus: selectedStatus,
    onStatusTabChange: handleStatusTabChange
  }), [itemRequests, handleStatusChange, pagination, handlePageChange, selectedStatus, handleStatusTabChange]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-2 mx-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Item Requests
          </h1>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <Table {...tableProps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
