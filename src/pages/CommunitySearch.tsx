
import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample recent searches
const RECENT_SEARCHES = [
  "roommate wanted",
  "internship opportunities",
  "campus events",
  "study group"
];

// Sample trending topics
const TRENDING_TOPICS = [
  "finals preparation",
  "scholarship applications",
  "housing crisis",
  "summer internships",
  "mental health resources",
  "campus food options"
];

const CommunitySearch: React.FC<{ communityType: 'campus' | 'nationwide' | 'confession' | 'forum' }> = ({ communityType }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches if not already present
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
      }
      
      // In a real app, this would trigger a search and navigate to results
      // For now, just return to previous page with a toast
      navigate(-1);
    }
  };
  
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    // Would normally trigger search here
  };
  
  const handleTrendingTopicClick = (topic: string) => {
    setSearchQuery(topic);
    // Would normally trigger search here
  };
  
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const getPageTitle = () => {
    switch (communityType) {
      case 'campus':
        return 'Campus Community';
      case 'nationwide':
        return 'Community';
      case 'confession':
        return 'Confession';
      case 'forum':
        return 'Forum';
      default:
        return 'Search';
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-10 border-b border-cendy-gray-medium bg-white">
        <div className="flex h-16 items-center px-4 gap-3">
          <button onClick={handleBack} className="text-cendy-text">
            <ArrowLeft size={20} />
          </button>
          
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              placeholder={`Search in ${getPageTitle()}...`}
              className="w-full rounded-xl border border-cendy-gray-medium bg-cendy-gray px-4 py-2 pl-10 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cendy-text-secondary" size={18} />
            {searchQuery && (
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cendy-text-secondary"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>
      </div>
      
      <main className="flex-1 p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock size={18} />
                Recent Searches
              </h2>
              <button 
                className="text-sm text-cendy-blue"
                onClick={handleClearRecentSearches}
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 hover:bg-cendy-gray rounded-lg cursor-pointer"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-cendy-text-secondary" />
                    <span>{search}</span>
                  </div>
                  <X 
                    size={16} 
                    className="text-cendy-text-secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches(recentSearches.filter((_, i) => i !== index));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Trending Topics */}
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            Trending
          </h2>
          <div className="space-y-3">
            {TRENDING_TOPICS.map((topic, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 hover:bg-cendy-gray rounded-lg cursor-pointer"
                onClick={() => handleTrendingTopicClick(topic)}
              >
                <TrendingUp size={16} className="text-cendy-text-secondary mr-3" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunitySearch;
