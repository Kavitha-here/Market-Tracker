
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from './Icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g., GOOGL, TSLA)"
          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-300 text-white placeholder-gray-500"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="px-5 py-3 bg-gradient-to-br from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? '...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
