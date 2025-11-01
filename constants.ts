
import { Stock } from './types';

export const INITIAL_STOCKS: Stock[] = [
  { name: 'Nifty 50 Index (India)', ticker: 'INDEXNSE:NIFTY_50', currentValue: 24973.10, ytdReturn: 5.62, dailyChange: 0.25, marketCap: 0, fiftyTwoWeekHigh: 25000, fiftyTwoWeekLow: 20000 },
  { name: 'S&P 500 Index (US Largecap)', ticker: 'SPY', currentValue: 652.21, ytdReturn: 11.28, dailyChange: -0.10, marketCap: 503_000_000_000, fiftyTwoWeekHigh: 655, fiftyTwoWeekLow: 500 },
  { name: 'Vanguard Total Stock Market', ticker: 'VTI', currentValue: 321.80, ytdReturn: 11.04, dailyChange: -0.15, marketCap: 1_600_000_000_000, fiftyTwoWeekHigh: 325, fiftyTwoWeekLow: 250 },
  { name: 'Nasdaq 100 Index (US Tech heavy)', ticker: 'QQQ', currentValue: 580.70, ytdReturn: 13.59, dailyChange: 0.50, marketCap: 275_000_000_000, fiftyTwoWeekHigh: 582, fiftyTwoWeekLow: 450 },
  { name: 'Russell 2000 Index (US Smallcap)', ticker: 'IWM', currentValue: 236.43, ytdReturn: 7.00, dailyChange: 1.12, marketCap: 70_000_000_000, fiftyTwoWeekHigh: 240, fiftyTwoWeekLow: 190 },
  { name: 'US High Growth ETF', ticker: 'ARKK', currentValue: 7.94, ytdReturn: 34.12, dailyChange: -2.5, marketCap: 6_000_000_000, fiftyTwoWeekHigh: 10, fiftyTwoWeekLow: 5 },
  { name: 'Emerging Market Equity', ticker: 'EEM', currentValue: 51.54, ytdReturn: 23.24, dailyChange: 0.88, marketCap: 25_000_000_000, fiftyTwoWeekHigh: 52, fiftyTwoWeekLow: 40 },
  { name: 'US Total Bond Market', ticker: 'BND', currentValue: 74.50, ytdReturn: 3.60, dailyChange: 0.05, marketCap: 105_000_000_000, fiftyTwoWeekHigh: 76, fiftyTwoWeekLow: 70 },
  { name: 'Gold in USD', ticker: 'GLD', currentValue: 335.26, ytdReturn: 38.46, dailyChange: 0.75, marketCap: 62_000_000_000, fiftyTwoWeekHigh: 340, fiftyTwoWeekLow: 250 },
  { name: 'Bitcoin in USD', ticker: 'BTCUSD', currentValue: 113963.32, ytdReturn: 23.36, dailyChange: -1.2, marketCap: 2_200_000_000_000, fiftyTwoWeekHigh: 120000, fiftyTwoWeekLow: 50000 },
];
