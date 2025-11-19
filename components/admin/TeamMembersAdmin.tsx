import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '../ui/button';

export function TeamMembersAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage staff, facilitators, and technicians</p>
        </div>
        <Button className="bg-[#3B0764] hover:bg-[#2d0550]">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">No team members yet. Add your first team member!</p>
      </div>
    </div>
  );
}
