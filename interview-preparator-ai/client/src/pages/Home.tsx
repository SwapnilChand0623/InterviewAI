/**
 * Home page - Question selection and session start
 */

import { useNavigate } from 'react-router-dom';
import { QuestionPicker } from '@/components/QuestionPicker';
import { useStore } from '@/features/state/store';
import { getRandomQuestion, type RoleSkill } from '@/lib/questions';
import { checkBrowserSupport } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Home() {
  const navigate = useNavigate();
  const startSession = useStore((state) => state.startSession);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsLoaded(true);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-1/3 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Logo with animations */}
          <div className={`flex flex-col items-center justify-center mb-8 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90'
          }`}>
            <div className="relative group">
              {/* Glowing circle background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Logo container */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/prep67-logo.png" 
                  alt="Prep67 Logo" 
                  className="w-40 h-40 md:w-56 md:h-56 object-contain"
                  onError={(e) => {
                    // Fallback if logo not found - display text logo
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.text-logo')) {
                      const textLogo = document.createElement('div');
                      textLogo.className = 'text-logo flex flex-col items-center justify-center';
                      textLogo.innerHTML = `
                        <div class="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                          Prep<span class="text-purple-600">67</span>
                        </div>
                        <div class="text-sm text-purple-700 font-semibold mt-2">AI INTERVIEW TOOL</div>
                      `;
                      parent.appendChild(textLogo);
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Brand name with gradient animation */}
            <h1 className={`text-6xl md:text-7xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`} style={{ 
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite'
            }}>
              Prep67
            </h1>
          </div>

          <p className={`text-base md:text-lg text-cyan-100 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
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
        <div className={`max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-center mb-8">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-cyan-100 mb-2">STAR Analysis</h3>
              <p className="text-sm text-slate-300">
                Get instant feedback on how well your answer follows the Situation-Task-Action-Result framework.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="font-semibold text-cyan-100 mb-2">Body Language</h3>
              <p className="text-sm text-slate-300">
                Track your head movement, attention stability, and eye contact using AI-powered face tracking.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-cyan-100 mb-2">Speech Metrics</h3>
              <p className="text-sm text-slate-300">
                Analyze your speaking pace, filler words, and get a full transcript of your answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
