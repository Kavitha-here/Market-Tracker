import React from 'react';
import { NewsArticle as NewsArticleType } from '../types';
import { timeAgo } from '../utils/time';

interface NewsArticleProps {
  article: NewsArticleType;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article }) => {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-gray-800/60 hover:bg-gray-700/70 transition-colors duration-300 border border-gray-700/50"
    >
      <h4 className="font-semibold text-gray-100 leading-tight mb-1">{article.title}</h4>
      <p className="text-xs text-gray-400 mb-2">
        {article.source} &middot; {timeAgo(new Date(article.publishedAt))}
      </p>
      <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{article.summary}</p>
    </a>
  );
};

export default NewsArticle;