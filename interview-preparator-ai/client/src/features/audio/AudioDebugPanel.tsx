import React, { useState } from 'react';
import { useElevenLabs, VOICES } from './useElevenLabs';

interface AudioDebugPanelProps {
  apiKey?: string;
}

export const AudioDebugPanel: React.FC<AudioDebugPanelProps> = ({ apiKey }) => {
  const [state, controls] = useElevenLabs(apiKey);
  const [testText, setTestText] = useState("This is a test of the ElevenLabs text to speech integration.");
  const [connectionTested, setConnectionTested] = useState(false);

  const testConnection = async () => {
    console.log('Testing ElevenLabs connection...');
    const result = await controls.testConnection();
    setConnectionTested(true);
    console.log('Connection test result:', result);
  };

  const testAudio = () => {
    console.log('Starting audio test with text:', testText);
    controls.speak(testText);
  };

  const checkBrowserSupport = () => {
    const support = {
      audio: typeof Audio !== 'undefined',
      audioContext: typeof AudioContext !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      blob: typeof Blob !== 'undefined',
      objectURL: typeof URL !== 'undefined' && typeof URL.createObjectURL !== 'undefined',
      promises: typeof Promise !== 'undefined',
    };

    console.log('Browser Support Check:', support);
    return support;
  };

  const support = checkBrowserSupport();

  return (
    <div className="p-4 border rounded-lg bg-gray-50 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">ElevenLabs Audio Debug Panel</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <h4 className="font-medium mb-2">Current Status:</h4>
          <div className="space-y-1">
            <p className={`p-2 rounded ${state.isLoading ? 'bg-yellow-100' : 'bg-green-100'}`}>
              Loading: {state.isLoading ? 'Yes' : 'No'}
            </p>
            <p className={`p-2 rounded ${state.isPlaying ? 'bg-blue-100' : 'bg-gray-100'}`}>
              Playing: {state.isPlaying ? 'Yes' : 'No'}
            </p>
            <p className={`p-2 rounded ${state.isSupported ? 'bg-green-100' : 'bg-red-100'}`}>
              Supported: {state.isSupported ? 'Yes' : 'No'}
            </p>
            {state.error && (
              <div className="p-2 bg-red-100 rounded">
                <p className="text-red-600 font-medium">Error:</p>
                <p className="text-red-600 text-sm">{state.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Browser Support */}
        <div>
          <h4 className="font-medium mb-2">Browser Support:</h4>
          <div className="space-y-1">
            {Object.entries(support).map(([feature, supported]) => (
              <p key={feature} className={`p-2 rounded ${supported ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {feature}: {supported ? 'Supported' : 'Not Supported'}
              </p>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div>
          <h4 className="font-medium mb-2">Configuration:</h4>
          <div className="space-y-2">
            <p className={`p-2 rounded ${apiKey ? 'bg-green-100' : 'bg-red-100'}`}>
              API Key: {apiKey ? 'Provided' : 'Missing'}
            </p>
            {apiKey && (
              <p className="p-2 bg-gray-100 rounded text-sm">
                Preview: {apiKey.substring(0, 8)}...
              </p>
            )}
            <button
              onClick={testConnection}
              disabled={!apiKey || state.isLoading}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded disabled:opacity-50 hover:bg-purple-600"
            >
              Test API Connection
            </button>
            {connectionTested && (
              <p className={`p-2 rounded text-sm ${state.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Connection: {state.error ? 'Failed' : 'Success'}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div>
          <h4 className="font-medium mb-2">Test Controls:</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Voice:</label>
              <select 
                onChange={(e) => controls.setVoice(e.target.value)}
                className="w-full border rounded px-2 py-1"
                disabled={state.isLoading}
              >
                {Object.entries(VOICES).map(([name, id]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Test Text:</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                rows={3}
                disabled={state.isLoading}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={testAudio}
                disabled={state.isLoading || !apiKey || !testText.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
              >
                {state.isLoading ? 'Loading...' : 'Test Audio'}
              </button>
              <button
                onClick={controls.stop}
                disabled={!state.isPlaying}
                className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Debug Info:</h4>
        <div className="p-3 bg-gray-800 text-green-400 rounded text-xs font-mono overflow-auto max-h-32">
          <p>Check browser console for detailed logs</p>
          <p>Current Audio Object: {state.currentAudio ? 'Active' : 'None'}</p>
          <p>API Endpoint: https://api.elevenlabs.io/v1/text-to-speech</p>
        </div>
      </div>
    </div>
  );
};
