import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Clock, AlertTriangle, User, Mail, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { deletionRequestStore, DeletionRequest } from '../../lib/deletionRequestStore';
import { studentStore } from '../../lib/studentStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

interface DeletionRequestsAdminProps {
  onRequestProcessed?: () => void;
}

export function DeletionRequestsAdmin({ onRequestProcessed }: DeletionRequestsAdminProps) {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);
  const [responseType, setResponseType] = useState<'approve' | 'reject'>('approve');
  const [adminResponse, setAdminResponse] = useState('');

  const loadRequests = useCallback(async () => {
    const data = await deletionRequestStore.getAll();
    setRequests(data);
    if (onRequestProcessed) {
      onRequestProcessed();
    }
  }, [onRequestProcessed]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Real-time subscription for auto-reload
  useRealtimeSubscription('deletion_requests', loadRequests);

  const handleApprove = (request: DeletionRequest) => {
    setSelectedRequest(request);
    setResponseType('approve');
    setAdminResponse('');
    setIsResponseModalOpen(true);
  };

  const handleReject = (request: DeletionRequest) => {
    setSelectedRequest(request);
    setResponseType('reject');
    setAdminResponse('');
    setIsResponseModalOpen(true);
  };

  const submitResponse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest) return;

    if (responseType === 'reject' && !adminResponse.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const adminEmail = 'admin@iprt.edu'; // In real app, get from auth context

    try {
      if (responseType === 'approve') {
        // Approve and delete the student
        await deletionRequestStore.approve(selectedRequest.id, adminEmail, adminResponse);
        await studentStore.delete(selectedRequest.studentId);
        toast.success('Deletion request approved and student deleted!');
      } else {
        // Reject the request
        await deletionRequestStore.reject(selectedRequest.id, adminEmail, adminResponse);
        toast.success('Deletion request rejected!');
      }

      await loadRequests();
      setIsResponseModalOpen(false);
      setSelectedRequest(null);
      setAdminResponse('');
    } catch (error) {
      toast.error('Failed to process request. Please try again.');
      console.error(error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'All') return true;
    return request.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Deletion Requests</h2>
        <p className="text-gray-600 dark:text-gray-400">Review and manage deletion requests from members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-green-800 dark:text-green-200">Approved</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.approved}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-red-800 dark:text-red-200">Rejected</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption)}
            className={filter === filterOption ? 'bg-[#3B0764] hover:bg-[#2d0550]' : ''}
          >
            {filterOption}
          </Button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No {filter !== 'All' ? filter.toLowerCase() : ''} deletion requests found
            </p>
          </div>
        ) : (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {request.studentName}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {request.studentEmail}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Requested by: <span className="font-medium">{request.requestedByEmail}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Date: <span className="font-medium">{request.requestDate}</span></span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">REASON FOR DELETION:</p>
                    <p className="text-gray-900 dark:text-white">{request.reason}</p>
                  </div>

                  {/* Admin Response */}
                  {request.status !== 'Pending' && request.adminResponse && (
                    <div className={`rounded-lg p-4 ${
                      request.status === 'Approved' 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        ADMIN RESPONSE ({request.responseDate}):
                      </p>
                      <p className={`${
                        request.status === 'Approved' 
                          ? 'text-green-900 dark:text-green-100' 
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        {request.adminResponse}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        By: {request.adminEmail}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {request.status === 'Pending' && (
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleApprove(request)}
                      className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request)}
                      variant="outline"
                      className="flex-1 lg:flex-none text-red-600 hover:text-red-700 border-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {isResponseModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                responseType === 'approve' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {responseType === 'approve' ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {responseType === 'approve' ? 'Approve' : 'Reject'} Deletion Request
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRequest.studentName}
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Member's Reason:</p>
              <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.reason}</p>
            </div>

            <form onSubmit={submitResponse} className="space-y-4">
              <div>
                <Label htmlFor="adminResponse">
                  {responseType === 'approve' ? 'Additional Notes (Optional)' : 'Reason for Rejection *'}
                </Label>
                <textarea
                  id="adminResponse"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder={
                    responseType === 'approve' 
                      ? 'Add any notes about this approval...' 
                      : 'Explain why you are rejecting this request...'
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
                  required={responseType === 'reject'}
                />
              </div>

              {responseType === 'approve' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Warning:</strong> Approving this request will permanently delete the student and remove them from all projects.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  className={`flex-1 ${
                    responseType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {responseType === 'approve' ? 'Approval' : 'Rejection'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsResponseModalOpen(false);
                    setSelectedRequest(null);
                    setAdminResponse('');
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
