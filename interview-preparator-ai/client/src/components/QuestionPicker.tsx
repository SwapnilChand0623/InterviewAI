/**
 * Question picker component for selecting role and question
 */

import { useState } from 'react';
import { ROLE_SKILL_OPTIONS, type RoleSkill } from '@/lib/questions';

interface QuestionPickerProps {
  onStart: (roleSkill: RoleSkill, duration: number, questionCount: number) => void;
}

export function QuestionPicker({ onStart }: QuestionPickerProps) {
  const [selectedRole, setSelectedRole] = useState<RoleSkill>('frontend_react');
  const [duration, setDuration] = useState(120); // 2 minutes default
  const [questionCount, setQuestionCount] = useState(3); // 3 questions default

  const handleStart = () => {
    onStart(selectedRole, duration, questionCount);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Configure Your Mock Interview
        </h2>

        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Role & Focus
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleSkill)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {ROLE_SKILL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selection */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Answer Duration (per question)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={240}>4 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          {/* Question Count Selection */}
          <div>
            <label
              htmlFor="questionCount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Questions
            </label>
            <select
              id="questionCount"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={1}>1 question</option>
              <option value={3}>3 questions</option>
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">What to expect:</span> You'll receive {questionCount} behavioral
              interview question{questionCount > 1 ? 's' : ''}. Answer using the STAR framework while we track your delivery,
              pace, and body language. You can navigate between questions during your session.
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full px-6 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Start Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
}
