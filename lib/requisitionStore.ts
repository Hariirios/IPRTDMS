import { supabase } from './supabase';

export interface Requisition {
  id: string;
  title: string;
  description: string;
  category: 'Equipment' | 'Supplies' | 'Services' | 'Other';
  quantity: number;
  estimated_cost: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_by: string;
  submitted_date: string;
  reviewed_by?: string;
  reviewed_date?: string;
  review_notes?: string;
  created_at?: string;
  updated_at?: string;
}

class RequisitionStore {
  async getAll(): Promise<Requisition[]> {
    const { data, error } = await supabase
      .from('requisitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requisitions:', error);
      throw error;
    }

    return (data || []).map(req => ({
      ...req,
      estimated_cost: req.estimated_cost?.toString() || '0'
    }));
  }

  async getById(id: string): Promise<Requisition | null> {
    const { data, error } = await supabase
      .from('requisitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching requisition:', error);
      return null;
    }

    return data ? {
      ...data,
      estimated_cost: data.estimated_cost?.toString() || '0'
    } : null;
  }

  async getBySubmitter(email: string): Promise<Requisition[]> {
    const { data, error } = await supabase
      .from('requisitions')
      .select('*')
      .eq('submitted_by', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requisitions by submitter:', error);
      throw error;
    }

    return (data || []).map(req => ({
      ...req,
      estimated_cost: req.estimated_cost?.toString() || '0'
    }));
  }

  async add(requisition: Omit<Requisition, 'id' | 'created_at' | 'updated_at'>): Promise<Requisition> {
    const { data, error } = await supabase
      .from('requisitions')
      .insert([{
        ...requisition,
        estimated_cost: parseFloat(requisition.estimated_cost)
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding requisition:', error);
      throw error;
    }

    return {
      ...data,
      estimated_cost: data.estimated_cost?.toString() || '0'
    };
  }

  async update(id: string, updates: Partial<Requisition>): Promise<Requisition> {
    const updateData: any = { ...updates };
    
    // Convert estimated_cost to number if present
    if (updates.estimated_cost !== undefined) {
      updateData.estimated_cost = parseFloat(updates.estimated_cost);
    }

    const { data, error } = await supabase
      .from('requisitions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating requisition:', error);
      throw error;
    }

    return {
      ...data,
      estimated_cost: data.estimated_cost?.toString() || '0'
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('requisitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting requisition:', error);
      throw error;
    }
  }

  async approve(id: string, reviewedBy: string, reviewNotes?: string): Promise<Requisition> {
    return this.update(id, {
      status: 'Approved',
      reviewed_by: reviewedBy,
      reviewed_date: new Date().toISOString().split('T')[0],
      review_notes: reviewNotes
    });
  }

  async reject(id: string, reviewedBy: string, reviewNotes: string): Promise<Requisition> {
    return this.update(id, {
      status: 'Rejected',
      reviewed_by: reviewedBy,
      reviewed_date: new Date().toISOString().split('T')[0],
      review_notes: reviewNotes
    });
  }

  async setPending(id: string): Promise<Requisition> {
    return this.update(id, {
      status: 'Pending',
      reviewed_by: undefined,
      reviewed_date: undefined,
      review_notes: undefined
    });
  }
}

export const requisitionStore = new RequisitionStore();
