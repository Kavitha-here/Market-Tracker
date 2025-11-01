import React, { useState, useEffect, useCallback } from 'react';
import { Stock, HistoricalDataPoint, NewsArticle } from './types';
import { INITIAL_STOCKS } from './constants';
import { fetchStockData, fetchHistoricalData, fetchFinancialNews } from './services/geminiService';
import StockTable from './components/StockTable';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';
import HistoricalChart from './components/HistoricalChart';
import NewsFeed from './components/NewsFeed';
import { SparklesIcon, MagnifyingGlassIcon, XMarkIcon } from './components/Icons';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for historical data modal
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [chartIsLoading, setChartIsLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartRange, setChartRange] = useState<'1m' | '6m' | '1y' | '5y'>('1y');

  // State for news feed
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const valueChange = (Math.random() - 0.5) * (stock.currentValue * 0.005);
          const returnChange = (Math.random() - 0.5) * 0.05;
          const dailyChange = (Math.random() - 0.5) * 0.1;

          return {
            ...stock,
            currentValue: parseFloat((stock.currentValue + valueChange).toFixed(2)),
            ytdReturn: parseFloat((stock.ytdReturn + returnChange).toFixed(2)),
            dailyChange: parseFloat((stock.dailyChange + dailyChange).toFixed(2)),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setIsNewsLoading(true);
      try {
        const fetchedNews = await fetchFinancialNews();
        setNews(fetchedNews);
      } catch (err) {
        setNewsError("Failed to load financial news.");
        console.error(err);
      } finally {
        setIsNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    try {
      const result = await fetchStockData(query);
      setSearchResult(result);
    } catch (err) {
      setError('Failed to fetch stock data. Please check the ticker and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectStock = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    fetchChartData(stock.ticker, chartRange);
  }, [chartRange]);

  const handleCloseModal = () => {
    setSelectedStock(null);
    setHistoricalData([]);
  };
  
  const fetchChartData = async (ticker: string, range: '1m' | '6m' | '1y' | '5y') => {
      if(!selectedStock && !ticker) return;
      setChartIsLoading(true);
      setChartError(null);
      try {
        const data = await fetchHistoricalData(ticker, range);
        setHistoricalData(data);
      } catch (err) {
        setChartError('Could not load historical data.');
        console.error(err);
      } finally {
        setChartIsLoading(false);
      }
  };

  const handleChangeChartRange = (range: '1m' | '6m' | '1y' | '5y') => {
    setChartRange(range);
    if(selectedStock) {
        fetchChartData(selectedStock.ticker, range);
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 mb-2">
            Live Market Tracker
          </h1>
          <p className="text-lg text-gray-400">
            Real-time data at your fingertips, powered by Gemini.
          </p>
        </header>

        <section className="mb-12">
          <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-6 shadow-2xl shadow-gray-900/50 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-6 h-6 text-green-400" />
              <span>Search Stock / Index</span>
            </h2>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
             {isLoading && (
              <div className="flex justify-center items-center mt-4 text-gray-400">
                <SparklesIcon className="w-5 h-5 animate-pulse mr-2" />
                Gemini is searching...
              </div>
            )}
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            {searchResult && <SearchResult result={searchResult} />}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2">
              <StockTable stocks={stocks} onSelectStock={handleSelectStock} />
            </section>
            <aside className="xl:col-span-1">
                <NewsFeed articles={news} isLoading={isNewsLoading} error={newsError} />
            </aside>
        </div>
      </main>
      
      {selectedStock && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={handleCloseModal}
        >
            <div 
                className="bg-gray-800/90 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl p-6 md:p-8 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XMarkIcon className="w-7 h-7" />
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{selectedStock.name}</h2>
                        <p className="text-lg text-gray-400">{selectedStock.ticker}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {['1m', '6m', '1y', '5y'].map(r => {
                            const rangeId = r as '1m' | '6m' | '1y' | '5y';
                            return (
                                <button
                                key={r}
                                onClick={() => handleChangeChartRange(rangeId)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    chartRange === r
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                }`}
                                >
                                {r.toUpperCase()}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="h-96 w-full mt-6">
                    {chartIsLoading && <div className="flex items-center justify-center h-full text-gray-400">Loading Chart...</div>}
                    {chartError && <div className="flex items-center justify-center h-full text-red-400">{chartError}</div>}
                    {!chartIsLoading && !chartError && historicalData.length > 0 && (
                        <HistoricalChart data={historicalData} />
                    )}
                </div>
            </div>
        </div>
      )}

       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Data is simulated for demonstration purposes. Click a row to see historical data.</p>
        <p>&copy; {new Date().getFullYear()} Live Market Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;