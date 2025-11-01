
import React, { useState, useMemo } from 'react';
import { Stock } from '../types';
import StockRow from './StockRow';
import { ArrowUpIcon, ArrowDownIcon } from './Icons';

interface StockTableProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

type SortKey = keyof Stock;

const StockTable: React.FC<StockTableProps> = ({ stocks, onSelectStock }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'marketCap', direction: 'descending' });

  const sortedStocks = useMemo(() => {
    let sortableItems = [...stocks];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [stocks, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader: React.FC<{ sortKey: SortKey; children: React.ReactNode }> = ({ sortKey, children }) => {
    const isSorted = sortConfig?.key === sortKey;
    const isAscending = sortConfig?.direction === 'ascending';
    
    return (
      <th scope="col" className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
        <button onClick={() => requestSort(sortKey)} className="flex items-center justify-end w-full group">
          <span>{children}</span>
          <span className="w-4 h-4 ml-1.5">
            {isSorted ? (isAscending ? <ArrowUpIcon /> : <ArrowDownIcon />) : <ArrowUpIcon className="opacity-0 group-hover:opacity-50" />}
          </span>
        </button>
      </th>
    );
  };


  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-2xl shadow-gray-900/50 backdrop-blur-sm border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/70">
            <tr>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Instrument
              </th>
              <SortableHeader sortKey="currentValue">Current Value</SortableHeader>
              <SortableHeader sortKey="dailyChange">Daily %</SortableHeader>
              <SortableHeader sortKey="ytdReturn">YTD %</SortableHeader>
              <SortableHeader sortKey="marketCap">Mkt Cap</SortableHeader>
              <SortableHeader sortKey="fiftyTwoWeekHigh">52W High</SortableHeader>
              <SortableHeader sortKey="fiftyTwoWeekLow">52W Low</SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-gray-800/50 divide-y divide-gray-700">
            {sortedStocks.map(stock => (
              <StockRow key={stock.ticker} stock={stock} onSelectStock={onSelectStock} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
