
import React, { useState } from 'react';
import { ArrowLeft, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityNationwideSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const recentSearches = [
    'Scholarship',
    'Exchange Program',
    'Internship',
    'Grad School'
  ];
  
  const trendingTopics = [
    'Student Loans',
    'Cross-Campus Events',
    'Job Opportunities',
    'National Competitions',
    'Study Abroad'
  ];
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // In a real app, this would navigate to search results
      console.log('Searching for:', searchTerm);
    }
  };
  
  const handleRecentSearch = (term: string) => {
    setSearchTerm(term);
    // Simulate a search with the selected term
    console.log('Searching for recent term:', term);
  };
  
  const handleTrendingTopic = (topic: string) => {
    setSearchTerm(topic);
    // Simulate a search with the selected topic
    console.log('Searching for trending topic:', topic);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <div className="sticky top-0 z-10 border-b border-cendy-gray-medium bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4 gap-3">
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
          
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Nationwide Community"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-cendy-gray-medium bg-cendy-gray px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-cendy-blue"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cendy-text-secondary"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <main className="flex-1 p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-cendy-text-secondary">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearch(term)}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center">
                    <Search size={16} className="mr-3 text-cendy-text-secondary" />
                    <span className="text-sm">{term}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Trending Topics */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-cendy-text-secondary">Trending Topics</h2>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                onClick={() => handleTrendingTopic(topic)}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <div className="flex items-center">
                  <TrendingUp size={16} className="mr-3 text-cendy-blue" />
                  <span className="text-sm">{topic}</span>
                </div>
                <span className="text-xs text-cendy-text-secondary">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityNationwideSearch;
