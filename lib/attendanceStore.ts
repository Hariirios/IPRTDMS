import { supabase } from './supabase';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  project_id: string;
  date: string;
  status: 'Present' | 'Late' | 'Absent' | 'Absent with Reason';
  comment?: string;
  marked_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceWithDetails extends AttendanceRecord {
  student_name?: string;
  student_email?: string;
  project_name?: string;
}

class AttendanceStore {
  async getAll(): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }

    return data || [];
  }

  async getByProject(projectId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance by project:', error);
      throw error;
    }

    return data || [];
  }

  async getByStudent(studentId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance by student:', error);
      throw error;
    }

    return data || [];
  }

  async getByProjectAndDate(projectId: string, date: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('project_id', projectId)
      .eq('date', date);

    if (error) {
      console.error('Error fetching attendance by project and date:', error);
      throw error;
    }

    return data || [];
  }

  async add(attendance: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AttendanceRecord> {
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendance])
      .select()
      .single();

    if (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }

    return data;
  }

  async addBulk(attendanceRecords: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendanceRecords)
      .select();

    if (error) {
      console.error('Error adding bulk attendance:', error);
      throw error;
    }

    return data || [];
  }

  async update(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  async getAttendanceStats(studentId: string, projectId?: string): Promise<{
    total: number;
    present: number;
    late: number;
    absent: number;
    absentWithReason: number;
    percentage: number;
  }> {
    let query = supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }

    const records = data || [];
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const absentWithReason = records.filter(r => r.status === 'Absent with Reason').length;
    // Late counts as Present for attendance percentage
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return {
      total,
      present,
      late,
      absent,
      absentWithReason,
      percentage
    };
  }

  async checkIfMarked(projectId: string, date: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('attendance')
      .select('id')
      .eq('project_id', projectId)
      .eq('date', date)
      .limit(1);

    if (error) {
      console.error('Error checking if attendance marked:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  }
}

export const attendanceStore = new AttendanceStore();
