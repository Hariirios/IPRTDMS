import { supabase } from './supabase';

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'On Hold';
  description: string;
  startDate: string;
  endDate: string;
  assignedMembers: string[];
}

export const projectStore = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        status: p.status as 'Active' | 'Completed' | 'On Hold',
        description: p.description,
        startDate: p.start_date,
        endDate: p.end_date || '',
        assignedMembers: p.assigned_members || []
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        status: data.status as 'Active' | 'Completed' | 'On Hold',
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date || '',
        assignedMembers: data.assigned_members || []
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  add: async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          status: project.status,
          description: project.description,
          start_date: project.startDate,
          end_date: project.endDate || null,
          assigned_members: project.assignedMembers
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        status: data.status,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date || '',
        assignedMembers: data.assigned_members || []
      };
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Omit<Project, 'id'>>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.status) updateData.status = updates.status;
      if (updates.description) updateData.description = updates.description;
      if (updates.startDate) updateData.start_date = updates.startDate;
      if (updates.endDate !== undefined) updateData.end_date = updates.endDate || null;
      if (updates.assignedMembers) updateData.assigned_members = updates.assignedMembers;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        status: data.status,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date || '',
        assignedMembers: data.assigned_members || []
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  assignMember: async (projectId: string, memberId: string) => {
    try {
      const project = await projectStore.getById(projectId);
      if (!project) throw new Error('Project not found');

      const members = project.assignedMembers || [];
      if (!members.includes(memberId)) {
        members.push(memberId);
        await projectStore.update(projectId, { assignedMembers: members });
      }
    } catch (error) {
      console.error('Error assigning member:', error);
      throw error;
    }
  },

  removeMember: async (projectId: string, memberId: string) => {
    try {
      const project = await projectStore.getById(projectId);
      if (!project) throw new Error('Project not found');

      const members = (project.assignedMembers || []).filter(m => m !== memberId);
      await projectStore.update(projectId, { assignedMembers: members });
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }
};
