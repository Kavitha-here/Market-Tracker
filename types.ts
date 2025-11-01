export interface Stock {
  name: string;
  ticker: string;
  currentValue: number;
  ytdReturn: number;
  dailyChange: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
}