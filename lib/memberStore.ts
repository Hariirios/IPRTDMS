import { supabase } from './supabase';

export interface Member {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  image?: string;
  status: 'Active' | 'Inactive';
  assignedProjects: string[];
}

export const memberStore = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        password: m.password,
        phone: m.phone,
        image: m.image,
        status: m.status as 'Active' | 'Inactive',
        assignedProjects: m.assigned_projects || []
      }));
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        image: data.image,
        status: data.status as 'Active' | 'Inactive',
        assignedProjects: data.assigned_projects || []
      };
    } catch (error) {
      console.error('Error fetching member:', error);
      return null;
    }
  },

  getByEmail: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        image: data.image,
        status: data.status as 'Active' | 'Inactive',
        assignedProjects: data.assigned_projects || []
      };
    } catch (error) {
      console.error('Error fetching member by email:', error);
      return null;
    }
  },

  add: async (member: Omit<Member, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: member.name,
          email: member.email,
          password: member.password, // In production, hash this!
          phone: member.phone,
          image: member.image,
          status: member.status,
          assigned_projects: member.assignedProjects
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        image: data.image,
        status: data.status,
        assignedProjects: data.assigned_projects || []
      };
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Omit<Member, 'id'>>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.password) updateData.password = updates.password;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.status) updateData.status = updates.status;
      if (updates.assignedProjects) updateData.assigned_projects = updates.assignedProjects;

      const { data, error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        image: data.image,
        status: data.status,
        assignedProjects: data.assigned_projects || []
      };
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  },

  assignProject: async (memberId: string, projectId: string) => {
    try {
      const member = await memberStore.getById(memberId);
      if (!member) throw new Error('Member not found');

      const projects = member.assignedProjects || [];
      if (!projects.includes(projectId)) {
        projects.push(projectId);
        await memberStore.update(memberId, { assignedProjects: projects });
      }
    } catch (error) {
      console.error('Error assigning project:', error);
      throw error;
    }
  },

  removeProject: async (memberId: string, projectId: string) => {
    try {
      const member = await memberStore.getById(memberId);
      if (!member) throw new Error('Member not found');

      const projects = (member.assignedProjects || []).filter(p => p !== projectId);
      await memberStore.update(memberId, { assignedProjects: projects });
    } catch (error) {
      console.error('Error removing project:', error);
      throw error;
    }
  },

  authenticate: async (email: string, password: string) => {
    try {
      const member = await memberStore.getByEmail(email);
      if (!member) return null;
      
      // Simple password check (in production, use proper hashing)
      if (member.password === password && member.status === 'Active') {
        return member;
      }
      
      return null;
    } catch (error) {
      console.error('Error authenticating member:', error);
      return null;
    }
  }
};
