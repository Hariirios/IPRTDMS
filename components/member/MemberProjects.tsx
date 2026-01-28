import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Eye, Users, Calendar, Search, FolderOpen } from 'lucide-react';
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
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
    // This function is kept for potential future use but currently not needed
    // since members can only view students, not add them
  };

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Real-time subscriptions
  useRealtimeSubscription('projects', loadProjects);
  useRealtimeSubscription('members', loadProjects);
  useRealtimeSubscription('students', loadProjects);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
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
