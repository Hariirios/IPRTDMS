import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, XCircle, Eye, Users, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Absent with Reason';
  comment?: string;
  markedBy: string;
}

interface Project {
  id: string;
  name: string;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

export function AttendanceAdmin() {
  // Mock data - in real app, this would come from API/database
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Research Methods Training',
      students: [
        { id: '1', fullName: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '123-456-7890', enrollmentDate: '2024-01-10', status: 'Active' },
        { id: '2', fullName: 'Fatima Ali', email: 'fatima@example.com', phone: '123-456-7891', enrollmentDate: '2024-01-12', status: 'Active' }
      ],
      attendanceRecords: [
        { studentId: '1', date: '2024-01-15', status: 'Present', markedBy: 'member@iprt.edu' },
        { studentId: '2', date: '2024-01-15', status: 'Absent with Reason', comment: 'Medical appointment', markedBy: 'member@iprt.edu' },
        { studentId: '1', date: '2024-01-16', status: 'Present', markedBy: 'member@iprt.edu' },
        { studentId: '2', date: '2024-01-16', status: 'Present', markedBy: 'member@iprt.edu' }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleViewStudent = (project: Project, student: Student) => {
    setSelectedProject(project);
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const getAttendanceStats = (project: Project, studentId: string) => {
    const records = project.attendanceRecords.filter(r => r.studentId === studentId);
    const present = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    return { present, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  const getAttendanceForDate = (project: Project, date: string) => {
    return project.attendanceRecords.filter(r => r.date === date);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allDates = [...new Set(projects.flatMap(p => p.attendanceRecords.map(r => r.date)))].sort().reverse();

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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Filter by date"
          />
          {filterDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterDate('')}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4" />
                    {project.students.length} Students • {project.attendanceRecords.length} Records
                  </p>
                </div>
              </div>

              {/* Students List */}
              {project.students.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">No students in this project yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.students.map((student) => {
                    const stats = getAttendanceStats(project, student.id);
                    const recentRecords = project.attendanceRecords
                      .filter(r => r.studentId === student.id)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 5);

                    return (
                      <div
                        key={student.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats.percentage}%
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {stats.present}/{stats.total}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStudent(project, student)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        {/* Recent Attendance */}
                        {recentRecords.length > 0 && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Attendance:</p>
                            <div className="flex flex-wrap gap-2">
                              {recentRecords.map((record, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                    record.status === 'Present'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : record.status === 'Absent with Reason'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}
                                >
                                  {record.status === 'Present' ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <XCircle className="h-3 w-3" />
                                  )}
                                  {record.date}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
      {isViewModalOpen && selectedStudent && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Attendance Details - {selectedStudent.fullName}
            </h3>

            <div className="space-y-4 mb-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Project</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedProject.name}</p>
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
              </div>

              {/* Attendance History */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Complete Attendance History
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedProject.attendanceRecords
                    .filter(r => r.studentId === selectedStudent.id)
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((record, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{record.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {record.status === 'Present' ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-600">Present</span>
                              </>
                            ) : record.status === 'Absent with Reason' ? (
                              <>
                                <XCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-semibold text-yellow-600">Absent (Reason)</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-semibold text-red-600">Absent</span>
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
                          Marked by: {record.markedBy}
                        </div>
                      </div>
                    ))}
                  {selectedProject.attendanceRecords.filter(r => r.studentId === selectedStudent.id).length === 0 && (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">No attendance records yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
