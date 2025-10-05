import React from 'react';
import { SessionControls } from './SessionControls';

export function InterviewSession() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Interview Session
          </h1>
          
          {/* Add SessionControls to header */}
          <div className="flex items-center gap-4">
            <SessionControls />
          </div>
        </div>
      </div>

      {/* Add session content here */}
    </div>
  );
}
