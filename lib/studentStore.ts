// Shared student store for both admin and members
export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
  addedBy: 'admin' | 'member';
  addedByEmail?: string;
  projects: Array<{
    projectId: string;
    projectName: string;
    assignedDate: string;
  }>;
}

// In-memory store (in real app, this would be in database)
let students: Student[] = [
  {
    id: '1',
    fullName: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '123-456-7890',
    enrollmentDate: '2024-01-10',
    status: 'Active',
    addedBy: 'admin',
    projects: []
  },
  {
    id: '2',
    fullName: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '123-456-7891',
    enrollmentDate: '2024-01-12',
    status: 'Active',
    addedBy: 'admin',
    projects: []
  }
];

export const studentStore = {
  getAll: () => students,
  
  getById: (id: string) => students.find(s => s.id === id),
  
  add: (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    students.push(newStudent);
    return newStudent;
  },
  
  update: (id: string, updates: Partial<Student>) => {
    students = students.map(s => s.id === id ? { ...s, ...updates } : s);
    return students.find(s => s.id === id);
  },
  
  delete: (id: string) => {
    students = students.filter(s => s.id !== id);
  },
  
  addProjectToStudent: (studentId: string, projectId: string, projectName: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const projectExists = student.projects.some(p => p.projectId === projectId);
      if (!projectExists) {
        student.projects.push({
          projectId,
          projectName,
          assignedDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  },
  
  removeProjectFromStudent: (studentId: string, projectId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.projects = student.projects.filter(p => p.projectId !== projectId);
    }
  }
};
