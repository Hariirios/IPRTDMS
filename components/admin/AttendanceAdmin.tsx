import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export function AttendanceAdmin() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h2>
        <p className="text-gray-600 dark:text-gray-400">Track student attendance</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No students enrolled yet. Add students to mark attendance.</p>
        </div>
      </div>
    </div>
  );
}
