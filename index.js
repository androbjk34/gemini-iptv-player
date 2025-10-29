
import React from 'react';
import ReactDOM from 'react-dom/client';

// types.ts (interfaces are conceptual in JS)

// components/Icons.tsx
const TvIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('rect', { x: "2", y: "7", width: "20", height: "15", rx: "2", ry: "2" }),
    React.createElement('polyline', { points: "17 2 12 7 7 2" })
  )
);
const SearchIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('circle', { cx: "11", cy: "11", r: "8" }),
    React.createElement('line', { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
  )
);
const ChevronLeftIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('polyline', { points: "15 18 9 12 15 6" })
  )
);
const ChevronDownIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('polyline', { points: "6 9 12 15 18 9" })
  )
);
const PlayIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M5 3l14 9-14 9V3z" })
  )
);
const PauseIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M6 3h4v18H6zM14 3h4v18h-4z" })
  )
);
const VolumeUpIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
    React.createElement('path', { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
  )
);
const VolumeOffIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
    React.createElement('line', { x1: "23", y1: "9", x2: "17", y2: "15" }),
    React.createElement('line', { x1: "17", y1: "9", x2: "23", y2: "15" })
  )
);
const FullscreenEnterIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M4 14h6m-6 0v6m0-6L14 4m-4 0h6m0 0v6" })
  )
);
const FullscreenExitIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M10 4H4v6m6-6l-8 8m14 2h6m-6 0v-6m6 6l-8-8" })
  )
);
const StarIcon = ({ filled, ...props }) => (
    React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement('polygon', { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
    )
);


// components/Player.tsx
const Player = ({ channel, allChannels, onSelectChannel, onFullscreenChange }) => {
  const videoRef = React.useRef(null);
  const playerContainerRef = React.useRef(null);
  const selectedChannelRef = React.useRef(null);
  const controlsTimerRef = React.useRef(null);
  const touchStartX = React.useRef(0);
  const [areControlsVisible, setAreControlsVisible] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const showControlsAndSetTimer = () => {
    setAreControlsVisible(true);
    if (controlsTimerRef.current)
      clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
    }, 4e3);
  };
  React.useEffect(() => {
    if (channel && videoRef.current) {
      videoRef.current.src = channel.streamUrl;
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
        setIsPlaying(false);
      });
      showControlsAndSetTimer();
      if (selectedChannelRef.current) {
        selectedChannelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
    return () => {
      if (controlsTimerRef.current)
        clearTimeout(controlsTimerRef.current);
    };
  }, [channel]);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video)
      return;
    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      onFullscreenChange(isCurrentlyFullscreen);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [onFullscreenChange]);
  const togglePlayPause = () => {
    showControlsAndSetTimer();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0)
      setIsMuted(false);
  };
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleFullscreen = () => {
    if (!playerContainerRef.current)
      return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    showControlsAndSetTimer();
    if (!channel || allChannels.length <= 1)
      return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const swipeThreshold = 50;
    if (Math.abs(deltaX) > swipeThreshold) {
      const currentIndex = allChannels.findIndex((c) => c.id === channel.id);
      if (currentIndex === -1)
        return;
      if (deltaX < 0) {
        const nextIndex = (currentIndex + 1) % allChannels.length;
        onSelectChannel(allChannels[nextIndex]);
      } else {
        const prevIndex = (currentIndex - 1 + allChannels.length) % allChannels.length;
        onSelectChannel(allChannels[prevIndex]);
      }
    }
    touchStartX.current = 0;
  };
  if (!channel) {
    return (
      React.createElement('div', { className: "flex-1 flex flex-col items-center justify-center bg-black text-gray-500 p-8 text-center" },
        React.createElement(TvIcon, { className: "w-24 h-24 mb-4 text-gray-700" }),
        React.createElement('h2', { className: "text-2xl font-semibold" }, "Select a channel to start watching"),
        React.createElement('p', null, "Your streaming experience begins here.")
      )
    );
  }
  return (
    React.createElement('div', { className: "flex-1 w-full h-full bg-black", ref: playerContainerRef },
      React.createElement('div', { className: "relative w-full h-full", onMouseMove: showControlsAndSetTimer, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, onClick: showControlsAndSetTimer },
        React.createElement('video', { ref: videoRef, autoPlay: true, className: "w-full h-full", onPlay: () => setIsPlaying(true), onPause: () => setIsPlaying(false) }, "Your browser does not support the video tag."),
        React.createElement('div', { className: `absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 ${areControlsVisible ? "opacity-100" : "opacity-0"}`, "aria-hidden": "true" }),
        React.createElement('div', { className: `absolute top-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-500 flex flex-col justify-start ${areControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}` },
          React.createElement('h2', { className: "text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg" }, channel.name)
        ),
        React.createElement('div', { className: `absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 flex flex-col space-y-4 ${areControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`, onClick: (e) => e.stopPropagation(), onMouseEnter: () => {
          if (controlsTimerRef.current)
            clearTimeout(controlsTimerRef.current);
        }, onMouseLeave: showControlsAndSetTimer },
          React.createElement('div', { className: "flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" },
            allChannels.map((c) => (
              React.createElement('button', { key: c.id, ref: c.id === channel.id ? selectedChannelRef : null, onClick: () => onSelectChannel(c), className: `flex-shrink-0 cursor-pointer rounded-lg transition-all duration-200 group/channel ${c.id === channel.id ? "" : "opacity-60 hover:opacity-100 hover:scale-105 focus:opacity-100 focus:scale-105"}`, title: c.name },
                React.createElement('img', { src: c.logo, alt: c.name, className: `w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 ${c.id === channel.id ? "border-teal-400" : "border-transparent group-hover/channel:border-gray-500 group-focus/channel:border-gray-500"}` })
              )
            ))
          ),
          React.createElement('div', { className: "flex items-center justify-between" },
            React.createElement('button', { onClick: togglePlayPause, className: "p-2 text-white hover:text-teal-400 transition-colors" },
              isPlaying ? React.createElement(PauseIcon, { className: "w-7 h-7 md:w-8 md:h-8" }) : React.createElement(PlayIcon, { className: "w-7 h-7 md:w-8 md:h-8" })
            ),
            React.createElement('div', { className: "flex items-center space-x-3" },
              React.createElement('button', { onClick: toggleMute, className: "p-2 text-white hover:text-teal-400 transition-colors" },
                isMuted || volume === 0 ? React.createElement(VolumeOffIcon, { className: "w-5 h-5 md:w-6 md:h-6" }) : React.createElement(VolumeUpIcon, { className: "w-5 h-5 md:w-6 md:h-6" })
              ),
              React.createElement('input', { type: "range", min: "0", max: "1", step: "0.05", value: isMuted ? 0 : volume, onChange: handleVolumeChange, className: "w-20 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500", "aria-label": "Volume control" })
            ),
            React.createElement('button', { onClick: toggleFullscreen, className: "p-2 text-white hover:text-teal-400 transition-colors" },
              isFullscreen ? React.createElement(FullscreenExitIcon, { className: "w-6 h-6 md:w-7 md:h-7" }) : React.createElement(FullscreenEnterIcon, { className: "w-6 h-6 md:w-7 md:h-7" })
            )
          )
        )
      )
    )
  );
};

// components/Sidebar.tsx
const FAVORITES_CATEGORY_ID = "__FAVORITES__";
const ChannelItem = ({ channel, isSelected, onSelect, isSidebarOpen, onToggleFavorite }) => {
    return (React.createElement("li", null,
        React.createElement("div", { onClick: onSelect, className: `flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-teal-600 text-white' : 'hover:bg-gray-700'} ${!isSidebarOpen && 'justify-center'}`, role: "button", "aria-selected": isSelected, tabIndex: 0 },
            React.createElement("div", { className: "flex items-center min-w-0" },
                React.createElement("img", { src: channel.logo, alt: channel.name, className: "w-10 h-10 rounded-md object-cover flex-shrink-0" }),
                React.createElement("span", { className: `font-medium truncate transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0'}` }, channel.name)),
            React.createElement("div", { className: "flex items-center flex-shrink-0" },
                React.createElement("button", { onClick: (e) => {
                        e.stopPropagation();
                        onToggleFavorite(channel.id);
                    }, className: `p-1 rounded-full ${channel.isFavorite ? 'text-teal-400 hover:text-teal-300' : 'text-gray-500 hover:text-white'} ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400`, "aria-label": `Favorite ${channel.name}` },
                    React.createElement(StarIcon, { filled: !!channel.isFavorite, className: "w-5 h-5" }))))));
};

const Sidebar = ({
  categories,
  channels,
  selectedChannel,
  onSelectChannel,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  isSidebarOpen,
  onToggleSidebar,
  onToggleFavorite,
  hasFavorites,
}) => {
  const handleCategoryClick = (categoryId) => {
    onSelectCategory(selectedCategory === categoryId ? '__COLLAPSED__' : categoryId);
  };
  const renderChannelList = (channelList) => (
    React.createElement('ul', { className: "space-y-1 pt-2" },
      channelList.map((channel) => (
        React.createElement(ChannelItem, {
          key: channel.id,
          channel: channel,
          isSelected: selectedChannel?.id === channel.id,
          onSelect: () => onSelectChannel(channel),
          isSidebarOpen: isSidebarOpen,
          onToggleFavorite: onToggleFavorite
        })
      ))
    )
  );
  return (
    React.createElement('aside', { className: `bg-gray-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 md:w-80" : "w-20"}` },
      React.createElement('header', { className: "p-4 border-b border-gray-700 flex items-center justify-between" },
        React.createElement('div', { className: `flex items-center space-x-3 overflow-hidden` },
          React.createElement(TvIcon, { className: "w-8 h-8 text-teal-400 flex-shrink-0" }),
          React.createElement('h1', { className: `text-2xl font-bold tracking-wider whitespace-nowrap transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}` }, "Gemini IPTV")
        ),
        React.createElement('button', {
            onClick: onToggleSidebar,
            className: "p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        },
          React.createElement(ChevronLeftIcon, { className: `w-6 h-6 transition-transform duration-300 ${!isSidebarOpen && "rotate-180"}` })
        )
      ),
      React.createElement('div', { className: `transition-all duration-300 ease-in-out ${isSidebarOpen ? "p-4" : "h-0 p-0"} overflow-hidden` },
        React.createElement('div', { className: "relative" },
          React.createElement(SearchIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
          React.createElement('input', { type: "text", placeholder: "Search channels...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition", "aria-label": "Search channels" })
        )
      ),
      React.createElement('nav', { className: "flex-1 overflow-y-auto px-4 pt-4 pb-4", "aria-label": "Channel list" },
        React.createElement('ul', { className: "space-y-2" },
          hasFavorites && (
            React.createElement('li', null,
              React.createElement('button', { onClick: () => handleCategoryClick(FAVORITES_CATEGORY_ID), className: `w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${selectedCategory === FAVORITES_CATEGORY_ID ? "bg-teal-500 text-white" : "hover:bg-gray-700 text-gray-200"}` },
                React.createElement('div', { className: "flex items-center" },
                  React.createElement(StarIcon, { filled: true, className: "w-5 h-5 mr-3 text-teal-300 flex-shrink-0" }),
                  React.createElement('span', { className: `truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}` }, "Favorites")
                ),
                React.createElement(ChevronDownIcon, { className: `w-5 h-5 flex-shrink-0 transition-transform duration-300 ${selectedCategory !== FAVORITES_CATEGORY_ID && "-rotate-90"} ${isSidebarOpen ? "opacity-100" : "opacity-0"}` })
              ),
              React.createElement('div', { className: `overflow-hidden transition-all duration-300 ease-in-out ${selectedCategory === FAVORITES_CATEGORY_ID ? "max-h-[5000px]" : "max-h-0"}` },
                renderChannelList(channels.filter((c) => c.isFavorite))
              )
            )
          ),
          React.createElement('li', null,
            React.createElement('button', { onClick: () => handleCategoryClick(null), className: `w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${selectedCategory === null ? "bg-teal-500 text-white" : "hover:bg-gray-700 text-gray-200"}` },
              React.createElement('span', { className: `truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}` }, "All Channels"),
              React.createElement(ChevronDownIcon, { className: `w-5 h-5 flex-shrink-0 transition-transform duration-300 ${selectedCategory !== null && "-rotate-90"} ${isSidebarOpen ? "opacity-100" : "opacity-0"}` })
            ),
            React.createElement('div', { className: `overflow-hidden transition-all duration-300 ease-in-out ${selectedCategory === null ? "max-h-[5000px]" : "max-h-0"}` },
              renderChannelList(channels)
            )
          ),
          categories.map((category) => {
            const isExpanded = selectedCategory === category.id;
            const categoryChannels = channels.filter(
              (c) => c.category === category.id
            );
            if (searchQuery && categoryChannels.length === 0)
              return null;
            return (
              React.createElement('li', { key: category.id },
                React.createElement('button', { onClick: () => handleCategoryClick(category.id), className: `w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${isExpanded ? "bg-teal-500 text-white" : "hover:bg-gray-700 text-gray-200"}`, "aria-expanded": isExpanded },
                  React.createElement('span', { className: `truncate transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}` }, category.name),
                  React.createElement(ChevronDownIcon, { className: `w-5 h-5 flex-shrink-0 transition-transform duration-300 ${!isExpanded && "-rotate-90"} ${isSidebarOpen ? "opacity-100" : "opacity-0"}` })
                ),
                React.createElement('div', { className: `overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[5000px]" : "max-h-0"}` },
                  renderChannelList(categoryChannels)
                )
              )
            );
          })
        ),
        channels.length === 0 && searchQuery && (
          React.createElement('div', { className: `text-center text-gray-400 p-6 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}` },
            React.createElement('p', { className: "font-medium" }, "No channels found"),
            React.createElement('p', { className: "text-sm mt-1" }, "Try changing your search query.")
          )
        )
      )
    )
  );
};

// App.tsx
const DEFAULT_M3U_CONTENT = `#EXTM3U
#EXTINF:-1 tvg-id="NASATV.us" tvg-name="NASA TV" tvg-logo="https://i.imgur.com/s4J3IuA.png" group-title="Science",NASA TV
https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8
#EXTINF:-1 tvg-id="Bloomberg.us" tvg-name="Bloomberg TV" tvg-logo="https://i.imgur.com/im20l3p.png" group-title="News",Bloomberg TV
https://live-streams.bloomberg.com/p/multichannel/index.m3u8
#EXTINF:-1 tvg-id="RedBullTV.us" tvg-name="Red Bull TV" tvg-logo="https://i.imgur.com/h52FvAn.png" group-title="Entertainment",Red Bull TV
https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8`;

const parseM3U = (data) => {
    const lines = data.split('\n');
    const channels = [];
    const categoryMap = new Map();
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
    const categories = Array.from(categoryMap.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    return { channels, categories };
};

function App() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [channels, setChannels] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [selectedChannel, setSelectedChannel] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isPlayerFullscreen, setIsPlayerFullscreen] = React.useState(false);
    const [favoriteChannelIds, setFavoriteChannelIds] = React.useState(new Set());
    
    React.useEffect(() => {
        const initializeApp = () => {
            setIsLoading(true);
            const savedFavorites = localStorage.getItem('iptv_favorites');
            if (savedFavorites) {
                try {
                    setFavoriteChannelIds(new Set(JSON.parse(savedFavorites)));
                } catch {
                    localStorage.removeItem('iptv_favorites');
                }
            }
            
            try {
                const { channels: parsedChannels, categories: parsedCategories } = parseM3U(DEFAULT_M3U_CONTENT);
                setChannels(parsedChannels);
                setCategories(parsedCategories);
                
                const lastChannelId = localStorage.getItem('iptv_last_channel_id');
                const foundChannel = lastChannelId ? parsedChannels.find(c => c.id === lastChannelId) : null;
                setSelectedChannel(foundChannel || parsedChannels[0] || null);
            } catch (e) {
                console.error("Critical Error: Failed to parse default M3U content.", e);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeApp();
    }, []);

    React.useEffect(() => {
        if (selectedChannel) {
            localStorage.setItem('iptv_last_channel_id', selectedChannel.id);
        }
    }, [selectedChannel]);
    
    const toggleFavorite = (channelId) => {
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
            React.createElement("div", { className: "flex flex-col h-screen bg-gray-900 text-white items-center justify-center space-y-4" },
                React.createElement(TvIcon, { className: "w-16 h-16 text-teal-400 animate-pulse" }),
                React.createElement("p", { className: "text-xl font-semibold" }, "Loading Player...")
            )
        );
    }

    return (
        React.createElement("div", { className: "flex h-screen bg-gray-900 text-white font-sans overflow-hidden" },
            !isPlayerFullscreen && (
                React.createElement(Sidebar, {
                    categories: categories,
                    channels: searchedChannels,
                    selectedChannel: selectedChannel,
                    onSelectChannel: setSelectedChannel,
                    searchQuery: searchQuery,
                    setSearchQuery: setSearchQuery,
                    selectedCategory: selectedCategory,
                    onSelectCategory: setSelectedCategory,
                    isSidebarOpen: isSidebarOpen,
                    onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
                    onToggleFavorite: toggleFavorite,
                    hasFavorites: favoriteChannelIds.size > 0
                })
            ),
            React.createElement("main", { 
                className: "flex-1 flex flex-col bg-black",
                onClick: handleMainClick
            },
                React.createElement(Player, { 
                    channel: selectedChannel,
                    allChannels: channelsForPlayer,
                    onSelectChannel: setSelectedChannel,
                    onFullscreenChange: setIsPlayerFullscreen
                })
            )
        )
    );
}


// index.tsx
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);
