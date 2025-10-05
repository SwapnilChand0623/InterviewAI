/**
 * Question picker component for selecting role and question
 */

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { ROLE_SKILL_OPTIONS, type RoleSkill } from '@/lib/questions';

interface QuestionPickerProps {
  onStart: (roleSkill: RoleSkill, duration: number) => void;
}

export function QuestionPicker({ onStart }: QuestionPickerProps) {
  const [selectedRole, setSelectedRole] = useState<RoleSkill>('frontend_react');
  const [duration, setDuration] = useState(120); // 2 minutes default

  const handleStart = () => {
    onStart(selectedRole, duration);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
          Configure Your Mock Interview
        </h2>

        <div className="space-y-4">
          {/* Role Selection */}
          <Select
            id="role"
            label="Select Role & Focus"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as RoleSkill)}
          >
            {ROLE_SKILL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {/* Duration Selection */}
          <Select
            id="duration"
            label="Answer Duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={180}>3 minutes</option>
            <option value={240}>4 minutes</option>
            <option value={300}>5 minutes</option>
          </Select>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">What to expect:</span> You'll receive a behavioral
              interview question. Answer using the STAR framework while we track your delivery,
              pace, and body language.
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Start Mock Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
