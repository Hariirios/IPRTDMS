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

// In-memory store (in real app, this would be in database)
let deletionRequests: DeletionRequest[] = [];

export const deletionRequestStore = {
  getAll: () => deletionRequests,
  
  getPending: () => deletionRequests.filter(r => r.status === 'Pending'),
  
  getById: (id: string) => deletionRequests.find(r => r.id === id),
  
  add: (request: Omit<DeletionRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: DeletionRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    deletionRequests.push(newRequest);
    
    // Create notification for admin
    notificationStore.add({
      type: 'deletion_request',
      title: 'New Student Deletion Request',
      message: `${request.requestedByEmail} requested to delete student: ${request.studentName}`,
      relatedId: newRequest.id,
      createdBy: request.requestedByEmail
    });
    
    return newRequest;
  },
  
  approve: (id: string, adminEmail: string, adminResponse?: string) => {
    const request = deletionRequests.find(r => r.id === id);
    if (request) {
      request.status = 'Approved';
      request.adminEmail = adminEmail;
      request.adminResponse = adminResponse || 'Deletion approved';
      request.responseDate = new Date().toISOString().split('T')[0];
    }
    return request;
  },
  
  reject: (id: string, adminEmail: string, reason: string) => {
    const request = deletionRequests.find(r => r.id === id);
    if (request) {
      request.status = 'Rejected';
      request.adminEmail = adminEmail;
      request.adminResponse = reason;
      request.responseDate = new Date().toISOString().split('T')[0];
    }
    return request;
  },
  
  delete: (id: string) => {
    deletionRequests = deletionRequests.filter(r => r.id !== id);
  }
};
