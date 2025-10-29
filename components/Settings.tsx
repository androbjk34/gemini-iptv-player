
import React, { useState, useEffect } from 'react';
import { DEFAULT_M3U_URL, DEFAULT_XMLTV_URL } from '../constants';
import { TvIcon } from './Icons';

interface SettingsProps {
  onConfigSaved: () => void;
  initialError?: string | null;
}

export const Settings: React.FC<SettingsProps> = ({ onConfigSaved, initialError }) => {
  const [m3uUrl, setM3uUrl] = useState('');
  const [epgUrl, setEpgUrl] = useState('');
  const [error, setError] = useState(initialError || '');

  useEffect(() => {
      if(initialError) setError(initialError);
  }, [initialError]);

  const handleSave = () => {
    if (!m3uUrl.trim()) {
      setError('M3U Playlist URL is required.');
      return;
    }
    try {
      new URL(m3uUrl);
      if (epgUrl.trim()) new URL(epgUrl);
    } catch (_) {
      setError('Please enter valid URLs.');
      return;
    }

    localStorage.setItem('iptv_m3u_url', m3uUrl.trim());
    localStorage.setItem('iptv_epg_url', epgUrl.trim());
    setError('');
    onConfigSaved();
  };

  const handleLoadDefaults = () => {
    setM3uUrl(DEFAULT_M3U_URL);
    setEpgUrl(DEFAULT_XMLTV_URL);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
            <TvIcon className="w-16 h-16 mx-auto text-teal-400" />
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-wider">
            Gemini IPTV Setup
          </h1>
          <p className="mt-2 text-gray-400">
            Enter your playlist URLs to get started.
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="m3u-url" className="block text-sm font-medium text-gray-300">
              M3U Playlist URL
            </label>
            <input
              id="m3u-url"
              type="text"
              value={m3uUrl}
              onChange={(e) => setM3uUrl(e.target.value)}
              placeholder="https://example.com/playlist.m3u"
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="epg-url" className="block text-sm font-medium text-gray-300">
              XMLTV EPG URL (Optional)
            </label>
            <input
              id="epg-url"
              type="text"
              value={epgUrl}
              onChange={(e) => setEpgUrl(e.target.value)}
              placeholder="https://example.com/epg.xml"
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400 text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLoadDefaults}
            className="w-full px-4 py-3 text-sm font-semibold text-teal-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150"
          >
            Load Example
          </button>
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150"
          >
            Save & Launch
          </button>
        </div>
      </div>
    </div>
  );
};
