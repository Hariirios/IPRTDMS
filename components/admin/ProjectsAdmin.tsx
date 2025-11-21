import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Search, Users, FolderOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { projectStore, Project } from '../../lib/projectStore';
import { memberStore, Member } from '../../lib/memberStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [assigningProject, setAssigningProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed' | 'On Hold'>('All');
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'Active' as 'Active' | 'Completed' | 'On Hold',
    description: '',
    startDate: '',
    endDate: '',
    assignedMembers: [] as string[]
  });

  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    const data = await projectStore.getAll();
    setProjects(data);
  }, []);

  const loadMembers = useCallback(async () => {
    const data = await memberStore.getAll();
    setMembers(data);
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadProjects(), loadMembers()]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadProjects, loadMembers]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Real-time subscription - debounced to prevent excessive updates
  useRealtimeSubscription('projects', useCallback(() => {
    if (!loading) loadProjects();
  }, [loading, loadProjects]));
  
  useRealtimeSubscription('members', useCallback(() => {
    if (!loading) loadMembers();
  }, [loading, loadMembers]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        await projectStore.update(editingProject.id, formData);
        toast.success('Project updated successfully!');
      } else {
        await projectStore.add(formData);
        toast.success('Project added successfully!');
      }
      
      await loadProjects();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save project. Please try again.');
      console.error(error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectStore.delete(id);
        await loadProjects();
        toast.success('Project deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete project.');
        console.error(error);
      }
    }
  };

  const handleAssignMembers = (project: Project) => {
    setAssigningProject(project);
    setIsAssignModalOpen(true);
  };

  const toggleMemberAssignment = async (memberId: string) => {
    if (!assigningProject) return;

    // Check if member is inactive
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    try {
      const isAssigned = assigningProject.assignedMembers.includes(memberId);
      
      if (isAssigned) {
        // Allow removing even if inactive
        await projectStore.removeMember(assigningProject.id, memberId);
        await memberStore.removeProject(memberId, assigningProject.id);
        toast.success('Member removed from project!');
      } else {
        // Prevent assigning if member is inactive
        if (member.status === 'Inactive') {
          toast.error('Cannot assign inactive member to project. Please activate the member first.');
          return;
        }
        
        await projectStore.assignMember(assigningProject.id, memberId);
        await memberStore.assignProject(memberId, assigningProject.id);
        toast.success('Member assigned to project!');
      }

      await loadProjects();
      await loadMembers();
      
      // Update the assigningProject state
      const updatedProject = await projectStore.getById(assigningProject.id);
      if (updatedProject) {
        setAssigningProject(updatedProject);
      }
    } catch (error) {
      toast.error('Failed to update member assignment.');
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      status: 'Active',
      description: '',
      startDate: '',
      endDate: '',
      assignedMembers: []
    });
  };

  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, filterStatus]);

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    onHold: projects.filter(p => p.status === 'On Hold').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your institute's projects</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3B0764] hover:bg-[#2d0550]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-green-800 dark:text-green-200">Active</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-blue-800 dark:text-blue-200">Completed</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.completed}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">On Hold</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.onHold}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Active', 'Completed', 'On Hold'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-[#3B0764] hover:bg-[#2d0550]' : ''}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No projects found. Add your first project!</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>📅 Start: {project.startDate}</span>
                    {project.endDate && <span>🏁 End: {project.endDate}</span>}
                  </div>
                  
                  {/* Assigned Members */}
                  {project.assignedMembers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Assigned Members ({project.assignedMembers.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.assignedMembers.map(memberId => (
                          <span
                            key={memberId}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium"
                          >
                            {getMemberName(memberId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignMembers(project)}
                    className="w-full"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Assign Members Modal */}
      {isAssignModalOpen && assigningProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Assign Members to Project
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {assigningProject.name}
            </p>

            {/* Info Banner */}
            {members.some(m => m.status === 'Inactive') && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Inactive members cannot be assigned to projects. Activate them first in the Members tab.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {members.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No members available. Create members first.
                </p>
              ) : (
                members.map((member) => {
                  const isAssigned = assigningProject.assignedMembers.includes(member.id);
                  const isInactive = member.status === 'Inactive';
                  const canAssign = !isInactive || isAssigned; // Can only interact if active OR already assigned (for removal)
                  
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        isInactive && !isAssigned
                          ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20'
                          : isAssigned
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 cursor-pointer'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer'
                      }`}
                      onClick={() => canAssign && toggleMemberAssignment(member.id)}
                      title={isInactive && !isAssigned ? 'Cannot assign inactive member' : ''}
                    >
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className={`w-10 h-10 rounded-full object-cover ${isInactive && !isAssigned ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold ${isInactive && !isAssigned ? 'grayscale' : ''}`}>
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className={`font-semibold ${isInactive && !isAssigned ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {member.name}
                            {isInactive && !isAssigned && (
                              <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Cannot assign)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {member.status}
                        </span>
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => canAssign && toggleMemberAssignment(member.id)}
                          disabled={isInactive && !isAssigned}
                          className={`w-5 h-5 text-purple-600 rounded focus:ring-purple-500 ${
                            isInactive && !isAssigned ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setAssigningProject(null);
                }}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Assigned Members</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Use the "Assign" button after creating the project to assign members
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#3B0764] hover:bg-[#2d0550]">
                  {editingProject ? 'Update Project' : 'Add Project'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
