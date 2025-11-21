import { supabase } from './supabase';

// Shared team member store
export interface TeamMember {
  id: string;
  name: string;
  type: 'Staff' | 'Technician' | 'Facilitator';
  role: string;
  department: string;
  email: string;
  phone: string;
  image?: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export const teamStore = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(m => ({
        id: m.id,
        name: m.name,
        type: m.type as 'Staff' | 'Technician' | 'Facilitator',
        role: m.role,
        department: m.department,
        email: m.email,
        phone: m.phone,
        image: m.image,
        joinDate: m.join_date,
        status: m.status as 'Active' | 'Inactive'
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },
  
  getByType: async (type: 'Staff' | 'Technician' | 'Facilitator') => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('type', type)
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(m => ({
        id: m.id,
        name: m.name,
        type: m.type as 'Staff' | 'Technician' | 'Facilitator',
        role: m.role,
        department: m.department,
        email: m.email,
        phone: m.phone,
        image: m.image,
        joinDate: m.join_date,
        status: m.status as 'Active' | 'Inactive'
      }));
    } catch (error) {
      console.error('Error fetching team members by type:', error);
      return [];
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        type: data.type as 'Staff' | 'Technician' | 'Facilitator',
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone,
        image: data.image,
        joinDate: data.join_date,
        status: data.status as 'Active' | 'Inactive'
      };
    } catch (error) {
      console.error('Error fetching team member:', error);
      return null;
    }
  },
  
  add: async (member: Omit<TeamMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          type: member.type,
          role: member.role,
          department: member.department,
          email: member.email,
          phone: member.phone,
          image: member.image || null,
          join_date: member.joinDate || new Date().toISOString().split('T')[0],
          status: member.status
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        type: data.type as 'Staff' | 'Technician' | 'Facilitator',
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone,
        image: data.image,
        joinDate: data.join_date,
        status: data.status as 'Active' | 'Inactive'
      };
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },
  
  update: async (id: string, updates: Partial<TeamMember>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.type) updateData.type = updates.type;
      if (updates.role) updateData.role = updates.role;
      if (updates.department) updateData.department = updates.department;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.joinDate) updateData.join_date = updates.joinDate;
      if (updates.status) updateData.status = updates.status;

      const { data, error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        type: data.type as 'Staff' | 'Technician' | 'Facilitator',
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone,
        image: data.image,
        joinDate: data.join_date,
        status: data.status as 'Active' | 'Inactive'
      };
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }
};
