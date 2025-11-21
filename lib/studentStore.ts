import { supabase } from './supabase';

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

export const studentStore = {
  getAll: async () => {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get projects for each student
      const studentsWithProjects = await Promise.all(
        (students || []).map(async (student) => {
          const { data: projectData } = await supabase
            .from('project_students')
            .select('project_id, project_name, assigned_date')
            .eq('student_id', student.id);

          return {
            id: student.id,
            fullName: student.full_name,
            email: student.email,
            phone: student.phone,
            enrollmentDate: student.enrollment_date,
            status: student.status as 'Active' | 'Completed' | 'Dropped',
            addedBy: student.added_by as 'admin' | 'member',
            addedByEmail: student.added_by_email,
            projects: (projectData || []).map(p => ({
              projectId: p.project_id,
              projectName: p.project_name,
              assignedDate: p.assigned_date
            }))
          };
        })
      );

      return studentsWithProjects;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!student) return null;

      const { data: projectData } = await supabase
        .from('project_students')
        .select('project_id, project_name, assigned_date')
        .eq('student_id', student.id);

      return {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollment_date,
        status: student.status as 'Active' | 'Completed' | 'Dropped',
        addedBy: student.added_by as 'admin' | 'member',
        addedByEmail: student.added_by_email,
        projects: (projectData || []).map(p => ({
          projectId: p.project_id,
          projectName: p.project_name,
          assignedDate: p.assigned_date
        }))
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  },
  
  add: async (student: Omit<Student, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          full_name: student.fullName,
          email: student.email,
          phone: student.phone,
          enrollment_date: student.enrollmentDate,
          status: student.status,
          added_by: student.addedBy,
          added_by_email: student.addedByEmail || ''
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        enrollmentDate: data.enrollment_date,
        status: data.status,
        addedBy: data.added_by,
        addedByEmail: data.added_by_email,
        projects: []
      };
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<Omit<Student, 'id' | 'projects'>>) => {
    try {
      const updateData: any = {};
      if (updates.fullName) updateData.full_name = updates.fullName;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.enrollmentDate) updateData.enrollment_date = updates.enrollmentDate;
      if (updates.status) updateData.status = updates.status;
      if (updates.addedBy) updateData.added_by = updates.addedBy;
      if (updates.addedByEmail) updateData.added_by_email = updates.addedByEmail;

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return await studentStore.getById(id);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
  
  addProjectToStudent: async (studentId: string, projectId: string, projectName: string) => {
    try {
      const { error } = await supabase
        .from('project_students')
        .insert({
          student_id: studentId,
          project_id: projectId,
          project_name: projectName,
          assigned_date: new Date().toISOString().split('T')[0]
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
    } catch (error) {
      console.error('Error adding project to student:', error);
      throw error;
    }
  },
  
  removeProjectFromStudent: async (studentId: string, projectId: string) => {
    try {
      const { error } = await supabase
        .from('project_students')
        .delete()
        .eq('student_id', studentId)
        .eq('project_id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing project from student:', error);
      throw error;
    }
  }
};
