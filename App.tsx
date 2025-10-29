
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Settings } from './components/Settings';
import type { Channel, Program, Category } from './types';
import { TvIcon } from './components/Icons';


const formatEpgTime = (timeString: string): string => {
  if (timeString.length < 12) return "N/A";
  const hour = timeString.substring(8, 10);
  const minute = timeString.substring(10, 12);
  return `${hour}:${minute}`;
};

const parseM3U = (data: string): { channels: Channel[], categories: Category[] } => {
    const lines = data.split('\n');
    const channels: Channel[] = [];
    const categoryMap = new Map<string, string>();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#EXTINF:')) {
            const infoLine = line;
            const streamUrl = lines[++i]?.trim();
            
            if (!streamUrl || streamUrl.startsWith('#')) {
                i--;
                continue;
            }
            
            const tvgIdMatch = infoLine.match(/tvg-id="([^"]*)"/);
            const tvgNameMatch = infoLine.match(/tvg-name="([^"]*)"/);
            const tvgLogoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
            const groupTitleMatch = infoLine.match(/group-title="([^"]*)"/);
            const nameMatch = infoLine.match(/,(.*)$/);

            const name = tvgNameMatch?.[1] || nameMatch?.[1].trim() || 'Unknown Channel';
            const id = tvgIdMatch?.[1] || streamUrl; 
            const logo = tvgLogoMatch?.[1] || 'https://i.imgur.com/p8vG2x9.png';
            const categoryName = groupTitleMatch?.[1] || 'Uncategorized';
            
            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, categoryName);
            }
            
            channels.push({
                id,
                name,
                logo,
                streamUrl,
                category: categoryName,
                epg: [],
            });
        }
    }

    const categories: Category[] = Array.from(categoryMap.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
        
    return { channels, categories };
};


export default function App(): React.ReactElement {
  const [config, setConfig] = useState<{ m3uUrl: string | null; epgUrl: string | null }>({ m3uUrl: null, epgUrl: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [favoriteChannelIds, setFavoriteChannelIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const savedM3uUrl = localStorage.getItem('iptv_m3u_url');
    const savedEpgUrl = localStorage.getItem('iptv_epg_url');
    const savedFavorites = localStorage.getItem('iptv_favorites');

    if (savedFavorites) {
        setFavoriteChannelIds(new Set(JSON.parse(savedFavorites)));
    }

    if (savedM3uUrl) {
        setConfig({ m3uUrl: savedM3uUrl, epgUrl: savedEpgUrl });
    } else {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
        if (!config.m3uUrl) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const m3uResponse = await fetch(config.m3uUrl);
            if (!m3uResponse.ok) throw new Error(`M3U fetch failed: ${m3uResponse.statusText}`);
            const m3uText = await m3uResponse.text();
            const { channels: parsedChannels, categories: parsedCategories } = parseM3U(m3uText);
            
            if (parsedChannels.length === 0) {
                throw new Error("M3U playlist is empty or could not be parsed.");
            }
            
            let finalChannels = parsedChannels;

            if (config.epgUrl) {
                try {
                    const epgResponse = await fetch(config.epgUrl);
                    if (epgResponse.ok) {
                        const xmlText = await epgResponse.text();
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                        
                        const programmes = xmlDoc.getElementsByTagName('programme');
                        const epgData: { [key: string]: Program[] } = {};

                        for (const programme of programmes) {
                          const channelId = programme.getAttribute('channel');
                          const startTime = programme.getAttribute('start');
                          const endTime = programme.getAttribute('stop');
                          const title = programme.querySelector('title')?.textContent;
                          const description = programme.querySelector('desc')?.textContent;

                          if (channelId && startTime && endTime && title) {
                            if (!epgData[channelId]) epgData[channelId] = [];
                            epgData[channelId].push({
                              title,
                              description: description || '',
                              startTime: formatEpgTime(startTime),
                              endTime: formatEpgTime(endTime),
                            });
                          }
                        }
                        
                        for (const channelId in epgData) {
                            epgData[channelId].sort((a, b) => a.startTime.localeCompare(b.startTime));
                        }

                        finalChannels = parsedChannels.map(channel => ({
                            ...channel,
                            epg: epgData[channel.id] || [],
                        }));
                    } else {
                        console.warn(`Failed to fetch EPG: ${epgResponse.statusText}`);
                    }
                } catch (epgError) {
                    console.error("Failed to process EPG data:", epgError);
                }
            }

            setChannels(finalChannels);
            setCategories(parsedCategories);
            if (finalChannels.length > 0) {
              setSelectedChannel(finalChannels[0]);
            }

        } catch (e: any) {
            console.error("Failed to load data:", e);
            setError(`Failed to load data: ${e.message}. Please check your URLs.`);
            localStorage.removeItem('iptv_m3u_url');
            localStorage.removeItem('iptv_epg_url');
            setConfig({ m3uUrl: null, epgUrl: null });
        } finally {
            setIsLoading(false);
        }
    };

    loadData();
  }, [config]);
  
  const toggleFavorite = (channelId: string) => {
    setFavoriteChannelIds(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(channelId)) {
            newFavorites.delete(channelId);
        } else {
            newFavorites.add(channelId);
        }
        localStorage.setItem('iptv_favorites', JSON.stringify(Array.from(newFavorites)));
        return newFavorites;
    });
  };

  const channelsWithFavorites = useMemo(() => {
    return channels.map(channel => ({
        ...channel,
        isFavorite: favoriteChannelIds.has(channel.id)
    }));
  }, [channels, favoriteChannelIds]);

  const searchedChannels = useMemo(() => {
    if (!searchQuery) return channelsWithFavorites;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return channelsWithFavorites.filter((channel) => 
        channel.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [channelsWithFavorites, searchQuery]);

  const channelsForPlayer = useMemo(() => {
    if (selectedCategory === '__FAVORITES__') {
        return searchedChannels.filter(c => c.isFavorite);
    }
    if (selectedCategory) {
        return searchedChannels.filter(c => c.category === selectedCategory);
    }
    return searchedChannels;
  }, [searchedChannels, selectedCategory]);

  const handleMainClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };
  
  const handleConfigSaved = () => {
    const savedM3uUrl = localStorage.getItem('iptv_m3u_url');
    const savedEpgUrl = localStorage.getItem('iptv_epg_url');
    setConfig({ m3uUrl: savedM3uUrl, epgUrl: savedEpgUrl });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center space-y-4">
          <TvIcon className="w-16 h-16 text-teal-400 animate-pulse" />
          <p className="text-xl font-semibold">Loading your playlist...</p>
      </div>
    );
  }

  if (!config.m3uUrl || error) {
      return <Settings onConfigSaved={handleConfigSaved} initialError={error} />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {!isPlayerFullscreen && (
        <Sidebar
          categories={categories}
          channels={searchedChannels}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleFavorite={toggleFavorite}
          hasFavorites={favoriteChannelIds.size > 0}
        />
      )}
      <main 
        className="flex-1 flex flex-col bg-black"
        onClick={handleMainClick}
      >
        <Player 
          channel={selectedChannel}
          allChannels={channelsForPlayer}
          onSelectChannel={setSelectedChannel}
          onFullscreenChange={setIsPlayerFullscreen}
        />
      </main>
    </div>
  );
}