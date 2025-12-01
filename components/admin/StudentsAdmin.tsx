import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, Eye, FolderOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { studentStore, Student } from '../../lib/studentStore';
import { projectStore, Project } from '../../lib/projectStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';
import { DeleteWithReasonDialog } from '../ui/DeleteWithReasonDialog';

export function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const loadStudents = useCallback(async () => {
    const data = await studentStore.getAll();
    setStudents(data);
  }, []);

  const loadProjects = useCallback(async () => {
    const data = await projectStore.getAll();
    setProjects(data);
  }, []);

  useEffect(() => {
    loadStudents();
    loadProjects();
  }, [loadStudents, loadProjects]);

  // Real-time subscription for auto-reload
  useRealtimeSubscription('students', loadStudents);
  useRealtimeSubscription('project_students', loadStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentDate: '',
    status: 'Active' as 'Active' | 'Completed' | 'Dropped',
    projectId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate project selection for new students
    if (!editingStudent && !formData.projectId) {
      toast.error('Please select a project for the student');
      return;
    }
    
    try {
      if (editingStudent) {
        await studentStore.update(editingStudent.id, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          enrollmentDate: formData.enrollmentDate,
          status: formData.status
        });
        toast.success('Student updated successfully!');
      } else {
        // Add new student
        const newStudent = await studentStore.add({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          enrollmentDate: formData.enrollmentDate,
          status: formData.status,
          addedBy: 'admin',
          addedByEmail: 'admin@iprt.edu',
          projects: []
        });

        // Assign to project
        const selectedProject = projects.find(p => p.id === formData.projectId);
        if (selectedProject) {
          await studentStore.addProjectToStudent(
            newStudent.id,
            formData.projectId,
            selectedProject.name
          );
        }
        
        toast.success('Student added and assigned to project successfully!');
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

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async (reason: string) => {
    if (!studentToDelete) return;
    
    try {
      await studentStore.delete(studentToDelete.id);
      

      
      await loadStudents();
      toast.success('Student deleted successfully!');
      setStudentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete student. Please try again.');
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ fullName: '', email: '', phone: '', enrollmentDate: '', status: 'Active', projectId: '' });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Dropped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    completed: students.filter(s => s.status === 'Completed').length,
    dropped: students.filter(s => s.status === 'Dropped').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage all students in the system</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#3B0764] hover:bg-[#2d0550]">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-green-800 dark:text-green-200">Active</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-800 dark:text-blue-200">Completed</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.completed}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-red-800 dark:text-red-200">Dropped</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.dropped}</p>
        </div>
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Projects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                  No students found. Add your first student!
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{student.fullName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <FolderOpen className="h-4 w-4" />
                      {student.projects.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(student)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(student)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Must be today or a future date
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

              {!editingStudent && (
                <div>
                  <Label htmlFor="projectId">Assign to Project *</Label>
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.status})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Student will be assigned to this project
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]">
                  {editingStudent ? 'Update' : 'Add'} Student
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog with Reason */}
      <DeleteWithReasonDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student?"
        message="Please provide a reason for deleting this student."
        itemName={studentToDelete?.fullName}
        reasonLabel="Reason for deletion *"
        reasonPlaceholder="e.g., Student withdrew from program, Duplicate entry, etc."
        confirmText="Delete Student"
        cancelText="Cancel"
      />
    </div>
  );
}
