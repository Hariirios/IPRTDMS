import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, FolderOpen, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { studentStore, Student } from '../../lib/studentStore';
import { memberStore } from '../../lib/memberStore';
import { deletionRequestStore } from '../../lib/deletionRequestStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

export function MemberStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deletionReason, setDeletionReason] = useState('');

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

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const handleRequestDeletion = (student: Student) => {
    setStudentToDelete(student);
    setDeletionReason('');
    setIsDeleteRequestModalOpen(true);
  };

  const submitDeletionRequest = async () => {
    if (!studentToDelete) return;
    
    if (!deletionReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }
    
    const currentMemberEmail = localStorage.getItem('currentMemberEmail');
    const currentMemberId = localStorage.getItem('currentMemberId');
    
    if (!currentMemberEmail) {
      toast.error('Member email not found. Please login again.');
      return;
    }
    
    console.log('Submitting deletion request:', {
      studentId: studentToDelete.id,
      studentName: studentToDelete.fullName,
      studentEmail: studentToDelete.email,
      requestedBy: 'member',
      requestedByEmail: currentMemberEmail,
      reason: deletionReason.trim()
    });
    
    try {
      const result = await deletionRequestStore.add({
        studentId: studentToDelete.id,
        studentName: studentToDelete.fullName,
        studentEmail: studentToDelete.email,
        requestedBy: 'member',
        requestedByEmail: currentMemberEmail,
        reason: deletionReason.trim()
      });
      
      console.log('Deletion request submitted successfully:', result);
      toast.success('Deletion request submitted to admin for approval');
      setIsDeleteRequestModalOpen(false);
      setStudentToDelete(null);
      setDeletionReason('');
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // More specific error messages
      if (error.message?.includes('relation "deletion_requests" does not exist')) {
        toast.error('Database table not found. Please contact administrator.');
      } else if (error.message?.includes('permission denied')) {
        toast.error('Permission denied. Please check your login status.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Failed to submit deletion request: ${error.message || 'Unknown error'}`);
      }
    }
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
        <p className="text-gray-600 dark:text-gray-400">View students in your assigned projects</p>
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
            <p className="text-gray-600 dark:text-gray-400">No students found in your assigned projects.</p>
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
                  onClick={() => handleRequestDeletion(student)}
                  className="flex-1 h-7 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Request Delete
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Deletion Request Modal */}
      {isDeleteRequestModalOpen && studentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Request Student Deletion
            </h3>
            
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This will send a deletion request to the admin for approval. 
                The student will only be deleted if the admin approves your request.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Student: <strong className="text-gray-900 dark:text-white">{studentToDelete.fullName}</strong>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Email: {studentToDelete.email}
              </p>
            </div>

            <div className="mb-4">
              <Label htmlFor="deletionReason" className="text-gray-700 dark:text-gray-300">
                Reason for deletion *
              </Label>
              <textarea
                id="deletionReason"
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Please provide a detailed reason for requesting this student's deletion (e.g., Student withdrew from program, Duplicate entry, Transferred to another institute, etc.)"
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 10 characters required
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={submitDeletionRequest}
                disabled={deletionReason.trim().length < 10}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteRequestModalOpen(false);
                  setStudentToDelete(null);
                  setDeletionReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
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
