import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, CheckCircle, XCircle, Calendar, Users, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

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
  status: 'Present' | 'Absent';
}

interface Project {
  id: string;
  name: string;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

export function MemberAttendance() {
  // Mock projects with students
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Research Methods Training',
      students: [
        { id: '1', fullName: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '123-456-7890', enrollmentDate: '2024-01-10', status: 'Active' },
        { id: '2', fullName: 'Fatima Ali', email: 'fatima@example.com', phone: '123-456-7891', enrollmentDate: '2024-01-12', status: 'Active' }
      ],
      attendanceRecords: []
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: 'Present' | 'Absent' }>({});

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewStudentModalOpen(true);
  };

  const handleTakeAttendance = (project: Project) => {
    setSelectedProject(project);
    setIsAttendanceModalOpen(true);
    
    // Initialize attendance status for all students
    const initialStatus: { [key: string]: 'Present' | 'Absent' } = {};
    project.students.forEach(student => {
      initialStatus[student.id] = 'Present';
    });
    setAttendanceStatus(initialStatus);
  };

  const handleSubmitAttendance = () => {
    if (!selectedProject) return;

    const newRecords: AttendanceRecord[] = Object.entries(attendanceStatus).map(([studentId, status]) => ({
      studentId,
      date: attendanceDate,
      status
    }));

    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, attendanceRecords: [...p.attendanceRecords, ...newRecords] }
        : p
    ));

    toast.success('Attendance recorded successfully!');
    setIsAttendanceModalOpen(false);
    setSelectedProject(null);
  };

  const getAttendanceStats = (project: Project, studentId: string) => {
    const records = project.attendanceRecords.filter(r => r.studentId === studentId);
    const present = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    return { present, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h2>
        <p className="text-gray-600 dark:text-gray-400">Track and manage student attendance</p>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4" />
                    {project.students.length} Students
                  </p>
                </div>
                <Button
                  onClick={() => handleTakeAttendance(project)}
                  className="bg-[#3B0764] hover:bg-[#2d0550]"
                  disabled={project.students.length === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Take Attendance
                </Button>
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
      {isViewStudentModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Student Details
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
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enrollment Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.enrollmentDate}</p>
                </div>
              </div>

              {/* Attendance History */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Attendance History</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {projects.flatMap(p => 
                    p.attendanceRecords
                      .filter(r => r.studentId === selectedStudent.id)
                      .map(record => (
                        <div key={`${record.date}-${record.studentId}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-semibold text-red-600">Absent</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                  {projects.every(p => p.attendanceRecords.filter(r => r.studentId === selectedStudent.id).length === 0) && (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">No attendance records yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                variant="outline"
                onClick={() => setIsViewStudentModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Take Attendance Modal */}
      {isAttendanceModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Take Attendance - {selectedProject.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="space-y-3 mb-6">
              {selectedProject.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Present' })}
                      className={attendanceStatus[student.id] === 'Present' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-300 hover:bg-gray-400'
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Absent' })}
                      className={attendanceStatus[student.id] === 'Absent' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-300 hover:bg-gray-400'
                      }
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitAttendance}
                className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]"
              >
                Submit Attendance
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
