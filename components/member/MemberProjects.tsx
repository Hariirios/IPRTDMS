import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Eye, Users, Calendar, Search, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { studentStore, Student } from '../../lib/studentStore';
import { projectStore, Project as ProjectType } from '../../lib/projectStore';
import { memberStore } from '../../lib/memberStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'On Hold';
  description: string;
  startDate: string;
  endDate: string;
  students: Student[];
}

export function MemberProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Get students from shared store
  const [existingStudents, setExistingStudents] = useState<Student[]>([]);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      // Get current member ID from localStorage
      const currentMemberId = localStorage.getItem('currentMemberId');
      
      if (!currentMemberId) {
        console.error('No member ID found');
        setProjects([]);
        return;
      }

      // Get member's assigned projects
      const member = await memberStore.getById(currentMemberId);
      if (!member || !member.assignedProjects || member.assignedProjects.length === 0) {
        setProjects([]);
        return;
      }

      // Fetch all projects and filter by assigned ones
      const allProjects = await projectStore.getAll();
      const assignedProjects = allProjects.filter(p => 
        member.assignedProjects.includes(p.id)
      );

      // Get all students
      const allStudents = await studentStore.getAll();

      // Map projects with their students
      const projectsWithStudents = assignedProjects.map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        students: allStudents.filter(student => 
          student.projects?.some(p => p.projectId === project.id)
        )
      }));

      setProjects(projectsWithStudents);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudents = async () => {
    const data = await studentStore.getAll();
    setExistingStudents(data);
  };

  useEffect(() => {
    loadProjects();
    loadStudents();
  }, [loadProjects]);

  // Real-time subscriptions
  useRealtimeSubscription('projects', loadProjects);
  useRealtimeSubscription('members', loadProjects);
  useRealtimeSubscription('students', () => {
    loadProjects();
    loadStudents();
  });

  const [newStudentForm, setNewStudentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentDate: '',
    status: 'Active' as 'Active' | 'Completed' | 'Dropped'
  });

  const [selectedExistingStudent, setSelectedExistingStudent] = useState('');

  const handleAddExistingStudent = async () => {
    if (!selectedProject || !selectedExistingStudent) return;

    const student = existingStudents.find(s => s.id === selectedExistingStudent);
    if (!student) return;

    // Check if student already in project
    if (selectedProject.students.some(s => s.id === student.id)) {
      toast.error('Student already added to this project');
      return;
    }

    try {
      // Add project to student record
      await studentStore.addProjectToStudent(student.id, selectedProject.id, selectedProject.name);

      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? { ...p, students: [...p.students, student] }
          : p
      ));

      toast.success('Student added to project successfully!');
      setSelectedExistingStudent('');
      setIsAddStudentModalOpen(false);
      await loadStudents();
    } catch (error) {
      toast.error('Failed to add student to project');
      console.error(error);
    }
  };

  const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      // Add student to shared store
      const newStudent = await studentStore.add({
        ...newStudentForm,
        addedBy: 'member',
        addedByEmail: 'member@iprt.edu',
        projects: []
      });

      // Add project to student
      await studentStore.addProjectToStudent(newStudent.id, selectedProject.id, selectedProject.name);

      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? { ...p, students: [...p.students, newStudent] }
          : p
      ));

      toast.success('New student added to project successfully!');
      setNewStudentForm({ fullName: '', email: '', phone: '', enrollmentDate: '', status: 'Active' });
      setIsAddStudentModalOpen(false);
      await loadStudents();
    } catch (error) {
      toast.error('Failed to add new student');
      console.error(error);
    }
  };

  const handleRemoveStudentFromProject = (studentId: string) => {
    if (!selectedProject) return;
    
    if (confirm('Remove this student from the project?')) {
      // Remove project from student record
      studentStore.removeProjectFromStudent(studentId, selectedProject.id);
      
      setProjects(projects.map(p =>
        p.id === selectedProject.id
          ? { ...p, students: p.students.filter(s => s.id !== studentId) }
          : p
      ));
      
      toast.success('Student removed from project');
      loadStudents();
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExistingStudents = existingStudents.filter(student =>
    student.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Assigned Projects</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage students in your assigned projects</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No projects assigned yet.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Contact your admin to get assigned to projects.</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.startDate} - {project.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.students.length} Students
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsViewStudentsModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Students ({project.students.length})
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add Student to {selectedProject.name}
            </h3>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex gap-6">
                  <button
                    onClick={() => {
                      setSelectedExistingStudent('');
                      document.getElementById('existing-tab')?.classList.remove('hidden');
                      document.getElementById('new-tab')?.classList.add('hidden');
                    }}
                    className="py-2 px-1 border-b-2 border-[#3B0764] text-[#3B0764] font-medium"
                    id="existing-btn"
                  >
                    Select Existing Student
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExistingStudent('');
                      document.getElementById('existing-tab')?.classList.add('hidden');
                      document.getElementById('new-tab')?.classList.remove('hidden');
                    }}
                    className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
                    id="new-btn"
                  >
                    Add New Student
                  </button>
                </nav>
              </div>
            </div>

            {/* Select Existing Student */}
            <div className="space-y-4" id="existing-tab">
              <div>
                <Label>Search Existing Students</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredExistingStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedExistingStudent(student.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExistingStudent === student.id
                        ? 'border-[#3B0764] bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{student.fullName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{student.email}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{student.phone}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddExistingStudent}
                  disabled={!selectedExistingStudent}
                  className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]"
                >
                  Add Selected Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Add New Student Form */}
            <div className="hidden space-y-4" id="new-tab">
              <form onSubmit={handleAddNewStudent} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={newStudentForm.fullName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={newStudentForm.enrollmentDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, enrollmentDate: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Cannot select future dates
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]">
                    Add New Student
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Students Modal */}
      {isViewStudentsModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Students in {selectedProject.name}
            </h3>

            {selectedProject.students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No students added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedProject.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{student.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled: {student.enrollmentDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveStudentFromProject(student.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-6">
              <Button
                variant="outline"
                onClick={() => setIsViewStudentsModalOpen(false)}
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
