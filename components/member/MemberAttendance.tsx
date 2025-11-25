import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Eye, CheckCircle, XCircle, Calendar, Users, Search, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { projectStore, Project } from '../../lib/projectStore';
import { studentStore, Student } from '../../lib/studentStore';
import { attendanceStore } from '../../lib/attendanceStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

interface ProjectWithStudents extends Project {
  students: Student[];
}

export function MemberAttendance() {
  const [projects, setProjects] = useState<ProjectWithStudents[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectWithStudents | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: 'Present' | 'Late' | 'Absent' | 'Absent with Reason' }>({});
  const [attendanceComments, setAttendanceComments] = useState<{ [key: string]: string }>({});
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const currentMemberId = localStorage.getItem('currentMemberId');
      
      if (!currentMemberId) {
        setProjects([]);
        return;
      }

      // Get member's assigned projects
      const allProjects = await projectStore.getAll();
      const allStudents = await studentStore.getAll();
      const allAttendance = await attendanceStore.getAll();

      // Filter projects assigned to this member
      const memberProjects = allProjects.filter(p => 
        p.assignedMembers?.includes(currentMemberId)
      );

      // Get students for each project
      const projectsWithStudents: ProjectWithStudents[] = memberProjects.map(project => {
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
      toast.error('Failed to load data');
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
    setIsViewStudentModalOpen(true);
  };

  const handleTakeAttendance = async (project: ProjectWithStudents) => {
    // Check if attendance already marked for today
    const alreadyMarked = await attendanceStore.checkIfMarked(project.id, attendanceDate);
    
    if (alreadyMarked) {
      toast.error(`Attendance already marked for ${attendanceDate}`);
      return;
    }

    setSelectedProject(project);
    setIsAttendanceModalOpen(true);
    
    // Initialize attendance status for all students
    const initialStatus: { [key: string]: 'Present' | 'Late' | 'Absent' | 'Absent with Reason' } = {};
    project.students.forEach(student => {
      initialStatus[student.id] = 'Present';
    });
    setAttendanceStatus(initialStatus);
    setAttendanceComments({});
  };

  const handleSubmitAttendance = async () => {
    if (!selectedProject) return;

    try {
      const memberEmail = localStorage.getItem('currentMemberEmail') || 'member@iprt.edu';
      
      const attendanceRecords = Object.entries(attendanceStatus).map(([studentId, status]) => ({
        student_id: studentId,
        project_id: selectedProject.id,
        date: attendanceDate,
        status,
        comment: attendanceComments[studentId] || '',
        marked_by: memberEmail
      }));

      await attendanceStore.addBulk(attendanceRecords);
      
      toast.success('Attendance recorded successfully!');
      setIsAttendanceModalOpen(false);
      setSelectedProject(null);
      setAttendanceComments({});
      await loadData();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Failed to submit attendance');
    }
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
            <p className="text-gray-600 dark:text-gray-400">No projects assigned to you yet.</p>
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
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cannot mark attendance for future dates
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {selectedProject.students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => {
                          setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Present' });
                          setAttendanceComments({ ...attendanceComments, [student.id]: '' });
                        }}
                        className={`text-xs px-2 ${attendanceStatus[student.id] === 'Present' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                        }`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Late' });
                          setAttendanceComments({ ...attendanceComments, [student.id]: '' });
                        }}
                        className={`text-xs px-2 ${attendanceStatus[student.id] === 'Late' 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Late
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          // When clicking Absent, show the reason field
                          setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Absent' });
                        }}
                        className={`text-xs px-2 ${(attendanceStatus[student.id] === 'Absent' || attendanceStatus[student.id] === 'Absent with Reason')
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                        }`}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                  
                  {/* Reason field for Absent - Optional */}
                  {(attendanceStatus[student.id] === 'Absent' || attendanceStatus[student.id] === 'Absent with Reason') && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Did the student inform you?</span>
                      </div>
                      <textarea
                        placeholder="Optional: Add reason if student informed (e.g., Medical appointment, Family emergency). Leave empty if student didn't inform."
                        value={attendanceComments[student.id] || ''}
                        onChange={(e) => {
                          const comment = e.target.value;
                          setAttendanceComments({ ...attendanceComments, [student.id]: comment });
                          // Update status based on whether there's a comment
                          if (comment.trim()) {
                            setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Absent with Reason' });
                          } else {
                            setAttendanceStatus({ ...attendanceStatus, [student.id]: 'Absent' });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Tip: Adding a reason means the student informed you and won't lose attendance points. Leave empty if they didn't inform.
                      </p>
                    </div>
                  )}
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
