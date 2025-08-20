"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Table from "@/components/tables/Table";
import { MockItemRequest } from "@/lib/types/mock/request";
import { RequestStatus } from "@/lib/types/request";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [requestorName, setRequestorName] = useState<string>("");
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

  // Handle adding new item request
  const handleAddItem = useCallback(async () => {
    if (!requestorName.trim()) {
      alert('Please enter a requestor name');
      return;
    }
    
    if (!item.trim()) {
      alert('Please enter an item name');
      return;
    }

    try {
      const response = await fetch('/api/request', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestorName: requestorName.trim(),
          itemRequested: item.trim()
        }),
      });

      if (response.ok) {
        // Clear the inputs
        setRequestorName('');
        setItem('');
        // Refresh the current data to show the new item
        fetchRequests(pagination.currentPage, selectedStatus);
        alert('Item request created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating item request: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating item request:', error);
      alert('Error creating item request. Please try again.');
    }
  }, [item, requestorName, fetchRequests, pagination.currentPage, selectedStatus]);

  
  return (
    <div className="min-h-screen bg-primary p-4">
      <h2 className="font-bold text-white text-center">Approve Items</h2>
      <div className="flex flex-col w-80 gap-4 mx-auto">
        <Input
          type="text"
          placeholder="Enter requestor name"
          value={requestorName}
          onChange={(e) => setRequestorName(e.target.value)}
          label="Requestor Name"
        />
        <Input
          type="text"
          placeholder="Type an item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="Item Requested"
        />
        <Button variant="inverted" onClick={handleAddItem}>Create Request</Button>
      </div>
      <div className="max-w-7xl mx-auto mt-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <h1 className="mt-4 mx-4 text-2xl font-bold text-gray-text-field">
            Item Requests
          </h1>
          <div className="p-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="text-gray-text-field">Loading...</div>
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
