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

// In-memory store (in real app, this would be in database)
let teamMembers: TeamMember[] = [];

export const teamStore = {
  getAll: () => teamMembers,
  
  getByType: (type: 'Staff' | 'Technician' | 'Facilitator') => 
    teamMembers.filter(m => m.type === type && m.status === 'Active'),
  
  getById: (id: string) => teamMembers.find(m => m.id === id),
  
  add: (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    };
    teamMembers.push(newMember);
    return newMember;
  },
  
  update: (id: string, updates: Partial<TeamMember>) => {
    teamMembers = teamMembers.map(m => m.id === id ? { ...m, ...updates } : m);
    return teamMembers.find(m => m.id === id);
  },
  
  delete: (id: string) => {
    teamMembers = teamMembers.filter(m => m.id !== id);
  }
};
