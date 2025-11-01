
import React, { useState, useEffect } from 'react';
import { Stock } from '../types';

interface StockRowProps {
  stock: Stock;
  onSelectStock: (stock: Stock) => void;
}

const getReturnColor = (value: number): [string, string] => {
  if (value > 0) return ['bg-green-800/40', 'text-green-300'];
  if (value < 0) return ['bg-red-800/40', 'text-red-300'];
  return ['bg-gray-700/40', 'text-gray-300'];
};

const formatCurrency = (value: number) => {
    if (Math.abs(value) < 0.01) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const formatMarketCap = (value: number) => {
    if (value === 0) return 'N/A';
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value}`;
}

const StockRow: React.FC<StockRowProps> = ({ stock, onSelectStock }) => {
  const [flashColor, setFlashColor] = useState('');

  useEffect(() => {
    setFlashColor('bg-blue-500/20');
    const timer = setTimeout(() => setFlashColor(''), 500);
    return () => clearTimeout(timer);
  }, [stock.currentValue]);

  const [dailyChangeBg, dailyChangeText] = getReturnColor(stock.dailyChange);
  const [ytdReturnBg, ytdReturnText] = getReturnColor(stock.ytdReturn);

  return (
    <tr 
        className={`transition-colors duration-500 ${flashColor} hover:bg-gray-700/50 cursor-pointer`}
        onClick={() => onSelectStock(stock)}
    >
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-200">{stock.name}</div>
        <div className="text-xs text-gray-400">{stock.ticker}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-gray-200">{formatCurrency(stock.currentValue)}</td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${dailyChangeBg} ${dailyChangeText}`}>
          {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${ytdReturnBg} ${ytdReturnText}`}>
          {stock.ytdReturn >= 0 ? '+' : ''}{stock.ytdReturn.toFixed(2)}%
        </span>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-gray-300">{formatMarketCap(stock.marketCap)}</td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-gray-300">{formatCurrency(stock.fiftyTwoWeekHigh)}</td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-gray-300">{formatCurrency(stock.fiftyTwoWeekLow)}</td>
    </tr>
  );
};

export default StockRow;
