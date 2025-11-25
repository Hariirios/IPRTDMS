import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, Eye, FolderOpen, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { studentStore, Student } from '../../lib/studentStore';
import { deletionRequestStore } from '../../lib/deletionRequestStore';
import { memberStore } from '../../lib/memberStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

export function MemberStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentDate: '',
    status: 'Active' as 'Active' | 'Completed' | 'Dropped'
  });

  const loadStudents = useCallback(async () => {
    const currentMemberId = localStorage.getItem('currentMemberId');
    
    if (!currentMemberId) {
      setStudents([]);
      return;
    }

    try {
      // Get member's assigned projects
      const member = await memberStore.getById(currentMemberId);
      if (!member || !member.assignedProjects || member.assignedProjects.length === 0) {
        setStudents([]);
        return;
      }

      // Get all students
      const allStudents = await studentStore.getAll();
      
      // Filter to show only students in member's assigned projects
      const memberStudents = allStudents.filter(student =>
        student.projects?.some(p => member.assignedProjects.includes(p.projectId))
      );
      
      setStudents(memberStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  }, []);

  // Load students on mount
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Real-time subscription for auto-reload
  useRealtimeSubscription('students', loadStudents);
  useRealtimeSubscription('project_students', loadStudents);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        // Update existing student
        await studentStore.update(editingStudent.id, formData);
        toast.success('Student updated successfully!');
      } else {
        // Add new student
        await studentStore.add({
          ...formData,
          addedBy: 'member',
          addedByEmail: 'member@iprt.edu', // In real app, get from auth context
          projects: []
        });
        toast.success('Student added successfully!');
      }
      
      await loadStudents();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save student. Please try again.');
      console.error(error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      enrollmentDate: student.enrollmentDate,
      status: student.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (student: Student) => {
    setDeletingStudent(student);
    setDeletionReason('');
    setIsDeletionModalOpen(true);
  };

  const submitDeletionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deletingStudent || !deletionReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    try {
      await deletionRequestStore.add({
        studentId: deletingStudent.id,
        studentName: deletingStudent.fullName,
        studentEmail: deletingStudent.email,
        requestedBy: 'member',
        requestedByEmail: 'member@iprt.edu', // In real app, get from auth context
        reason: deletionReason
      });

      toast.success('🔔 Deletion request submitted! Admin has been notified and will review your request.');
      setIsDeletionModalOpen(false);
      setDeletingStudent(null);
      setDeletionReason('');
    } catch (error) {
      toast.error('Failed to submit deletion request. Please try again.');
      console.error(error);
    }
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ fullName: '', email: '', phone: '', enrollmentDate: '', status: 'Active' });
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Dropped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage student enrollments</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3B0764] hover:bg-[#2d0550]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">No students found. Add your first student!</p>
          </div>
        ) : (
          filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">{student.fullName}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>
              
              <div className="space-y-1 mb-3 text-xs text-gray-600 dark:text-gray-400">
                <p className="truncate flex items-center gap-1">
                  <span>📧</span>
                  <span className="truncate">{student.email}</span>
                </p>
                <p className="truncate">📱 {student.phone}</p>
                <p className="truncate">📅 {student.enrollmentDate}</p>
                <p className="flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  {student.projects.length} Project{student.projects.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(student)}
                  className="flex-1 h-7 text-xs px-2"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(student)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRequest(student)}
                  className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                  title="Request Deletion"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Cannot select future dates
                </p>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Deletion Request Modal */}
      {isDeletionModalOpen && deletingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Request Student Deletion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin approval required
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Student:</p>
              <p className="font-semibold text-gray-900 dark:text-white">{deletingStudent.fullName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{deletingStudent.email}</p>
            </div>

            <form onSubmit={submitDeletionRequest} className="space-y-4">
              <div>
                <Label htmlFor="deletionReason">Reason for Deletion *</Label>
                <textarea
                  id="deletionReason"
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  placeholder="Please explain why this student should be deleted..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This reason will be reviewed by an administrator
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Submit Request
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDeletionModalOpen(false);
                    setDeletingStudent(null);
                    setDeletionReason('');
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

      {/* View Student Modal */}
      {isViewModalOpen && viewingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Student Details
            </h3>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingStudent.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewingStudent.status)}`}>
                    {viewingStudent.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingStudent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enrollment Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewingStudent.enrollmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Added By</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{viewingStudent.addedBy}</p>
                </div>
              </div>

              {/* Projects */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Assigned Projects ({viewingStudent.projects.length})
                </h4>
                {viewingStudent.projects.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-4">Not assigned to any projects yet.</p>
                ) : (
                  <div className="space-y-2">
                    {viewingStudent.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{project.projectName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Assigned: {project.assignedDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6">
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
