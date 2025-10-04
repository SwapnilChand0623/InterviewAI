/**
 * Home page - Question selection and session start
 */

import { useNavigate } from 'react-router-dom';
import { QuestionPicker } from '@/components/QuestionPicker';
import { useStore } from '@/features/state/store';
import { getRandomQuestion, type RoleSkill } from '@/lib/questions';
import { checkBrowserSupport } from '@/lib/utils';

export function Home() {
  const navigate = useNavigate();
  const startSession = useStore((state) => state.startSession);

  const handleStart = (roleSkill: RoleSkill, duration: number) => {
    // Check browser support
    const support = checkBrowserSupport();
    
    if (!support.getUserMedia) {
      alert('Your browser does not support camera access. Please use a modern browser with HTTPS.');
      return;
    }

    const question = getRandomQuestion(roleSkill);
    startSession(roleSkill, question, duration);
    navigate('/session');
  };

  const support = checkBrowserSupport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Interview Preparator AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice behavioral interviews with real-time feedback on your delivery,
            body language, and answer structure.
          </p>
        </div>

        {/* Browser Support Warning */}
        {(!support.getUserMedia || !support.speechRecognition) && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                ⚠️ Browser Compatibility
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                {!support.getUserMedia && (
                  <li>• Camera/microphone access not supported. Use HTTPS and a modern browser.</li>
                )}
                {!support.speechRecognition && (
                  <li>• Speech recognition not supported. Some features will be limited.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Question Picker */}
        <QuestionPicker onStart={handleStart} />

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">STAR Analysis</h3>
              <p className="text-sm text-gray-600">
                Get instant feedback on how well your answer follows the Situation-Task-Action-Result framework.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Body Language</h3>
              <p className="text-sm text-gray-600">
                Track your head movement, attention stability, and eye contact using AI-powered face tracking.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Speech Metrics</h3>
              <p className="text-sm text-gray-600">
                Analyze your speaking pace, filler words, and get a full transcript of your answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
