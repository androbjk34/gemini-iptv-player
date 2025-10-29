import React from 'react';
import type { Category, Channel } from '../types';
import { SearchIcon, TvIcon, ChevronLeftIcon, ChevronDownIcon, StarIcon } from './Icons';

const FAVORITES_CATEGORY_ID = '__FAVORITES__';

interface SidebarProps {
  categories: Category[];
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null | '__COLLAPSED__') => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleFavorite: (channelId: string) => void;
  hasFavorites: boolean;
}

const ChannelItem: React.FC<{
  channel: Channel;
  isSelected: boolean;
  onSelect: () => void;
  isSidebarOpen: boolean;
  onToggleFavorite: (channelId: string) => void;
}> = ({ channel, isSelected, onSelect, isSidebarOpen, onToggleFavorite }) => {
  return (
    <li>
      <div
        onClick={onSelect}
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          isSelected ? 'bg-teal-600 text-white' : 'hover:bg-gray-700'
        } ${!isSidebarOpen && 'justify-center'}`}
        role="button"
        aria-selected={isSelected}
        tabIndex={0}
      >
        <div className="flex items-center min-w-0">
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
          />
          <span
            className={`font-medium truncate transition-opacity duration-200 ${
              isSidebarOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0'
            }`}
          >
            {channel.name}
          </span>
        </div>
        <div className="flex items-center flex-shrink-0">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(channel.id);
                }}
                className={`p-1 rounded-full ${channel.isFavorite ? 'text-teal-400 hover:text-teal-300' : 'text-gray-500 hover:text-white'} ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400`}
                aria-label={`Favorite ${channel.name}`}
            >
                <StarIcon filled={!!channel.isFavorite} className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
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
  const handleCategoryClick = (categoryId: string | null) => {
    onSelectCategory(selectedCategory === categoryId ? '__COLLAPSED__' : categoryId);
  };

  const renderChannelList = (channelList: Channel[]) => (
    <ul className="space-y-1 pt-2">
      {channelList.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isSelected={selectedChannel?.id === channel.id}
          onSelect={() => onSelectChannel(channel)}
          isSidebarOpen={isSidebarOpen}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );

  return (
    <aside
      className={`bg-gray-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64 md:w-80' : 'w-20'
      }`}
    >
      <header className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className={`flex items-center space-x-3 overflow-hidden`}>
          <TvIcon className="w-8 h-8 text-teal-400 flex-shrink-0" />
          <h1
            className={`text-2xl font-bold tracking-wider whitespace-nowrap transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            Gemini IPTV
          </h1>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <ChevronLeftIcon
            className={`w-6 h-6 transition-transform duration-300 ${
              !isSidebarOpen && 'rotate-180'
            }`}
          />
        </button>
      </header>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'p-4' : 'h-0 p-0'
        } overflow-hidden`}
      >
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            aria-label="Search channels"
          />
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-4 pt-4 pb-4"
        aria-label="Channel list"
      >
        <ul className="space-y-2">
           {hasFavorites && (
            <li>
                <button
                onClick={() => handleCategoryClick(FAVORITES_CATEGORY_ID)}
                className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${
                    selectedCategory === FAVORITES_CATEGORY_ID
                    ? 'bg-teal-500 text-white'
                    : 'hover:bg-gray-700 text-gray-200'
                }`}
                >
                <div className="flex items-center">
                    <StarIcon filled className="w-5 h-5 mr-3 text-teal-300 flex-shrink-0"/>
                    <span
                    className={`truncate transition-opacity duration-200 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                    }`}
                    >
                    Favorites
                    </span>
                </div>
                <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    selectedCategory !== FAVORITES_CATEGORY_ID && '-rotate-90'
                    } ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                />
                </button>
                <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedCategory === FAVORITES_CATEGORY_ID
                    ? 'max-h-[5000px]'
                    : 'max-h-0'
                }`}
                >
                {renderChannelList(channels.filter(c => c.isFavorite))}
                </div>
            </li>
          )}
          <li>
            <button
              onClick={() => handleCategoryClick(null)}
              className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${
                selectedCategory === null
                  ? 'bg-teal-500 text-white'
                  : 'hover:bg-gray-700 text-gray-200'
              }`}
            >
              <span
                className={`truncate transition-opacity duration-200 ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              >
                All Channels
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  selectedCategory !== null && '-rotate-90'
                } ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                selectedCategory === null
                  ? 'max-h-[5000px]'
                  : 'max-h-0'
              }`}
            >
              {renderChannelList(channels)}
            </div>
          </li>
          
          {categories.map((category) => {
            const isExpanded = selectedCategory === category.id;
            const categoryChannels = channels.filter(
              (c) => c.category === category.id
            );

            if (searchQuery && categoryChannels.length === 0) return null;

            return (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 font-semibold text-base ${
                    isExpanded
                      ? 'bg-teal-500 text-white'
                      : 'hover:bg-gray-700 text-gray-200'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <span
                    className={`truncate transition-opacity duration-200 ${
                      isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                    }`}
                  >
                    {category.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      !isExpanded && '-rotate-90'
                    } ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[5000px]' : 'max-h-0'
                  }`}
                >
                  {renderChannelList(categoryChannels)}
                </div>
              </li>
            );
          })}
        </ul>
        {channels.length === 0 && searchQuery && (
          <div
            className={`text-center text-gray-400 p-6 transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="font-medium">No channels found</p>
            <p className="text-sm mt-1">Try changing your search query.</p>
          </div>
        )}
      </nav>
    </aside>
  );
};