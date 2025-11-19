import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../ui/button';

export function RequisitionsAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Requisitions</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage project requisitions</p>
        </div>
        <Button className="bg-[#3B0764] hover:bg-[#2d0550]">
          <Plus className="h-4 w-4 mr-2" />
          New Requisition
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">No requisitions yet. Create your first requisition!</p>
      </div>
    </div>
  );
}
