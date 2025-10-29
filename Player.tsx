
import React from 'react';
import type { Channel } from '../types';
import { TvIcon, PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon, FullscreenEnterIcon, FullscreenExitIcon } from './Icons';

interface PlayerProps {
  channel: Channel | null;
  allChannels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export const Player: React.FC<PlayerProps> = ({ channel, allChannels, onSelectChannel, onFullscreenChange }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerContainerRef = React.useRef<HTMLDivElement>(null);
  const selectedChannelRef = React.useRef<HTMLButtonElement>(null);
  const controlsTimerRef = React.useRef<number | null>(null);
  const touchStartX = React.useRef(0);

  const [areControlsVisible, setAreControlsVisible] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const showControlsAndSetTimer = () => {
    setAreControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
    }, 4000); // 4-second timeout
  };

  // Effect for channel changes
  React.useEffect(() => {
    if (channel && videoRef.current) {
      videoRef.current.src = channel.streamUrl;
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
        setIsPlaying(false);
      });

      showControlsAndSetTimer();
      
      if (selectedChannelRef.current) {
        selectedChannelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    
    return () => {
      if(controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    }
  }, [channel]);
  
  // Effect for volume control
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  // Effect for fullscreen handling
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      onFullscreenChange(isCurrentlyFullscreen);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };
  
  const toggleMute = () => setIsMuted(!isMuted);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    showControlsAndSetTimer();
    if (!channel || allChannels.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      const currentIndex = allChannels.findIndex(c => c.id === channel.id);
      if (currentIndex === -1) return;

      if (deltaX < 0) { // Swiped left for next channel
        const nextIndex = (currentIndex + 1) % allChannels.length;
        onSelectChannel(allChannels[nextIndex]);
      } else { // Swiped right for previous channel
        const prevIndex = (currentIndex - 1 + allChannels.length) % allChannels.length;
        onSelectChannel(allChannels[prevIndex]);
      }
    }
    touchStartX.current = 0;
  };

  if (!channel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-gray-500 p-8 text-center">
        <TvIcon className="w-24 h-24 mb-4 text-gray-700" />
        <h2 className="text-2xl font-semibold">Select a channel to start watching</h2>
        <p>Your streaming experience begins here.</p>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 w-full h-full bg-black"
      ref={playerContainerRef}
    >
      <div 
        className="relative w-full h-full"
        onMouseMove={showControlsAndSetTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={showControlsAndSetTimer}
      >
        <video 
          ref={videoRef} 
          autoPlay 
          className="w-full h-full" 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
        
        <div 
          className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true" 
        />
        
        {/* Channel Name Overlay */}
        <div className={`absolute top-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-500 flex flex-col justify-start ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">{channel.name}</h2>
        </div>
        
        {/* Controls and Channel Carousel Overlay */}
        <div 
            className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 flex flex-col space-y-4 ${areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside controls from hiding them
            onMouseEnter={() => { // Keep controls visible when mouse is over them
                if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
            }}
            onMouseLeave={showControlsAndSetTimer} // Restart timer when mouse leaves
        >
            {/* Channel Carousel */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {allChannels.map(c => (
                    <button 
                        key={c.id} 
                        ref={c.id === channel.id ? selectedChannelRef : null}
                        onClick={() => onSelectChannel(c)} 
                        className={`flex-shrink-0 cursor-pointer rounded-lg transition-all duration-200 group/channel ${c.id === channel.id ? '' : 'opacity-60 hover:opacity-100 hover:scale-105 focus:opacity-100 focus:scale-105'}`}
                        title={c.name}
                    >
                        <img 
                          src={c.logo} 
                          alt={c.name} 
                          className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 ${c.id === channel.id ? 'border-teal-400' : 'border-transparent group-hover/channel:border-gray-500 group-focus/channel:border-gray-500'}`} 
                        />
                    </button>
                ))}
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between">
                <button onClick={togglePlayPause} className="p-2 text-white hover:text-teal-400 transition-colors">
                    {isPlaying ? <PauseIcon className="w-7 h-7 md:w-8 md:h-8"/> : <PlayIcon className="w-7 h-7 md:w-8 md:h-8"/>}
                </button>
                <div className="flex items-center space-x-3">
                    <button onClick={toggleMute} className="p-2 text-white hover:text-teal-400 transition-colors">
                        {isMuted || volume === 0 ? <VolumeOffIcon className="w-5 h-5 md:w-6 md:h-6"/> : <VolumeUpIcon className="w-5 h-5 md:w-6 md:h-6"/>}
                    </button>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={isMuted ? 0 : volume} 
                        onChange={handleVolumeChange}
                        className="w-20 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        aria-label="Volume control"
                    />
                </div>
                <button onClick={toggleFullscreen} className="p-2 text-white hover:text-teal-400 transition-colors">
                    {isFullscreen ? <FullscreenExitIcon className="w-6 h-6 md:w-7 md:h-7"/> : <FullscreenEnterIcon className="w-6 h-6 md:w-7 md:h-7"/>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
