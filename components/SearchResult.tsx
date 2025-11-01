
import React from 'react';
import { Stock } from '../types';

interface SearchResultProps {
  result: Stock;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value}`;
}

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  const isPositiveDaily = result.dailyChange >= 0;
  const isPositiveYTD = result.ytdReturn >= 0;

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg border border-gray-600 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{result.name}</h3>
          <p className="text-md text-gray-400">{result.ticker}</p>
        </div>
        <div className={`text-2xl font-bold font-mono ${isPositiveDaily ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(result.currentValue)}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-600 grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Daily Change</span>
          <span className={`font-semibold font-mono ${isPositiveDaily ? 'text-green-400' : 'text-red-400'}`}>
            {isPositiveDaily ? '+' : ''}{result.dailyChange.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">YTD Return</span>
          <span className={`font-semibold font-mono ${isPositiveYTD ? 'text-green-400' : 'text-red-400'}`}>
            {isPositiveYTD ? '+' : ''}{result.ytdReturn.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Market Cap</span>
          <span className="font-semibold font-mono text-gray-200">
            {formatMarketCap(result.marketCap)}
          </span>
        </div>
         <div className="flex justify-between">
          <span className="text-gray-400">52W High / Low</span>
          <span className="font-semibold font-mono text-gray-200">
            {formatCurrency(result.fiftyTwoWeekHigh)} / {formatCurrency(result.fiftyTwoWeekLow)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
