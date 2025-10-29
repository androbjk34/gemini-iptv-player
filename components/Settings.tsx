import React, { useState, useEffect, useRef } from 'react';
import { TvIcon, ChevronLeftIcon } from './Icons';

interface SettingsProps {
  onPlaylistLoaded: (content: string) => void;
  initialError?: string | null;
  onBack: () => void;
  hasConfig: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ onPlaylistLoaded, initialError, onBack, hasConfig }) => {
  const [m3uContent, setM3uContent] = useState('');
  const [error, setError] = useState(initialError || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if(initialError) setError(initialError);
  }, [initialError]);

  const handleLoad = () => {
    if (!m3uContent.trim()) {
      setError('Please paste your M3U content or upload an M3U file.');
      return;
    }
    setError('');
    onPlaylistLoaded(m3uContent);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setM3uContent(text);
          setError(''); // Clear error on new file
        } else {
            setError('Could not read the file content.');
        }
      };
      reader.onerror = () => {
        setError('Failed to read the selected file.');
      };
      reader.readAsText(file);
    }
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  const handleClear = () => {
    // Clear all user data from storage
    localStorage.removeItem('iptv_channels');
    localStorage.removeItem('iptv_categories');
    localStorage.removeItem('iptv_favorites');
    localStorage.removeItem('iptv_last_channel_id');
    setM3uContent('');
    // Signal to App component to clear its state
    onPlaylistLoaded('');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 relative">
        {hasConfig && (
             <button 
                onClick={onBack} 
                className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                aria-label="Back to player"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
        )}
        <div className="text-center pt-8 sm:pt-0">
            <TvIcon className="w-16 h-16 mx-auto text-teal-400" />
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-wider">
            Load Your Playlist
          </h1>
          <p className="mt-2 text-gray-400">
            Paste your M3U playlist content below or upload a file.
          </p>
        </div>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="m3u-content" className="block text-sm font-medium text-gray-300 mb-1">
                    Paste M3U Content
                </label>
                <textarea
                    id="m3u-content"
                    value={m3uContent}
                    onChange={(e) => setM3uContent(e.target.value)}
                    placeholder="#EXTM3U&#10;#EXTINF:-1 tvg-id=&quot;Channel1&quot; group-title=&quot;News&quot;,Channel 1&#10;http://server/stream1"
                    className="mt-1 block w-full h-48 bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition font-mono text-xs scrollbar-thin"
                />
            </div>

            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".m3u,.m3u8"
                />
                <button
                    onClick={triggerFileSelect}
                    className="w-full px-4 py-3 text-sm font-semibold text-teal-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150"
                >
                    Upload M3U File
                </button>
            </div>
        </div>

        {error && <p className="text-sm text-red-400 text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleLoad}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150"
            >
                Load Playlist
            </button>
            <button
                onClick={handleClear}
                className="w-full px-4 py-3 text-sm font-semibold text-red-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-150"
            >
                Clear Configuration
            </button>
        </div>
      </div>
    </div>
  );
};
