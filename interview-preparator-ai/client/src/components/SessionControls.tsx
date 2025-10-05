import { useState } from 'react';
import { useSessionStore } from '@/features/state/store';

export function SessionControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { sessionSettings, toggleLandmarkVisibility } = useSessionStore();

  return (
    <div className="relative">
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        title="Session Settings"
      >
        <span className="text-gray-600">⚙️</span>
        <span className="text-gray-700">Settings</span>
      </button>

      {/* Settings Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Settings Menu */}
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48">
            <div className="p-3 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                Debug Settings
              </h3>
              
              {/* Landmark Visibility Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Show Face Landmarks</span>
                <button
                  onClick={toggleLandmarkVisibility}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    sessionSettings.showLandmarks ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      sessionSettings.showLandmarks ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <p className="text-xs text-gray-500">
                Toggle visibility of face tracking points for debugging purposes.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
