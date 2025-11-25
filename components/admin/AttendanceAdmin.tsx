import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, XCircle, Eye, Users, Search, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { projectStore, Project } from '../../lib/projectStore';
import { studentStore, Student } from '../../lib/studentStore';
import { attendanceStore } from '../../lib/attendanceStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

interface ProjectWithStudents extends Project {
  students: Student[];
}

export function AttendanceAdmin() {
  const [projects, setProjects] = useState<ProjectWithStudents[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const allProjects = await projectStore.getAll();
      const allStudents = await studentStore.getAll();
      const allAttendance = await attendanceStore.getAll();

      // Get students for each project
      const projectsWithStudents: ProjectWithStudents[] = allProjects.map(project => {
        const projectStudents = allStudents.filter(student =>
          student.projects?.some(p => p.projectId === project.id)
        );
        return {
          ...project,
          students: projectStudents
        };
      });

      setProjects(projectsWithStudents);
      setAttendanceRecords(allAttendance);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time subscriptions
  useRealtimeSubscription('projects', loadData);
  useRealtimeSubscription('students', loadData);
  useRealtimeSubscription('project_students', loadData);
  useRealtimeSubscription('attendance', loadData);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const getAttendanceStats = (studentId: string) => {
    const records = attendanceRecords.filter(r => r.student_id === studentId);
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const total = records.length;
    // Late counts as Present for attendance percentage
    return { present: present + late, total, percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0 };
  };

  const getStudentAttendanceHistory = (studentId: string) => {
    return attendanceRecords
      .filter(r => r.student_id === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Records (View Only)</h2>
        <p className="text-gray-600 dark:text-gray-400">View student attendance tracked by members</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Read-Only Access</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You can view all attendance records but cannot modify or delete them. Only members can mark attendance.
            </p>
          </div>
        </div>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {projects.reduce((sum, p) => sum + p.students.length, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceRecords.length}</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
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
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Users className="h-4 w-4" />
                  {project.students.length} Students
                </p>
              </div>

              {/* Students List */}
              {project.students.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">No students in this project yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.students.map((student) => {
                    const stats = getAttendanceStats(student.id);
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Attendance: {stats.present}/{stats.total} ({stats.percentage}%)
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              stats.percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {stats.percentage >= 80 ? 'Good' : stats.percentage >= 60 ? 'Fair' : 'Poor'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* View Student Details Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Student Attendance Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedStudent.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    selectedStudent.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.phone}</p>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Attendance Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const stats = getAttendanceStats(selectedStudent.id);
                    return (
                      <>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <p className="text-sm text-green-800 dark:text-green-200">Present</p>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.present}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">Absent</p>
                          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.total - stats.present}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <p className="text-sm text-blue-800 dark:text-blue-200">Percentage</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.percentage}%</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Attendance History */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Attendance History</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getStudentAttendanceHistory(selectedStudent.id).map((record, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{record.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.status === 'Present' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">Present</span>
                            </>
                          ) : record.status === 'Late' ? (
                            <>
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-semibold text-orange-600">Late</span>
                            </>
                          ) : record.status === 'Absent with Reason' ? (
                            <>
                              <XCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">Absent (Informed)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-semibold text-red-600">Absent (Not Informed)</span>
                            </>
                          )}
                        </div>
                      </div>
                      {record.comment && (
                        <div className="pl-6 text-sm text-gray-600 dark:text-gray-400 italic">
                          Reason: {record.comment}
                        </div>
                      )}
                      <div className="pl-6 text-xs text-gray-500 dark:text-gray-500">
                        Marked by: {record.marked_by}
                      </div>
                    </div>
                  ))}
                  {getStudentAttendanceHistory(selectedStudent.id).length === 0 && (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">No attendance records yet.</p>
                  )}
                </div>
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
