
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import type { Channel, Category } from './types';
import { TvIcon } from './components/Icons';

const DEFAULT_M3U_CONTENT = `#EXTM3U
#EXTINF:-1 tvg-id="Sinema Tv.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinematv_logo_A0CC7C58-E100-4C18-8B8D-BF961C4F785E.png"  group-title="Sinema", Sinema TV
http://65.108.239.207/sinema/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv 2.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinema2_logo_C0C84D85-E6DD-4807-B52F-277AD04EAE22.png" group-title="Sinema", Sinema TV 2
http://65.108.239.207/sinema2/index.m3u8
#EXTINF:-1 tvg-id="SİNEMA YERLİ HD.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemayerli_logo_75EF9BC4-3582-455A-BB02-47FAFD00CEA0.png" group-title="Sinema", Sinema Yerli
http://apx-me.com:8880/live/live:persian_share/Hs6guU9ziF/49303.ts
#EXTINF:-1 tvg-id="SİNEMA YERLİ 2 HD.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemayerli2_logo_6C526B31-1CD4-4F36-B514-FDB85BF311F5.png" group-title="Sinema", Sinema Yerli 2
http://apx-me.com:8880/live/live:persian_share/Hs6guU9ziF/49293.ts
#EXTINF:-1 tvg-id="Sinema Tv Aile.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemaaile_logo_B2AC3808-8447-4546-80EF-EA50B34D6089.png" group-title="Sinema",Sinema Aile
http://65.108.239.207/sinemaaile/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv Aile 2.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemaaile2_logo_AD8E0B38-BE08-48CD-ACF5-28DB2419266C.png" group-title="Sinema", Sinema Aile 2
http://apx-me.com:8880/live/live:persian_share/Hs6guU9ziF/49302.m3u8
#EXTINF:-1 tvg-id="Sinema Tv Comedy.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemakomedi_logo_16AD0158-3FF7-4897-93A7-26577BC1EC33.png"  group-title="Sinema",Sinema Komedi
http://65.108.239.207/sinemakomedi/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv Comedy 2.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemakomedi2_logo_D70C1FCF-C2FF-4A95-980E-1454B5728647.png" group-title="Sinema", Sinema Komedi 2
http://apx-me.com:8880/live/live:persian_share/Hs6guU9ziF/49306.m3u8
#EXTINF:-1 tvg-id="Sinema Tv Aksiyon.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemaaksiyon_logo_ECCA8162-A617-4236-82AD-BE14CFBE4C8D.png"  group-title="Sinema", Sinema Aksiyon
http://65.108.239.207/sinemaaksiyon/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv Aksiyon 2.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinemaaksiyon2_logo_1E3AE25E-8ED5-4388-BF6E-6A902F87DF27.png" group-title="Sinema",Sinema Aksiyon 2
http://65.108.239.207/sinemaaksiyon2/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv 1001.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinema1001_logo_CA7B6954-4A94-455B-9A1F-5FC54D88B982.png" group-title="Sinema",Sinema 1001
http://65.108.239.207/sinema1001/index.m3u8
#EXTINF:-1 tvg-id="Sinema Tv 1002.tr" tvg-logo="https://www.tivibu.com.tr/uploads/ChannelFiles/sinema1002_logo_FEC606FA-0E12-4B71-AE3A-E9879A6AB678.png" group-title="Sinema", Sinema 1002
http://65.108.239.207/sinema1002/index.m3u8`;

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
            });
        }
    }

    const categories: Category[] = Array.from(categoryMap.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
        
    return { channels, categories };
};


export default function App(): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = React.useState(false);
  const [favoriteChannelIds, setFavoriteChannelIds] = React.useState<Set<string>>(new Set());
  
  React.useEffect(() => {
    const initializeApp = () => {
        setIsLoading(true);
        // Load favorites from local storage
        const savedFavorites = localStorage.getItem('iptv_favorites');
        if (savedFavorites) {
            try {
                setFavoriteChannelIds(new Set(JSON.parse(savedFavorites)));
            } catch {
                localStorage.removeItem('iptv_favorites');
            }
        }
        
        // Always parse the hardcoded default content
        try {
            const { channels: parsedChannels, categories: parsedCategories } = parseM3U(DEFAULT_M3U_CONTENT);
            setChannels(parsedChannels);
            setCategories(parsedCategories);
            
            // Restore last watched channel or default to first
            const lastChannelId = localStorage.getItem('iptv_last_channel_id');
            const foundChannel = lastChannelId ? parsedChannels.find(c => c.id === lastChannelId) : null;
            setSelectedChannel(foundChannel || parsedChannels[0] || null);
        } catch (e: any) {
            console.error("Critical Error: Failed to parse default M3U content.", e);
            // This is a developer error, the app will be in a broken state.
        } finally {
            setIsLoading(false);
        }
    };
    
    initializeApp();
  }, []);

  // Persist last selected channel
  React.useEffect(() => {
    if (selectedChannel) {
        localStorage.setItem('iptv_last_channel_id', selectedChannel.id);
    }
  }, [selectedChannel]);
  
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

  const channelsWithFavorites = React.useMemo(() => {
    return channels.map(channel => ({
        ...channel,
        isFavorite: favoriteChannelIds.has(channel.id)
    }));
  }, [channels, favoriteChannelIds]);

  const searchedChannels = React.useMemo(() => {
    if (!searchQuery) return channelsWithFavorites;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return channelsWithFavorites.filter((channel) => 
        channel.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [channelsWithFavorites, searchQuery]);

  const channelsForPlayer = React.useMemo(() => {
    if (selectedCategory === '__FAVORITES__') {
        return searchedChannels.filter(c => c.isFavorite);
    }
    if (selectedCategory && selectedCategory !== '__COLLAPSED__') {
        return searchedChannels.filter(c => c.category === selectedCategory);
    }
    return searchedChannels;
  }, [searchedChannels, selectedCategory]);

  const handleMainClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center space-y-4">
          <TvIcon className="w-16 h-16 text-teal-400 animate-pulse" />
          <p className="text-xl font-semibold">Loading Player...</p>
      </div>
    );
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
