import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, FileText, Check, X, Clock, Eye, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { notificationStore } from '../../lib/notificationStore';

interface Requisition {
  id: string;
  title: string;
  description: string;
  category: 'Equipment' | 'Supplies' | 'Services' | 'Other';
  quantity: number;
  estimatedCost: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedBy: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

interface RequisitionsAdminProps {
  userRole?: 'admin' | 'member';
}

export function RequisitionsAdmin({ userRole = 'admin' }: RequisitionsAdminProps) {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRequisition, setViewingRequisition] = useState<Requisition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Equipment' as 'Equipment' | 'Supplies' | 'Services' | 'Other',
    quantity: 1,
    estimatedCost: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const [reviewNotes, setReviewNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequisition: Requisition = {
      ...formData,
      id: Date.now().toString(),
      status: 'Pending',
      submittedBy: userRole === 'admin' ? 'admin@iprt.edu' : 'member@iprt.edu',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    
    setRequisitions([newRequisition, ...requisitions]);
    
    // Create notification for admin if submitted by member
    if (userRole === 'member') {
      notificationStore.add({
        type: 'requisition',
        title: 'New Requisition Request',
        message: `${newRequisition.submittedBy} submitted a requisition for ${newRequisition.title}`,
        relatedId: newRequisition.id,
        createdBy: newRequisition.submittedBy
      });
      toast.success('🔔 Requisition submitted! Admin has been notified.');
    } else {
      toast.success('Requisition submitted successfully!');
    }
    
    handleCloseModal();
  };

  const handleApprove = (id: string) => {
    setRequisitions(requisitions.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'Approved',
            reviewedBy: 'admin@iprt.edu',
            reviewedDate: new Date().toISOString().split('T')[0],
            reviewNotes
          }
        : r
    ));
    toast.success('Requisition approved!');
    setReviewNotes('');
    setIsViewModalOpen(false);
  };

  const handleReject = (id: string) => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setRequisitions(requisitions.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'Rejected',
            reviewedBy: 'admin@iprt.edu',
            reviewedDate: new Date().toISOString().split('T')[0],
            reviewNotes
          }
        : r
    ));
    toast.success('Requisition rejected');
    setReviewNotes('');
    setIsViewModalOpen(false);
  };

  const handleSetPending = (id: string) => {
    setRequisitions(requisitions.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'Pending',
            reviewedBy: undefined,
            reviewedDate: undefined,
            reviewNotes: undefined
          }
        : r
    ));
    toast.success('Requisition set to pending');
    setIsViewModalOpen(false);
  };

  const handleView = (requisition: Requisition) => {
    setViewingRequisition(requisition);
    setReviewNotes(requisition.reviewNotes || '');
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      category: 'Equipment',
      quantity: 1,
      estimatedCost: '',
      priority: 'Medium'
    });
  };

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || req.status === filterStatus;
    
    // Members only see their own requisitions
    if (userRole === 'member') {
      return matchesSearch && matchesFilter && req.submittedBy === 'member@iprt.edu';
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600';
    }
  };

  const stats = {
    total: requisitions.length,
    pending: requisitions.filter(r => r.status === 'Pending').length,
    approved: requisitions.filter(r => r.status === 'Approved').length,
    rejected: requisitions.filter(r => r.status === 'Rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Requisitions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'admin' ? 'Review and manage requisitions from members' : 'Submit and track your requisitions'}
          </p>
        </div>
        {userRole === 'member' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#3B0764] hover:bg-[#2d0550]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Requisition
          </Button>
        )}
      </div>

      {/* Admin Info Banner */}
      {userRole === 'admin' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Admin View - Review Only</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You can view all requisitions and approve/reject them. Only members can submit new requisitions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search requisitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-[#3B0764] hover:bg-[#2d0550]' : ''}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {filteredRequisitions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No requisitions found. Create your first requisition!</p>
          </div>
        ) : (
          filteredRequisitions.map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{req.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                      <span className={`text-sm font-semibold ${getPriorityColor(req.priority)}`}>
                        {req.priority} Priority
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{req.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Category: {req.category}</span>
                      <span>Quantity: {req.quantity}</span>
                      <span>Cost: ${req.estimatedCost}</span>
                      <span>Submitted: {req.submittedDate}</span>
                      {req.reviewedDate && <span>Reviewed: {req.reviewedDate}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(req)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Show review notes for rejected/approved requisitions */}
                {req.reviewNotes && (req.status === 'Rejected' || req.status === 'Approved') && (
                  <div className={`p-3 rounded-lg border-l-4 ${
                    req.status === 'Rejected' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  }`}>
                    <p className={`text-sm font-semibold mb-1 ${
                      req.status === 'Rejected' 
                        ? 'text-red-900 dark:text-red-200' 
                        : 'text-green-900 dark:text-green-200'
                    }`}>
                      {req.status === 'Rejected' ? '❌ Rejection Reason:' : '✅ Approval Note:'}
                    </p>
                    <p className={`text-sm ${
                      req.status === 'Rejected' 
                        ? 'text-red-800 dark:text-red-300' 
                        : 'text-green-800 dark:text-green-300'
                    }`}>
                      {req.reviewNotes}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Reviewed by {req.reviewedBy} on {req.reviewedDate}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Requisition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              New Requisition
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Laptop for Research"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Provide detailed description..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost ($) *</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]">
                  Submit Requisition
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View/Review Requisition Modal */}
      {isViewModalOpen && viewingRequisition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Requisition Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                <p className="text-gray-900 dark:text-white">{viewingRequisition.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                  <p className={`font-semibold ${getPriorityColor(viewingRequisition.priority)}`}>
                    {viewingRequisition.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</p>
                  <p className="font-semibold text-gray-900 dark:text-white">${viewingRequisition.estimatedCost}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(viewingRequisition.status)}`}>
                  {viewingRequisition.status === 'Pending' && '⏳ '}
                  {viewingRequisition.status === 'Approved' && '✅ '}
                  {viewingRequisition.status === 'Rejected' && '❌ '}
                  {viewingRequisition.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted By</p>
                <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.submittedBy}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.submittedDate}</p>
              </div>

              {viewingRequisition.reviewedBy && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed By</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.reviewedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{viewingRequisition.reviewedDate}</p>
                  </div>
                </>
              )}

              {viewingRequisition.reviewNotes && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  viewingRequisition.status === 'Rejected' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                    : viewingRequisition.status === 'Approved'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-500'
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    viewingRequisition.status === 'Rejected' 
                      ? 'text-red-900 dark:text-red-200' 
                      : viewingRequisition.status === 'Approved'
                      ? 'text-green-900 dark:text-green-200'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {viewingRequisition.status === 'Rejected' && '❌ Rejection Reason:'}
                    {viewingRequisition.status === 'Approved' && '✅ Approval Note:'}
                    {viewingRequisition.status === 'Pending' && '📝 Review Notes:'}
                  </p>
                  <p className={`${
                    viewingRequisition.status === 'Rejected' 
                      ? 'text-red-800 dark:text-red-300' 
                      : viewingRequisition.status === 'Approved'
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-gray-800 dark:text-gray-300'
                  }`}>
                    {viewingRequisition.reviewNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Actions */}
            {userRole === 'admin' && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add notes about your decision..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(viewingRequisition.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={viewingRequisition.status === 'Approved'}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(viewingRequisition.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={viewingRequisition.status === 'Rejected'}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleSetPending(viewingRequisition.id)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    disabled={viewingRequisition.status === 'Pending'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
