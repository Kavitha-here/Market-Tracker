import React from 'react';
import { NewsArticle as NewsArticleType } from '../types';
import NewsArticle from './NewsArticle';
import { NewspaperIcon, SparklesIcon } from './Icons';

interface NewsFeedProps {
  articles: NewsArticleType[];
  isLoading: boolean;
  error: string | null;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, isLoading, error }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl shadow-gray-900/50 backdrop-blur-sm border border-gray-700 h-full">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <NewspaperIcon className="w-6 h-6 text-green-400" />
        <span>Latest News</span>
      </h2>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8 text-gray-400">
            <SparklesIcon className="w-5 h-5 animate-pulse mr-2" />
            Loading news...
        </div>
      )}

      {error && <p className="text-red-400 py-8 text-center">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <NewsArticle key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;