import { supabase } from './supabase';
import { notificationStore } from './notificationStore';

// Store for student deletion requests
export interface DeletionRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  requestedBy: string;
  requestedByEmail: string;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminResponse?: string;
  adminEmail?: string;
  responseDate?: string;
}

export const deletionRequestStore = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        studentId: r.student_id,
        studentName: r.student_name,
        studentEmail: r.student_email,
        requestedBy: r.requested_by,
        requestedByEmail: r.requested_by_email,
        reason: r.reason,
        requestDate: r.request_date,
        status: r.status as 'Pending' | 'Approved' | 'Rejected',
        adminResponse: r.admin_response,
        adminEmail: r.admin_email,
        responseDate: r.response_date
      }));
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      return [];
    }
  },
  
  getPending: async () => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        studentId: r.student_id,
        studentName: r.student_name,
        studentEmail: r.student_email,
        requestedBy: r.requested_by,
        requestedByEmail: r.requested_by_email,
        reason: r.reason,
        requestDate: r.request_date,
        status: r.status as 'Pending' | 'Approved' | 'Rejected',
        adminResponse: r.admin_response,
        adminEmail: r.admin_email,
        responseDate: r.response_date
      }));
    } catch (error) {
      console.error('Error fetching pending deletion requests:', error);
      return [];
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        studentId: data.student_id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        requestedBy: data.requested_by,
        requestedByEmail: data.requested_by_email,
        reason: data.reason,
        requestDate: data.request_date,
        status: data.status as 'Pending' | 'Approved' | 'Rejected',
        adminResponse: data.admin_response,
        adminEmail: data.admin_email,
        responseDate: data.response_date
      };
    } catch (error) {
      console.error('Error fetching deletion request:', error);
      return null;
    }
  },
  
  add: async (request: Omit<DeletionRequest, 'id' | 'requestDate' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .insert({
          student_id: request.studentId,
          student_name: request.studentName,
          student_email: request.studentEmail,
          requested_by: request.requestedBy,
          requested_by_email: request.requestedByEmail,
          reason: request.reason,
          request_date: new Date().toISOString().split('T')[0],
          status: 'Pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newRequest = {
        id: data.id,
        studentId: data.student_id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        requestedBy: data.requested_by,
        requestedByEmail: data.requested_by_email,
        reason: data.reason,
        requestDate: data.request_date,
        status: data.status as 'Pending' | 'Approved' | 'Rejected'
      };
      
      // Create notification for admin
      await notificationStore.add({
        type: 'deletion_request',
        title: 'New Student Deletion Request',
        message: `${request.requestedByEmail} requested to delete student: ${request.studentName}`,
        relatedId: newRequest.id,
        createdBy: request.requestedByEmail,
        targetUser: 'admin' // Only admin should see this
      });
      
      return newRequest;
    } catch (error) {
      console.error('Error adding deletion request:', error);
      throw error;
    }
  },
  
  approve: async (id: string, adminEmail: string, adminResponse?: string) => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .update({
          status: 'Approved',
          admin_email: adminEmail,
          admin_response: adminResponse || 'Deletion approved',
          response_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        requestedBy: data.requested_by,
        requestedByEmail: data.requested_by_email,
        reason: data.reason,
        requestDate: data.request_date,
        status: data.status as 'Pending' | 'Approved' | 'Rejected',
        adminResponse: data.admin_response,
        adminEmail: data.admin_email,
        responseDate: data.response_date
      };
    } catch (error) {
      console.error('Error approving deletion request:', error);
      throw error;
    }
  },
  
  reject: async (id: string, adminEmail: string, reason: string) => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .update({
          status: 'Rejected',
          admin_email: adminEmail,
          admin_response: reason,
          response_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        studentName: data.student_name,
        studentEmail: data.student_email,
        requestedBy: data.requested_by,
        requestedByEmail: data.requested_by_email,
        reason: data.reason,
        requestDate: data.request_date,
        status: data.status as 'Pending' | 'Approved' | 'Rejected',
        adminResponse: data.admin_response,
        adminEmail: data.admin_email,
        responseDate: data.response_date
      };
    } catch (error) {
      console.error('Error rejecting deletion request:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('deletion_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting deletion request:', error);
      throw error;
    }
  }
};
