/**
 * Home page - Question selection and session start
 */

import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Container>
        <Section spacing="lg">
          {/* Header */}
          <div className="text-center mb-12">
            <Heading level={1} className="mb-4">
              Interview Preparator AI
            </Heading>
            <Text variant="body" className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Practice behavioral interviews with real-time feedback on your delivery,
              body language, and answer structure.
            </Text>
          </div>

          {/* Browser Support Warning */}
          {(!support.getUserMedia || !support.speechRecognition) && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card variant="bordered" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚠️ Browser Compatibility
                </h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  {!support.getUserMedia && (
                    <li>• Camera/microphone access not supported. Use HTTPS and a modern browser.</li>
                  )}
                  {!support.speechRecognition && (
                    <li>• Speech recognition not supported. Some features will be limited.</li>
                  )}
                </ul>
              </Card>
            </div>
          )}

          {/* Question Picker */}
          <QuestionPicker onStart={handleStart} />

          {/* Features */}
          <div className="max-w-4xl mx-auto mt-16">
            <Heading level={2} className="text-center mb-8">
              What You'll Get
            </Heading>
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="elevated">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">STAR Analysis</h3>
                <Text variant="muted">
                  Get instant feedback on how well your answer follows the Situation-Task-Action-Result framework.
                </Text>
              </Card>

              <Card variant="elevated">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👁️</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Body Language</h3>
                <Text variant="muted">
                  Track your head movement, attention stability, and eye contact using AI-powered face tracking.
                </Text>
              </Card>

              <Card variant="elevated">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Speech Metrics</h3>
                <Text variant="muted">
                  Analyze your speaking pace, filler words, and get a full transcript of your answer.
                </Text>
              </Card>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
